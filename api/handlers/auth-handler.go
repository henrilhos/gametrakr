package handlers

import (
	"context"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/henrilhos/gametrakr/config"
	"github.com/henrilhos/gametrakr/database"
	"github.com/henrilhos/gametrakr/models"
	"github.com/henrilhos/gametrakr/utils"
	"github.com/henrilhos/gametrakr/utils/mail"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// Structs

type SignUpBody struct {
	Username        string `json:"username" validate:"required"`
	Email           string `json:"email" validate:"required"`
	Password        string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirmPassword" validate:"required,min=8"`
}

type SignInForm struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// Handlers

func SignUpUser(c *fiber.Ctx) error {
	body := new(SignUpBody)
	if err := c.BodyParser(body); err != nil {
		return respondWithError(c, fiber.StatusBadRequest, err.Error())
	}

	errors := utils.ValidateStruct(body)
	if errors != nil {
		return respondWithError(c, fiber.StatusBadRequest, errors)
	}

	if body.Password != body.ConfirmPassword {
		return respondWithError(c, fiber.StatusBadRequest, "passwords do not match")
	}

	userRes, err := createUser(body)
	if err != nil && strings.Contains(err.Error(), "duplicate key value violates unique") {
		return respondWithError(c, fiber.StatusConflict, "user with that username or email already exists")
	}
	if err != nil {
		return respondWithError(c, fiber.StatusBadGateway, err.Error())
	}

	code, err := sendEmailVerification(userRes.Email, userRes.Username)
	if err != nil {
		logrus.Error("unable to send mail verification", err)
	}

	expires_at := time.Hour * config.GetConfig().SendGrid.MailVerificationCodeExpiration
	err = storeVerificationCode(userRes.Email, code, mail.MailConfirmation, expires_at)
	if err != nil {
		logrus.Error("unable to store mail verification data", err)
	}

	return respondWithSuccess(c, fiber.StatusCreated, "user created with succes")
}

func SignInUser(c *fiber.Ctx) error {
	body := new(SignInForm)
	if err := c.BodyParser(body); err != nil {
		return respondWithError(c, fiber.StatusBadRequest, err.Error())
	}

	errors := utils.ValidateStruct(body)
	if errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": errors})
	}

	user, err := models.SignIn(body.Username, body.Password)
	if err != nil {
		return handleSignInError(c, err)
	}

	accessTokenDetails, err := utils.CreateAccessToken(user.ID.String())
	if err != nil {
		return respondWithError(c, fiber.StatusUnprocessableEntity, err.Error())
	}

	refreshTokenDetails, err := utils.CreateRefreshToken(user.ID.String())
	if err != nil {
		return respondWithError(c, fiber.StatusUnprocessableEntity, err.Error())
	}

	if err := storeTokensInRedis(c, accessTokenDetails, refreshTokenDetails); err != nil {
		return respondWithError(c, fiber.StatusUnprocessableEntity, err.Error())
	}

	setCookies(c, accessTokenDetails.Token, refreshTokenDetails.Token)

	return respondWithSuccess(c, fiber.StatusOK, fiber.Map{"token": accessTokenDetails.Token})
}

func SignOutUser(c *fiber.Ctx) error {
	const (
		message          = "token is invalid or session has expired"
		accessTokenName  = "access_token"
		refreshTokenName = "refresh_token"
		loggedInName     = "logged_in"
	)

	refreshToken := c.Cookies(refreshTokenName)
	if refreshToken == "" {
		return respondWithError(c, fiber.StatusForbidden, message)
	}

	ctx := context.TODO()
	tokenClaims, err := utils.ValidateRefreshToken(refreshToken)
	if err != nil {
		return respondWithError(c, fiber.StatusForbidden, err.Error())
	}

	accessTokenUuid := c.Locals("access_token_uuid").(string)
	if err := database.GetRedisClient().Del(ctx, tokenClaims.TokenUuid, accessTokenUuid).Err(); err != nil {
		return respondWithError(c, fiber.StatusBadGateway, err.Error())
	}

	expired := time.Now().Add(-time.Hour * 24)
	expireCookie := func(name string) {
	c.Cookie(&fiber.Cookie{
			Name:    name,
		Value:   "",
		Expires: expired,
	})
	}

	expireCookie(accessTokenName)
	expireCookie(refreshTokenName)
	expireCookie(loggedInName)

	return respondWithSuccess(c, fiber.StatusOK, "signed out successfully")
}

func RefreshAccessToken(c *fiber.Ctx) error {
	message := "could not refresh access token"
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": message})
	}

	ctx := context.TODO()
	tokenClaims, err := utils.ValidateRefreshToken(refreshToken)
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	userId, err := database.GetRedisClient().Get(ctx, tokenClaims.TokenUuid).Result()
	if err == redis.Nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": message})
	}

	user, err := models.FindUserById(userId)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": "the user belonging to this token no logger exists"})
		} else {
			return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
		}
	}

	accessTokenDetails, err := utils.CreateAccessToken(user.ID.String())
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	now := time.Now()

	errAccess := database.GetRedisClient().Set(ctx, accessTokenDetails.TokenUuid, user.ID.String(), time.Unix(*accessTokenDetails.ExpiresIn, 0).Sub(now)).Err()
	if errAccess != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"status": "fail", "message": errAccess.Error()})
	}

	accessTokenMaxAge := config.GetConfig().JWT.AccessTokenMaxAge

	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    *accessTokenDetails.Token,
		Path:     "/",
		MaxAge:   accessTokenMaxAge * 60,
		Secure:   false,
		HTTPOnly: true,
		Domain:   "localhost",
	})

	c.Cookie(&fiber.Cookie{
		Name:     "logged_in",
		Value:    "true",
		Path:     "/",
		MaxAge:   accessTokenMaxAge * 60,
		Secure:   false,
		HTTPOnly: false,
		Domain:   "localhost",
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "access_token": accessTokenDetails.Token})
}

// private

func respondWithError(c *fiber.Ctx, statusCode int, message interface{}) error {
	return c.Status(statusCode).JSON(fiber.Map{"status": "fail", "message": message})
}

func respondWithSuccess(c *fiber.Ctx, statusCode int, data interface{}) error {
	return c.Status(statusCode).JSON(fiber.Map{"status": "success", "data": data})
}

func createUser(body *SignUpBody) (*models.User, error) {
	u := models.User{Username: body.Username, Email: body.Email, Password: body.Password}
	userRes, err := u.Create()
	return userRes, err
}

func sendEmailVerification(email, username string) (string, error) {
	templateID := config.GetConfig().SendGrid.MailVerificationTemplateId
	return sendVerification(email, username, templateID, mail.MailConfirmation)
}

func sendPasswordVerification(email, username string) (string, error) {
	templateID := config.GetConfig().SendGrid.PasswordResetTemplateId
	return sendVerification(email, username, templateID, mail.PassReset)
}

func sendVerification(email, username, templateID string, mailType mail.MailType) (string, error) {
	to := mail.MailTo{
		Email: email,
		User:  username,
	}
	mailData := &mail.MailData{
		Username: username,
		Code:     utils.RandomString(6),
	}

	mailService := mail.NewSGMailService()
	mailReq := mailService.NewMail(to, mailType, mailData, templateID)
	err := mailService.SendMail(mailReq)
	return mailData.Code, err
}

func storeVerificationCode(email, code string, mailType mail.MailType, expires_at time.Duration) error {
	verification := models.Verification{
		Email:     email,
		Code:      code,
		Type:      mailType,
		ExpiresAt: time.Now().Add(expires_at),
	}
	_, err := verification.Create()
	return err
}

func handleSignInError(c *fiber.Ctx, err error) error {
	message := "Invalid username/email or password"
	if err == gorm.ErrRecordNotFound {
		return respondWithError(c, fiber.StatusForbidden, message)
	}
	if strings.Contains(err.Error(), "hashedPassword is not the hash of the given password") {
		return respondWithError(c, fiber.StatusBadGateway, message)
	}
	return respondWithError(c, fiber.StatusBadGateway, err.Error())
}

func storeTokensInRedis(c *fiber.Ctx, accessTokenDetails, refreshTokenDetails *utils.TokenDetails) error {
	ctx := context.TODO()
	now := time.Now()

	if err := storeTokenInRedis(c, accessTokenDetails, ctx, now); err != nil {
		return err
	}

	if err := storeTokenInRedis(c, refreshTokenDetails, ctx, now); err != nil {
		return err
	}

	return nil
}

func storeTokenInRedis(c *fiber.Ctx, tokenDetails *utils.TokenDetails, ctx context.Context, now time.Time) error {
	err := database.GetRedisClient().Set(ctx, tokenDetails.TokenUuid, tokenDetails.UserID,
		time.Unix(*tokenDetails.ExpiresIn, 0).Sub(now)).Err()
	return err
}

func setCookies(c *fiber.Ctx, accessToken, refreshToken *string) {
	accessTokenMaxAge := config.GetConfig().JWT.AccessTokenMaxAge
	refreshTokenMaxAge := config.GetConfig().JWT.RefreshTokenMaxAge

	setCookie(c, "access_token", *accessToken, accessTokenMaxAge)
	setCookie(c, "refresh_token", *refreshToken, refreshTokenMaxAge)
	setCookie(c, "logged_in", "true", accessTokenMaxAge)
}

func setCookie(c *fiber.Ctx, name, value string, maxAge int) {
	c.Cookie(&fiber.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		MaxAge:   maxAge * 60,
		Secure:   false,
		HTTPOnly: true,
		Domain:   "localhost",
	})
}

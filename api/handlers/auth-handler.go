package handlers

import (
	"context"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
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

type SignInInput struct {
	UsernameOrEmail string `json:"usernameOrEmail" validate:"required"`
	Password        string `json:"password" validate:"required"`
}

// Handlers

func SignUpUser(c *fiber.Ctx) error {
	body := new(SignUpBody)
	if err := c.BodyParser(body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(failResponse(err.Error()))
	}

	errors := utils.ValidateStruct(body)
	if errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(failResponse(errors))
	}

	if body.Password != body.ConfirmPassword {
		return c.Status(fiber.StatusBadRequest).JSON(failResponse("Passwords do not match"))
	}

	userRes, err := createUser(body)
	if err != nil && strings.Contains(err.Error(), "duplicate key value violates unique") {
		return c.Status(fiber.StatusConflict).JSON(failResponse("User with that username or email already exists"))
	}
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(failResponse(err.Error()))
	}

	code, err := sendEmailVerification(userRes.Email, userRes.Username)
	if err != nil {
		logrus.Error("unable to send mail verification", err)
	}

	expires_at := time.Hour * time.Duration(utils.GetenvInt("MAIL_VERIFICATION_CODE_EXPIRATION"))
	err = storeVerificationCode(userRes.Email, code, mail.MailConfirmation, expires_at)
	if err != nil {
		logrus.Error("unable to store mail verification data", err)
	}

	return c.Status(fiber.StatusCreated).JSON(successResponse("user created with success"))
}

func SignInUser(c *fiber.Ctx) error {
	var payload *SignInInput
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	errors := utils.ValidateStruct(payload)
	if errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": errors})
	}

	message := "Invalid username/email or password"

	user, err := models.SignIn(payload.UsernameOrEmail, payload.Password)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": message})
		}
		if strings.Contains(err.Error(), "hashedPassword is not the hash of the given password") {
			return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": message})
		}
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	accessTokenDetails, err := utils.CreateAccessToken(user.ID.String())
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	refreshTokenDetails, err := utils.CreateRefreshToken(user.ID.String())
	if err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	ctx := context.TODO()
	now := time.Now()

	errAccess := database.GetRedisClient().Set(ctx, accessTokenDetails.TokenUuid, user.ID.String(), time.Unix(*accessTokenDetails.ExpiresIn, 0).Sub(now)).Err()
	if errAccess != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"status": "fail", "message": errAccess.Error()})
	}

	errRefresh := database.GetRedisClient().Set(ctx, refreshTokenDetails.TokenUuid, user.ID.String(), time.Unix(*refreshTokenDetails.ExpiresIn, 0).Sub(now)).Err()
	if errAccess != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"status": "fail", "message": errRefresh.Error()})
	}

	accessTokenMaxAge := utils.GetenvInt("ACCESS_TOKEN_MAXAGE")
	refreshTokenMaxAge := utils.GetenvInt("REFRESH_TOKEN_MAXAGE")

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
		Name:     "refresh_token",
		Value:    *refreshTokenDetails.Token,
		Path:     "/",
		MaxAge:   refreshTokenMaxAge * 60,
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

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "data": fiber.Map{"jwt": accessTokenDetails}})
}

func SignOutUser(c *fiber.Ctx) error {
	message := "Token is invalid or session has expired"
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		print("Error 1")
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": message})
	}

	ctx := context.TODO()
	tokenClaims, err := utils.ValidateRefreshToken(refreshToken)
	if err != nil {
		print("Error 2")
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	accessTokenUuid := c.Locals("access_token_uuid").(string)
	_, err = database.GetRedisClient().Del(ctx, tokenClaims.TokenUuid, accessTokenUuid).Result()
	if err != nil {
		print("Error 3")
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	expired := time.Now().Add(-time.Hour * 24)
	c.Cookie(&fiber.Cookie{
		Name:    "access_token",
		Value:   "",
		Expires: expired,
	})
	c.Cookie(&fiber.Cookie{
		Name:    "refresh_token",
		Value:   "",
		Expires: expired,
	})
	c.Cookie(&fiber.Cookie{
		Name:    "logged_in",
		Value:   "",
		Expires: expired,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success"})
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

	accessTokenMaxAge := utils.GetenvInt("ACCESS_TOKEN_MAXAGE")

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

func successResponse(data interface{}) fiber.Map {
	return fiber.Map{"status": "success", "data": data}
}

func failResponse(message interface{}) fiber.Map {
	return fiber.Map{"status": "fail", "message": message}
}

func createUser(body *SignUpBody) (*models.User, error) {
	u := models.User{Username: body.Username, Email: body.Email, Password: body.Password}
	userRes, err := u.Create()
	return userRes, err
}

func sendEmailVerification(email, username string) (string, error) {
	templateID := utils.GetenvString("MAIL_VERIFICATION_TEMPLATE_ID")
	return sendVerification(email, username, templateID, mail.MailConfirmation)
}

func sendPasswordVerification(email, username string) (string, error) {
	templateID := utils.GetenvString("PASSWORD_VERIFICATION_TEMPLATE_ID")
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

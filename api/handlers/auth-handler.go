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

type SignInBody struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type ForgotPasswordBody struct {
	Username string `json:"username" validate:"required"`
}

type ResetPasswordForm struct {
	Username        string `json:"username" validate:"required"`
	Password        string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirmPassword" validate:"required,min=8"`
}

type VerifyParam struct {
	Code string `params:"code" json:"code"`
}

// Handlers

func SignUpUser(c *fiber.Ctx) error {
	body := new(SignUpBody)
	if err := parseAndValidateRequestBody(c, body); err != nil {
		return err
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
	body := new(SignInBody)
	if err := parseAndValidateRequestBody(c, body); err != nil {
		return err
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
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return respondWithError(c, fiber.StatusForbidden, "could not refresh the access token")
	}

	ctx := context.TODO()
	tokenClaims, err := utils.ValidateRefreshToken(refreshToken)
	if err != nil {
		return respondWithError(c, fiber.StatusForbidden, err.Error())
	}

	userId, err := database.GetUserIdFromCache(ctx, tokenClaims.TokenUuid)
	if err != nil {
		return respondWithError(c, fiber.StatusForbidden, err.Error())
	}

	user, err := models.FindUserById(userId)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return respondWithError(c, fiber.StatusForbidden, "the user belonging to this token no longer exists")
		}
		return respondWithError(c, fiber.StatusBadGateway, err.Error())
	}

	accessTokenDetails, err := utils.CreateAccessToken(user.ID.String())
	if err != nil {
		return respondWithError(c, fiber.StatusUnprocessableEntity, err.Error())
	}

	if err := storeTokenInRedis(c, accessTokenDetails, ctx, time.Now()); err != nil {
		return respondWithError(c, fiber.StatusUnprocessableEntity, err.Error())
	}

	setAccessTokenCookies(c, accessTokenDetails.Token)

	return respondWithSuccess(c, fiber.StatusOK, fiber.Map{"token": accessTokenDetails.Token})
}

func SendEmailVerification(c *fiber.Ctx) error {
	user := c.Locals("user").(models.UserResponse)
	if user.Verified {
		return respondWithSuccess(c, fiber.StatusAlreadyReported, "email already verified")
	}

	code, err := sendEmailVerification(user.Email, user.Username)
	if err != nil {
		logrus.Error("unable to send mail verification", err)
	}

	expires_at := time.Hour * config.GetConfig().SendGrid.MailVerificationCodeExpiration
	err = storeVerificationCode(user.Email, code, mail.MailConfirmation, expires_at)
	if err != nil {
		logrus.Error("unable to store mail verification data", err)
	}

	return respondWithSuccess(c, fiber.StatusOK, "code sent successfully")
}

func VerifyEmail(c *fiber.Ctx) error {
	user := c.Locals("user").(models.UserResponse)
	if user.Verified {
		return respondWithSuccess(c, fiber.StatusAlreadyReported, "email already verified")
	}

	params := new(VerifyParam)
	if err := parseAndValidateRequestParam(c, params); err != nil {
		return err
	}

	if err := models.VerifyEmailCode(user.Email, params.Code); err != nil {
		return respondWithError(c, fiber.StatusUnauthorized, "invalid code")
	}

	if err := models.SetEmailVerified(user.ID); err != nil {
		return respondWithError(c, fiber.StatusInternalServerError, "error when updating user status")
	}

	return respondWithSuccess(c, fiber.StatusOK, "email verified successfully")
}

func ForgotPassword(c *fiber.Ctx) error {
	body := new(ForgotPasswordBody)
	if err := parseAndValidateRequestBody(c, body); err != nil {
		return err
	}

	userRes, err := models.FindPrimaryKeysByUsernameOrEmail(body.Username)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return respondWithError(c, fiber.StatusForbidden, "Invalid username/email")
		}
		return respondWithError(c, fiber.StatusBadGateway, err.Error())
	}

	code, err := sendPasswordVerification(userRes.Username, userRes.Email)
	if err != nil {
		logrus.Error("unable to send mail verification", err)
	}

	expires_at := time.Minute * config.GetConfig().SendGrid.PasswordResetCodeExpiration
	if err := storeVerificationCode(userRes.Email, code, mail.PassReset, expires_at); err != nil {
		logrus.Error("unable to store mail verification data", err)
	}

	return respondWithSuccess(c, fiber.StatusOK, "code sent successfully")
}

func ResetPassword(c *fiber.Ctx) error {
	body := new(ResetPasswordForm)
	if err := parseAndValidateRequestBody(c, body); err != nil {
		return err
	}

	params := new(VerifyParam)
	if err := parseAndValidateRequestParam(c, params); err != nil {
		return err
	}

	userRes, err := models.FindPrimaryKeysByUsernameOrEmail(body.Username)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return respondWithError(c, fiber.StatusForbidden, "Invalid username/email")
		}
		return respondWithError(c, fiber.StatusBadGateway, err.Error())
	}

	userId, err := models.VerifyPasswordCode(userRes.Email, params.Code)
	if err != nil {
		return respondWithError(c, fiber.StatusBadRequest, err.Error())
	}

	if body.Password != body.ConfirmPassword {
		return respondWithError(c, fiber.StatusBadRequest, "passwords do not match")
	}

	err = models.UpdatePassword(userId, body.Password)
	if err != nil {
		return respondWithError(c, fiber.StatusInternalServerError, err.Error())
	}

	return respondWithSuccess(c, fiber.StatusOK, "password reset successfully")
}

// private

func respondWithError(c *fiber.Ctx, statusCode int, message interface{}) error {
	return c.Status(statusCode).JSON(fiber.Map{"status": "fail", "message": message})
}

func respondWithSuccess(c *fiber.Ctx, statusCode int, data interface{}) error {
	return c.Status(statusCode).JSON(fiber.Map{"status": "success", "data": data})
}

func parseAndValidateRequestBody(c *fiber.Ctx, body interface{}) error {
	if err := c.BodyParser(body); err != nil {
		return respondWithError(c, fiber.StatusBadRequest, err.Error())
	}
	if errors := utils.ValidateStruct(body); errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": errors})
	}
	return nil
}

func parseAndValidateRequestParam(c *fiber.Ctx, params interface{}) error {
	if err := c.QueryParser(params); err != nil {
		return respondWithError(c, fiber.StatusBadGateway, err.Error())
	}
	if errors := utils.ValidateStruct(params); errors != nil {
		return respondWithError(c, fiber.StatusBadRequest, errors)
	}
	return nil
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
	refreshTokenMaxAge := config.GetConfig().JWT.RefreshTokenMaxAge

	setAccessTokenCookies(c, accessToken)
	setCookie(c, "refresh_token", *refreshToken, refreshTokenMaxAge)
}

func setAccessTokenCookies(c *fiber.Ctx, accessToken *string) {
	accessTokenMaxAge := config.GetConfig().JWT.AccessTokenMaxAge

	setCookie(c, "access_token", *accessToken, accessTokenMaxAge)
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

package middlewares

import (
	"context"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/henrilhos/gametrakr/config"
	"github.com/henrilhos/gametrakr/database"
	"github.com/henrilhos/gametrakr/models"
	"github.com/henrilhos/gametrakr/utils"
	"gorm.io/gorm"
)

func JwtMiddleware(c *fiber.Ctx) error {
	var accessToken string
	authorization := c.Get("Authorization")

	if strings.HasPrefix(authorization, "Bearer ") {
		accessToken = strings.TrimPrefix(authorization, "Bearer ")
	} else if c.Cookies("access_token") != "" {
		accessToken = c.Cookies("access_token")
	}

	if accessToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": "You are not logged in"})
	}

	tokenClaims, err := utils.ValidateAccessToken(accessToken)
	if err != nil {
		refreshToken := c.Cookies("refresh_token")
		if refreshToken != "" {
			newAccessToken, refreshErr := refreshAccessToken(refreshToken)
			if refreshErr != nil {
				return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": err.Error()})
			}
			accessToken = newAccessToken
		} else {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": err.Error()})
		}
	}

	ctx := context.TODO()
	userId, err := database.GetUserIdFromCache(ctx, tokenClaims.TokenUuid)
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": "token is invalid or session has expired"})
	}

	user, err := models.FindUserById(userId)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": "the user belonging to this token no logger exists"})
		} else {
			return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
		}
	}

	c.Locals("user", models.FilterUser(&user))
	c.Locals("access_token_uuid", tokenClaims.TokenUuid)

	if accessToken != "" && accessToken != c.Cookies("access_token") {
		setAccessTokenCookie(c, accessToken)
	}

	return c.Next()
}

func refreshAccessToken(refreshToken string) (string, error) {
	ctx := context.TODO()
	tokenClaims, err := utils.ValidateRefreshToken(refreshToken)
	if err != nil {
		return "", err
	}

	userId, err := database.GetUserIdFromCache(ctx, tokenClaims.TokenUuid)
	if err != nil {
		return "", err
	}

	user, err := models.FindUserById(userId)
	if err != nil {
		return "", err
	}

	accessTokenDetails, err := utils.CreateAccessToken(user.ID.String())
	if err != nil {
		return "", nil
	}

	now := time.Now()
	err = database.GetRedisClient().Set(ctx, accessTokenDetails.TokenUuid, accessTokenDetails.UserID,
		time.Unix(*accessTokenDetails.ExpiresIn, 0).Sub(now)).Err()
	if err != nil {
		return "", err
	}

	return *accessTokenDetails.Token, nil
}

func setAccessTokenCookie(c *fiber.Ctx, accessToken string) {
	accessTokenMaxAge := config.GetConfig().JWT.AccessTokenMaxAge

	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		MaxAge:   accessTokenMaxAge * 60,
		Secure:   false,
		HTTPOnly: true,
		Domain:   "localhost",
	})
}

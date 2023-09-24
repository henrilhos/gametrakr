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
	accessToken, refreshToken := getTokens(c)

	tokenClaims, err := utils.ValidateAccessToken(accessToken)
	if err != nil {
		if refreshToken != "" && config.GetConfig().Server.IsRefreshingToken {
			accessToken, newTokenClaims, refreshErr := refreshAccessToken(refreshToken)
			if refreshErr != nil {
				utils.RespondWithError(c, fiber.StatusForbidden, err.Error())
			}
			tokenClaims = newTokenClaims
			setAccessTokenCookie(c, accessToken)
		} else {
			return utils.RespondWithError(c, fiber.StatusForbidden, err.Error())
		}
	}

	ctx := context.TODO()
	userId, err := database.GetUserIdFromCache(ctx, tokenClaims.TokenUuid)
	if err != nil {
		return utils.RespondWithError(c, fiber.StatusForbidden, "token is invalid or session has expired")
	}

	user, err := models.FindUserById(userId)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return utils.RespondWithError(c, fiber.StatusForbidden, "the user belonging to this token no longer exists")
		} else {
			return utils.RespondWithError(c, fiber.StatusBadGateway, err.Error())
		}
	}

	c.Locals("user", models.FilterUser(&user))
	c.Locals("access_token_uuid", tokenClaims.TokenUuid)

	return c.Next()
}

func getTokens(c *fiber.Ctx) (accessToken, refreshToken string) {
	authorization := c.Get("Authorization")
	if strings.HasPrefix(authorization, "Bearer ") {
		accessToken = strings.TrimPrefix(authorization, "Bearer ")
	} else if c.Cookies("access_token") != "" {
		accessToken = c.Cookies("access_token")
	}

	if c.Cookies("refresh_token") != "" {
		refreshToken = c.Cookies("refresh_token")
	}

	return accessToken, refreshToken
}

func refreshAccessToken(refreshToken string) (string, *utils.TokenDetails, error) {
	ctx := context.TODO()
	tokenClaims, err := utils.ValidateRefreshToken(refreshToken)
	if err != nil {
		return "", nil, err
	}

	userId, err := database.GetUserIdFromCache(ctx, tokenClaims.TokenUuid)
	if err != nil {
		return "", nil, err
	}

	user, err := models.FindUserById(userId)
	if err != nil {
		return "", nil, err
	}

	accessTokenDetails, err := utils.CreateAccessToken(user.ID.String())
	if err != nil {
		return "", nil, err
	}

	now := time.Now()
	err = database.GetRedisClient().Set(ctx, accessTokenDetails.TokenUuid, accessTokenDetails.UserID,
		time.Unix(*accessTokenDetails.ExpiresIn, 0).Sub(now)).Err()
	if err != nil {
		return "", nil, err
	}

	return *accessTokenDetails.Token, tokenClaims, nil
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

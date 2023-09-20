package middlewares

import (
	"context"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/henrilhos/gametrakr/database"
	"github.com/henrilhos/gametrakr/models"
	"github.com/henrilhos/gametrakr/utils"
	"github.com/redis/go-redis/v9"
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
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	ctx := context.TODO()
	userId, err := database.GetRedisClient().Get(ctx, tokenClaims.TokenUuid).Result()
	if err == redis.Nil {
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

	return c.Next()
}

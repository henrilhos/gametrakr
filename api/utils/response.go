package utils

import "github.com/gofiber/fiber/v2"

func RespondWithError(c *fiber.Ctx, statusCode int, message interface{}) error {
	return c.Status(statusCode).JSON(fiber.Map{"status": "fail", "message": message})
}

func RespondWithSuccess(c *fiber.Ctx, statusCode int, data interface{}) error {
	return c.Status(statusCode).JSON(fiber.Map{"status": "success", "data": data})
}

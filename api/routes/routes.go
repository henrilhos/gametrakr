package routes

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/monitor"
)

func RegisterV1Routes(app fiber.Router) {
	v1 := app.Group("/v1")

	RegisterV1AuthRoutes(v1)
	RegisterV1UserRoutes(v1)
	registerCommonRoutes(app)
}

func registerCommonRoutes(r fiber.Router) {
	r.Get("/metrics", monitor.New())

	r.Get("/healthcheck", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "success",
			"message": "ping",
		})
	})

	r.All("*", func(c *fiber.Ctx) error {
		path := c.Path()
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": fmt.Sprintf("path: %v does not exists on this server", path)})
	})
}

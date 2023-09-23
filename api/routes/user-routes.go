package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/henrilhos/gametrakr/handlers"
	"github.com/henrilhos/gametrakr/middlewares"
)

func RegisterV1UserRoutes(v1 fiber.Router) {
	user := v1.Group("/user")

	// private
	user.Get("/me", middlewares.JwtMiddleware, handlers.GetMe)
}

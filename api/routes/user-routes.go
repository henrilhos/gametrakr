package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/henrilhos/gametrakr/handlers"
	"github.com/henrilhos/gametrakr/middlewares"
)

func RegisterPrivateUserRoutes(r fiber.Router) {
	r.Get("/me", middlewares.JwtMiddleware, handlers.GetMe)
}

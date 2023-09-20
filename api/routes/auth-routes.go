package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/henrilhos/gametrakr/handlers"
	"github.com/henrilhos/gametrakr/middlewares"
)

func RegisterPublicAuthRoutes(r fiber.Router) {
	r.Post("/register", handlers.SignUpUser)
	r.Post("/login", handlers.SignInUser)
}

func RegisterPrivateAuthRoutes(r fiber.Router) {
	r.Get("/logout", middlewares.JwtMiddleware, handlers.SignOutUser)
	r.Get("/refresh", middlewares.JwtMiddleware, handlers.RefreshAccessToken)
}

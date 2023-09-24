package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/henrilhos/gametrakr/handlers"
	"github.com/henrilhos/gametrakr/middlewares"
)

func RegisterV1AuthRoutes(v1 fiber.Router) {
	auth := v1.Group("/auth")

	auth.Post("/signup", handlers.SignUpUser)
	auth.Post("/signin", handlers.SignInUser)
	auth.Post("/forgot-password", handlers.ForgotPassword)
	auth.Post("/reset-password/:code", handlers.ResetPassword)
	auth.Get("/refresh", handlers.RefreshAccessToken)

	// Private
	auth.Get("/signout", middlewares.JwtMiddleware, handlers.SignOutUser)
	auth.Get("/verify-email", middlewares.JwtMiddleware, handlers.SendEmailVerification)
	auth.Get("/verify-email/:code", middlewares.JwtMiddleware, handlers.VerifyEmail)
}

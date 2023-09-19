package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/henrilhos/gametrakr/database"
	"github.com/henrilhos/gametrakr/migrations"
	"github.com/henrilhos/gametrakr/routes"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// dsn := config.DBConfig()
	database.DBConnection()
	database.RedisConnection()

	migrations.Migrate()
}

func main() {
	// Get Timezone

	// Setup app and routes
	app := fiber.New()

	app.Use(logger.New())
	app.Use(helmet.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET, POST, PATCH, DELETE",
		AllowCredentials: true,
	}))

	routes.RegisterPrivateRoutes(app)
	routes.RegisterPublicRoutes(app)

	// Runs app
	log.Fatal(app.Listen(":8000"))
}

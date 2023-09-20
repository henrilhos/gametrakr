package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/henrilhos/gametrakr/database"
	"github.com/henrilhos/gametrakr/migrations"
	"github.com/henrilhos/gametrakr/routes"
	"github.com/henrilhos/gametrakr/utils"
	"github.com/joho/godotenv"
)

func init() {
	env := utils.GetenvString("ENVIRONMENT")

	if env != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	database.DBConnection()
	database.RedisConnection()

	migrations.Migrate()
}

func main() {
	port := utils.GetenvString("SERVER_PORT")
	addr := fmt.Sprintf(":%s", port)
	clientAddr := utils.GetenvString("CLIENT_ADDR")

	// Get Timezone

	// Setup app and routes
	app := fiber.New()

	app.Use(logger.New())
	app.Use(helmet.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     clientAddr,
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET, POST, PATCH, DELETE",
		AllowCredentials: true,
	}))

	routes.RegisterPrivateRoutes(app)
	routes.RegisterPublicRoutes(app)

	// Runs app
	log.Fatal(app.Listen(addr))
}

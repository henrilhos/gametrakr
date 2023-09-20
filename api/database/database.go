package database

import (
	"fmt"
	"log"
	"os"

	"github.com/henrilhos/gametrakr/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/plugin/dbresolver"
)

var (
	db  *gorm.DB
	err error
)

func DBConnection() {
	dsn := getDSN()

	logMode := utils.GetenvBool("ENABLE_GORM_LOGGER")
	debug := utils.GetenvBool("DEBUG")

	logLevel := logger.Silent
	if logMode {
		logLevel = logger.Info
	}

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})
	if err != nil {
		log.Fatal("Failed to connect to the database\n", err.Error())
		os.Exit(1)
	}

	if !debug {
		err := db.Use(dbresolver.Register(dbresolver.Config{
			Policy: dbresolver.RandomPolicy{},
		}))
		if err != nil {
			log.Fatal("Failed to add dbresolver\n", err.Error())
		}
	}

	fmt.Println("Database connected successfully...")
}

func GetDB() *gorm.DB {
	return db
}

func getDSN() string {
	DBHost := utils.GetenvString("POSTGRES_HOST")
	DBPort := utils.GetenvString("POSTGRES_PORT")
	DBUser := utils.GetenvString("POSTGRES_USER")
	DBPassword := utils.GetenvString("POSTGRES_PASSWORD")
	DBName := utils.GetenvString("POSTGRES_DB")
	DBSslMode := utils.GetenvString("DB_SSL_MODE")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		DBHost, DBUser, DBPassword, DBName, DBPort, DBSslMode,
	)

	return dsn
}

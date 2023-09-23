package database

import (
	"fmt"
	"log"
	"os"

	"github.com/henrilhos/gametrakr/config"
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
	config := config.GetConfig()
	dsn := getDSN(config.DB)

	logLevel := logger.Silent
	if config.DB.LogMode {
		logLevel = logger.Info
	}

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})
	if err != nil {
		log.Fatal("Failed to connect to the database\n", err.Error())
		os.Exit(1)
	}

	if !config.Server.Debug {
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

func getDSN(dbConfig config.DBConfiguration) string {
	if dbConfig.Port == "" {
		return fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s sslmode=%s",
			dbConfig.Host, dbConfig.User, dbConfig.Password, dbConfig.Name, dbConfig.SslMode,
		)
	}

	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		dbConfig.Host, dbConfig.User, dbConfig.Password, dbConfig.Name, dbConfig.Port, dbConfig.SslMode,
	)
}

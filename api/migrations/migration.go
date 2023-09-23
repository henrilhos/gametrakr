package migrations

import (
	"github.com/henrilhos/gametrakr/database"
	"github.com/henrilhos/gametrakr/models"
)

func Migrate() {
	var migrationModels = []interface{}{
		&models.User{},
		&models.Verification{},
	}

	database.GetDB().Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
	err := database.GetDB().AutoMigrate(migrationModels...)
	if err != nil {
		return
	}
}

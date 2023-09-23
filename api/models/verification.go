package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/henrilhos/gametrakr/database"
	"github.com/henrilhos/gametrakr/utils/mail"
)

type Verification struct {
	ID        uuid.UUID     `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	Email     string        `gorm:"not null" json:"email"`
	Code      string        `gorm:"not null" json:"code"`
	ExpiresAt time.Time     `gorm:"not null" json:"expiresAt"`
	Type      mail.MailType `gorm:"not null" json:"type"`
}

// Hooks

func (v *Verification) Create() (*Verification, error) {
	var err = database.GetDB().Create(&v).Error
	if err != nil {
		return &Verification{}, err
	}
	return v, nil
}

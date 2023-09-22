package models

import (
	"time"

	"github.com/google/uuid"
)

type VerificationType int

const (
	MailConfirmation VerificationType = iota + 1
	PassReset
)

type Verification struct {
	ID        uuid.UUID        `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	Email     string           `gorm:"not null" json:"email"`
	Code      string           `gorm:"not null" json:"code"`
	ExpiresAt time.Time        `gorm:"not null" json:"expiresAt"`
	Type      VerificationType `gorm:"not null" json:"type"`
}


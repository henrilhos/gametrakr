package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/henrilhos/gametrakr/database"
	"github.com/henrilhos/gametrakr/utils/mail"
	"github.com/sirupsen/logrus"
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

// Other

func VerifyEmailCode(email, code string) error {
	var verification Verification
	err := database.GetDB().Where("email = ? AND code = ? AND type = ? AND expires_at > ?", email, code, mail.MailConfirmation, time.Now()).First(&verification).Error
	if err != nil {
		logrus.Error("code not found or expired")
		return err
	}
	return nil
}

func VerifyPasswordCode(email, code string) (string, error) {
	var verification Verification
	err := database.GetDB().Model(Verification{}).Where("email = ? AND code = ? AND type = ? AND expires_at > ?", email, code, mail.PassReset, time.Now()).Take(&verification).Error
	if err != nil {
		logrus.Error("code not found or expired")
		return "", err
	}

	var userId string
	err = database.GetDB().Model(User{}).Where("email = ?", verification.Email).Select("id").Take(&userId).Error
	if err != nil {
		logrus.Error("user not found")
		return "", err
	}

	return userId, nil
}

package config

import (
	"time"

	"github.com/spf13/viper"
)

type SendGridConfiguration struct {
	ApiKey                         string        `mapstructure:"SENDGRID_API_KEY"`
	FromEmail                      string        `mapstructure:"SENDGRID_MAIL"`
	MailVerificationTemplateId     string        `mapstructure:"MAIL_VERIFICATION_TEMPLATE_ID"`
	PasswordResetTemplateId        string        `mapstructure:"PASSWORD_VERIFICATION_TEMPLATE_ID"`
	MailVerificationCodeExpiration time.Duration `mapstructure:"MAIL_VERIFICATION_CODE_EXPIRATION"`
	PasswordResetCodeExpiration    time.Duration `mapstructure:"PASSWORD_RESET_CODE_EXPIRATION"`
}

func LoadSGConfig() {
	viper.BindEnv("SENDGRID_API_KEY")
	viper.BindEnv("SENDGRID_MAIL")
	viper.BindEnv("MAIL_VERIFICATION_TEMPLATE_ID")
	viper.BindEnv("PASSWORD_VERIFICATION_TEMPLATE_ID")
	viper.BindEnv("MAIL_VERIFICATION_CODE_EXPIRATION")
	viper.BindEnv("PASSWORD_RESET_CODE_EXPIRATION")
}

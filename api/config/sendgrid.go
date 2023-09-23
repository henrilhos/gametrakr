package config

import "time"

type SendGridConfiguration struct {
	ApiKey                         string        `mapstructure:"SENDGRID_API_KEY"`
	FromEmail                      string        `mapstructure:"SENDGRID_MAIL"`
	MailVerificationTemplateId     string        `mapstructure:"MAIL_VERIFICATION_TEMPLATE_ID"`
	PasswordResetTemplateId        string        `mapstructure:"PASSWORD_VERIFICATION_TEMPLATE_ID"`
	MailVerificationCodeExpiration time.Duration `mapstructure:"MAIL_VERIFICATION_CODE_EXPIRATION"`
	PasswordResetCodeExpiration    time.Duration `mapstructure:"PASSWORD_RESET_CODE_EXPIRATION"`
}

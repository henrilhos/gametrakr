package config

type SendGridConfiguration struct {
	ApiKey                         string `mapstructure:"SENDGRID_API_KEY"`
	FromEmail                      string `mapstructure:"SENDGRID_MAIL"`
	MailVerificationTemplateId     string `mapstructure:"MAIL_VERIFICATION_TEMPLATE_ID"`
	PasswordResetTemplateId        string `mapstructure:"PASSWORD_VERIFICATION_TEMPLATE_ID"`
	MailVerificationCodeExpiration int    `mapstructure:"MAIL_VERIFICATION_CODE_EXPIRATION"`
	PasswordResetCodeExpiration    int    `mapstructure:"PASSWORD_RESET_CODE_EXPIRATION"`
}

func LoadSGConfig() {
	BindAndValidateEnv("SENDGRID_API_KEY")
	BindAndValidateEnv("SENDGRID_MAIL")
	BindAndValidateEnv("MAIL_VERIFICATION_TEMPLATE_ID")
	BindAndValidateEnv("PASSWORD_VERIFICATION_TEMPLATE_ID")
	BindAndValidateEnv("MAIL_VERIFICATION_CODE_EXPIRATION")
	BindAndValidateEnv("PASSWORD_RESET_CODE_EXPIRATION")
}

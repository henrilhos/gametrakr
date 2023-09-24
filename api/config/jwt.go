package config

type JWTConfiguration struct {
	AccessTokenPublicKey   string `mapstructure:"ACCESS_TOKEN_PUBLIC_KEY"`
	AccessTokenPrivateKey  string `mapstructure:"ACCESS_TOKEN_PRIVATE_KEY"`
	AccessTokenMaxAge      int    `mapstructure:"ACCESS_TOKEN_MAXAGE"`
	RefreshTokenPublicKey  string `mapstructure:"REFRESH_TOKEN_PUBLIC_KEY"`
	RefreshTokenPrivateKey string `mapstructure:"REFRESH_TOKEN_PRIVATE_KEY"`
	RefreshTokenMaxAge     int    `mapstructure:"REFRESH_TOKEN_MAXAGE"`
}

func LoadJWTConfig() {
	BindAndValidateEnv("ACCESS_TOKEN_PUBLIC_KEY")
	BindAndValidateEnv("ACCESS_TOKEN_PRIVATE_KEY")
	BindAndValidateEnv("ACCESS_TOKEN_MAXAGE")
	BindAndValidateEnv("REFRESH_TOKEN_PUBLIC_KEY")
	BindAndValidateEnv("REFRESH_TOKEN_PRIVATE_KEY")
	BindAndValidateEnv("REFRESH_TOKEN_MAXAGE")
}

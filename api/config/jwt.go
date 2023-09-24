package config

import (
	"time"

	"github.com/spf13/viper"
)

type JWTConfiguration struct {
	AccessTokenPublicKey   string        `mapstructure:"ACCESS_TOKEN_PUBLIC_KEY"`
	AccessTokenPrivateKey  string        `mapstructure:"ACCESS_TOKEN_PRIVATE_KEY"`
	AccessTokenMaxAge      int           `mapstructure:"ACCESS_TOKEN_MAXAGE"`
	AccessTokenExpiresIn   time.Duration `mapstructure:"ACCESS_TOKEN_EXPIRED_IN"`
	RefreshTokenPublicKey  string        `mapstructure:"REFRESH_TOKEN_PUBLIC_KEY"`
	RefreshTokenPrivateKey string        `mapstructure:"REFRESH_TOKEN_PRIVATE_KEY"`
	RefreshTokenMaxAge     int           `mapstructure:"REFRESH_TOKEN_MAXAGE"`
	RefreshTokenExpiresIn  time.Duration `mapstructure:"REFRESH_TOKEN_EXPIRED_IN"`
}

func LoadJWTConfig() {
	viper.BindEnv("ACCESS_TOKEN_PUBLIC_KEY")
	viper.BindEnv("ACCESS_TOKEN_PRIVATE_KEY")
	viper.BindEnv("ACCESS_TOKEN_MAXAGE")
	viper.BindEnv("ACCESS_TOKEN_EXPIRED_IN")
	viper.BindEnv("REFRESH_TOKEN_PUBLIC_KEY")
	viper.BindEnv("REFRESH_TOKEN_PRIVATE_KEY")
	viper.BindEnv("REFRESH_TOKEN_MAXAGE")
	viper.BindEnv("REFRESH_TOKEN_EXPIRED_IN")
}

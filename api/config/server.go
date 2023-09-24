package config

import "github.com/spf13/viper"

type ServerConfiguration struct {
	Environment       string `mapstructure:"ENVIRONMENT"`
	Port              string `mapstructure:"SERVER_PORT"`
	ClientAddr        string `mapstructure:"CLIENT_ADDR"`
	Debug             bool   `mapstructure:"DEBUG"`
	IsRefreshingToken bool   `mapstructure:"REFRESH_TOKEN"`
}

func LoadServerConfig() {
	BindAndValidateEnv("ENVIRONMENT")
	BindAndValidateEnv("SERVER_PORT")
	BindAndValidateEnv("CLIENT_ADDR")
	BindAndValidateEnv("DEBUG")
	BindAndValidateEnv("REFRESH_TOKEN")

	viper.SetDefault("REFRESH_TOKEN", false)
}

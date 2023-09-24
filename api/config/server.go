package config

import "github.com/spf13/viper"

type ServerConfiguration struct {
	Environment string `mapstructure:"ENVIRONMENT"`
	Port        string `mapstructure:"SERVER_PORT"`
	ClientAddr  string `mapstructure:"CLIENT_ADDR"`
	Debug       bool   `mapstructure:"DEBUG"`
}

func LoadServerConfig() {
	viper.BindEnv("ENVIRONMENT")
	viper.BindEnv("SERVER_PORT")
	viper.BindEnv("CLIENT_ADDR")
	viper.BindEnv("DEBUG")
}

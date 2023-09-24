package config

import (
	"fmt"

	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

type Configuration struct {
	Server   ServerConfiguration   `mapstructure:",squash"`
	DB       DBConfiguration       `mapstructure:",squash"`
	SendGrid SendGridConfiguration `mapstructure:",squash"`
	JWT      JWTConfiguration      `mapstructure:",squash"`
}

var config *Configuration

func LoadConfig() {
	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		logrus.Errorf("error to reading config file, %s", err)
	}

	LoadServerConfig()
	LoadDBConfig()
	LoadSGConfig()
	LoadJWTConfig()

	if err := viper.Unmarshal(&config); err != nil {
		logrus.Errorf("error to decode, %v", err)
	}
	fmt.Printf("Config loaded successfully...")
}

func GetConfig() *Configuration {
	return config
}

func BindAndValidateEnv(envName string) {
	if err := viper.BindEnv(envName); err != nil {
		logrus.Errorf(err.Error())
	}
}

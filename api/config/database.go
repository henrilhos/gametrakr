package config

import "github.com/spf13/viper"

type DBConfiguration struct {
	RedisUrl string `mapstructure:"REDIS_URL"`
	LogMode  bool   `mapstructure:"ENABLE_GORM_LOGGER"`
	Host     string `mapstructure:"POSTGRES_HOST"`
	Port     string `mapstructure:"POSTGRES_PORT"`
	User     string `mapstructure:"POSTGRES_USER"`
	Password string `mapstructure:"POSTGRES_PASSWORD"`
	Name     string `mapstructure:"POSTGRES_DB"`
	SslMode  string `mapstructure:"DB_SSL_MODE"`
}

func LoadDBConfig() {
	viper.BindEnv("REDIS_URL")
	viper.BindEnv("ENABLE_GORM_LOGGER")
	viper.BindEnv("POSTGRES_HOST")
	viper.BindEnv("POSTGRES_PORT")
	viper.BindEnv("POSTGRES_USER")
	viper.BindEnv("POSTGRES_PASSWORD")
	viper.BindEnv("POSTGRES_DB")
	viper.BindEnv("DB_SSL_MODE")
}

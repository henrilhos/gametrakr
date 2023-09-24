package config

type ServerConfiguration struct {
	Environment string `mapstructure:"ENVIRONMENT"`
	Port        string `mapstructure:"SERVER_PORT"`
	ClientAddr  string `mapstructure:"CLIENT_ADDR"`
	Debug       bool   `mapstructure:"DEBUG"`
}

func LoadServerConfig() {
	BindAndValidateEnv("ENVIRONMENT")
	BindAndValidateEnv("SERVER_PORT")
	BindAndValidateEnv("CLIENT_ADDR")
	BindAndValidateEnv("DEBUG")
}

package config

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
	BindAndValidateEnv("REDIS_URL")
	BindAndValidateEnv("ENABLE_GORM_LOGGER")
	BindAndValidateEnv("POSTGRES_HOST")
	BindAndValidateEnv("POSTGRES_PORT")
	BindAndValidateEnv("POSTGRES_USER")
	BindAndValidateEnv("POSTGRES_PASSWORD")
	BindAndValidateEnv("POSTGRES_DB")
	BindAndValidateEnv("DB_SSL_MODE")
}

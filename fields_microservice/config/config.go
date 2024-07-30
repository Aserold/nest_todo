package config

import (
	"github.com/pkg/errors"
	"github.com/spf13/viper"
)

type Config struct {
	PostgresqlHost     string `mapstructure:"DB_HOST"`
	PostgresqlPort     string `mapstructure:"DB_PORT"`
	PostgresqlUser     string `mapstructure:"DB_USER"`
	PostgresqlPassword string `mapstructure:"DB_PASSWORD"`
	PostgresqlDbname   string `mapstructure:"DB_NAME"`
	RMQUrl             string `mapstructure:"RMQ_URL"`
}

func LoadConfig() (*Config, error) {
	viper.AutomaticEnv()

	viper.BindEnv("DB_HOST")
	viper.BindEnv("DB_PORT")
	viper.BindEnv("DB_USER")
	viper.BindEnv("DB_PASSWORD")
	viper.BindEnv("DB_NAME")
	viper.BindEnv("RMQ_URL")

	var config Config
	err := viper.Unmarshal(&config)
	if err != nil {
		return nil, errors.Wrap(err, "unable to decode into config struct")
	}

	envVars := []string{"DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME", "RMQ_URL"}
	for _, v := range envVars {
		if !viper.IsSet(v) {
			return nil, errors.Errorf("missing mandatory config variable: %s", v)
		}
	}

	return &config, nil
}

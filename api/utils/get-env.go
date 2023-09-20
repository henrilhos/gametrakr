package utils

import (
	"os"
	"strconv"
	"time"
)

func GetenvString(key string) string {
	v := os.Getenv(key)
	return v
}

func GetenvInt(key string) int {
	s := GetenvString(key)
	if s == "" {
		return 0
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return v
}

func GetenvBool(key string) bool {
	s := GetenvString(key)
	if s == "" {
		return false
	}
	v, err := strconv.ParseBool(s)
	if err != nil {
		return false
	}
	return v
}

func GetenvDuration(key string) time.Duration {
	s := GetenvString(key)
	v, err := time.ParseDuration(s)
	if err != nil {
		return 0
	}
	return v
}

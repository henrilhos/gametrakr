package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/henrilhos/gametrakr/utils"
	"github.com/redis/go-redis/v9"
)

var (
	redisClient *redis.Client
	c           context.Context
)

func RedisConnection() {
	redisAddr := utils.GetenvString("REDIS_URL")
	c = context.TODO()

	redisClient = redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	if _, err := redisClient.Ping(c).Result(); err != nil {
		log.Fatal("Failed to connect to the Redis\n", err.Error())
		os.Exit(1)
	}

	err := redisClient.Set(c, "test", "gametrakr", 0).Err()
	if err != nil {
		log.Fatal("Failed to connect to the Redis\n", err.Error())
		os.Exit(1)
	}

	fmt.Println("Redis connected successfully...")
}

func GetRedisClient() *redis.Client {
	return redisClient
}

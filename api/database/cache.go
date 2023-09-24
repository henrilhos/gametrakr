package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/henrilhos/gametrakr/config"
	"github.com/redis/go-redis/v9"
)

var (
	redisClient *redis.Client
	c           context.Context
)

func RedisConnection() {
	redisUrl := config.GetConfig().DB.RedisUrl
	redisOptions, err := redis.ParseURL(redisUrl)
	if err != nil {
		redisOptions = &redis.Options{
			Addr: redisUrl,
		}
	}

	c = context.TODO()

	redisClient = redis.NewClient(redisOptions)

	if _, err := redisClient.Ping(c).Result(); err != nil {
		log.Fatal("Failed to connect to the Redis\n", err.Error())
		os.Exit(1)
	}

	err = redisClient.Set(c, "test", "gametrakr", 0).Err()
	if err != nil {
		log.Fatal("Failed to connect to the Redis\n", err.Error())
		os.Exit(1)
	}

	fmt.Println("Redis connected successfully...")
}

func GetRedisClient() *redis.Client {
	return redisClient
}

func GetUserIdFromCache(ctx context.Context, tokenUuid string) (string, error) {
	userId, err := redisClient.Get(ctx, tokenUuid).Result()
	if err == redis.Nil {
		return "", fmt.Errorf("token not found")
	}
	return userId, nil
}

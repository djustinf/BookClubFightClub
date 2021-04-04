package db

import (
	"github.com/go-redis/redis/v8"
)

var rdb *redis.Client

func GetRDB() *redis.Client {
	if rdb != nil {
		return rdb
	}

	rdb = redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	return rdb
}

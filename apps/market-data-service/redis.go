package main

import (
	"context"

	"github.com/redis/go-redis/v9"
)


type RedisClient struct{
	rdb *redis.Client
}

 func NewRedisClient(addr string) *RedisClient{
	rdb:=redis.NewClient((&redis.Options{
		Addr: addr,
	}))

	return &RedisClient{rdb:rdb}
 }

 func (c *RedisClient) Publish(ctx context.Context,channel string,message []byte) error {
	return c.rdb.Publish(ctx,channel,message).Err()
 }

 func (c *RedisClient) Close() error{
	return c.rdb.Close()
 }
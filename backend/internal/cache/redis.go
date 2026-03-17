package cache

import (
	"context"
	"errors"
	"time"

	"github.com/redis/go-redis/v9"
)

// ErrCacheMiss is returned when a key is not found in the cache.
var ErrCacheMiss = errors.New("cache miss")

// Client defines the interface for the cache layer.
// All implementations must be goroutine-safe.
type Client interface {
	Get(ctx context.Context, key string) (string, error)
	Set(ctx context.Context, key string, value string, ttl time.Duration) error
	Delete(ctx context.Context, key string) error
	Ping(ctx context.Context) error
	Close() error
}

// GoRedisClient wraps go-redis/v9 to implement the Client interface.
type GoRedisClient struct {
	rdb *redis.Client
}

// NewGoRedisClient parses the Redis URL and returns a connected client.
// url format: redis://[:password@]host[:port][/db]
func NewGoRedisClient(url string) (*GoRedisClient, error) {
	opts, err := redis.ParseURL(url)
	if err != nil {
		return nil, err
	}
	rdb := redis.NewClient(opts)
	return &GoRedisClient{rdb: rdb}, nil
}

func (c *GoRedisClient) Get(ctx context.Context, key string) (string, error) {
	val, err := c.rdb.Get(ctx, key).Result()
	if errors.Is(err, redis.Nil) {
		return "", ErrCacheMiss
	}
	return val, err
}

func (c *GoRedisClient) Set(ctx context.Context, key string, value string, ttl time.Duration) error {
	return c.rdb.Set(ctx, key, value, ttl).Err()
}

func (c *GoRedisClient) Delete(ctx context.Context, key string) error {
	return c.rdb.Del(ctx, key).Err()
}

func (c *GoRedisClient) Ping(ctx context.Context) error {
	return c.rdb.Ping(ctx).Err()
}

func (c *GoRedisClient) Close() error {
	return c.rdb.Close()
}

// GetRawClient returns the underlying *redis.Client.
func (c *GoRedisClient) GetRawClient() *redis.Client {
	return c.rdb
}

// NoopClient is used when Redis is not available. It never caches anything.
// This allows the app to degrade gracefully without Redis.
type NoopClient struct{}

func (n *NoopClient) Get(_ context.Context, _ string) (string, error) {
	return "", ErrCacheMiss
}
func (n *NoopClient) Set(_ context.Context, _ string, _ string, _ time.Duration) error {
	return nil
}
func (n *NoopClient) Delete(_ context.Context, _ string) error { return nil }
func (n *NoopClient) Ping(_ context.Context) error             { return errors.New("noop cache: redis not configured") }
func (n *NoopClient) Close() error                             { return nil }

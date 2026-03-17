package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

// RateLimiter returns a middleware that limits requests by client IP.
func RateLimiter(rate string, store limiter.Store) gin.HandlerFunc {
	// e.g. "5-M" (5 requests per minute), "10-H" (10 requests per hour)
	r, err := limiter.NewRateFromFormatted(rate)
	if err != nil {
		// Fallback to strict limit if parsing fails
		r = limiter.Rate{
			Period: 1 * time.Minute,
			Limit:  5,
		}
	}

	if store == nil {
		store = memory.NewStore()
	}

	instance := limiter.New(store, r, limiter.WithTrustForwardHeader(true))

	middleware := mgin.NewMiddleware(instance,
		mgin.WithLimitReachedHandler(func(c *gin.Context) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Rate limit exceeded. Try again later.",
			})
			c.Abort()
		}),
	)

	return middleware
}

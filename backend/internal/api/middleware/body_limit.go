package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// MaxBodySize rejects requests with bodies larger than the given limit.
func MaxBodySize(limit int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, limit)
		c.Next()
	}
}

package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
)

func normalizeOrigin(value string) string {
	value = strings.TrimSpace(value)
	if value == "*" {
		return value
	}

	return strings.TrimRight(value, "/")
}

// CORSMiddleware handles Cross-Origin Resource Sharing.
func CORSMiddleware(origins []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := normalizeOrigin(c.Request.Header.Get("Origin"))
		if origin == "" {
			c.Next()
			return
		}

		allowed := false
		for _, o := range origins {
			normalizedAllowedOrigin := normalizeOrigin(o)
			if normalizedAllowedOrigin == "*" || normalizedAllowedOrigin == origin {
				allowed = true
				break
			}
		}

		if allowed {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Request-ID")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

			if c.Request.Method == "OPTIONS" {
				c.AbortWithStatus(204)
				return
			}
		}

		c.Next()
	}
}

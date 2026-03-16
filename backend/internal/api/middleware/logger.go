package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RequestIDMiddleware injects a unique X-Request-ID into every request
// and sets it in the Gin context for logging.
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		reqID := c.GetHeader("X-Request-ID")
		if reqID == "" {
			reqID = uuid.NewString()
		}
		c.Set("request_id", reqID)
		c.Writer.Header().Set("X-Request-ID", reqID)
		c.Next()
	}
}

// LoggerMiddleware logs incoming HTTP requests using slog in JSON format.
func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		c.Next()

		latency := time.Since(start)
		if raw != "" {
			path = path + "?" + raw
		}

		reqID, _ := c.Get("request_id")
		userID, userExists := c.Get("user_id")
		role, _ := c.Get("role")

		attrs := []any{
			slog.String("request_id", reqID.(string)),
			slog.String("method", c.Request.Method),
			slog.String("path", path),
			slog.Int("status", c.Writer.Status()),
			slog.String("latency", latency.String()),
			slog.String("client_ip", c.ClientIP()),
		}

		if userExists {
			attrs = append(attrs, slog.String("user_id", userID.(string)))
			if role != nil {
				attrs = append(attrs, slog.String("role", role.(string)))
			}
		}

		if len(c.Errors) > 0 {
			attrs = append(attrs, slog.String("errors", c.Errors.ByType(gin.ErrorTypePrivate).String()))
			slog.Error("Request failed", attrs...)
		} else {
			slog.Info("Request processed", attrs...)
		}
	}
}

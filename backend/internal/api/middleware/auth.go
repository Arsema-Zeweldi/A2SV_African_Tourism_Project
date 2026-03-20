package middleware

import (
	"fmt"
	"log/slog"
	"net/http"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/cache"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func JWTMiddleware(jwtSecret string, redis cache.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenString string

		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			parts := strings.Fields(authHeader)
			if len(parts) >= 2 && strings.ToLower(parts[0]) == "bearer" {
				tokenString = strings.TrimSpace(parts[1])
			}
		}

		// Fallback to query parameter for token (e.g. for WebSockets)
		if tokenString == "" {
			tokenString = strings.TrimSpace(c.Query("token"))
		}

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token is required (header or query parameter)"})
			c.Abort()
			return
		}

		// Check if token is blacklisted in Redis
		if redis != nil {
			val, err := redis.Get(c.Request.Context(), "blacklist:"+tokenString)
			if err == nil && val != "" {
				slog.Info("Access blocked: token is blacklisted", "token_tail", tokenString[len(tokenString)-10:])
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has been invalidated (logged out)"})
				c.Abort()
				return
			}
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Set user_id and role in context for handlers to use
		c.Set("user_id", claims["user_id"])
		roleClaim, ok := claims["role"]
		if !ok {
			roleClaim = claims["account_type"]
		}
		if role, ok := roleClaim.(string); ok {
			c.Set("role", role)
		}
		c.Next()
	}
}

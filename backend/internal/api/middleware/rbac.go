package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RequireRole checks if the authenticated user has one of the allowed roles.
func RequireRole(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: missing role claim in token"})
			c.Abort()
			return
		}

		role, ok := roleVal.(string)
		if !ok || role == "" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: invalid role claim format"})
			c.Abort()
			return
		}

		for _, allowed := range allowedRoles {
			if role == allowed {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: insufficient permissions"})
		c.Abort()
	}
}

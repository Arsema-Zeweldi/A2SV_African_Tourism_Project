package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

func TestJWTMiddleware(t *testing.T) {
	secret := "test-secret"
	gin.SetMode(gin.TestMode)

	t.Run("Valid Token", func(t *testing.T) {
		r := gin.New()
		r.Use(JWTMiddleware(secret))
		r.GET("/test", func(c *gin.Context) {
			userID, exists := c.Get("user_id")
			assert.True(t, exists)
			assert.Equal(t, "123", userID)
			c.Status(http.StatusOK)
		})

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": "123",
			"exp":     time.Now().Add(time.Hour).Unix(),
		})
		tokenString, _ := token.SignedString([]byte(secret))

		req := httptest.NewRequest("GET", "/test", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("Missing Header", func(t *testing.T) {
		r := gin.New()
		r.Use(JWTMiddleware(secret))
		r.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

		req := httptest.NewRequest("GET", "/test", nil)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("Invalid Secret", func(t *testing.T) {
		r := gin.New()
		r.Use(JWTMiddleware(secret))
		r.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": "123",
			"exp":     time.Now().Add(time.Hour).Unix(),
		})
		tokenString, _ := token.SignedString([]byte("wrong-secret"))

		req := httptest.NewRequest("GET", "/test", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("Missing Bearer Prefix", func(t *testing.T) {
		r := gin.New()
		r.Use(JWTMiddleware(secret))
		r.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": "123",
			"exp":     time.Now().Add(time.Hour).Unix(),
		})
		tokenString, _ := token.SignedString([]byte(secret))

		req := httptest.NewRequest("GET", "/test", nil)
		req.Header.Set("Authorization", tokenString)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("Expired Token", func(t *testing.T) {
		r := gin.New()
		r.Use(JWTMiddleware(secret))
		r.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": "123",
			"exp":     time.Now().Add(-time.Hour).Unix(),
		})
		tokenString, _ := token.SignedString([]byte(secret))

		req := httptest.NewRequest("GET", "/test", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("Invalid Signing Method", func(t *testing.T) {
		r := gin.New()
		r.Use(JWTMiddleware(secret))
		r.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

		token := jwt.NewWithClaims(jwt.SigningMethodNone, jwt.MapClaims{
			"user_id": "123",
			"exp":     time.Now().Add(time.Hour).Unix(),
		})
		tokenString, _ := token.SignedString(jwt.UnsafeAllowNoneSignatureType)

		req := httptest.NewRequest("GET", "/test", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("Garbage Token", func(t *testing.T) {
		r := gin.New()
		r.Use(JWTMiddleware(secret))
		r.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

		req := httptest.NewRequest("GET", "/test", nil)
		req.Header.Set("Authorization", "Bearer not-a-token")
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

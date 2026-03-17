package handlers

import (
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// getUserID extracts the user ID from the Gin context.
// This assumes the JWTMiddleware has already set the "user_id" string in the context.
func getUserID(c *gin.Context) (uuid.UUID, error) {
	raw, exists := c.Get("user_id")
	if !exists {
		return uuid.Nil, errors.New("user_id not found in context")
	}
	idStr, ok := raw.(string)
	if !ok {
		return uuid.Nil, errors.New("user_id has unexpected type in context")
	}
	return uuid.Parse(idStr)
}

// parseInt is a helper to parse query strings to integers.
func parseInt(s string) (int, error) {
	if s == "" {
		return 0, errors.New("empty string")
	}
	return strconv.Atoi(s)
}

// parseFloat is a helper to parse query strings to floats.
func parseFloat(s string) (float64, error) {
	if s == "" {
		return 0, errors.New("empty string")
	}
	return strconv.ParseFloat(s, 64)
}

// parseISODate parses a YYYY-MM-DD string into a time.Time pointer.
func parseISODate(raw string) (*time.Time, error) {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" {
		return nil, nil
	}
	parsed, err := time.Parse("2006-01-02", trimmed)
	if err != nil {
		return nil, err
	}
	parsed = parsed.UTC()
	return &parsed, nil
}

// boolFromPtr returns the value of a bool pointer or false if nil.
func boolFromPtr(value *bool) bool {
	if value == nil {
		return false
	}
	return *value
}

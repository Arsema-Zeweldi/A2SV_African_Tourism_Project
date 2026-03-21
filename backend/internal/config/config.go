package config

import (
	"errors"
	"log/slog"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

// Config holds all application configuration loaded from environment variables.
type Config struct {
	ServerPort      string
	DatabaseURL     string
	JWTSecret       string
	GeminiAPIKey    string
	GeminiModel     string
	RedisURL        string
	AllowedOrigins  []string
	Environment     string
	CloudinaryURL   string
	// Email
	BrevoAPIKey     string
	BrevoAPIURL     string
	EmailFrom       string
	EmailFromName   string
	FrontendURL     string
}

// LoadConfig reads configuration from environment variables (and an optional .env file).
// It returns an error if any required variable is missing or invalid.
func LoadConfig() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		slog.Info("No .env file found, reading from system environment")
	}

	secret := getEnv("JWT_SECRET", "")
	if strings.TrimSpace(secret) == "" {
		return nil, errors.New("JWT_SECRET environment variable is required and must not be empty")
	}

	geminiKey := getEnv("GEMINI_API_KEY", "")
	if strings.TrimSpace(geminiKey) == "" {
		slog.Warn("GEMINI_API_KEY is not set — AI planner will return errors")
	}

	originsRaw := getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")
	origins := []string{}
	for _, o := range strings.Split(originsRaw, ",") {
		if trimmed := strings.TrimSpace(o); trimmed != "" {
			origins = append(origins, trimmed)
		}
	}

	return &Config{
		ServerPort:     getEnv("SERVER_PORT", "8080"),
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		JWTSecret:      secret,
		GeminiAPIKey:   geminiKey,
		GeminiModel:    getEnv("GEMINI_MODEL", "gemini-1.5-flash-latest"),
		RedisURL:       getEnv("REDIS_URL", "redis://localhost:6379"),
		AllowedOrigins: origins,
		Environment:    getEnv("ENVIRONMENT", "development"),
		CloudinaryURL:  getEnv("CLOUDINARY_URL", ""),
		BrevoAPIKey:    getEnv("BREVO_API_KEY", ""),
		BrevoAPIURL:    getEnv("BREVO_API_URL", "https://api.brevo.com/v3/smtp/email"),
		EmailFrom:      getEnv("EMAIL_FROM", "noreply@amona.travel"),
		EmailFromName:  getEnv("EMAIL_FROM_NAME", "Amona"),
		FrontendURL:    getEnv("FRONTEND_URL", "http://localhost:3000"),
	}, nil
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

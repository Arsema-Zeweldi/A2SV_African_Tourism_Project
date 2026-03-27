package database

import (
	"errors"
	"log/slog"
	"net/url"
	"os"
	"strings"
	"time"

	"path/filepath"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB(cfg *config.Config) (*gorm.DB, error) {
	if cfg == nil {
		return nil, errors.New("config is nil")
	}
	if strings.TrimSpace(cfg.DatabaseURL) == "" {
		return nil, errors.New("DATABASE_URL is required")
	}

	dsn := ensureSSLModeRequire(cfg.DatabaseURL)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err == nil {
		// Connection pooling settings
		sqlDB.SetMaxOpenConns(25)
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetConnMaxLifetime(5 * time.Minute)
	}

	// 3. Run migrations using golang-migrate
	migrationsPath := getEnv("MIGRATIONS_PATH", "file://migrations")

	m, err := migrate.New(
		migrationsPath,
		dsn,
	)
	if err != nil {
		slog.Warn("Migration initialization failed", "error", err)
		// Try to see if migrations folder exists locally if path is relative
		if strings.HasPrefix(migrationsPath, "file://") {
			relPath := strings.TrimPrefix(migrationsPath, "file://")
			if abs, err := filepath.Abs(relPath); err == nil {
				if _, err := os.Stat(abs); err != nil {
					slog.Warn("Migrations directory not found", "path", abs)
				}
			}
		}
	} else {
		if err := m.Up(); err != nil && err != migrate.ErrNoChange {
			slog.Warn("Migration execution failed", "error", err)
		}
		m.Close()
	}

	slog.Info("✅ Database connected successfully")

	return db, nil
}

func ensureSSLModeRequire(dsn string) string {
	parsed, err := url.Parse(dsn)
	if err != nil {
		if strings.Contains(strings.ToLower(dsn), "sslmode=") {
			return dsn
		}
		separator := "?"
		if strings.Contains(dsn, "?") {
			separator = "&"
		}
		return dsn + separator + "sslmode=require"
	}

	query := parsed.Query()
	if strings.TrimSpace(query.Get("sslmode")) == "" {
		query.Set("sslmode", "require")
		parsed.RawQuery = query.Encode()
	}

	return parsed.String()
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

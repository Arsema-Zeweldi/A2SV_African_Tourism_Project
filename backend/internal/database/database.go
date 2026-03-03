package database

import (
	"errors"
	"log"
	"net/url"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
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
	log.Println("Connecting to database using DATABASE_URL")

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	log.Println("✅ Database connection established")

	log.Println("🔄 Running auto-migrations...")
	err = db.AutoMigrate(
		&models.User{},
		&models.UserPreference{},
		&models.Region{},
		&models.Country{},
		&models.Destination{},
		&models.Tag{},
		&models.DestinationTag{},
		&models.UserFavorite{},
		&models.Review{},
		&models.UserRecommendation{},
		&models.AIInsight{},
		&models.AnalyticsEvent{},
		&models.VisitorStatistic{},
		&models.VisaRequirement{},
		&models.SafetyAlert{},
		&models.Itinerary{},
		&models.ItineraryItem{},
		&models.Package{},
		&models.PackageReview{},
		&models.PackageChat{},
	)
	if err != nil {
		log.Printf("⚠️ Auto-migration warning: %v", err)
	} else {
		log.Println("✅ Auto-migrations completed")
	}

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

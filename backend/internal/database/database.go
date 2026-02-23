package database

import (
	"fmt"
	"log"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB(cfg *config.Config) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s connect_timeout=5",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode)

	log.Printf("Connecting to database: host=%s port=%s dbname=%s user=%s", cfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBUser)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}

	DB = db
	log.Println("✅ Database connection established")

	log.Println("🔄 Running auto-migrations...")
	err = db.AutoMigrate(
		&models.User{},
		&models.UserPreference{},
		&models.Region{},
		&models.Country{},
		&models.Destination{},
		&models.Tag{},
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
}

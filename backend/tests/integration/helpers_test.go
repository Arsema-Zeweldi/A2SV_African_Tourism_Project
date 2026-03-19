//go:build integration
// +build integration

package handlers_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"runtime"
	"testing"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/api"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/database"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type testEnv struct {
	router        http.Handler
	db            *gorm.DB
	cfg           *config.Config
	userID        uuid.UUID
	token         string
	itineraryID   uuid.UUID
	destinationID uuid.UUID
	regionID      uuid.UUID
	sourceCountry uuid.UUID
	destCountry   uuid.UUID
}

func setupTestEnv(t *testing.T) *testEnv {
	t.Helper()

	_, filename, _, _ := runtime.Caller(0)
	// Points to A2SV_African_Tourism_Project/backend
	projectRoot := filepath.Join(filepath.Dir(filename), "../..")

	// Load config from project root (.env might be there)
	origDir, _ := os.Getwd()
	os.Chdir(projectRoot)
	defer os.Chdir(origDir)

	os.Setenv("MIGRATIONS_PATH", "file://migrations")
	cfg, err := config.LoadConfig()
	if err != nil {
		t.Fatalf("Failed to load config: %v", err)
	}

	db, err := database.InitDB(cfg)
	if err != nil {
		t.Fatalf("DB connection failed: %v\n\nMake sure DATABASE_URL is set in .env", err)
	}

	email := fmt.Sprintf("test_%d@packages.test", time.Now().UnixNano())
	userID := uuid.New()
	if err := db.Exec(
		`INSERT INTO users (user_id, email, password_hash, first_name, last_name, account_type, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, now(), now())`,
		userID, email, "$2a$10$placeholder", "Test", "User", "admin",
	).Error; err != nil {
		t.Fatalf("Failed to insert test user: %v", err)
	}

	tokenStr := makeJWT(t, userID.String(), "admin", cfg.JWTSecret)

	regionID := uuid.New()
	if err := db.Exec(`INSERT INTO regions (region_id, name, slug, description)
		VALUES (?, ?, ?, ?)`,
		regionID, "Test Region", "test-region", "Region for tests").Error; err != nil {
		t.Fatalf("Failed to insert test region: %v", err)
	}

	sourceCountryID := uuid.New()
	if err := db.Exec(`INSERT INTO countries (country_id, name, iso_code, region_id)
		VALUES (?, ?, ?, ?)`,
		sourceCountryID, "Source Country", "SC", regionID).Error; err != nil {
		t.Fatalf("Failed to insert source country: %v", err)
	}

	destCountryID := uuid.New()
	if err := db.Exec(`INSERT INTO countries (country_id, name, iso_code, region_id)
		VALUES (?, ?, ?, ?)`,
		destCountryID, "Destination Country", "DC", regionID).Error; err != nil {
		t.Fatalf("Failed to insert destination country: %v", err)
	}

	destID := uuid.New()
	if err := db.Exec(`INSERT INTO destinations
		(destination_id, name, slug, description, country_id, region_id, is_active, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, true, now(), now())`,
		destID, "Test Destination", "test-destination", "A nice place", destCountryID, regionID).Error; err != nil {
		t.Fatalf("Failed to insert test destination: %v", err)
	}

	if err := db.Exec(`INSERT INTO visa_requirements
		(visa_id, source_country_id, destination_country_id, visa_type, description, cost_usd, valid_days, last_updated)
		VALUES (?, ?, ?, ?, ?, ?, ?, now())`,
		uuid.New(), sourceCountryID, destCountryID, "required", "Test visa", 25.0, 30).Error; err != nil {
		t.Fatalf("Failed to insert test visa requirement: %v", err)
	}

	if err := db.Exec(`INSERT INTO safety_alerts
		(alert_id, country_id, destination_id, level, message, created_at)
		VALUES (?, ?, ?, ?, ?, now())`,
		uuid.New(), destCountryID, destID, 2, "Test alert").Error; err != nil {
		t.Fatalf("Failed to insert test safety alert: %v", err)
	}

	itineraryID := uuid.New()
	db.Create(&models.Itinerary{
		ItineraryID: itineraryID,
		UserID:      userID,
		Title:       "Test Safari Itinerary",
	})
	for i := 1; i <= 3; i++ {
		db.Create(&models.ItineraryActivity{
			ActivityID:  uuid.New(),
			ItineraryID: itineraryID,
			DayNumber:   i,
			Title:       fmt.Sprintf("Day %d Activity", i),
			Description: "Seeing the big 5.",
			StartTime:   "09:00:00",
			EndTime:     "17:00:00",
		})
	}

	router := api.SetupRouter(db, cfg, nil)
	env := &testEnv{
		router:        router,
		db:            db,
		cfg:           cfg,
		userID:        userID,
		token:         tokenStr,
		itineraryID:   itineraryID,
		destinationID: destID,
		regionID:      regionID,
		sourceCountry: sourceCountryID,
		destCountry:   destCountryID,
	}

	t.Cleanup(func() {
		db.Exec("DELETE FROM package_chats WHERE package_id IN (SELECT package_id FROM packages WHERE creator_id = ?)", userID)
		db.Exec("DELETE FROM package_reviews WHERE package_id IN (SELECT package_id FROM packages WHERE creator_id = ?)", userID)
		db.Exec("DELETE FROM packages WHERE creator_id = ?", userID)
		db.Exec("DELETE FROM itinerary_activities WHERE itinerary_id = ?", itineraryID)
		db.Exec("DELETE FROM itineraries WHERE itinerary_id = ?", itineraryID)
		db.Exec("DELETE FROM safety_alerts WHERE destination_id = ?", destID)
		db.Exec("DELETE FROM visa_requirements WHERE source_country_id = ? OR destination_country_id = ?", sourceCountryID, destCountryID)
		db.Exec("DELETE FROM destinations WHERE destination_id = ?", destID)
		db.Exec("DELETE FROM countries WHERE country_id IN (?, ?)", sourceCountryID, destCountryID)
		db.Exec("DELETE FROM regions WHERE region_id = ?", regionID)
		db.Exec("DELETE FROM users WHERE user_id = ?", userID)
	})

	return env
}

func makeJWT(t *testing.T, userID, accountType, secret string) string {
	t.Helper()
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":      userID,
		"account_type": accountType,
		"exp":          time.Now().Add(time.Hour).Unix(),
	})
	s, err := tok.SignedString([]byte(secret))
	if err != nil {
		t.Fatalf("failed to sign JWT: %v", err)
	}
	return s
}

func doRequest(t *testing.T, router http.Handler, method, path string, body interface{}, token string) *httptest.ResponseRecorder {
	t.Helper()
	var buf bytes.Buffer
	if body != nil {
		if err := json.NewEncoder(&buf).Encode(body); err != nil {
			t.Fatalf("failed to encode body: %v", err)
		}
	}
	req := httptest.NewRequest(method, path, &buf)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func mustDecode(t *testing.T, w *httptest.ResponseRecorder, v interface{}) {
	t.Helper()
	if err := json.NewDecoder(w.Body).Decode(v); err != nil {
		t.Fatalf("failed to decode response body (%s): %v", w.Body.String(), err)
	}
}

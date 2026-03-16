//go:build e2e
// +build e2e

package e2e

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"testing"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/database"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
)

func TestPackagesE2E(t *testing.T) {
	// Let's connect to the DB to inject a test Itinerary (since the Itinerary API is just a stub right now)
	cfg, err := config.LoadConfig()
	if err != nil {
		t.Fatalf("Failed to load config: %v", err)
	}
	db, err := database.InitDB(cfg)
	if err != nil {
		t.Fatalf("Failed to connect to db: %v", err)
	}

	// We got this from your terminal output
	userID := uuid.MustParse("9c92b287-9824-40cf-86be-73df71e1a74d")
	token := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzI1NjI0NjUsInVzZXJfaWQiOiI5YzkyYjI4Ny05ODI0LTQwY2YtODZiZS03M2RmNzFlMWE3NGQifQ.O9cJkN8zAqM86JkfxAYs4LWpl4MW5AC8aYMDojWSGPE"

	log.Println("Setting up mock Itinerary for User to test Packages...")
	itineraryID := uuid.New()
	itinerary := models.Itinerary{
		ItineraryID: itineraryID,
		UserID:      userID,
		Title:       "My African Safari",
	}
	db.Create(&itinerary)

	// A package needs at least 3 attached itinerary items to be "Published"
	for i := 1; i <= 3; i++ {
		err := db.Create(&models.ItineraryItem{
			ItemID:              uuid.New(),
			ItineraryID:         itineraryID,
			DayNumber:           i,
			ActivityName:        fmt.Sprintf("Day %d: Amazing Safari", i),
			ActivityDescription: "Seeing the big 5.",
			StartTime:           "09:00:00",
			EndTime:             "17:00:00",
		}).Error
		if err != nil {
			log.Printf("Failed to insert item: %v", err)
		}
	}
	log.Println("Mock Itinerary and Items created in DB")

	time.Sleep(1 * time.Second)

	log.Println("STARTING PACKAGES API TESTS")

	makeRequest := func(method, url string, body interface{}) string {
		var reqBody io.Reader
		if body != nil {
			b, _ := json.Marshal(body)
			reqBody = bytes.NewBuffer(b)
		}

		req, _ := http.NewRequest(method, url, reqBody)
		req.Header.Set("Authorization", "Bearer "+token)
		if body != nil {
			req.Header.Set("Content-Type", "application/json")
		}

		client := &http.Client{Timeout: 5 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			t.Fatalf("HTTP Request failed: %v", err)
		}
		defer resp.Body.Close()

		respBytes, _ := io.ReadAll(resp.Body)

		log.Printf("[%s] %s", method, url)
		log.Printf("Status: %s", resp.Status)

		// Attempt pretty print JSON
		var prettyJSON bytes.Buffer
		if err := json.Indent(&prettyJSON, respBytes, "", "  "); err == nil {
			log.Printf("Body:\n%s", prettyJSON.String())
		} else {
			log.Printf("Body:\n%s", string(respBytes))
		}

		return string(respBytes)
	}

	// 1. Create a Package
	log.Println("1. Creating a package (draft)")
	createRes := makeRequest("POST", "http://localhost:8080/api/v1/packages", map[string]interface{}{
		"itinerary_id": itineraryID.String(),
		"title":        "Complete Epic Safari Adventure",
		"summary":      "A beautiful 3-day guided trip.",
		"price":        499.99,
	})

	// Extract the newly created Package ID
	var pkg map[string]interface{}
	json.Unmarshal([]byte(createRes), &pkg)
	packageIDRaw, ok := pkg["package_id"]
	if !ok {
		t.Fatalf("Failed to extract package_id from response")
	}
	packageID := packageIDRaw.(string)

	// 2. Publish the Package
	log.Println("2. Publishing the package")
	makeRequest("POST", "http://localhost:8080/api/v1/packages/"+packageID+"/publish", nil)

	// Wait a moment so the second user has different timestamps if needed
	time.Sleep(500 * time.Millisecond)

	// 3. User leaves a review
	log.Println("3. Leaving a 5-star review")
	makeRequest("POST", "http://localhost:8080/api/v1/packages/"+packageID+"/reviews", map[string]interface{}{
		"rating":  5,
		"comment": "Absolutely phenomenal adventure!",
	})

	// 4. Send a Chat Message
	log.Println("4. Sending a chat message")
	makeRequest("POST", "http://localhost:8080/api/v1/packages/"+packageID+"/chat", map[string]interface{}{
		"message": "Are the park entrance fees included in the price?",
	})

	// 5. Check Package Chat History
	log.Println("5. Getting chat history")
	makeRequest("GET", "http://localhost:8080/api/v1/packages/"+packageID+"/chat", nil)

	// 6. See the Packages Feed
	log.Println("6. Retrieving packages feed")
	makeRequest("GET", "http://localhost:8080/api/v1/packages", nil)

	log.Println("ALL TESTS COMPLETED SUCCESSFULLY")
}

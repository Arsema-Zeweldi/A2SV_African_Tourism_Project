//go:build integration
// +build integration

package handlers_test

import (
	"net/http"
	"testing"
)

type itineraryResponse struct {
	ItineraryID string                      `json:"itinerary_id"`
	Activities  []itineraryActivityResponse `json:"activities"`
}

type itineraryActivityResponse struct {
	ActivityID string `json:"activity_id"`
	Title      string `json:"title"`
}

func TestItineraryFlow(t *testing.T) {
	env := setupTestEnv(t)

	// Create itinerary with activities
	w := doRequest(t, env.router, http.MethodPost, "/api/v1/itineraries", map[string]interface{}{
		"title":       "Test Itinerary",
		"description": "Testing itinerary handler",
		"activities": []map[string]interface{}{
			{
				"day_number":  1,
				"title":       "Arrival",
				"start_time":  "09:00",
				"end_time":    "12:00",
				"description": "Check-in",
			},
			{
				"day_number":  2,
				"title":       "Safari",
				"start_time":  "08:00",
				"end_time":    "18:00",
				"description": "Game drive",
			},
		},
	}, env.token)
	if w.Code != http.StatusCreated {
		t.Fatalf("SaveItinerary: want 201, got %d - body: %s", w.Code, w.Body.String())
	}

	var created itineraryResponse
	mustDecode(t, w, &created)
	if created.ItineraryID == "" {
		t.Fatalf("SaveItinerary: missing itinerary_id")
	}
	if len(created.Activities) == 0 {
		t.Fatalf("SaveItinerary: expected activities in response")
	}

	// Get itinerary
	w = doRequest(t, env.router, http.MethodGet, "/api/v1/itineraries/"+created.ItineraryID, nil, env.token)
	if w.Code != http.StatusOK {
		t.Fatalf("GetItinerary: want 200, got %d - body: %s", w.Code, w.Body.String())
	}

	// Update first activity
	activityID := created.Activities[0].ActivityID
	w = doRequest(t, env.router, http.MethodPatch, "/api/v1/itineraries/"+created.ItineraryID+"/activities", map[string]interface{}{
		"activity_id": activityID,
		"title":       "Updated Arrival",
	}, env.token)
	if w.Code != http.StatusOK {
		t.Fatalf("UpdateItineraryActivity: want 200, got %d - body: %s", w.Code, w.Body.String())
	}
}

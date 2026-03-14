//go:build integration
// +build integration

package handlers_test

import (
	"net/http"
	"testing"
)

type itineraryResponse struct {
	ItineraryID string                  `json:"itinerary_id"`
	Items       []itineraryItemResponse `json:"items"`
}

type itineraryItemResponse struct {
	ItemID       string `json:"item_id"`
	ActivityName string `json:"activity_name"`
}

func TestItineraryFlow(t *testing.T) {
	env := setupTestEnv(t)

	// Create itinerary with items
	w := doRequest(t, env.router, http.MethodPost, "/api/v1/itineraries", map[string]interface{}{
		"title":       "Test Itinerary",
		"description": "Testing itinerary handler",
		"items": []map[string]interface{}{
			{
				"day_number":           1,
				"activity_name":        "Arrival",
				"start_time":           "09:00",
				"end_time":             "12:00",
				"activity_description": "Check-in",
			},
			{
				"day_number":           2,
				"activity_name":        "Safari",
				"start_time":           "08:00",
				"end_time":             "18:00",
				"activity_description": "Game drive",
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
	if len(created.Items) == 0 {
		t.Fatalf("SaveItinerary: expected items in response")
	}

	// Get itinerary
	w = doRequest(t, env.router, http.MethodGet, "/api/v1/itineraries/"+created.ItineraryID, nil, env.token)
	if w.Code != http.StatusOK {
		t.Fatalf("GetItinerary: want 200, got %d - body: %s", w.Code, w.Body.String())
	}

	// Update first item
	itemID := created.Items[0].ItemID
	w = doRequest(t, env.router, http.MethodPatch, "/api/v1/itineraries/"+created.ItineraryID+"/items", map[string]interface{}{
		"item_id":       itemID,
		"activity_name": "Updated Arrival",
	}, env.token)
	if w.Code != http.StatusOK {
		t.Fatalf("UpdateItineraryItem: want 200, got %d - body: %s", w.Code, w.Body.String())
	}
}

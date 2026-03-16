//go:build integration
// +build integration

package handlers_test

import (
	"net/http"
	"testing"
)

func TestRegionsCRUD(t *testing.T) {
	env := setupTestEnv(t)

	// Create
	w := doRequest(t, env.router, http.MethodPost, "/api/v1/regions", map[string]interface{}{
		"name":        "Test Region",
		"slug":        "test-region",
		"description": "Region for handler tests",
	}, env.token)
	if w.Code != http.StatusCreated {
		t.Fatalf("CreateRegion: want 201, got %d - body: %s", w.Code, w.Body.String())
	}

	var region map[string]interface{}
	mustDecode(t, w, &region)
	regionID, _ := region["region_id"].(string)
	if regionID == "" {
		t.Fatalf("CreateRegion: missing region_id")
	}

	// List
	w = doRequest(t, env.router, http.MethodGet, "/api/v1/regions", nil, "")
	if w.Code != http.StatusOK {
		t.Fatalf("ListRegions: want 200, got %d - body: %s", w.Code, w.Body.String())
	}

	// Get
	w = doRequest(t, env.router, http.MethodGet, "/api/v1/regions/"+regionID, nil, "")
	if w.Code != http.StatusOK {
		t.Fatalf("GetRegion: want 200, got %d - body: %s", w.Code, w.Body.String())
	}

	// Update
	w = doRequest(t, env.router, http.MethodPut, "/api/v1/regions/"+regionID, map[string]interface{}{
		"name": "Updated Region",
	}, env.token)
	if w.Code != http.StatusOK {
		t.Fatalf("UpdateRegion: want 200, got %d - body: %s", w.Code, w.Body.String())
	}

	// Delete
	w = doRequest(t, env.router, http.MethodDelete, "/api/v1/regions/"+regionID, nil, env.token)
	if w.Code != http.StatusNoContent {
		t.Fatalf("DeleteRegion: want 204, got %d - body: %s", w.Code, w.Body.String())
	}
}

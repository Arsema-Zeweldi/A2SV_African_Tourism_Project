//go:build integration
// +build integration

package handlers_test

import (
	"net/http"
	"testing"
)

func TestDiscoveryAndIntelligenceRoutes(t *testing.T) {
	env := setupTestEnv(t)

	w := doRequest(t, env.router, http.MethodGet, "/api/v1/destinations", nil, "")
	if w.Code != http.StatusOK {
		t.Fatalf("SearchDestinations: want 200, got %d - body: %s", w.Code, w.Body.String())
	}

	w = doRequest(t, env.router, http.MethodGet, "/api/v1/destinations/not-a-uuid", nil, "")
	if w.Code != http.StatusBadRequest {
		t.Fatalf("GetDestinationDetails (invalid): want 400, got %d - body: %s", w.Code, w.Body.String())
	}

	w = doRequest(t, env.router, http.MethodGet, "/api/v1/destinations/"+env.destinationID.String(), nil, "")
	if w.Code != http.StatusOK {
		t.Fatalf("GetDestinationDetails: want 200, got %d - body: %s", w.Code, w.Body.String())
	}

	w = doRequest(t, env.router, http.MethodGet, "/api/v1/intelligence/visa", nil, env.token)
	if w.Code != http.StatusBadRequest {
		t.Fatalf("GetVisaRequirements (missing params): want 400, got %d - body: %s", w.Code, w.Body.String())
	}

	visaQuery := "/api/v1/intelligence/visa?source_country_id=" + env.sourceCountry.String() + "&destination_country_id=" + env.destCountry.String()
	w = doRequest(t, env.router, http.MethodGet, visaQuery, nil, env.token)
	if w.Code != http.StatusOK {
		t.Fatalf("GetVisaRequirements: want 200, got %d - body: %s", w.Code, w.Body.String())
	}

	w = doRequest(t, env.router, http.MethodGet, "/api/v1/intelligence/safety", nil, env.token)
	if w.Code != http.StatusOK {
		t.Fatalf("GetSafetyAlerts: want 200, got %d - body: %s", w.Code, w.Body.String())
	}
}

func TestUserPreferencesRoutes(t *testing.T) {
	env := setupTestEnv(t)

	w := doRequest(t, env.router, http.MethodGet, "/api/v1/user/preferences", nil, env.token)
	if w.Code != http.StatusOK {
		t.Fatalf("GetUserPreferences: want 200, got %d - body: %s", w.Code, w.Body.String())
	}

	w = doRequest(t, env.router, http.MethodPut, "/api/v1/user/preferences", map[string]interface{}{}, env.token)
	if w.Code != http.StatusOK {
		t.Fatalf("UpdateUserPreferences: want 200, got %d - body: %s", w.Code, w.Body.String())
	}
}

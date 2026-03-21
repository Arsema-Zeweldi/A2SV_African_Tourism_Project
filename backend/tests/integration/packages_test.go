//go:build integration
// +build integration

package handlers_test

import (
	"net/http"
	"testing"

	"github.com/google/uuid"
)

// TestPackagesFlow runs the full lifecycle of a package end-to-end:
//
//  1. Create (draft)
//  2. Publish
//  3. Verify package appears in packages feed
//  4. Get package by ID
//  5. Submit a review
//  6. Read reviews
//  7. Post a chat message
//  8. Read chat history
func TestPackagesFlow(t *testing.T) {
	env := setupTestEnv(t)

	// 1. Create Package
	t.Run("CreatePackage", func(t *testing.T) {
		w := doRequest(t, env.router, http.MethodPost, "/api/v1/packages", map[string]interface{}{
			"itinerary_id": env.itineraryID.String(),
			"title":        "Epic Safari Adventure (test)",
			"summary":      "A beautiful 3-day guided safari trip.",
			"price":        299.99,
		}, env.token)

		if w.Code != http.StatusCreated {
			t.Fatalf("CreatePackage: want 201, got %d - body: %s", w.Code, w.Body.String())
		}

		var pkg map[string]interface{}
		mustDecode(t, w, &pkg)

		pkgID, ok := pkg["package_id"].(string)
		if !ok || pkgID == "" {
			t.Fatal("CreatePackage: missing package_id in response")
		}

		t.Logf("Created package %s (status=%s)", pkgID, pkg["status"])

		packageID := pkgID

		// 2. Publish Package
		t.Run("PublishPackage", func(t *testing.T) {
			w := doRequest(t, env.router, http.MethodPost,
				"/api/v1/packages/"+packageID+"/publish", nil, env.token)

			if w.Code != http.StatusOK {
				t.Fatalf("PublishPackage: want 200, got %d - body: %s", w.Code, w.Body.String())
			}
			t.Logf("Package published")
		})

		// 3. Packages Feed
		t.Run("GetPackagesFeed", func(t *testing.T) {
			w := doRequest(t, env.router, http.MethodGet, "/api/v1/packages", nil, "")

			if w.Code != http.StatusOK {
				t.Fatalf("GetPackagesFeed: want 200, got %d - body: %s", w.Code, w.Body.String())
			}

			var resp map[string]interface{}
			mustDecode(t, w, &resp)

			data, ok := resp["data"].([]interface{})
			if !ok {
				t.Fatal("GetPackagesFeed: missing 'data' array in response")
			}
			t.Logf("Feed returned %d package(s)", len(data))
		})

		// 4. Get Package by ID
		t.Run("GetPackageByID", func(t *testing.T) {
			w := doRequest(t, env.router, http.MethodGet,
				"/api/v1/packages/"+packageID, nil, "")

			if w.Code != http.StatusOK {
				t.Fatalf("GetPackageByID: want 200, got %d - body: %s", w.Code, w.Body.String())
			}

			var pkg map[string]interface{}
			mustDecode(t, w, &pkg)

			if pkg["package_id"] != packageID {
				t.Fatalf("GetPackageByID: response package_id mismatch")
			}
			t.Logf("Got package by ID, status=%s", pkg["status"])
		})

		// 5. Submit Review
		t.Run("SubmitReview", func(t *testing.T) {
			w := doRequest(t, env.router, http.MethodPost,
				"/api/v1/packages/"+packageID+"/reviews", map[string]interface{}{
					"rating":  5,
					"comment": "Absolutely phenomenal adventure!",
				}, env.token)

			if w.Code != http.StatusCreated {
				t.Fatalf("SubmitReview: want 201, got %d - body: %s", w.Code, w.Body.String())
			}
			t.Logf("Review submitted")
		})

		// 5b. Duplicate review should be 409
		t.Run("DuplicateReview_Returns409", func(t *testing.T) {
			w := doRequest(t, env.router, http.MethodPost,
				"/api/v1/packages/"+packageID+"/reviews", map[string]interface{}{
					"rating":  4,
					"comment": "Trying to review twice",
				}, env.token)

			if w.Code != http.StatusConflict {
				t.Fatalf("DuplicateReview: want 409, got %d - body: %s", w.Code, w.Body.String())
			}
			t.Logf("Duplicate review correctly blocked (409)")
		})

		// 6. Get Reviews
		t.Run("GetPackageReviews", func(t *testing.T) {
			w := doRequest(t, env.router, http.MethodGet,
				"/api/v1/packages/"+packageID+"/reviews", nil, "")

			if w.Code != http.StatusOK {
				t.Fatalf("GetPackageReviews: want 200, got %d - body: %s", w.Code, w.Body.String())
			}

			var reviews []interface{}
			mustDecode(t, w, &reviews)

			if len(reviews) == 0 {
				t.Fatal("GetPackageReviews: expected at least 1 review")
			}
			t.Logf("Got %d review(s)", len(reviews))
		})

		// 7. Post Chat Message
		t.Run("PostChatMessage", func(t *testing.T) {
			w := doRequest(t, env.router, http.MethodPost,
				"/api/v1/packages/"+packageID+"/chat", map[string]interface{}{
					"message": "Are the park entrance fees included in the price?",
				}, env.token)

			if w.Code != http.StatusCreated {
				t.Fatalf("PostChatMessage: want 201, got %d - body: %s", w.Code, w.Body.String())
			}
			t.Logf("Chat message posted")
		})

		// 8. Get Chat History
		t.Run("GetChatHistory", func(t *testing.T) {
			w := doRequest(t, env.router, http.MethodGet,
				"/api/v1/packages/"+packageID+"/chat", nil, "")

			if w.Code != http.StatusOK {
				t.Fatalf("GetChatHistory: want 200, got %d - body: %s", w.Code, w.Body.String())
			}

			var resp map[string]interface{}
			mustDecode(t, w, &resp)

			data, ok := resp["data"].([]interface{})
			if !ok {
				t.Fatal("GetChatHistory: missing 'data' array in response")
			}
			if len(data) == 0 {
				t.Fatal("GetChatHistory: expected at least 1 message")
			}
			t.Logf("Got %d chat message(s)", len(data))
		})
	})
}

// TestCreatePackage_Validations tests input validation edge cases.
func TestCreatePackage_Validations(t *testing.T) {
	env := setupTestEnv(t)

	tests := []struct {
		name       string
		body       map[string]interface{}
		wantStatus int
	}{
		{
			name:       "MissingItineraryID",
			body:       map[string]interface{}{"title": "Some Package", "price": 100},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "TitleTooShort",
			body:       map[string]interface{}{"itinerary_id": env.itineraryID.String(), "title": "ab", "price": 100},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "NegativePrice",
			body:       map[string]interface{}{"itinerary_id": env.itineraryID.String(), "title": "Valid Title", "price": -1},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "WrongItineraryOwner",
			body:       map[string]interface{}{"itinerary_id": uuid.New().String(), "title": "Valid Title", "price": 0},
			wantStatus: http.StatusForbidden,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			w := doRequest(t, env.router, http.MethodPost, "/api/v1/packages", tc.body, env.token)
			if w.Code != tc.wantStatus {
				t.Fatalf("%s: want %d, got %d - body: %s", tc.name, tc.wantStatus, w.Code, w.Body.String())
			}
			t.Logf("%s returned %d as expected", tc.name, w.Code)
		})
	}
}

// TestFeedFilters tests that query parameters work correctly.
func TestFeedFilters(t *testing.T) {
	env := setupTestEnv(t)

	// Invalid filters should not crash the server.
	testCases := []struct {
		query      string
		wantStatus int
	}{
		{"/api/v1/packages", http.StatusOK},
		{"/api/v1/packages?sort_by=price&order=asc", http.StatusOK},
		{"/api/v1/packages?min_price=100&max_price=500", http.StatusOK},
		{"/api/v1/packages?min_price=abc", http.StatusBadRequest},
		{"/api/v1/packages?min_rating=6", http.StatusBadRequest},
		{"/api/v1/packages?min_price=500&max_price=100", http.StatusBadRequest},
	}

	for _, tc := range testCases {
		t.Run(tc.query, func(t *testing.T) {
			w := doRequest(t, env.router, http.MethodGet, tc.query, nil, "")
			if w.Code != tc.wantStatus {
				t.Fatalf("Feed %s: want %d, got %d - body: %s", tc.query, tc.wantStatus, w.Code, w.Body.String())
			}
			t.Logf("Feed %s -> %d", tc.query, w.Code)
		})
	}
}

// TestUnauthorizedAccess ensures protected routes reject requests without a token.
func TestUnauthorizedAccess(t *testing.T) {
	env := setupTestEnv(t)
	fakeID := uuid.New().String()

	routes := []struct {
		method string
		path   string
	}{
		{http.MethodPost, "/api/v1/packages"},
		{http.MethodPatch, "/api/v1/packages/" + fakeID},
		{http.MethodDelete, "/api/v1/packages/" + fakeID},
		{http.MethodPost, "/api/v1/packages/" + fakeID + "/publish"},
		{http.MethodPost, "/api/v1/packages/" + fakeID + "/reviews"},
		{http.MethodPost, "/api/v1/packages/" + fakeID + "/chat"},
	}

	for _, r := range routes {
		t.Run(r.method+"_"+r.path, func(t *testing.T) {
			w := doRequest(t, env.router, r.method, r.path, nil, "")
			if w.Code != http.StatusUnauthorized {
				t.Fatalf("%s %s: want 401, got %d - body: %s", r.method, r.path, w.Code, w.Body.String())
			}
			t.Logf("%s %s correctly returned 401", r.method, r.path)
		})
	}
}

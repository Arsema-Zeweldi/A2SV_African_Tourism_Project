//go:build integration
// +build integration

package handlers_test

import (
	"fmt"
	"net/http"
	"testing"
	"time"
)

func TestRegisterAndLogin(t *testing.T) {
	env := setupTestEnv(t)

	email := fmt.Sprintf("auth_%d@handlers.test", time.Now().UnixNano())
	password := "StrongPass123"

	w := doRequest(t, env.router, http.MethodPost, "/api/v1/auth/register", map[string]interface{}{
		"email":      email,
		"password":   password,
		"first_name": "Auth",
		"last_name":  "Tester",
	}, "")
	if w.Code != http.StatusCreated {
		t.Fatalf("Register: want 201, got %d - body: %s", w.Code, w.Body.String())
	}

	w = doRequest(t, env.router, http.MethodPost, "/api/v1/auth/login", map[string]interface{}{
		"email":    email,
		"password": password,
	}, "")
	if w.Code != http.StatusOK {
		t.Fatalf("Login: want 200, got %d - body: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	mustDecode(t, w, &resp)
	if resp["token"] == "" {
		t.Fatalf("Login: missing token in response")
	}

	t.Cleanup(func() {
		env.db.Exec("DELETE FROM users WHERE email = ?", email)
	})
}

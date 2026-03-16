package ai_planner

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBuildCacheKey(t *testing.T) {
	req := GenerateRequest{
		Destination:  "Nairobi, Kenya",
		DurationDays: 3,
		BudgetLevel:  "Luxury",
		VibeTags:     []string{"Adventure", "Foodie"},
		GroupSize:    2,
		ClimatePref:  "Tropical",
	}

	key := BuildCacheKey(req)
	expected := "planner:nairobi_kenya:3d:luxury:adventure_foodie:tropical:g2"
	assert.Equal(t, expected, key)

	// Test normalization
	req2 := GenerateRequest{
		Destination: "  South Africa  ",
		BudgetLevel: "Student/Low",
	}
	key2 := BuildCacheKey(req2)
	assert.Contains(t, key2, "south_africa")
	assert.Contains(t, key2, "student/low")
}

func TestParseAIResponse(t *testing.T) {
	// Happy path
	raw := []byte(`{
		"title": "Epic Serengeti",
		"currency": "USD",
		"days": [
			{
				"day_num": 1,
				"activities": [
					{"name": "Safari", "type": "adventure", "est_cost": 100.0, "geo_lat": -2.3, "geo_long": 34.8}
				]
			}
		]
	}`)
	resp, err := ParseAIResponse(raw)
	assert.NoError(t, err)
	assert.Equal(t, "Epic Serengeti", resp.Title)
	assert.Len(t, resp.Days, 1)

	// With markdown fences
	rawFenced := []byte("```json\n" + string(raw) + "\n```")
	resp2, err := ParseAIResponse(rawFenced)
	assert.NoError(t, err)
	assert.Equal(t, "Epic Serengeti", resp2.Title)

	// Invalid JSON
	_, err = ParseAIResponse([]byte(`{ "invalid": }`))
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "valid JSON")

	// Empty days
	_, err = ParseAIResponse([]byte(`{"days": []}`))
	assert.Error(t, err)
}

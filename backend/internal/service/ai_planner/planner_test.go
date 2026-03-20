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
	expected := "planner:nairobi_kenya:3d:luxury:adventure_foodie:tropical:single:b0:g2:nnone"
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
		"description": "A wonderful safari trip",
		"days_count": 1,
		"nights_count": 0,
		"activities": [
			{"day_number": 1, "order_index": 1, "title": "Safari", "activity_type": "adventure", "cost_label": "$100 USD", "latitude": -2.3, "longitude": 34.8, "ai_pick": true}
		]
	}`)
	resp, err := ParseAIResponse(raw)
	assert.NoError(t, err)
	assert.Equal(t, "Epic Serengeti", resp.Title)
	assert.Len(t, resp.Activities, 1)

	// With markdown fences
	rawFenced := []byte("```json\n" + string(raw) + "\n```")
	resp2, err := ParseAIResponse(rawFenced)
	assert.NoError(t, err)
	assert.Equal(t, "Epic Serengeti", resp2.Title)

	// Invalid JSON
	_, err = ParseAIResponse([]byte(`{ "invalid": }`))
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "valid JSON")

	// Empty activities
	_, err = ParseAIResponse([]byte(`{"activities": []}`))
	assert.Error(t, err)
}

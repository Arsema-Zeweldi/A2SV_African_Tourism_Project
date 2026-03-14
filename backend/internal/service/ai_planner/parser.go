package ai_planner

import (
	"encoding/json"
	"errors"
	"strings"
)

// ParseAIResponse validates and parses the raw JSON bytes from the LLM.
// It handles common failure modes: markdown fences, empty response, empty days.
func ParseAIResponse(raw []byte) (*ItineraryResponse, error) {
	if len(raw) == 0 {
		return nil, errors.New("AI response is empty")
	}

	// Strip markdown code fences if the model wrapped the JSON (common failure mode)
	cleaned := strings.TrimSpace(string(raw))
	cleaned = strings.TrimPrefix(cleaned, "```json")
	cleaned = strings.TrimPrefix(cleaned, "```")
	cleaned = strings.TrimSuffix(cleaned, "```")
	cleaned = strings.TrimSpace(cleaned)

	var result ItineraryResponse
	if err := json.Unmarshal([]byte(cleaned), &result); err != nil {
		return nil, errors.New("AI response is not valid JSON: " + err.Error())
	}

	if len(result.Days) == 0 {
		return nil, errors.New("AI response has no itinerary days")
	}

	// Validate each day has at least one activity
	for i, day := range result.Days {
		if len(day.Activities) == 0 {
			return nil, errors.New(
				"AI response day " + itoa(i+1) + " has no activities",
			)
		}
	}

	if result.Currency == "" {
		result.Currency = "USD"
	}

	return &result, nil
}

// CalcAvgRating computes the average of a slice of 1–5 star ratings,
// rounded to 2 decimal places. Returns 0.0 for an empty slice (no NaN risk).
func CalcAvgRating(ratings []int) float64 {
	if len(ratings) == 0 {
		return 0.0
	}
	sum := 0
	for _, r := range ratings {
		sum += r
	}
	avg := float64(sum) / float64(len(ratings))
	// Round to 2 decimal places
	return float64(int(avg*100+0.5)) / 100
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	result := ""
	for n > 0 {
		result = string(rune('0'+n%10)) + result
		n /= 10
	}
	return result
}

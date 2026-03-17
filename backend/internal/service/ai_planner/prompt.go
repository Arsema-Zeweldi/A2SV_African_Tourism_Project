package ai_planner

import (
	"fmt"
	"strings"
)

// BuildPrompt constructs the PRD-compliant prompt for the AI model.
// It includes: role, context, all 5 user inputs, hard constraints, and JSON schema.
func BuildPrompt(req GenerateRequest) string {
	vibes := "general travel"
	if len(req.VibeTags) > 0 {
		vibes = strings.Join(req.VibeTags, ", ")
	}
	budgetAmount := "not specified"
	if req.Budget > 0 {
		budgetAmount = fmt.Sprintf("$%.0f", req.Budget)
	}
	groupSize := req.GroupSize
	if groupSize <= 0 {
		groupSize = 1
	}
	duration := req.DurationDays
	if duration <= 0 {
		duration = 3
	}
	budgetLabel := req.BudgetLevel
	if budgetLabel == "" {
		budgetLabel = "medium"
	}
	climate := req.ClimatePref
	if climate == "" {
		climate = "any"
	}
	notes := strings.TrimSpace(req.Notes)
	if notes == "" {
		notes = "none"
	}
	multiCountry := "no"
	if req.MultiCountry {
		multiCountry = "yes"
	}

	return fmt.Sprintf(`You are an expert African travel guide with deep local knowledge.

TASK: Create a detailed, realistic day-by-day travel itinerary for the trip below.

USER INPUT:
  Destination:        %s
  Duration:           %d days
  Budget level:       %s (use realistic local prices in %s — NOT inflated tourist prices)
  Budget (USD):       %s per person
  Vibe / Interests:   %s
  Multi-country trip: %s
  Group size:         %d people
  Climate preference: %s
  Extra notes:        %s

HARD CONSTRAINTS:
  1. Output MUST be valid JSON only — no markdown, no code fences, no explanation text.
  2. Do NOT invent places. Use only real, well-known, publicly verifiable landmarks.
  3. If you are NOT highly confident a place exists or you do NOT know its exact coordinates, DO NOT include it.
  4. Do NOT invent hotels or restaurants unless they are iconic, widely known, and verifiable.
  5. Include a realistic estimated cost in USD for EVERY activity based on the budget level.
  6. Activity "type" MUST be one of: food, adventure, culture, party, wildlife.
  7. "geo_lat" and "geo_long" MUST be accurate GPS coordinates for the real location.
  8. Each day must have 2–5 activities that match the specified vibe and budget.
  9. If the destination is multi-city or multi-country, distribute days logically.
 10. Prefer fewer, correct activities over more, uncertain ones.

REQUIRED JSON SCHEMA (output exactly this structure, no extra fields):
{
  "title": "Trip name — creative but descriptive",
  "currency": "USD",
  "days": [
    {
      "day_num": 1,
      "activities": [
        {
          "name": "Real place name",
          "type": "food|adventure|culture|party|wildlife",
          "description": "One practical sentence about what to do and why",
          "est_cost": 25.00,
          "geo_lat": -1.2921,
          "geo_long": 36.8219
        }
      ]
    }
  ]
}`,
		req.Destination,
		duration,
		budgetLabel,
		req.Destination,
		budgetAmount,
		vibes,
		multiCountry,
		groupSize,
		climate,
		notes,
	)
}

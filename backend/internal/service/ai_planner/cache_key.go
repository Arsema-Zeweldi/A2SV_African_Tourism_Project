package ai_planner

import (
	"fmt"
	"strings"
)

// BuildCacheKey generates a deterministic, collision-free, namespaced cache key
// from a GenerateRequest. All fields are normalised to lowercase with spaces
// replaced by underscores so the key is filesystem- and Redis-safe.
func BuildCacheKey(req GenerateRequest) string {
	dest := normalise(req.Destination)
	budget := normalise(req.BudgetLevel)
	if budget == "" {
		budget = "medium"
	}
	vibes := "any"
	if len(req.VibeTags) > 0 {
		tags := make([]string, len(req.VibeTags))
		for i, t := range req.VibeTags {
			tags[i] = normalise(t)
		}
		vibes = strings.Join(tags, "_")
	}
	climate := normalise(req.ClimatePref)
	if climate == "" {
		climate = "any"
	}
	size := req.GroupSize
	if size <= 0 {
		size = 1
	}
	duration := req.DurationDays
	if duration <= 0 {
		duration = 3
	}

	return fmt.Sprintf("planner:%s:%dd:%s:%s:%s:g%d",
		dest, duration, budget, vibes, climate, size)
}

// normalise converts a string to lowercase and replaces spaces/commas with underscores.
func normalise(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = strings.ReplaceAll(s, " ", "_")
	s = strings.ReplaceAll(s, ",", "")
	s = strings.ReplaceAll(s, "-", "_")
	return s
}

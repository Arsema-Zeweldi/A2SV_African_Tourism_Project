package ai_planner

import (
	"fmt"
	"hash/fnv"
	"strconv"
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
	multi := "single"
	if req.MultiCountry {
		multi = "multi"
	}
	budgetBucket := 0
	if req.Budget > 0 {
		budgetBucket = int(req.Budget/100) * 100
	}
	noteHash := "none"
	if strings.TrimSpace(req.Notes) != "" {
		noteHash = hashString(req.Notes)
	}
	size := req.GroupSize
	if size <= 0 {
		size = 1
	}
	duration := req.DurationDays
	if duration <= 0 {
		duration = 3
	}

	return fmt.Sprintf("planner:%s:%dd:%s:%s:%s:%s:b%s:g%d:n%s",
		dest,
		duration,
		budget,
		vibes,
		climate,
		multi,
		strconv.Itoa(budgetBucket),
		size,
		noteHash,
	)
}

// normalise converts a string to lowercase and replaces spaces/commas with underscores.
func normalise(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = strings.ReplaceAll(s, " ", "_")
	s = strings.ReplaceAll(s, ",", "")
	s = strings.ReplaceAll(s, "-", "_")
	return s
}

func hashString(value string) string {
	h := fnv.New32a()
	_, _ = h.Write([]byte(strings.ToLower(strings.TrimSpace(value))))
	return fmt.Sprintf("%x", h.Sum32())
}

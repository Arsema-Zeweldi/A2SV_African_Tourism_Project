package ai_planner

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBuildPromptIncludesInputsAndSchema(t *testing.T) {
	req := GenerateRequest{
		Destination:  "Nairobi, Kenya",
		DurationDays: 5,
		BudgetLevel:  "luxury",
		VibeTags:     []string{"adventure", "culture"},
		GroupSize:    4,
		ClimatePref:  "tropical",
	}

	prompt := BuildPrompt(req)

	assert.True(t, strings.Contains(prompt, "Nairobi, Kenya"))
	assert.True(t, strings.Contains(prompt, "5 days"))
	assert.True(t, strings.Contains(prompt, "luxury"))
	assert.True(t, strings.Contains(prompt, "adventure, culture"))
	assert.True(t, strings.Contains(prompt, "4 people"))
	assert.True(t, strings.Contains(prompt, "tropical"))

	// Schema checks
	assert.True(t, strings.Contains(prompt, "REQUIRED JSON SCHEMA"))
	assert.True(t, strings.Contains(prompt, "\"title\""))
	assert.True(t, strings.Contains(prompt, "\"currency\""))
	assert.True(t, strings.Contains(prompt, "\"day_num\""))
	assert.True(t, strings.Contains(prompt, "\"activities\""))
	assert.True(t, strings.Contains(prompt, "food|adventure|culture|party"))
}

func TestBuildPromptDefaults(t *testing.T) {
	req := GenerateRequest{Destination: "Accra"}
	prompt := BuildPrompt(req)

	assert.True(t, strings.Contains(prompt, "Accra"))
	assert.True(t, strings.Contains(prompt, "3 days"))
	assert.True(t, strings.Contains(prompt, "medium"))
	assert.True(t, strings.Contains(prompt, "1 people"))
	assert.True(t, strings.Contains(prompt, "any"))
}

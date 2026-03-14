package ai_planner

import "context"

// StartInterviewInput is kept for backward compatibility with older callers.
type StartInterviewInput struct {
	SessionID  string
	PromptSeed string
	Answers    map[string]string
}

// StartInterviewResult is kept for backward compatibility.
type StartInterviewResult struct {
	Prompt string
}

// Legacy interface — prefer PlannerService.GenerateItinerary instead.
type LegacyPlannerService interface {
	StartInterview(ctx context.Context, input StartInterviewInput) (*StartInterviewResult, error)
}

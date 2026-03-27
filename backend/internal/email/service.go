package email

import (

	"bytes"
    "encoding/json"
    "fmt"
    "io"            // <--- Add this for io.ReadAll
    "log/slog"      // <--- Add this for structured logging
    "net/http"
    "strings"
    "time"
)

const defaultBrevoAPIURL = "https://api.brevo.com/v3/smtp/email"

// Service sends transactional emails via Brevo API.
type Service struct {
	apiURL    string
	apiKey    string
	fromEmail string
	fromName  string
}

func NewService(apiURL, apiKey, fromEmail, fromName string) *Service {
	fmt.Printf("Key Length: %d\n", len(apiKey), "\n")
	if apiURL == "" {
		apiURL = defaultBrevoAPIURL
	}
	return &Service{
		apiURL:    apiURL,
		apiKey:    apiKey,
		fromEmail: fromEmail,
		fromName:  fromName,
	}

}

type brevoRecipient struct {
	Name  string `json:"name,omitempty"`
	Email string `json:"email"`
}

type brevoPayload struct {
	Sender      brevoRecipient   `json:"sender"`
	To          []brevoRecipient `json:"to"`
	Subject     string           `json:"subject"`
	HTMLContent string           `json:"htmlContent"`
}

// func (s *Service) sendEmail(toEmail, toName, subject, htmlBody string) error {
// 	if s.apiKey == "" {
// 		// In dev mode just log it
// 		fmt.Printf("[EMAIL] To: %s | Subject: %s\n", toEmail, subject)
// 		return nil
// 	}

// 	payload := brevoPayload{
// 		Sender:      brevoRecipient{Name: s.fromName, Email: s.fromEmail},
// 		To:          []brevoRecipient{{Name: toName, Email: toEmail}},
// 		Subject:     subject,
// 		HTMLContent: htmlBody,
// 	}

// 	body, _ := json.Marshal(payload)
// 	req, err := http.NewRequest(http.MethodPost, s.apiURL, bytes.NewBuffer(body))
// 	if err != nil {
// 		return err
// 	}
// 	req.Header.Set("Content-Type", "application/json")
// 	req.Header.Set("api-key", s.apiKey)

// 	resp, err := http.DefaultClient.Do(req)
// 	if err != nil {
// 		return err
// 	}
// 	defer resp.Body.Close()

// 	if resp.StatusCode >= 300 {
// 		return fmt.Errorf("brevo returned status %d", resp.StatusCode)
// 	}
// 	return nil
// }

func (s *Service) sendEmail(toEmail, toName, subject, htmlBody string) error {
    // If API Key is missing, log it using the system logger instead of fmt
    if s.apiKey == "" {
        slog.Info("Email service in dev mode (no API key)",
            "to", toEmail,
            "subject", subject,
        )
        return nil
    }

    payload := brevoPayload{
        Sender:      brevoRecipient{Name: s.fromName, Email: s.fromEmail},
        To:          []brevoRecipient{{Name: toName, Email: toEmail}},
        Subject:     subject,
        HTMLContent: htmlBody,
    }

    body, _ := json.Marshal(payload)
    req, err := http.NewRequest(http.MethodPost, s.apiURL, bytes.NewBuffer(body))
    if err != nil {
        return err
    }

    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("api-key", s.apiKey)

    // Using a client with a timeout is safer
    client := &http.Client{Timeout: 10 * time.Second}
    resp, err := client.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    // If it fails, read the body to see WHY (Crucial for fixing your 401)
    if resp.StatusCode >= 300 {
        respBody, _ := io.ReadAll(resp.Body)
        return fmt.Errorf("brevo error: status %d, detail: %s", resp.StatusCode, string(respBody))
    }

    return nil
}

// SendVerificationEmail sends the email with a verify link.
func (s *Service) SendVerificationEmail(toEmail, firstName, verifyURL string) error {
	subject := "Verify your email – Amona"
	html := buildVerificationEmail(firstName, verifyURL)
	name := strings.TrimSpace(firstName)
	return s.sendEmail(toEmail, name, subject, html)
}

// SendWelcomeEmail sends after successful email verification.
func (s *Service) SendWelcomeEmail(toEmail, firstName, frontendURL string) error {
	subject := "Welcome to Amona! 🌍"
	html := buildWelcomeEmail(firstName, frontendURL)
	return s.sendEmail(toEmail, firstName, subject, html)
}

// SendPasswordResetEmail sends a reset link.
func (s *Service) SendPasswordResetEmail(toEmail, firstName, resetURL string) error {
	subject := "Reset your Amona password"
	html := buildPasswordResetEmail(firstName, resetURL)
	return s.sendEmail(toEmail, firstName, subject, html)
}

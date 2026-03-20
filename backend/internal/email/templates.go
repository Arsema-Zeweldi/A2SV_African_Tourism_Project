package email

import "fmt"

func emailWrapper(content string) string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Amona</title>
<style>
  body { margin:0; padding:0; background:#f4f4f4; font-family: 'Segoe UI', Arial, sans-serif; }
  .outer { background:#f4f4f4; padding: 40px 16px; }
  .header { text-align:center; margin-bottom:32px; }
  .logo-text { font-size:28px; font-weight:800; color:#FF6B35; letter-spacing:-0.5px; }
  .card { background:#ffffff; max-width:540px; margin:0 auto; border-radius:16px;
          padding:40px 48px; box-shadow:0 2px 12px rgba(0,0,0,0.08); }
  p { color:#374151; font-size:16px; line-height:1.7; margin:0 0 20px; }
  .btn { display:block; width:fit-content; margin:28px auto 0; padding:14px 36px;
         background:#FF6B35; color:#ffffff !important; font-size:15px; font-weight:700;
         text-decoration:none; border-radius:8px; letter-spacing:0.3px; }
  .note { color:#9CA3AF; font-size:13px; font-style:italic; }
  .sign { color:#374151; font-size:15px; margin-top:28px; }
  .footer { text-align:center; color:#9CA3AF; font-size:12px; margin-top:32px; }
  .divider { border:none; border-top:1px solid #E5E7EB; margin:28px 0; }
</style>
</head>
<body>
<div class="outer">
  <div class="header">
    <span class="logo-text">Amona</span>
  </div>
  <div class="card">` + content + `</div>
  <div class="footer">
    Explore Africa with Amona<br/>
    &copy; 2026 Amona Toursim Intelligence Platform
  </div>
</div>
</body>
</html>`
}

func buildVerificationEmail(firstName, verifyURL string) string {
	greeting := "Hello"
	if firstName != "" {
		greeting = "Hello, " + firstName
	}
	body := fmt.Sprintf(`
    <p>%s,</p>
    <p>Thanks for signing up! Please verify your email address to activate your Amona account and start exploring Africa's most amazing travel experiences.</p>
    <a class="btn" href="%s">Verify My Email</a>
    <hr class="divider"/>
    <p class="note">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
    <p class="sign">Cheers,<br/><strong>The Amona Team</strong></p>
`, greeting, verifyURL)
	return emailWrapper(body)
}

func buildWelcomeEmail(firstName, frontendURL string) string {
	greeting := "Hello"
	if firstName != "" {
		greeting = "Hello, " + firstName
	}
	loginURL := "http://localhost:3000/login"
	if frontendURL != "" {
		loginURL = fmt.Sprintf("%s/login", frontendURL)
	}
	body := fmt.Sprintf(`
    <p>%s 🎉</p>
    <p>Your email has been <strong>verified successfully</strong>. Welcome to Amona — your gateway to Africa's rich cultures, breathtaking landscapes, and unforgettable adventures!</p>
    <p>You can now log in and start planning your dream trip.</p>
    <a class="btn" href="%s">Go to Amona</a>
    <hr class="divider"/>
    <p class="note">Need help? Just reply to this email — we're here for you!</p>
    <p class="sign">Cheers,<br/><strong>The Amona Team</strong></p>
`, greeting, loginURL)
	return emailWrapper(body)
}

func buildPasswordResetEmail(firstName, resetURL string) string {
	greeting := "Hello"
	if firstName != "" {
		greeting = "Hello, " + firstName
	}
	body := fmt.Sprintf(`
    <p>%s,</p>
    <p>We received a request to reset your Amona account password. Click the button below to set a new password.</p>
    <a class="btn" href="%s">Reset My Password</a>
    <p style="margin-top:24px; font-size:13px; color:#6B7280; word-break:break-all;">
      Or copy and paste this link into your browser:<br/>
      <a href="%s" style="color:#FF6B35;">%s</a>
    </p>
    <hr class="divider"/>
    <p class="note">This link expires in 15 minutes. If you didn't request a password reset, you can safely ignore this email — your account is secure.</p>
    <p class="sign">Cheers,<br/><strong>The Amona Team</strong></p>
`, greeting, resetURL, resetURL, resetURL)
	return emailWrapper(body)
}

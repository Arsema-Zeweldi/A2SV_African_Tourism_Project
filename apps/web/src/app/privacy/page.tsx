import Navbar from '@/components/navbar'
import FooterSimple from '@/components/footerSimple'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Amona',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-[760px] px-5 py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-[#221810] mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#9A7360] mb-10">
          Last updated: April 2026
        </p>

        <div className="prose prose-slate prose-sm max-w-none space-y-8 text-[15px] leading-[1.8] text-[#4a3f38]">
          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly when using Amona:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>Account information:</strong> Name, email address, password, and optional profile photo when you register</li>
              <li><strong>Profile data:</strong> Travel preferences, vibes, preferred climate, budget range, and dietary restrictions you set in your profile</li>
              <li><strong>Content you create:</strong> Posts, comments, reviews, itineraries, and packages you publish</li>
              <li><strong>Usage data:</strong> Pages visited, features used, and interactions with the platform</li>
              <li><strong>Device information:</strong> Browser type, operating system, and IP address for security and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide and improve the Service, including AI-powered itinerary generation</li>
              <li>Personalize your experience based on travel preferences</li>
              <li>Display your content to other users (posts, reviews, packages)</li>
              <li>Send account-related communications (verification, password resets)</li>
              <li>Analyze usage patterns to improve features and fix issues</li>
              <li>Protect against fraud and ensure platform security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>Service providers:</strong> Cloud hosting (Vercel, Render), image storage (Cloudinary), email delivery (Brevo), and AI processing (Google Gemini) — only as needed to operate the platform</li>
              <li><strong>Other users:</strong> Your public profile, posts, reviews, and packages are visible to other users</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect rights and safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">4. Data Storage & Security</h2>
            <p>
              Your data is stored on secure servers provided by Render (backend) and Vercel (frontend). We use HTTPS encryption for all data transmission, bcrypt hashing for passwords, and JWT tokens for authentication. While we implement industry-standard security measures, no system is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">5. Cookies & Local Storage</h2>
            <p>We use:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>Authentication cookies:</strong> To keep you signed in across sessions</li>
              <li><strong>Session cookies:</strong> For NextAuth.js session management</li>
              <li><strong>Local storage:</strong> To save your marketplace wishlist and cart preferences on your device</li>
            </ul>
            <p className="mt-2">
              We do not use third-party tracking cookies or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>Access:</strong> View and download your personal data through your profile settings</li>
              <li><strong>Correction:</strong> Update inaccurate information in your profile at any time</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
              <li><strong>Withdraw consent:</strong> Opt out of optional data collection at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">7. Third-Party Services</h2>
            <p>
              Our platform integrates with third-party services (Google OAuth for authentication, Google Gemini for AI features). These services have their own privacy policies. We encourage you to review them. We only share the minimum data necessary for these integrations to function.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Amona is not intended for children under 16. We do not knowingly collect data from children. If we discover that a child under 16 has created an account, we will promptly delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy periodically. We will notify you of significant changes via email or platform notification. Your continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">10. Contact</h2>
            <p>
              For privacy-related questions or requests, contact us at <span className="font-semibold text-primary">privacy@amona.travel</span>.
            </p>
          </section>
        </div>
      </main>
      <FooterSimple />
    </div>
  )
}

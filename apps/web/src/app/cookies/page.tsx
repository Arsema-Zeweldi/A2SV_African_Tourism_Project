import Navbar from '@/components/navbar'
import FooterSimple from '@/components/footerSimple'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Amona',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-[760px] px-5 py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-[#221810] mb-2">
          Cookie Policy
        </h1>
        <p className="text-sm text-[#9A7360] mb-10">
          Last updated: April 2026
        </p>

        <div className="prose prose-slate prose-sm max-w-none space-y-8 text-[15px] leading-[1.8] text-[#4a3f38]">
          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and keep you signed in. Amona uses cookies and similar technologies (like browser local storage) to provide a secure and personalized experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">Cookies We Use</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#E6E0DA]">
                    <th className="text-left py-3 pr-4 font-bold text-[#221810]">Cookie</th>
                    <th className="text-left py-3 pr-4 font-bold text-[#221810]">Purpose</th>
                    <th className="text-left py-3 font-bold text-[#221810]">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-[#4a3f38]">
                  <tr className="border-b border-[#f0ebe5]">
                    <td className="py-3 pr-4 font-mono text-xs">auth_token</td>
                    <td className="py-3 pr-4">Stores your authentication token to keep you signed in</td>
                    <td className="py-3">7 days</td>
                  </tr>
                  <tr className="border-b border-[#f0ebe5]">
                    <td className="py-3 pr-4 font-mono text-xs">auth_status</td>
                    <td className="py-3 pr-4">Indicates whether you are currently logged in</td>
                    <td className="py-3">7 days</td>
                  </tr>
                  <tr className="border-b border-[#f0ebe5]">
                    <td className="py-3 pr-4 font-mono text-xs">next-auth.session-token</td>
                    <td className="py-3 pr-4">NextAuth.js session management for Google OAuth</td>
                    <td className="py-3">Session</td>
                  </tr>
                  <tr className="border-b border-[#f0ebe5]">
                    <td className="py-3 pr-4 font-mono text-xs">next-auth.csrf-token</td>
                    <td className="py-3 pr-4">Cross-site request forgery protection</td>
                    <td className="py-3">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">Local Storage</h2>
            <p>We also use browser local storage for:</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#E6E0DA]">
                    <th className="text-left py-3 pr-4 font-bold text-[#221810]">Key</th>
                    <th className="text-left py-3 font-bold text-[#221810]">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-[#4a3f38]">
                  <tr className="border-b border-[#f0ebe5]">
                    <td className="py-3 pr-4 font-mono text-xs">amona_wishlist</td>
                    <td className="py-3">Saves packages you have added to your wishlist</td>
                  </tr>
                  <tr className="border-b border-[#f0ebe5]">
                    <td className="py-3 pr-4 font-mono text-xs">amona_cart</td>
                    <td className="py-3">Saves packages in your cart</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">What We Do NOT Use</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>No third-party advertising or tracking cookies</li>
              <li>No analytics cookies (Google Analytics, etc.)</li>
              <li>No social media tracking pixels</li>
              <li>No cross-site tracking</li>
            </ul>
            <p className="mt-2">
              All cookies and storage used by Amona are strictly necessary for the platform to function. We do not use any cookies for marketing or behavioral profiling.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">Managing Cookies</h2>
            <p>
              You can manage cookies through your browser settings. Most browsers allow you to block or delete cookies. However, blocking essential cookies (like auth_token) will prevent you from signing in.
            </p>
            <p className="mt-2">
              To clear local storage data (wishlist, cart), you can use your browser&apos;s developer tools or clear site data in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#221810] mb-3">Contact</h2>
            <p>
              If you have questions about our use of cookies, contact us at <span className="font-semibold text-primary">privacy@amona.travel</span>.
            </p>
          </section>
        </div>
      </main>
      <FooterSimple />
    </div>
  )
}

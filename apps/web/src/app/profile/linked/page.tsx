import { Mail, Github, Chrome } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const PROVIDERS = [
  {
    id: "email",
    icon: Mail,
    label: "Email & Password",
    description: "Sign in with your email address and password.",
    connected: true,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    id: "google",
    icon: Chrome,
    label: "Google",
    description: "Connect your Google account for one-click sign in.",
    connected: false,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    id: "github",
    icon: Github,
    label: "GitHub",
    description: "Connect your GitHub account.",
    connected: false,
    color: "text-stone-700",
    bg: "bg-stone-100",
  },
]

export default function LinkedAccountsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Linked Accounts
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage the sign-in methods connected to your account.
        </p>
      </div>

      <Card className="border-stone-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-stone-900">
            <span className="block w-0.5 h-5 rounded-full bg-orange-500" />
            Sign-in Methods
          </CardTitle>
        </CardHeader>

        <CardContent className="divide-y divide-stone-100">
          {PROVIDERS.map(({ id, icon: Icon, label, description, connected, color, bg }) => (
            <div key={id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${bg}`}
              >
                <Icon className={`h-5 w-5 ${color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800">{label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{description}</p>
              </div>

              {connected ? (
                <Badge className="bg-green-50 text-green-700 border-green-200 text-[11px] font-semibold pointer-events-none">
                  Connected
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-stone-200 text-stone-400 text-[11px] font-medium pointer-events-none"
                >
                  Coming Soon
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Info note */}
      <p className="text-xs text-stone-400 text-center">
        Social login integrations (Google, GitHub) are coming in a future release.
      </p>
    </div>
  )
}

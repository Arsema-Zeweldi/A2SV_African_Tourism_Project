"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Shield, SlidersHorizontal, Link2, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

const SIDEBAR_ITEMS = [
  { icon: User,              label: "Account Info",    href: "/profile"             },
  { icon: Shield,            label: "Security",        href: "/profile/security"    },
  { icon: SlidersHorizontal, label: "Preferences",     href: "/profile/preferences" },
  { icon: Link2,             label: "Linked Accounts", href: "/profile/linked"      },
]

export default function ProfileSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="w-52 shrink-0 border-r border-stone-200 bg-white flex flex-col py-5">
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {SIDEBAR_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-orange-500 text-white font-medium"
                  : "text-stone-500 hover:bg-orange-50 hover:text-stone-900",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mx-3 my-2 border-t border-stone-200" />

      <Button
        variant="ghost"
        onClick={logout}
        className="mx-3 justify-start gap-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 text-sm font-normal"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </Button>
    </aside>
  )
}

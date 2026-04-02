'use client'
import { clearAuthCookie } from '@/actions/auth_actions'
import LogoutConfirmationModal from '@/components/logout-confirmation-modal'
import { useAuth } from '@/context/auth-context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Shield, SlidersHorizontal, Link2, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SIDEBAR_ITEMS = [
  { icon: User, label: 'Account Info', href: '/profile' },
  { icon: Shield, label: 'Security', href: '/profile/security' },
  {
    icon: SlidersHorizontal,
    label: 'Preferences',
    href: '/profile/preferences',
  },
  { icon: Link2, label: 'Linked Accounts', href: '/profile/linked' },
]

interface ProfileSidebarProps {
  className?: string
  onNavigate?: () => void
}

export default function ProfileSidebar({
  className,
  onNavigate,
}: ProfileSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
      await clearAuthCookie()
      router.refresh()
      router.push('/')
    } finally {
      setIsLoggingOut(false)
      setIsLogoutModalOpen(false)
    }
  }

  return (
    <aside
      className={cn(
        'w-64 shrink-0 border-r border-stone-200 bg-white flex flex-col py-5',
        className
      )}
    >
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {SIDEBAR_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-orange-500 text-white font-medium'
                  : 'text-stone-500 hover:bg-orange-50 hover:text-stone-900'
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
        className="mx-3 justify-start gap-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 text-sm font-normal"
        onClick={() => setIsLogoutModalOpen(true)}
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </Button>

      <LogoutConfirmationModal
        open={isLogoutModalOpen}
        isSubmitting={isLoggingOut}
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </aside>
  )
}

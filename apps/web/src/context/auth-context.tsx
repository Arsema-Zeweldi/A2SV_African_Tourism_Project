'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { clearAuthCookie } from '@/actions/auth_actions'
import { usePathname } from 'next/navigation'
import { logout as authLogout } from '@/services/authService'

interface AuthContextValue {
  isAuthenticated: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const hasStatusCookie = document.cookie.includes('auth_status=1')
      setIsAuthenticated(hasStatusCookie)
    }

    checkAuth()
  }, [pathname])

  const logout = useCallback(async () => {
    document.cookie = 'auth_status=; path=/; max-age=0; SameSite=Lax;'

    await authLogout()

    await clearAuthCookie()

    setIsAuthenticated(false)
    router.refresh()
    router.push('/')
  }, [router])

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

'use client'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function hasAuthStatusCookie() {
  if (typeof document === 'undefined') {
    return false
  }

  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie === 'auth_status=1')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(hasAuthStatusCookie())
      setIsLoading(false)
    }

    syncAuthState()

    window.addEventListener('focus', syncAuthState)
    window.addEventListener('auth-status-change', syncAuthState)

    return () => {
      window.removeEventListener('focus', syncAuthState)
      window.removeEventListener('auth-status-change', syncAuthState)
    }
  }, [pathname])

  useEffect(() => {
    if (status === 'authenticated') {
      document.cookie = 'auth_status=1; path=/; SameSite=Lax;'
      window.dispatchEvent(new Event('auth-status-change'))
    }
  }, [status])

  const logout = useCallback(async () => {
    await signOut({ redirect: false })
    document.cookie = 'auth_status=; path=/; max-age=0; SameSite=Lax;'
    setIsAuthenticated(false)
    window.dispatchEvent(new Event('auth-status-change'))
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: isAuthenticated || status === 'authenticated',
      isLoading: isLoading || status === 'loading',
      logout,
    }),
    [isAuthenticated, isLoading, logout, status]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { useRouter, usePathname } from "next/navigation"
import { clearAuthCookie } from "@/actions/auth_actions"

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
    // Re-check on every route change so the navbar updates immediately after
    // login/logout without requiring a hard refresh
    const hasAuth = document.cookie.includes("auth_status=1")
    setIsAuthenticated(hasAuth)
  }, [pathname])

  const logout = useCallback(async () => {
    // Clear client-side token
    localStorage.removeItem("user_token")

    // Clear the non-httpOnly flag cookie
    document.cookie = "auth_status=; path=/; max-age=0"

    // Clear the httpOnly cookie via server action
    await clearAuthCookie()

    setIsAuthenticated(false)
    router.push("/")
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

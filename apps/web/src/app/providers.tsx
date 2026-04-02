'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/context/auth-context'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <SessionProvider>
        <AuthProvider>{children}</AuthProvider>
      </SessionProvider>
    </>
  )
}

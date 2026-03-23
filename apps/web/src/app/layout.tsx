import type { Metadata } from 'next'
import React from 'react'
import { AuthProvider } from '@/context/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'AMÒNÀ',
  icons: '/images/logo.png',
  description: 'Your Wise African Travel Pathfinder.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}

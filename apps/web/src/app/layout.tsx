import type { Metadata } from 'next'
import React from 'react'
import { Outfit, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import { Providers } from './providers'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

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
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <main>{children}</main>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  )
}

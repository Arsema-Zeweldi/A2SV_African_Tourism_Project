import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AMÒNÀ',
  icons: '/favicon.ico',
  description: 'Your Wise African Travel Pathfinder.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

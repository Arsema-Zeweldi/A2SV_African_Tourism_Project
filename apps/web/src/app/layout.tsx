import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/navbar'

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
       {/* <Navbar /> */}
      <body>{children}</body>
    </html>
  )
}
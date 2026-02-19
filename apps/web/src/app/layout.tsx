import type { Metadata } from 'next'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
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
      <body>{children}</body>
    </html>
  )
}

import { MarketplaceProvider } from '../../context/marketplace-context'
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <MarketplaceProvider>
          <Navbar />
          {children}
          <Footer />
        </MarketplaceProvider>
      </body>
    </html>
  )
}

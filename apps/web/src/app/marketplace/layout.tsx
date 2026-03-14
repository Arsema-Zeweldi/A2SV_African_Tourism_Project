import { MarketplaceProvider } from '../../context/marketplace-context'

export default function MarketplaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <MarketplaceProvider>
      {children}
    </MarketplaceProvider>
  )
}

import { MarketplaceProvider } from '../../context/marketplace-context'
import Navbar from '@/components/navbar'
import FooterSimple from '@/components/footerSimple'

export default function MarketplaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <MarketplaceProvider>{children}</MarketplaceProvider>
      <FooterSimple />
    </>
  )
}

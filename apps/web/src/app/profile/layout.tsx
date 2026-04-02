// profile/layout.tsx
// Assembles: Navbar + Sidebar + page content + Footer
import Navbar from '@/components/navbar'
import FooterSimple from '@/components/footerSimple'
import ProfileLayoutShell from '@/components/profile/LayoutShell'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar />
      <ProfileLayoutShell>{children}</ProfileLayoutShell>
      <FooterSimple />
    </div>
  )
}

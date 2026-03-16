// profile/layout.tsx
// Assembles: Navbar + Sidebar + page content + Footer
import Navbar from '@/components/navbar'
import FooterSimple from '@/components/footerSimple'
import Sidebar from '@/components/profile/Sidebar'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 px-8 py-8">{children}</main>
      </div>
      <FooterSimple />
    </div>
  )
}

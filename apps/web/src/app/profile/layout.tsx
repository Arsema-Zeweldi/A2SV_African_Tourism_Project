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
    <div className="flex h-screen flex-col overflow-hidden bg-stone-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto min-w-0 px-8 py-8 bg-stone-50">
          {children}

          <FooterSimple />
        </main>
      </div>
    </div>
  )
}

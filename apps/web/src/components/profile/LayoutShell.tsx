'use client'

import { ReactNode, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from '@/components/profile/Sidebar'

export default function ProfileLayoutShell({
  children,
}: {
  children: ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="mx-auto flex max-w-[1440px] min-h-[calc(100vh-72px)]">
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close profile sidebar overlay"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto bg-white transition-transform duration-200 lg:static lg:z-auto lg:w-auto lg:translate-x-0 ${
          isSidebarOpen
            ? 'translate-x-0 shadow-[0_20px_40px_rgba(27,20,17,0.12)]'
            : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-5 lg:hidden">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-stone-500">
            Profile Menu
          </p>
          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-100"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      </div>

      <main className="min-w-0 flex-1 bg-stone-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 lg:hidden">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
            Open sidebar
          </button>
        </div>

        {children}
      </main>
    </div>
  )
}

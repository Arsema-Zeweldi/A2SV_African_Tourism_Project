"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import FooterSimple from "@/components/footerSimple"
import { MyTripsHeader } from "@/components/my-trips/MyTripsHeader"
import { TripsOverview } from "@/components/my-trips/TripsOverview"
import { UpcomingAdventures } from "@/components/my-trips/UpcomingAdventures"
import { SavedItineraries } from "@/components/my-trips/PastAdventures"
import { TripSidebar } from "@/components/my-trips/TripSidebar"
import { ToastContainer } from "@/components/new-package-details/Toast"
import { useToast } from "@/hooks/useToast"
import { deleteItinerary } from "@/actions/itinerary_actions"
import type { ItineraryResponse } from "@/types/api"

interface MyTripsPageProps {
  itineraries: ItineraryResponse[]
}

export function MyTripsPage({ itineraries: initial }: MyTripsPageProps) {
  const [items, setItems] = useState<ItineraryResponse[]>(initial)
  const [search, setSearch] = useState("")
  const { toasts, show: toast, dismiss } = useToast()

  // ── Client-side search filter ──────────────────────────────────────
  const filtered = search.trim()
    ? items.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase()),
      )
    : items

  // ── Categorise by start_date ───────────────────────────────────────
  const now = new Date()
  const upcoming = filtered.filter(
    (i) => i.start_date && new Date(i.start_date) > now,
  )
  const saved = filtered.filter(
    (i) => !i.start_date || new Date(i.start_date) <= now,
  )

  // ── Stats ─────────────────────────────────────────────────────────
  const totalDays = items.reduce((sum, i) => sum + (i.days_count ?? 0), 0)
  const totalNights = items.reduce(
    (sum, i) => sum + (i.nights_count ?? 0),
    0,
  )

  // ── Delete (optimistic) ───────────────────────────────────────────
  const handleDelete = async (id: string) => {
    const removed = items.find((i) => i.itinerary_id === id)
    setItems((prev) => prev.filter((i) => i.itinerary_id !== id))

    const result = await deleteItinerary(id)
    if (!result.success) {
      // Restore the deleted item on failure
      if (removed) {
        setItems((prev) =>
          [removed, ...prev].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          ),
        )
      }
      toast(result.error, "error")
    } else {
      toast("Itinerary deleted.", "success")
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 overflow-x-hidden">
      <Navbar />

      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col lg:flex-row">
          {/* ── Main content ── */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 lg:py-12 lg:pr-12">
            <MyTripsHeader search={search} onSearch={setSearch} />

            <div className="mt-10 flex min-w-0 flex-col gap-10">
              <TripsOverview
                total={items.length}
                totalDays={totalDays}
                totalNights={totalNights}
              />

              {upcoming.length > 0 && (
                <UpcomingAdventures
                  itineraries={upcoming}
                  onDelete={handleDelete}
                />
              )}

              <SavedItineraries
                itineraries={saved}
                onDelete={handleDelete}
                showEmptyState={items.length === 0}
              />
            </div>
          </main>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-[320px] bg-white px-4 sm:px-6 lg:px-8 py-10 lg:py-12 relative">
            <div className="absolute inset-y-0 right-[-100vw] w-[100vw] bg-white hidden lg:block" />
            <div className="relative z-10">
              <TripSidebar />
            </div>
          </aside>
        </div>
      </div>

      <FooterSimple />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

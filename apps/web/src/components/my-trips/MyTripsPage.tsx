"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import FooterSimple from "@/components/footerSimple"
import { MyTripsHeader } from "@/components/my-trips/MyTripsHeader"
import { TripsOverview } from "@/components/my-trips/TripsOverview"
import { UpcomingAdventures } from "@/components/my-trips/UpcomingAdventures"
import { SavedItineraries } from "@/components/my-trips/PastAdventures"
import { DeleteTripConfirmationModal } from "@/components/my-trips/DeleteTripConfirmationModal"
import { ToastContainer } from "@/components/new-package-details/Toast"
import { useToast } from "@/hooks/useToast"
import { deleteItinerary } from "@/actions/itinerary_actions"
import type { ItineraryResponse } from "@/types/api"

interface MyTripsPageProps {
  itineraries: ItineraryResponse[]
  packageStatuses: Record<string, "public" | "private" | "archived">
  packageIdsByItinerary: Record<string, string>
  sidebarUser: {
    name: string
    avatarUrl: string
  }
}

export function MyTripsPage({
  itineraries: initial,
  packageStatuses,
  packageIdsByItinerary,
  sidebarUser,
}: MyTripsPageProps) {
  const [items, setItems] = useState<ItineraryResponse[]>(initial)
  const [search, setSearch] = useState("")
  const [tripPendingDelete, setTripPendingDelete] =
    useState<ItineraryResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toasts, show: toast, dismiss } = useToast()

  const filtered = search.trim()
    ? items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()))
    : items

  const now = new Date()
  const upcoming = filtered.filter(
    (i) => i.start_date && new Date(i.start_date) > now
  )
  const saved = filtered.filter(
    (i) => !i.start_date || new Date(i.start_date) <= now
  )

  const totalDays = filtered.reduce((sum, i) => sum + (i.days_count ?? 0), 0)
  const totalNights = filtered.reduce((sum, i) => sum + (i.nights_count ?? 0), 0)

  const handleDeleteRequest = (trip: ItineraryResponse) => {
    setTripPendingDelete(trip)
  }

  const handleDeleteConfirmed = async () => {
    if (!tripPendingDelete) {
      return
    }

    const id = tripPendingDelete.itinerary_id
    const removed = items.find((i) => i.itinerary_id === id)
    setIsDeleting(true)
    setItems((prev) => prev.filter((i) => i.itinerary_id !== id))

    try {
      const result = await deleteItinerary(id)
      if (!result.success) {
        if (removed) {
          setItems((prev) =>
            [removed, ...prev].sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
          )
        }
        toast(result.error, "error")
      } else {
        toast("Itinerary deleted.", "success")
      }
    } finally {
      setIsDeleting(false)
      setTripPendingDelete(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 overflow-x-hidden">
      <Navbar />

      <div className="mx-auto w-full max-w-[1100px]">
        <main className="px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <MyTripsHeader search={search} onSearch={setSearch} />

          <div className="mt-10 flex min-w-0 flex-col gap-10">
            <TripsOverview
              savedCount={saved.length}
              totalDays={totalDays}
              totalNights={totalNights}
            />

            {upcoming.length > 0 && (
              <UpcomingAdventures
                itineraries={upcoming}
                packageStatuses={packageStatuses}
                packageIdsByItinerary={packageIdsByItinerary}
                onDelete={handleDeleteRequest}
              />
            )}

            <SavedItineraries
              itineraries={saved}
              packageIdsByItinerary={packageIdsByItinerary}
              onDelete={handleDeleteRequest}
              showEmptyState={items.length === 0}
            />
          </div>
        </main>
      </div>

      <FooterSimple />
      <DeleteTripConfirmationModal
        open={tripPendingDelete !== null}
        tripTitle={tripPendingDelete?.title}
        isSubmitting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setTripPendingDelete(null)
          }
        }}
        onConfirm={handleDeleteConfirmed}
      />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

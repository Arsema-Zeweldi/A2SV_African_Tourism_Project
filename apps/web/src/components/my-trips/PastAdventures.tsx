import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CalendarDays, Trash2, MapPinned } from "lucide-react"
import type { ItineraryResponse } from "@/types/api"

const TRIP_IMAGES = [
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&q=80",
  "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=300&q=80",
  "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=300&q=80",
  "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=300&q=80",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80",
]

function getTripImage(index: number) {
  return TRIP_IMAGES[index % TRIP_IMAGES.length]
}

function formatSavedDate(created: string): string {
  return new Date(created).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatCost(cost: number): string {
  if (!cost) return "—"
  return `$${cost.toLocaleString("en-US", { maximumFractionDigits: 0 })} est.`
}

interface SavedItinerariesProps {
  itineraries: ItineraryResponse[]
  packageIdsByItinerary: Record<string, string>
  onDelete: (trip: ItineraryResponse) => void
  showEmptyState?: boolean
}

export function SavedItineraries({
  itineraries,
  packageIdsByItinerary,
  onDelete,
  showEmptyState = false,
}: SavedItinerariesProps) {
  // Full empty state when no itineraries exist at all
  if (showEmptyState) {
    return (
      <section className="space-y-4">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#243244]">
          Saved Itineraries
        </h2>
        <div className="rounded-[28px] bg-white shadow-[0_16px_34px_rgba(48,35,11,0.03)] p-12 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#fff3e8] flex items-center justify-center">
            <MapPinned className="h-7 w-7 text-[#ec6d13]" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#243244] mb-1">
              No trips yet
            </h3>
            <p className="text-[13px] text-[#8090a3] max-w-[280px]">
              Generate your first AI-powered itinerary and it will appear here.
            </p>
          </div>
          <Link
            href="/plan-your-trip"
            className="mt-2 h-[42px] rounded-full bg-[#ec6d13] px-7 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(236,109,19,0.22)] hover:bg-[#d4600f] transition-all flex items-center"
          >
            + Plan New Trip
          </Link>
        </div>
      </section>
    )
  }

  // Search result empty state (has trips but none match)
  if (itineraries.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#243244]">
          Saved Itineraries
        </h2>
        <div className="rounded-[28px] bg-white shadow-[0_16px_34px_rgba(48,35,11,0.03)] p-8 text-center">
          <p className="text-[13px] text-[#8090a3]">
            No itineraries match your search.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#243244]">
            Saved Itineraries
          </h2>
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#fdf2e8] text-[11px] font-bold text-[#ec6d13]">
            {itineraries.length}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {itineraries.map((trip, index) => (
          <Card
            key={trip.itinerary_id}
            className="rounded-[24px] border-0 bg-white p-5 shadow-[0_16px_34px_rgba(48,35,11,0.03)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pl-1">
              {/* Left: image + info */}
              <div className="flex items-center gap-5">
                <div className="relative h-[68px] w-[90px] shrink-0 overflow-hidden rounded-[16px] bg-[#f4f1ec]">
                  <Image
                    src={getTripImage(index)}
                    alt={trip.title}
                    fill
                    className="object-cover"
                    sizes="90px"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <Badge
                    variant="secondary"
                    className="mb-2.5 w-fit bg-[#f4f2ef] px-2 py-[2px] text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8d98a6]"
                  >
                    Saved
                  </Badge>
                  <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-[#243244] leading-tight truncate max-w-[300px]">
                    {trip.title}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[#a0aab7]">
                    <span className="flex items-center gap-[4px]">
                      <CalendarDays className="h-3 w-3 text-[#a6b0bc]" />
                      Saved {formatSavedDate(trip.created_at)}
                    </span>
                    <span className="text-[#dde3ea]">·</span>
                    <span>
                      {trip.days_count}d · {trip.nights_count}n
                    </span>
                    {trip.total_cost_est > 0 && (
                      <>
                        <span className="text-[#dde3ea]">·</span>
                        <span className="font-semibold text-[#ec6d13]">
                          {formatCost(trip.total_cost_est)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
                <button
                  onClick={() => onDelete(trip)}
                  aria-label="Delete itinerary"
                  className="h-8 w-8 rounded-full border border-[#ece7e0] bg-[#fbfaf8] flex items-center justify-center text-[#8d98a6] transition hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                >
                  <Trash2 size={13} />
                </button>
                <Link
                  href={
                    packageIdsByItinerary[trip.itinerary_id]
                      ? `/package-details/${packageIdsByItinerary[trip.itinerary_id]}`
                      : `/new-package/${trip.itinerary_id}`
                  }
                  className="h-8 rounded-full border border-[#ec6d13] bg-white px-5 text-[11px] font-semibold text-[#ec6d13] transition hover:bg-[#fff3e8] flex items-center"
                >
                  View Itinerary
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

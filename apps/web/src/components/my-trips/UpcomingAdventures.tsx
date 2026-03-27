import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CalendarDays, MapPin, Trash2 } from "lucide-react"
import type { ItineraryResponse } from "@/types/api"

// Curated African travel images from Unsplash (already whitelisted domain)
const TRIP_IMAGES = [
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80",
  "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80",
  "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400&q=80",
  "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&q=80",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80",
]

function getTripImage(index: number) {
  return TRIP_IMAGES[index % TRIP_IMAGES.length]
}

function formatDateRange(
  start: string | null,
  end: string | null,
): string {
  if (!start) return ""
  const s = new Date(start).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  if (!end) return s
  const e = new Date(end).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return `${s} – ${e}`
}

function formatCost(cost: number): string {
  if (!cost) return "See itinerary"
  return `$${cost.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
}

interface UpcomingAdventuresProps {
  itineraries: ItineraryResponse[]
  onDelete: (id: string) => void
}

export function UpcomingAdventures({
  itineraries,
  onDelete,
}: UpcomingAdventuresProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#243244]">
          Upcoming Adventures
        </h2>
        <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#fdf2e8] text-[11px] font-bold text-[#ec6d13]">
          {itineraries.length}
        </span>
      </div>

      <div className="space-y-4">
        {itineraries.map((trip, index) => (
          <Card
            key={trip.itinerary_id}
            className="relative overflow-hidden rounded-[28px] border-0 bg-white shadow-[0_18px_38px_rgba(48,35,11,0.03)]"
          >
            {/* Confirmed accent bar */}
            <div className="absolute left-0 top-[20%] h-[60%] w-[4px] rounded-r-full bg-[#ec6d13]" />

            <div className="grid gap-6 p-6 lg:grid-cols-[140px_minmax(0,1fr)_auto] lg:items-center pr-8">
              {/* Image */}
              <div className="relative h-[110px] w-[140px] overflow-hidden rounded-[20px] bg-[#f4f1ec] shrink-0">
                <Image
                  src={getTripImage(index)}
                  alt={trip.title}
                  fill
                  className="object-cover"
                  sizes="140px"
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-2.5">
                  <Badge
                    variant="secondary"
                    className="bg-[#fff2e7] text-primary border-0 px-2.5 py-[3px] text-[9px] font-bold uppercase tracking-[0.12em]"
                  >
                    Confirmed
                  </Badge>
                  <span className="text-[11px] font-medium text-[#9ba5b1]">
                    #{trip.itinerary_id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <h3 className="max-w-xl text-[20px] font-bold tracking-[-0.02em] text-[#243244] leading-tight">
                  {trip.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-8 text-[11px] text-[#7f8c9a]">
                  <div className="flex items-start gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-[#a6b0bc] mt-[2px]" />
                    <span className="text-[12px] font-medium leading-[1.3] text-[#768494]">
                      {formatDateRange(trip.start_date, trip.end_date)}
                      <br />
                      {trip.days_count} days · {trip.nights_count} nights
                    </span>
                  </div>
                  {trip.description && (
                    <div className="flex items-start gap-2 border-l border-[#ebe5dc] pl-6">
                      <MapPin className="h-3.5 w-3.5 text-[#a6b0bc] mt-[2px]" />
                      <span className="text-[12px] font-medium leading-[1.3] text-[#768494] line-clamp-2 max-w-[180px]">
                        {trip.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-start gap-3.5 lg:items-end justify-center min-w-[140px]">
                <div className="text-left lg:text-right">
                  <p className="text-[18px] font-bold tracking-[-0.02em] text-[#243244] leading-none mb-1.5">
                    {formatCost(trip.total_cost_est)}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#a6b0bc]">
                    Est. Total Cost
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onDelete(trip.itinerary_id)}
                    aria-label="Delete itinerary"
                    className="h-[34px] w-[34px] rounded-full border border-[#ece7e0] bg-[#fcfaf8] flex items-center justify-center text-[#8c97a4] transition hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                  <Link
                    href={`/new-package/${trip.itinerary_id}`}
                    className="h-[34px] rounded-full bg-[#ec6d13] px-4 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(236,109,19,0.24)] transition hover:bg-[#d4600f] flex items-center"
                  >
                    View Itinerary
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

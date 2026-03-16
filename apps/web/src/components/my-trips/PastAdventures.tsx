import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { pastTrips } from "@/lib/my-trips-data"
import { MessageSquareText, Star, CalendarDays } from "lucide-react"

export function PastAdventures() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#243244]">
          Past Adventures
        </h2>
        <button className="text-[12px] font-bold text-[#ec6d13] transition hover:text-[#d4600f] flex items-center gap-1">
          View All History <span className="text-[14px]">›</span>
        </button>
      </div>

      <div className="space-y-4">
        {pastTrips.map((trip) => (
          <Card
            key={trip.id}
            className="rounded-[24px] border-0 bg-white p-5 shadow-[0_16px_34px_rgba(48,35,11,0.03)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pl-1">
              <div className="flex items-center gap-5">
                <div className="relative h-[68px] w-[90px] shrink-0 overflow-hidden rounded-[16px] bg-[#f4f1ec]">
                  <Image
                    src={trip.image}
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
                    {trip.statusLabel}
                  </Badge>
                  <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-[#243244] leading-tight">
                    {trip.title}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-[4px] text-[11px] text-[#a0aab7]">
                    <CalendarDays className="h-3 w-3 text-[#a6b0bc]" />
                    {trip.dateRange}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-5">
                {trip.rating ? (
                  <div className="flex items-center gap-2 text-[11px] text-[#b0b7c2]">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-3 w-3 ${index < Math.floor(trip.rating!)
                              ? "fill-primary text-primary"
                              : "fill-[#e3e8ee] text-[#e3e8ee]"
                            }`}
                        />
                      ))}
                    </div>
                    <span>{trip.reviewLabel}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#94a0ae]">
                    <MessageSquareText className="h-[14px] w-[14px]" />
                    <span>{trip.reviewLabel}</span>
                  </div>
                )}
                <button className="h-8 rounded-full border border-[#ece7e0] bg-[#fbfaf8] px-5 text-[11px] font-semibold text-[#8d98a6] transition hover:bg-[#f1ece6]">
                  {trip.actionLabel}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

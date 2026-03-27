import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { upcomingTrips } from "@/lib/my-trips-data"
import { CalendarDays, MapPin } from "lucide-react"

const statusStyles: Record<string, string> = {
  confirmed: "bg-[#fff2e7] text-primary",
  "pending confirmation": "bg-[#fff8d6] text-[#eeb01b]",
}

export function UpcomingAdventures() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#243244]">
          Upcoming Adventures
        </h2>
        <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#fdf2e8] text-[11px] font-bold text-[#ec6d13]">
          {upcomingTrips.length}
        </span>
      </div>

      <div className="space-y-4">
        {upcomingTrips.map((trip) => (
          <Card
            key={trip.id}
            className="relative overflow-hidden rounded-[28px] border-0 bg-white shadow-[0_18px_38px_rgba(48,35,11,0.03)]"
          >
            {trip.statusLabel === "confirmed" && (
              <div className="absolute left-0 top-[20%] h-[60%] w-[4px] rounded-r-full bg-[#ec6d13]" />
            )}
            <div className="grid gap-6 p-6 lg:grid-cols-[140px_minmax(0,1fr)_auto] lg:items-center pr-8">
              <div className="relative h-[110px] w-[140px] overflow-hidden rounded-[20px] bg-[#f4f1ec] shrink-0">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  className="object-cover"
                  sizes="140px"
                />
              </div>

              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-2.5">
                  <Badge
                    variant="secondary"
                    className={`${statusStyles[trip.statusLabel]} border-0 px-2.5 py-[3px] text-[9px] font-bold uppercase tracking-[0.12em]`}
                  >
                    {trip.statusLabel}
                  </Badge>
                  <span className="text-[11px] font-medium text-[#9ba5b1]">
                    {trip.reference}
                  </span>
                </div>
                <div>
                  <h3 className="max-w-xl text-[20px] font-bold tracking-[-0.02em] text-[#243244] leading-tight">
                    {trip.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-8 text-[11px] text-[#7f8c9a]">
                    <div className="flex items-start gap-2 max-w-[120px]">
                      <div className="pt-[2px]">
                        <CalendarDays className="h-3.5 w-3.5 text-[#a6b0bc]" />
                      </div>
                      <div className="text-[12px] font-medium leading-[1.3] text-[#768494] whitespace-pre-line">
                        {trip.dateRange}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 border-l border-[#ebe5dc] pl-6">
                      <div className="pt-[2px]">
                        <MapPin className="h-3.5 w-3.5 text-[#a6b0bc]" />
                      </div>
                      <div className="flex items-start">
                        <span className="text-[12px] font-medium leading-[1.3] text-[#768494]">
                          {trip.location}
                          <br />
                          {trip.locationDetail}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3.5 lg:items-end justify-center min-w-[140px]">
                <div className="text-left lg:text-right">
                  <p className="text-[18px] font-bold tracking-[-0.02em] text-[#243244] leading-none mb-1.5">
                    {trip.priceRange}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#a6b0bc]">
                    Est. Total Cost
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button className="h-[34px] rounded-full border border-[#ece7e0] bg-[#fcfaf8] px-4 text-[11px] font-semibold text-[#8c97a4] transition hover:bg-[#f1ece6]">
                    {trip.secondaryActionLabel}
                  </button>
                  <button className="h-[34px] rounded-full bg-[#ec6d13] px-4 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(236,109,19,0.24)] transition hover:bg-[#d4600f]">
                    {trip.primaryActionLabel}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

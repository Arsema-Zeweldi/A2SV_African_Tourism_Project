import Image from "next/image"
import { recommendedTrips } from "@/lib/my-trips-data"

interface TripSidebarProps {
  userName: string
  avatarUrl: string
}

export function TripSidebar({ userName, avatarUrl }: TripSidebarProps) {
  return (
    <aside className="space-y-8">
      <div className="flex flex-col items-center gap-4 pt-6 text-center">
        <div className="relative">
          <div className="relative h-[84px] w-[84px] overflow-hidden rounded-full border-[3px] border-[#ecd2c0] bg-[#f7efe8]">
            <Image
              src={avatarUrl}
              alt={userName}
              fill
              className="object-cover"
              sizes="84px"
            />
          </div>
          <span className="absolute bottom-1 right-2 h-4 w-4 rounded-full border-[2.5px] border-white bg-[#25d674]" />
        </div>
        <p className="text-[17px] font-semibold tracking-[-0.02em] text-[#243244]">
          {userName}
        </p>
      </div>

      <div className="mt-8 px-2">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9ba5b1]">
          Recommended for you
        </h3>
        <div className="mt-5 space-y-5">
          {recommendedTrips.map((trip) => (
            <div key={trip.id} className="flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#eee7de] shrink-0">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <p className="truncate text-[13px] font-bold tracking-[-0.01em] text-[#243244]">
                  {trip.title}
                </p>
                <p className="text-[12px] font-bold text-[#ec6d13]">
                  {trip.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

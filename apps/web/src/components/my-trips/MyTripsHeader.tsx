import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function MyTripsHeader() {
  return (
    <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between pt-4">
      <div className="max-w-sm">
        <h1 className="text-[34px] font-bold leading-none tracking-[-0.03em] text-[#243244] mb-3">
          My Trips
        </h1>
        <p className="max-w-[280px] text-[13px] leading-[1.4] text-[#8090a3]">
          Manage your upcoming adventures and revisit your memories.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
        <div className="relative w-full sm:w-[280px]">
          <Search className="absolute left-5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#a9b3be]" />
          <input
            placeholder="Search trips..."
            aria-label="Search trips"
            className="h-[46px] w-full rounded-full border-0 bg-white py-2 pl-[46px] pr-5 text-[13px] font-medium text-[#243244] shadow-[0_4px_14px_rgba(48,35,11,0.02)] placeholder:text-[#a9b3be] outline-none transition focus:ring-2 focus:ring-[#ec6d13]/20"
          />
        </div>
        <Button
          size="lg"
          className="h-[46px] rounded-full bg-[#ec6d13] px-7 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(236,109,19,0.22)] hover:bg-[#d4600f] transition-all"
        >
          + Plan New Trip
        </Button>
      </div>
    </section>
  )
}

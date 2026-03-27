import { Card, CardContent } from "@/components/ui/card"
import { tripStats } from "@/lib/my-trips-data"
import { CalendarRange, Gem, MapPinned } from "lucide-react"

const statIcons = {
  map: MapPinned,
  calendar: CalendarRange,
  gem: Gem,
}

const toneStyles: Record<string, string> = {
  neutral: "bg-[#e8f2ff] text-[#3b82f6]", // Changed to blue to match design
  orange: "bg-[#fff3e8] text-[#ec6d13]",
  green: "bg-[#ecfaf0] text-[#3aa76d]",
}

export function TripsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {tripStats.map((stat) => (
        <Card
          key={stat.id}
          className="rounded-[28px] border-0 bg-white shadow-[0_20px_40px_rgba(48,35,11,0.02)]"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div
                className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] ${toneStyles[stat.tone]}`}
              >
                {(() => {
                  const Icon = statIcons[stat.icon as keyof typeof statIcons]
                  return <Icon className="h-6 w-6 stroke-[1.5]" />
                })()}
              </div>
              <div className="flex flex-col items-start min-w-0">
                <p className="text-[12px] font-medium text-[#8d98a6] mb-1">
                  {stat.label}
                </p>
                <div className="flex flex-col items-start leading-none">
                  <p className="text-[28px] font-semibold tracking-[-0.02em] text-[#243244] leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[16px] font-semibold text-[#243244] leading-none">
                    {stat.suffix}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

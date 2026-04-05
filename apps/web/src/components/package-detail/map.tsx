import React from 'react'
import { Map as MapIcon } from 'lucide-react'
import type { RouteStop } from '@/types/package-details'
import { DynamicLeafletMap } from '@/components/new-package-details/DynamicLeafletMap'
import type { Activity } from '@/types/new-package'

interface MapProps {
  stops: RouteStop[]
}

const fallbackStops: RouteStop[] = [
  {
    name: 'No stops',
    label: 'Unavailable',
    latitude: 0,
    longitude: 0,
  },
]

const Map = ({ stops }: MapProps) => {
  const displayStops = stops.length > 0 ? stops : fallbackStops
  const activities: Activity[] = stops.map((stop, index) => ({
    id: `${stop.name}-${index}`,
    time: '',
    duration: '',
    title: stop.name,
    description: stop.label,
    cost: '',
    location: stop.name,
    type: 'tour',
    latitude: stop.latitude,
    longitude: stop.longitude,
  }))

  return (
    <div>
      <h2 className="text-[15px] font-bold mb-4 flex items-center gap-2">
        <MapIcon size={17} className="text-[#F97316]" /> Route Map
      </h2>
      <div className="bg-[#f8f9fa] rounded-2xl border border-slate-200 p-2 flex flex-col gap-2">
        <div className="relative rounded-xl overflow-hidden h-[280px] sm:h-[320px] isolate">
          {activities.length > 0 ? (
            <DynamicLeafletMap activities={activities} />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-100 text-center text-sm text-slate-500">
              Map coordinates are not available for this package yet.
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
          <div className="relative flex items-center gap-1 min-w-max">
            {displayStops.length > 1 && (
              <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-orange-100 -translate-y-1/2" />
            )}
            {displayStops.map((stop, index) => (
              <div
                key={`${stop.name}-${index}`}
                className="relative z-10 flex flex-col items-center bg-white px-2 shrink-0 max-w-[90px]"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full mb-1 shrink-0 ${
                    index === 0 ? 'bg-[#F97316]' : 'bg-orange-200'
                  }`}
                />
                <span className="text-[10px] font-bold text-slate-800 text-center leading-tight line-clamp-2">
                  {stop.name}
                </span>
                <span className="text-[9px] text-slate-400">{stop.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Map

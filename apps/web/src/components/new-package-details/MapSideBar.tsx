"use client"

import { useState } from "react"
import { Expand, Shrink, Route } from "lucide-react"
import type { Activity } from "@/types/new-package"
import { DynamicLeafletMap } from "./DynamicLeafletMap"

interface MapSidebarProps {
  activities: Activity[]
  focusedActivityId?: string | null
  routeLabel?: string
  routeDistance?: string
}

export function MapSidebar({
  activities,
  focusedActivityId,
  routeLabel = "Route Day 1",
  routeDistance,
}: MapSidebarProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden isolate">
      <div className={`${expanded ? "h-96" : "h-44"} relative transition-all duration-300`}>
        <DynamicLeafletMap
          activities={activities}
          focusedActivityId={focusedActivityId}
        />
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute bottom-2 right-2 z-10 flex items-center gap-1 bg-white/90 text-[10px] text-gray-700 px-2 py-1 rounded shadow-sm hover:bg-white transition-colors font-medium"
        >
          {expanded ? (
            <><Shrink size={10} /> Collapse</>
          ) : (
            <><Expand size={10} /> Expand</>
          )}
        </button>
      </div>

      {/* Route info bar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-700">
          <Route size={11} className="text-primary" />
          {routeLabel}
        </span>
        {routeDistance && (
          <span className="text-[10px] text-gray-400 font-medium">
            {routeDistance}
          </span>
        )}
      </div>
    </div>
  )
}

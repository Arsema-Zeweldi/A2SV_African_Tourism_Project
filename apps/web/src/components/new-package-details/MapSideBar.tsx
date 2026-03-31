"use client"

import { useState } from "react"
import { Expand, Shrink } from "lucide-react"
import type { Activity } from "@/types/new-package"
import { DynamicLeafletMap } from "./DynamicLeafletMap"

interface MapSidebarProps {
  activities: Activity[]
  focusedActivityId?: string | null
}

export function MapSidebar({
  activities,
  focusedActivityId,
}: MapSidebarProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden">
      <div className={`${expanded ? "h-96" : "h-44"} relative transition-all duration-300`}>
        <DynamicLeafletMap
          activities={activities}
          focusedActivityId={focusedActivityId}
        />
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute bottom-2 right-2 z-[1000] flex items-center gap-1 bg-white/90 text-xs text-gray-700 px-2 py-1 rounded shadow hover:bg-white transition-colors font-medium"
        >
          {expanded ? (
            <><Shrink size={10} /> Collapse</>
          ) : (
            <><Expand size={10} /> Expand</>
          )}
        </button>
      </div>
    </div>
  )
}

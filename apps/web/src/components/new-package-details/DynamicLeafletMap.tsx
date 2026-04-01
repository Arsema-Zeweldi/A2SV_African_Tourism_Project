"use client"

import dynamic from "next/dynamic"
import type { LeafletMapProps } from "./LeafletMap"

const LeafletMap = dynamic(
  () => import("./LeafletMap").then((mod) => mod.LeafletMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#dce8d8] flex items-center justify-center">
        <span className="text-xs text-gray-400">Loading map...</span>
      </div>
    ),
  },
)

export function DynamicLeafletMap(props: LeafletMapProps) {
  return <LeafletMap {...props} />
}

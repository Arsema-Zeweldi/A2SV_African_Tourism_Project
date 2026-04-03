"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Activity } from "@/types/new-package"

// Fix Leaflet's default icon paths (broken in webpack/Next.js)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

const highlightedIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [35, 56],
  iconAnchor: [17, 56],
  popupAnchor: [1, -48],
})

interface MapControllerProps {
  activities: Activity[]
  focusedActivityId?: string | null
}

function MapController({ activities, focusedActivityId }: MapControllerProps) {
  const map = useMap()

  useEffect(() => {
    const withCoords = activities.filter((a) => a.latitude && a.longitude)

    if (focusedActivityId) {
      const focused = withCoords.find((a) => a.id === focusedActivityId)
      if (focused && focused.latitude && focused.longitude) {
        map.flyTo([focused.latitude, focused.longitude], 15, { duration: 0.8 })
        return
      }
    }

    if (withCoords.length > 0) {
      const bounds = L.latLngBounds(
        withCoords.map(
          (a) => [a.latitude!, a.longitude!] as [number, number],
        ),
      )
      map.fitBounds(bounds, { padding: [30, 30] })
    }
  }, [activities, focusedActivityId, map])

  return null
}

export interface LeafletMapProps {
  activities: Activity[]
  focusedActivityId?: string | null
}

export function LeafletMapInner({
  activities,
  focusedActivityId,
}: LeafletMapProps) {
  const withCoords = activities.filter((a) => a.latitude && a.longitude)
  const defaultCenter: [number, number] =
    withCoords.length > 0
      ? [withCoords[0].latitude!, withCoords[0].longitude!]
      : [-1.29, 36.82]

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      className="w-full h-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController
        activities={activities}
        focusedActivityId={focusedActivityId}
      />
      {withCoords.map((activity) => (
        <Marker
          key={activity.id}
          position={[activity.latitude!, activity.longitude!]}
          icon={
            activity.id === focusedActivityId
              ? highlightedIcon
              : new L.Icon.Default()
          }
        >
          <Popup>
            <strong>{activity.title}</strong>
            <br />
            <span className="text-xs text-gray-500">{activity.location}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

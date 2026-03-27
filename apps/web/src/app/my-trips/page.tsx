import type { Metadata } from "next"
import { apiFetch } from "@/lib/api"
import type { ItineraryListResponse, ItineraryResponse } from "@/types/api"
import { MyTripsPage } from "@/components/my-trips"

export const metadata: Metadata = {
  title: "My Trips | AMONA",
  description: "Track your saved itineraries and plan new adventures.",
}

export default async function MyTrips() {
  let itineraries: ItineraryResponse[] = []

  try {
    const res = await apiFetch<ItineraryListResponse>("/itineraries")
    itineraries = res.data ?? []
  } catch {
    // If unauthenticated or network error, render with empty state —
    // the middleware will redirect guests before this even runs.
  }

  return <MyTripsPage itineraries={itineraries} />
}

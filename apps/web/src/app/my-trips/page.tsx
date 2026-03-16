import type { Metadata } from "next"
import { MyTripsPage } from "@/components/my-trips"

export const metadata: Metadata = {
  title: "My Trips | AMONA",
  description: "Track upcoming adventures and revisit past journeys.",
}

export default function MyTrips() {
  return <MyTripsPage />
}

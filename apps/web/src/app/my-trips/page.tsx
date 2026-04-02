import type { Metadata } from "next"
import { apiFetch } from "@/lib/api"
import type {
  ItineraryListResponse,
  ItineraryResponse,
  PackagesFeedResponse,
  UserProfileResponse,
} from "@/types/api"
import { MyTripsPage } from "@/components/my-trips"

export const metadata: Metadata = {
  title: "My Trips | AMONA",
  description: "Track your saved itineraries and plan new adventures.",
}

export default async function MyTrips() {
  let itineraries: ItineraryResponse[] = []
  let packageStatuses: Record<string, "public" | "private" | "archived"> = {}
  let packageIdsByItinerary: Record<string, string> = {}
  let sidebarUser = {
    name: "Traveler",
    avatarUrl: "/images/user-icon.png",
  }

  try {
    const [itineraryRes, packagesRes, profileRes] = await Promise.all([
      apiFetch<ItineraryListResponse>("/itineraries"),
      apiFetch<PackagesFeedResponse>("/packages/me").catch(() => ({
        data: [],
        meta: { total: 0, page: 1, page_size: 20 },
      })),
      apiFetch<{ data: UserProfileResponse }>("/user/profile").catch(() => null),
    ])

    itineraries = itineraryRes.data ?? []
    packageStatuses = Object.fromEntries(
      (packagesRes.data ?? []).map((pkg) => [pkg.itinerary_id, pkg.status])
    )
    packageIdsByItinerary = Object.fromEntries(
      (packagesRes.data ?? []).map((pkg) => [pkg.itinerary_id, pkg.package_id])
    )

    const profile = profileRes?.data
    const fullName = [profile?.first_name, profile?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim()

    sidebarUser = {
      name: fullName || profile?.email || "Traveler",
      avatarUrl: profile?.avatar_url || "/images/user-icon.png",
    }
  } catch {
    // If unauthenticated or network error, render with empty state.
  }

  return (
    <MyTripsPage
      itineraries={itineraries}
      packageStatuses={packageStatuses}
      packageIdsByItinerary={packageIdsByItinerary}
      sidebarUser={sidebarUser}
    />
  )
}

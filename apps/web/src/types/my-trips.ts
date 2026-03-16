export type TripStatIcon = "map" | "calendar" | "gem"

export interface TripStat {
  id: string
  label: string
  value: string
  suffix: string
  icon: TripStatIcon
  tone: "neutral" | "orange" | "green"
}

export interface UpcomingTrip {
  id: string
  title: string
  reference: string
  statusLabel: "confirmed" | "pending"
  scheduleLabel: string
  dateRange: string
  location: string
  locationDetail: string
  image: string
  priceRange: string
  primaryActionLabel: string
  secondaryActionLabel: string
}

export interface PastTrip {
  id: string
  title: string
  dateRange: string
  statusLabel: string
  image: string
  reviewLabel: string
  actionLabel: string
  rating?: number
}

export interface RecommendedTrip {
  id: string
  title: string
  price: string
  image: string
}

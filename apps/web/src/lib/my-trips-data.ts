import type {
  PastTrip,
  RecommendedTrip,
  TripStat,
  UpcomingTrip,
} from "@/types/my-trips"

export const tripStats: TripStat[] = [
  {
    id: "destinations",
    label: "Total Destinations",
    value: "14",
    suffix: "Countries",
    icon: "map",
    tone: "neutral",
  },
  {
    id: "upcoming",
    label: "Upcoming Trips",
    value: "2",
    suffix: "Bookings",
    icon: "calendar",
    tone: "orange",
  },
  {
    id: "rewards",
    label: "Rewards Points",
    value: "12,450",
    suffix: "pts",
    icon: "gem",
    tone: "green",
  },
]

export const upcomingTrips: UpcomingTrip[] = [
  {
    id: "zermatt",
    title: "Zermatt & Matterhorn Expedition",
    reference: "Ref: #AWD-8829",
    statusLabel: "confirmed",
    scheduleLabel: "Expected",
    dateRange: "Oct 12 - Oct 18,\n2023",
    location: "Valais,",
    locationDetail: "Switzerland",
    image: "/homepage/top_rated1.png",
    priceRange: "$2,000 - $2,400",
    primaryActionLabel: "Manage",
    secondaryActionLabel: "Details",
  },
  {
    id: "aegean",
    title: "Aegean Island Hopping Tour",
    reference: "Ref: #AWD-9012",
    statusLabel: "pending confirmation",
    scheduleLabel: "Confirmed Tour",
    dateRange: "Nov 05 - Nov 12,\n2023",
    location: "Cyclades,",
    locationDetail: "Greece",
    image: "/homepage/top_rated2.png",
    priceRange: "$3,000 - $3,400",
    primaryActionLabel: "Confirm",
    secondaryActionLabel: "Details",
  },
]

export const pastTrips: PastTrip[] = [
  {
    id: "california",
    title: "California National Parks Roadtrip",
    dateRange: "Aug 10 - Aug 20, 2023",
    statusLabel: "Complete",
    image: "/homepage/top_rated3.png",
    reviewLabel: "Leave a Review",
    actionLabel: "Rebook This",
  },
  {
    id: "vietnam",
    title: "Northern Vietnam Cultural Discovery",
    dateRange: "1 May - 6 May 2023",
    statusLabel: "Complete",
    image: "/homepage/top_rated1.png",
    reviewLabel: "Reviewed",
    actionLabel: "Rebook This",
    rating: 4.6,
  },
]

export const recommendedTrips: RecommendedTrip[] = [
  {
    id: "kyoto",
    title: "Kyoto Autumn Colors",
    price: "$1,890",
    image: "/homepage/community1.png",
  },
  {
    id: "venice",
    title: "Venice Canal Experience",
    price: "$1,150",
    image: "/homepage/community2.png",
  },
]

export const profile = {
  name: "Alex Thompson",
  avatar: "/homepage/community3.png",
}

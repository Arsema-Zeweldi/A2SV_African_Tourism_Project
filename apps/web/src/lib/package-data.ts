import { apiFetch } from "@/lib/api"
import type {
  PackageChatHistoryResponse,
  PackageResponse,
  PackageReviewsResponse,
  PackagesFeedResponse,
} from "@/types/api"
import type {
  MyPackagesPageData,
  PackageCard as MyPackageCard,
  RecommendationCard,
} from "@/types/my-packages"
import type {
  CostBreakdowns as PackageDetailsCostBreakdownItem,
  PackageDetails as PackageDetailsPageData,
  RouteStop,
} from "@/types/package-details"

import { getFallbackImage, getTripImage, safeImageUrl } from "@/lib/fallback-images"

const FALLBACK_PACKAGE_IMAGE = "/images/African-Safari-Sunset.png"
const FALLBACK_AVATAR = "/images/profile.png"

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency || "USD"} ${amount}`
  }
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

function formatRelativeDate(date: string) {
  const value = new Date(date)
  const diffMs = Date.now() - value.getTime()
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? "s" : ""} ago`

  return formatShortDate(date)
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date))
}

function toDisplayName(userID: string, prefix: string) {
  return `${prefix} ${userID.slice(0, 8)}`
}

function parseActivityCost(costLabel: string) {
  const match = costLabel.match(/[\d,.]+/)
  if (!match) return 0
  return Number(match[0].replaceAll(",", ""))
}

function buildCostBreakdown(pkg: PackageResponse): PackageDetailsCostBreakdownItem[] {
  const activities = pkg.itinerary?.activities ?? []
  const grouped = new Map<string, number>()

  for (const activity of activities) {
    const label = activity.activity_type
      ? activity.activity_type[0].toUpperCase() + activity.activity_type.slice(1)
      : "Activity"
    grouped.set(label, (grouped.get(label) ?? 0) + parseActivityCost(activity.cost_label))
  }

  const breakdown = Array.from(grouped.entries()).map(([category, cost]) => ({
    category,
    item: `${category} expenses`,
    notes: `${pkg.duration_days || pkg.itinerary?.days_count || activities.length} day package estimate`,
    cost,
  }))

  if (breakdown.length > 0) return breakdown

  return [
    {
      category: "Package",
      item: pkg.title,
      notes: pkg.summary || "Base package price",
      cost: pkg.price,
    },
  ]
}

function mapPackageDetails(
  pkg: PackageResponse,
  reviews: PackageReviewsResponse["data"],
  chatMessages: PackageChatHistoryResponse["data"],
): PackageDetailsPageData {
  const packageSeed = pkg.package_id || pkg.title
  const packageImage = pkg.image_url?.trim()
    ? safeImageUrl(pkg.image_url, packageSeed)
    : getTripImage(packageSeed)
  const location = [pkg.location, pkg.country].filter(Boolean).join(", ")
  const itineraryActivities = (pkg.itinerary?.activities ?? [])
    .slice()
    .sort((a, b) => a.day_number - b.day_number || a.order_index - b.order_index)
  const routeStops: RouteStop[] = itineraryActivities
    .filter(
      (activity) =>
        Number.isFinite(activity.latitude) && Number.isFinite(activity.longitude)
    )
    .map((activity, index, arr) => ({
      name: activity.location || activity.title || `Stop ${index + 1}`,
      label:
        index === 0 ? "Start" : index === arr.length - 1 ? "End" : `Stop ${index}`,
      latitude: activity.latitude,
      longitude: activity.longitude,
    }))

  return {
    name: pkg.title,
    owner: {
      name: pkg.creator_name || toDisplayName(pkg.creator_id, "Creator"),
      avatar: pkg.creator_avatar || FALLBACK_AVATAR,
    },
    cost: formatCurrency(pkg.price, pkg.currency),
    currency: pkg.currency || "USD",
    totalCost: pkg.price,
    isPublic: pkg.status === "public",
    review: reviews.map((review) => ({
      author: toDisplayName(review.user_id, "Traveler"),
      avatar: FALLBACK_AVATAR,
      text: review.comment,
      date: formatRelativeDate(review.created_at),
      rating: review.rating,
    })),
    description: pkg.description || pkg.summary || "No description available yet.",
    image: packageImage,
    viralMoment: pkg.image_url?.trim()
      ? {
          thumbnail: packageImage,
          description: pkg.summary || "Highlights from this package.",
        }
      : undefined,
    location,
    itinerary: itineraryActivities.map((activity) => ({
        day: activity.day_number,
        name: activity.title,
        description: activity.description,
        cost: activity.cost_label || undefined,
        requirement: activity.requirement || undefined,
        latitude: activity.latitude,
        longitude: activity.longitude,
        location: activity.location || undefined,
      })),
    routeStops,
    costBreakdown: buildCostBreakdown(pkg),
    communityChat: chatMessages
      .slice()
      .reverse()
      .map((message) => ({
        id: message.chat_id,
        userId: message.user_id,
        name: message.user_name || toDisplayName(message.user_id, "Traveler"),
        avatar: message.user_avatar || FALLBACK_AVATAR,
        text: message.message,
        timeStamp: formatTime(message.created_at),
      })),
    viewsCount: pkg.views_count,
    reviewsCount: pkg.reviews_count,
    ratingAvg: pkg.rating_avg,
    updatedAt: formatRelativeDate(pkg.updated_at),
  }
}

function mapMyPackageCard(pkg: PackageResponse): MyPackageCard {
  const statusMap: Record<PackageResponse["status"], MyPackageCard["status"]> = {
    public: { label: "Public", tone: "success", value: "public" },
    private: { label: "Private", tone: "neutral", value: "private" },
    archived: { label: "Archived", tone: "warning", value: "archived" },
  }

  return {
    id: pkg.package_id,
    title: pkg.title,
    location: [pkg.location, pkg.country].filter(Boolean).join(", "),
    image: pkg.image_url || getFallbackImage(pkg.package_id),
    createdAt: pkg.created_at,
    priceAmount: pkg.price,
    status: statusMap[pkg.status],
    priceLabel: "Package Price",
    priceValue: formatCurrency(pkg.price, pkg.currency),
    priceSuffix: pkg.group_size ? `/${pkg.group_size}` : undefined,
    metaLabel: "Duration",
    metaValue: pkg.duration_days > 0 ? `${pkg.duration_days} Days` : "Flexible",
    actions: [
      {
        label: "View Details",
        variant: "secondary",
        href: `/package-details/${pkg.package_id}`,
      },
      {
        label: pkg.status === "public" ? "Live Package" : "Edit Package",
        variant: "primary",
        kind: "status-modal",
      },
    ],
  }
}

export async function getPackageDetailsPageData(id: string) {
  const [pkg, reviewsResult, chatResult] = await Promise.all([
    apiFetch<PackageResponse>(`/packages/${id}`),
    apiFetch<PackageReviewsResponse>(`/packages/${id}/reviews`).catch(() => ({
      data: [],
      meta: { total: 0, page: 1, page_size: 50 },
    })),
    apiFetch<PackageChatHistoryResponse>(`/packages/${id}/chat`).catch(() => ({
      data: [],
      meta: { total: 0, page: 1, page_size: 50 },
    })),
  ])

  return mapPackageDetails(pkg, reviewsResult.data, chatResult.data)
}

export async function getMyPackagesPageData(): Promise<MyPackagesPageData> {
  const response = await apiFetch<PackagesFeedResponse>("/packages/me")

  // Fetch top-rated public packages as recommendations
  const recResponse = await apiFetch<PackagesFeedResponse>("/packages", {
    params: {
      sort_by: "rating_avg",
      order: "desc",
      page_size: 3,
      status: "public",
    },
  }).catch(() => null)

  const myPackageIds = new Set(
    (response.data ?? []).map((p) => p.package_id)
  )

  const recommendations: RecommendationCard[] = (recResponse?.data ?? [])
    .filter((p) => !myPackageIds.has(p.package_id))
    .slice(0, 3)
    .map((p) => ({
      title: p.title,
      image: p.image_url || getFallbackImage(p.package_id || p.title),
      price: `${p.currency || "USD"} ${p.price}`,
    }))

  return {
    title: "My Packages",
    description: "Manage your upcoming African adventures and itineraries.",
    sidebar: {
      dashboardItems: [
        { label: "Current Packages", icon: "package", active: true, href: "/my-packages" },
        { label: "Saved for Later", icon: "bookmark", href: "/my-packages/saved-for-later" },
        { label: "Past Trips", icon: "history", href: "/my-packages/past-trips" },
      ],
      preferenceItems: [
        { label: "Account Settings", icon: "settings", href: "/profile" },
        { label: "Support Center", icon: "support", href: "/my-packages/support-center" },
      ],
      tipCard: {
        title: "Travel Tip",
        description: "Keep your draft packages updated so they are ready to publish as soon as the itinerary is complete.",
      },
    },
    packages: response.data.map(mapMyPackageCard),
    recommendations,
  }
}

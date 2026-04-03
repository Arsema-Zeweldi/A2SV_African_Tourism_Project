import type { TripFormData } from "@/types/plan-trip"
import type {
  GeneratePlanRequest,
  GeneratePlanResponse,
  GeneratedActivity,
  CreateItineraryRequest,
  CreateItineraryActivity,
  ItineraryResponse,
  ItineraryActivityResponse,
} from "@/types/api"
import type { ItineraryData, Day, Activity, Budget } from "@/types/new-package"

// ── Frontend form → Backend request ────────────────────────────────

/** Maps frontend climate ids to backend-accepted enum values */
const CLIMATE_MAP: Record<string, string> = {
  tropical: "tropical",
  arid: "desert",
  savanna: "temperate",
  coastal: "coastal",
}

/** Derives budget_level from a numeric budget */
function deriveBudgetLevel(budget: number): "low" | "medium" | "high" | "luxury" {
  if (budget < 1000) return "low"
  if (budget < 3000) return "medium"
  if (budget < 5000) return "high"
  return "luxury"
}

export function toGeneratePlanRequest(form: TripFormData): GeneratePlanRequest {
  return {
    destination: form.destination,
    duration_days: form.duration,
    budget: form.budget,
    budget_level: deriveBudgetLevel(form.budget),
    vibe_tags: form.vibes,
    group_size: form.groupSize,
    climate_pref: CLIMATE_MAP[form.climate] ?? form.climate,
    multi_country: form.multiCountry,
    notes: form.notes,
  }
}

// ── Activity type normalization ─────────────────────────────────────

/** Backend only accepts these 5 activity types */
const VALID_BACKEND_ACTIVITY_TYPES = new Set([
  "food",
  "adventure",
  "culture",
  "party",
  "wildlife",
])

/** Maps common AI-generated types to valid backend types */
const BACKEND_ACTIVITY_TYPE_MAP: Record<string, string> = {
  food: "food",
  dining: "food",
  restaurant: "food",
  cuisine: "food",
  adventure: "adventure",
  hiking: "adventure",
  sport: "adventure",
  outdoor: "adventure",
  tour: "adventure",
  sightseeing: "adventure",
  excursion: "adventure",
  culture: "culture",
  cultural: "culture",
  museum: "culture",
  history: "culture",
  heritage: "culture",
  monument: "culture",
  art: "culture",
  party: "party",
  nightlife: "party",
  entertainment: "party",
  wildlife: "wildlife",
  safari: "wildlife",
  nature: "wildlife",
  transport: "adventure",
  accommodation: "culture",
  shopping: "culture",
  relaxation: "culture",
}

function normalizeActivityType(type: string): string {
  const lower = type.toLowerCase().trim()
  if (VALID_BACKEND_ACTIVITY_TYPES.has(lower)) return lower
  return BACKEND_ACTIVITY_TYPE_MAP[lower] ?? "culture"
}

// ── AI response → CreateItineraryRequest (for saving) ──────────────

export function toCreateItineraryRequest(
  res: GeneratePlanResponse,
): CreateItineraryRequest {
  return {
    title: res.title,
    description: res.description,
    days_count: res.days_count,
    nights_count: res.nights_count,
    activities: res.activities.map(
      (a): CreateItineraryActivity => ({
        day_number: a.day_number,
        order_index: a.order_index,
        title: a.title,
        description: a.description,
        time_label: "",
        duration_label: "",
        cost_label: a.cost_label,
        location: "",
        activity_type: normalizeActivityType(a.activity_type),
        image_url: "",
        ai_pick: a.ai_pick,
        requirement: "",
        latitude: a.latitude,
        longitude: a.longitude,
      }),
    ),
  }
}

// ── Backend response → Frontend display types ──────────────────────

/** Maps backend activity_type to frontend ActivityType */
const ACTIVITY_TYPE_MAP: Record<string, Activity["type"]> = {
  food: "food",
  adventure: "tour",
  culture: "monument",
  party: "tour",
  wildlife: "tour",
}

/** Assigns a time label based on order within a day */
function deriveTimeLabel(orderIndex: number): string {
  const times = ["09:00 AM", "11:30 AM", "01:00 PM", "03:30 PM", "06:00 PM", "08:00 PM"]
  return times[orderIndex] ?? `${9 + orderIndex * 2}:00 AM`
}

/** Returns undefined for placeholder/fake image URLs that will 500 */
function sanitizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    // Reject known AI-hallucinated placeholder domains
    if (
      parsed.hostname === 'images.example.com' ||
      parsed.hostname === 'example.com' ||
      parsed.hostname === 'placeholder.com' ||
      parsed.hostname.includes('example')
    ) {
      return undefined
    }
    return url
  } catch {
    // Not a valid URL (relative path or garbage) — keep if it starts with /
    return url.startsWith('/') ? url : undefined
  }
}

function mapActivityResponse(a: ItineraryActivityResponse, index: number): Activity {
  return {
    id: a.activity_id,
    time: a.time_label || deriveTimeLabel(a.order_index),
    duration: a.duration_label || "~2 Hours",
    title: a.title,
    description: a.description,
    cost: a.cost_label || "Free",
    location: a.location || "See map",
    type: ACTIVITY_TYPE_MAP[a.activity_type] ?? "tour",
    imageUrl: sanitizeImageUrl(a.image_url),
    aiPick: a.ai_pick,
    latitude: a.latitude || undefined,
    longitude: a.longitude || undefined,
  }
}

function mapGeneratedActivity(a: GeneratedActivity, index: number): Activity {
  return {
    id: `gen-${a.day_number}-${a.order_index}`,
    time: deriveTimeLabel(a.order_index),
    duration: "~2 Hours",
    title: a.title,
    description: a.description,
    cost: a.cost_label || "Free",
    location: "See map",
    type: ACTIVITY_TYPE_MAP[a.activity_type] ?? "tour",
    imageUrl: undefined,
    aiPick: a.ai_pick,
    latitude: a.latitude || undefined,
    longitude: a.longitude || undefined,
  }
}

/** Parses a cost label like "$30 USD" or "30" into a number */
function parseCost(costLabel: string): number {
  const match = costLabel.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

function buildBudget(activities: Array<{ cost_label: string }>): Budget {
  let total = 0
  const categoryTotals: Record<string, number> = {}

  for (const a of activities) {
    const cost = parseCost(a.cost_label)
    total += cost
  }

  // Simple category split estimate
  const accommodation = Math.round(total * 0.35)
  const food = Math.round(total * 0.25)
  const activitiesCost = Math.round(total * 0.3)
  const transport = total - accommodation - food - activitiesCost

  return {
    totalMin: Math.round(total * 0.85),
    totalMax: Math.round(total * 1.15),
    isOnTrack: true,
    categories: [
      { label: "Accommodation", amount: accommodation, color: "bg-orange-400", strokeColor: "#F97316" },
      { label: "Food & Dining", amount: food, color: "bg-green-500", strokeColor: "#22c55e" },
      { label: "Activities", amount: activitiesCost, color: "bg-violet-400", strokeColor: "#a78bfa" },
      { label: "Transport", amount: transport, color: "bg-gray-300", strokeColor: "#d1d5db" },
    ],
  }
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function buildDayLabel(dayNumber: number): string {
  const dayName = DAY_NAMES[(dayNumber - 1) % 7]
  return `${dayName} – Day ${dayNumber}`
}

function buildDayDate(dayNumber: number): string {
  const date = new Date()
  date.setDate(date.getDate() + dayNumber - 1)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

/** Converts an AI-generated plan response to frontend ItineraryData (before saving) */
export function generatedPlanToItineraryData(
  res: GeneratePlanResponse,
): ItineraryData {
  const dayMap = new Map<number, GeneratedActivity[]>()

  for (const activity of res.activities) {
    const existing = dayMap.get(activity.day_number) ?? []
    existing.push(activity)
    dayMap.set(activity.day_number, existing)
  }

  const days: Day[] = Array.from(dayMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([dayNumber, activities]) => ({
      id: `day-${dayNumber}`,
      dayNumber,
      label: buildDayLabel(dayNumber),
      date: buildDayDate(dayNumber),
      activities: activities
        .sort((a, b) => a.order_index - b.order_index)
        .map(mapGeneratedActivity),
    }))

  return {
    title: res.title,
    tags: [],
    daysCount: res.days_count,
    nightsCount: res.nights_count,
    budget: buildBudget(res.activities),
    map: {
      cityLabel: "",
      routeLabel: `Route Day 1`,
      routeDistance: "",
    },
    days,
  }
}

/** Converts a saved itinerary response to frontend ItineraryData */
export function itineraryResponseToItineraryData(
  res: ItineraryResponse,
): ItineraryData {
  const dayMap = new Map<number, ItineraryActivityResponse[]>()

  for (const activity of res.activities) {
    const existing = dayMap.get(activity.day_number) ?? []
    existing.push(activity)
    dayMap.set(activity.day_number, existing)
  }

  const days: Day[] = Array.from(dayMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([dayNumber, activities]) => ({
      id: `day-${dayNumber}`,
      dayNumber,
      label: buildDayLabel(dayNumber),
      date: buildDayDate(dayNumber),
      activities: activities
        .sort((a, b) => a.order_index - b.order_index)
        .map(mapActivityResponse),
    }))

  const destination =
    res.activities[0]?.location || res.title.split(" ").pop() || ""

  return {
    title: res.title,
    tags: [],
    daysCount: res.days_count,
    nightsCount: res.nights_count,
    budget: buildBudget(
      res.activities.map((a) => ({ cost_label: a.cost_label })),
    ),
    map: {
      cityLabel: destination,
      routeLabel: "Route Day 1",
      routeDistance: "",
    },
    days,
  }
}

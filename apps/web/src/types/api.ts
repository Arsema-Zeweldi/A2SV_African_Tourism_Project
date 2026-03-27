import { z } from "zod"

// ── Discriminated union for all server action returns ──────────────

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

// ── Generate Plan ──────────────────────────────────────────────────

export const generatePlanSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  duration_days: z.number().int().min(1).max(30),
  budget: z.number().min(0),
  budget_level: z.enum(["low", "medium", "high", "luxury"]).optional(),
  vibe_tags: z.array(z.string()),
  group_size: z.number().int().min(1).max(50),
  climate_pref: z.string(),
  multi_country: z.boolean(),
  notes: z.string(),
})

export type GeneratePlanRequest = z.infer<typeof generatePlanSchema>

/** Activity returned by the AI planner (mirrors ai_planner.Activity in Go) */
export interface GeneratedActivity {
  day_number: number
  order_index: number
  title: string
  description: string
  cost_label: string
  activity_type: string
  latitude: number
  longitude: number
  ai_pick: boolean
}

/** Response from POST /planner/generate (mirrors ai_planner.ItineraryResponse) */
export interface GeneratePlanResponse {
  title: string
  description: string
  days_count: number
  nights_count: number
  activities: GeneratedActivity[]
}

// ── Save Itinerary ─────────────────────────────────────────────────

export interface CreateItineraryActivity {
  day_number: number
  order_index: number
  title: string
  description: string
  time_label: string
  duration_label: string
  cost_label: string
  location: string
  activity_type: string
  image_url: string
  ai_pick: boolean
  requirement: string
  latitude: number
  longitude: number
  start_time?: string
  end_time?: string
}

export interface CreateItineraryRequest {
  title: string
  description: string
  days_count: number
  nights_count: number
  start_date?: string
  end_date?: string
  activities: CreateItineraryActivity[]
}

/** Single activity in a saved itinerary (mirrors models.ItineraryActivity) */
export interface ItineraryActivityResponse {
  activity_id: string
  itinerary_id: string
  day_number: number
  order_index: number
  title: string
  description: string
  time_label: string
  duration_label: string
  cost_label: string
  location: string
  activity_type: string
  image_url: string
  ai_pick: boolean
  requirement: string
  latitude: number
  longitude: number
  start_time: string | null
  end_time: string | null
}

/** Full itinerary response (mirrors models.Itinerary) */
export interface ItineraryResponse {
  itinerary_id: string
  user_id: string
  title: string
  description: string
  days_count: number
  nights_count: number
  start_date: string | null
  end_date: string | null
  total_cost_est: number
  created_at: string
  updated_at: string
  activities: ItineraryActivityResponse[]
}

// ── Itinerary list ─────────────────────────────────────────────────

export interface ItineraryListResponse {
  data: ItineraryResponse[]
  meta: { total: number }
}

// ── User Profile ───────────────────────────────────────────────────

export interface UserProfileResponse {
  user_id: string
  email: string
  first_name: string
  last_name: string
  country: string
  bio: string
  avatar_url: string | null
  created_at: string
}

export interface UserPreferencesResponse {
  preference_id?: string
  user_id?: string
  preferred_season?: string
  budget_range?: string
  preferred_activities?: string[]
  dietary_restrictions?: string[]
  preferred_climate?: string
  preferred_language?: string
  travel_vibe_interest?: string
  created_at?: string
  updated_at?: string
}

// ── Packages ───────────────────────────────────────────────────────

export interface CreatePackageRequest {
  itinerary_id: string
  title: string
  summary: string
  description: string
  price: number
  country: string
  location: string
  currency: string
  image_url: string
  duration_days: number
  category: string
  group_size: string
}

export interface PackageResponse {
  package_id: string
  creator_id: string
  itinerary_id: string
  title: string
  summary: string
  description: string
  price: number
  status: "private" | "public" | "archived"
  rating_avg: number
  reviews_count: number
  views_count: number
  country: string
  location: string
  currency: string
  image_url: string
  duration_days: number
  category: string
  group_size: string
  created_at: string
  updated_at: string
  itinerary?: ItineraryResponse
}

import type { LucideIcon } from "lucide-react"

/** The full form data collected across all wizard steps */
export interface TripFormData {
    destination: string
    multiCountry: boolean
    climate: string
    vibes: string[]
    duration: number
    budget: number
    notes: string
}

/** A climate card option (step 2) */
export interface ClimateOption {
    id: string
    title: string
    subtitle: string
    image: string
}

/** A vibe pill option (step 2) */
export interface VibeOption {
    id: string
    label: string
    icon: LucideIcon
}

/** A popular-gems avatar (step 1) */
export interface GemOption {
    name: string
    image: string
}

/** Summary card shown on step 5 */
export interface SummaryCard {
    icon: LucideIcon
    label: string
    value: string
    extra?: string
    step: number
}

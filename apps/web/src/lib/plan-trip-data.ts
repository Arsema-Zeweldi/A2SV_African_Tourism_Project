import {
    Mountain,
    Palmtree,
    Building,
    TreePine,
} from "lucide-react"
import type { ClimateOption, VibeOption, GemOption } from "@/types/plan-trip"

/** Labels shown for each step in the header */
export const STEP_TITLES = [
    "Choose Destination",
    "Choose Climate & Vibe",
    "Set duration and budget",
    "Additional Information",
] as const

/** Total number of form steps (excluding the summary) */
export const TOTAL_STEPS = 4

/** Popular destination gems shown in step 1 */
export const POPULAR_GEMS: GemOption[] = [
    { name: "Cape Town", image: "/plan_trip/gem-capetown.jpg" },
    { name: "Nairobi", image: "/plan_trip/gem-nairobi.jpg" },
    { name: "Marrakech", image: "/plan_trip/gem-marrakech.jpg" },
    { name: "Cairo", image: "/plan_trip/gem-cairo.jpg" },
]

/** Climate card options shown in step 2 */
export const CLIMATES: ClimateOption[] = [
    {
        id: "tropical",
        title: "Tropical",
        subtitle: "Lush rainforests and vibrant biodiversity.",
        image: "/plan_trip/climate-tropical.jpg",
    },
    {
        id: "arid",
        title: "Arid",
        subtitle: "Vast dunes and dramatic sunrises.",
        image: "/plan_trip/climate-arid.jpg",
    },
    {
        id: "savanna",
        title: "Savanna",
        subtitle: "Iconic golden plains and big game.",
        image: "/plan_trip/climate-savanna.jpg",
    },
    {
        id: "coastal",
        title: "Coastal",
        subtitle: "Turquoise waters and white sand beaches.",
        image: "/plan_trip/climate-coastal.jpg",
    },
]

/** Trip vibe pill options shown in step 2 */
export const VIBES: VibeOption[] = [
    { id: "adventure", label: "Adventure", icon: Mountain },
    { id: "relaxation", label: "Relaxation", icon: Palmtree },
    { id: "cultural", label: "Cultural", icon: Building },
    { id: "wildlife", label: "Wildlife", icon: TreePine },
]

/** Slider constraints */
export const DURATION_MIN = 1
export const DURATION_MAX = 30
export const BUDGET_MIN = 500
export const BUDGET_MAX = 10_000
export const BUDGET_STEP = 100

/** Background image for the wizard overlay */
export const WIZARD_BG = "/plan_trip/savanna-bg.jpg"

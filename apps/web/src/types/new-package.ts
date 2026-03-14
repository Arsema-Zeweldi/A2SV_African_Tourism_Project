// src/types/itinerary.types.ts

export type ActivityType =
  | "monument"
  | "food"
  | "tour"
  | "accommodation"
  | "transport";

export interface Activity {
  id: string;
  time: string;        // e.g. "09:00 AM"
  duration: string;    // e.g. "~2.5 Hours"
  title: string;
  description: string;
  cost: string;        // e.g. "$10 entry"
  location: string;    // e.g. "Gisozi, Kigali"
  type: ActivityType;
  imageUrl?: string;
  aiPick?: boolean;
}

export interface Day {
  id: string;
  dayNumber: number;   // 1, 2, 3…
  label: string;       // e.g. "Friday – Arrival & History"
  date: string;        // e.g. "Oct 12th"
  activities: Activity[];
}

export interface BudgetCategory {
  label: string;       // e.g. "Accommodation"
  amount: number;      // numeric, e.g. 200
  color: string;       // Tailwind bg class e.g. "bg-orange-400"
  strokeColor: string; // SVG hex for donut e.g. "#F97316"
}

export interface Budget {
  totalMin: number;
  totalMax: number;
  isOnTrack: boolean;
  categories: BudgetCategory[];
}

export interface MapConfig {
  cityLabel: string;      // e.g. "Kigali"
  routeLabel: string;     // e.g. "Route Day 1"
  routeDistance: string;  // e.g. "10km Total"
}

export interface ItineraryData {
  title: string;
  tags: string[];
  daysCount: number;
  nightsCount: number;
  budget: Budget;
  map: MapConfig;
  days: Day[];
  footerText?: string;
}
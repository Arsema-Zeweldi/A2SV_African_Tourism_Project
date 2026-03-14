import type { Metadata } from "next"
import { TripWizard } from "@/components/plan-trip"

export const metadata: Metadata = {
    title: "Plan Your Trip | AMÒNÀ",
    description:
        "Plan your dream African adventure — choose your destination, climate, vibe, and budget.",
}

export default function PlanYourTripPage() {
    return <TripWizard />
}

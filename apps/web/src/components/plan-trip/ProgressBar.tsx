import { cn } from "@/lib/utils"
import { TOTAL_STEPS } from "@/lib/plan-trip-data"

interface ProgressBarProps {
    currentStep: number
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
    return (
        <div className="flex items-center justify-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
                <div
                    key={step}
                    className={cn(
                        "h-0.5 w-10 rounded-full transition-colors duration-300",
                        step <= currentStep ? "bg-[#F28A1E]" : "bg-[#E5DDD0]"
                    )}
                />
            ))}
        </div>
    )
}

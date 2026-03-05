import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { TOTAL_STEPS } from "@/lib/plan-trip-data"

interface WizardFooterProps {
    currentStep: number
    onBack: () => void
    onNext: () => void
}

export function WizardFooter({
    currentStep,
    onBack,
    onNext,
}: WizardFooterProps) {
    const isSummary = currentStep > TOTAL_STEPS

    const buttonLabel = (() => {
        if (currentStep <= 3)
            return (
                <>
                    Continue <ArrowRight className="ml-1 h-4 w-4" />
                </>
            )
        if (currentStep === 4)
            return (
                <>
                    Complete <ArrowRight className="ml-1 h-4 w-4" />
                </>
            )
        return (
            <>
                Generate my itinerary <Sparkles className="ml-1 h-4 w-4" />
            </>
        )
    })()

    return (
        <div className="relative z-10 flex items-center justify-between px-6 pb-4 pt-4 sm:px-12">
            {currentStep > 1 ? (
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[15px] font-medium text-[#7A6B57] transition-colors hover:text-[#2D1B06]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
            ) : (
                <div />
            )}

            <button
                onClick={onNext}
                className={`flex items-center rounded-full bg-gradient-to-r from-[#F59A2B] to-[#ED7F12] px-9 py-3.5 text-[15px] font-bold text-white shadow-md shadow-[#F28A1E]/20 transition-all hover:brightness-110 active:scale-[0.97] ${isSummary ? "px-10 py-4 text-base" : ""
                    }`}
            >
                {buttonLabel}
            </button>
        </div>
    )
}

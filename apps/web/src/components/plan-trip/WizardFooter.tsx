import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { TOTAL_STEPS } from "@/lib/plan-trip-data"

interface WizardFooterProps {
    currentStep: number
    onBack: () => void
    onNext: () => void
    onSubmit?: () => void
    isSubmitting?: boolean
}

export function WizardFooter({
    currentStep,
    onBack,
    onNext,
    onSubmit,
    isSubmitting = false,
}: WizardFooterProps) {
    const isSummary = currentStep > TOTAL_STEPS

    const buttonLabel = (() => {
        if (isSubmitting)
            return (
                <>
                    Generating… <Loader2 className="ml-1 h-4 w-4 animate-spin" />
                </>
            )
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

    const handleClick = () => {
        if (isSummary && onSubmit) {
            onSubmit()
        } else {
            onNext()
        }
    }

    return (
        <div className="relative z-10 flex items-center justify-between px-6 pb-4 pt-4 sm:px-12">
            {currentStep > 1 ? (
                <button
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 text-[15px] font-medium text-[#7A6B57] transition-colors hover:text-[#2D1B06] disabled:opacity-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
            ) : (
                <div />
            )}

            <button
                onClick={handleClick}
                disabled={isSubmitting}
                className={`flex items-center rounded-full bg-gradient-to-r from-[#F59A2B] to-[#ED7F12] px-9 py-3.5 text-[15px] font-bold text-white shadow-md shadow-[#F28A1E]/20 transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed ${isSummary ? "px-10 py-4 text-base" : ""
                    }`}
            >
                {buttonLabel}
            </button>
        </div>
    )
}

import Image from "next/image"
import { X } from "lucide-react"
import { ProgressBar } from "./ProgressBar"
import { STEP_TITLES, TOTAL_STEPS } from "@/lib/plan-trip-data"

interface WizardHeaderProps {
    currentStep: number
    onClose?: () => void
}

export function WizardHeader({ currentStep, onClose }: WizardHeaderProps) {
    const isSummary = currentStep > TOTAL_STEPS

    return (
        <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-1 sm:px-10">

            <div className="flex w-full items-center justify-between">

                <Image
                    src="/images/logo&name.png"
                    alt="Amònà"
                    width={120}
                    height={36}
                    className="h-7 w-auto object-contain"
                    priority
                />

                <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#7A6B57] transition-colors hover:bg-black/5 hover:text-[#2D1B06]"
                    aria-label="Close wizard"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {!isSummary && (
                <div className="mt-2 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#F28A1E]">
                        Plan Your Trip
                    </span>
                    <ProgressBar currentStep={currentStep} />
                    <span className="text-[11px] text-[#7A6B57]">
                        Step {currentStep} of {TOTAL_STEPS} &bull;{" "}
                        {STEP_TITLES[currentStep - 1]}
                    </span>
                </div>
            )}
        </div>
    )
}

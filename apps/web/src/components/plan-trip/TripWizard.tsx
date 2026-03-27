"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { TripFormData } from "@/types/plan-trip"
import { WIZARD_BG, TOTAL_STEPS } from "@/lib/plan-trip-data"
import { generateItinerary, saveItinerary } from "@/actions/planner_actions"

import { WizardHeader } from "./WizardHeader"
import { WizardFooter } from "./WizardFooter"
import { StepDestination } from "./StepDestination"
import { StepClimateVibe } from "./StepClimateVibe"
import { StepDurationBudget } from "./StepDurationBudget"
import { StepAdditionalInfo } from "./StepAdditionalInfo"
import { StepSummary } from "./StepSummary"

const INITIAL_DATA: TripFormData = {
    destination: "",
    multiCountry: false,
    climate: "",
    vibes: [],
    duration: 14,
    budget: 4500,
    groupSize: 1,
    notes: "",
}

export function TripWizard() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<TripFormData>(INITIAL_DATA)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /* ── Helpers ──────────────────────────────────── */

    const updateField = useCallback(
        <K extends keyof TripFormData>(field: K, value: TripFormData[K]) => {
            setFormData((prev) => ({ ...prev, [field]: value }))
        },
        []
    )

    const goToStep = useCallback((step: number) => setCurrentStep(step), [])

    const next = () =>
        setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS + 1))

    const back = () => setCurrentStep((s) => Math.max(s - 1, 1))

    const handleClose = () => {
        if (typeof window !== "undefined") window.history.back()
    }

    const handleGenerate = async () => {
        setIsSubmitting(true)
        setError(null)

        try {
            // Step 1: Generate itinerary via AI
            const genResult = await generateItinerary(formData)

            if (!genResult.success) {
                setError(genResult.error)
                setIsSubmitting(false)
                return
            }

            // Step 2: Save the generated itinerary
            const saveResult = await saveItinerary(genResult.data)

            if (!saveResult.success) {
                setError(saveResult.error)
                setIsSubmitting(false)
                return
            }

            // Step 3: Navigate to the new package builder
            router.push(`/new-package/${saveResult.data.itinerary_id}`)
        } catch {
            setError("Something went wrong. Please try again.")
            setIsSubmitting(false)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepDestination
                        destination={formData.destination}
                        onDestinationChange={(v) => updateField("destination", v)}
                        multiCountry={formData.multiCountry}
                        onMultiCountryChange={(v) => updateField("multiCountry", v)}
                    />
                )
            case 2:
                return (
                    <StepClimateVibe
                        climate={formData.climate}
                        onClimateChange={(v) => updateField("climate", v)}
                        vibes={formData.vibes}
                        onVibesChange={(v) => updateField("vibes", v)}
                    />
                )
            case 3:
                return (
                    <StepDurationBudget
                        duration={formData.duration}
                        onDurationChange={(v) => updateField("duration", v)}
                        budget={formData.budget}
                        onBudgetChange={(v) => updateField("budget", v)}
                        groupSize={formData.groupSize}
                        onGroupSizeChange={(v) => updateField("groupSize", v)}
                    />
                )
            case 4:
                return (
                    <StepAdditionalInfo
                        notes={formData.notes}
                        onNotesChange={(v) => updateField("notes", v)}
                    />
                )
            case 5:
                return (
                    <StepSummary
                        data={{
                            destination: formData.destination,
                            multiCountry: formData.multiCountry,
                            climate: formData.climate,
                            vibes: formData.vibes,
                            duration: formData.duration,
                            budget: formData.budget,
                            groupSize: formData.groupSize,
                        }}
                        onGoToStep={goToStep}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6 font-sans">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <Image
                    src={WIZARD_BG}
                    alt="African savanna sunset"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/5" />
            </div>

            <div className="relative flex w-full max-w-[920px] flex-col overflow-hidden rounded-[2.2rem] border border-transparent bg-[#F5E9D7]/72 shadow-[0_14px_44px_rgba(0,0,0,0.16)] backdrop-blur-2xl">
                {/* Sun glow over the backdrop blur */}
                <div className="pointer-events-none absolute left-1/2 top-[58%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-[90px]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[82px] border-t border-white/35 bg-white/28 backdrop-blur-md" />

                <WizardHeader currentStep={currentStep} onClose={handleClose} />

                <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5 sm:px-12">
                    {renderStep()}

                    {error && (
                        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-[14px] font-medium text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                <WizardFooter
                    currentStep={currentStep}
                    onBack={back}
                    onNext={next}
                    onSubmit={handleGenerate}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    )
}

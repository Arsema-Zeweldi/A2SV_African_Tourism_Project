"use client"

import { Info } from "lucide-react"

interface StepAdditionalInfoProps {
    notes: string
    onNotesChange: (value: string) => void
}

export function StepAdditionalInfo({
    notes,
    onNotesChange,
}: StepAdditionalInfoProps) {
    return (
        <div className="flex flex-col gap-8">
            {/* Heading */}
            <div className="text-center mt-6">
                <h1 className="text-[28px] font-bold text-[#1F160F] sm:text-[32px] text-balance leading-tight">
                    Anything else we should know?
                </h1>
                <p className="mt-3 text-[15px] font-medium text-[#7A6B57]">
                    Help us make your African adventure truly unforgettable by sharing any
                    specific preferences.
                </p>
            </div>

            <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Tell us about special occasions, dietary requirements, or specific landmarks you want to visit..."
                rows={6}
                className="w-full resize-none rounded-[24px] border border-white/40 bg-white/40 p-6 text-[15px] font-medium text-[#1F160F] placeholder:text-[#8C7A6B] focus:border-[#F28A1E]/40 focus:bg-white/60 focus:outline-none focus:ring-4 focus:ring-[#F28A1E]/10 transition-all"
            />

            <div className="flex items-center justify-center gap-2 text-[13px] font-bold text-[#F28A1E]">
                <Info className="h-5 w-5 shrink-0" />
                <span>
                    Our experts will use this to further personalize your itinerary.
                </span>
            </div>
        </div>
    )
}

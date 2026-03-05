"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { CLIMATES, VIBES } from "@/lib/plan-trip-data"
import { Sun, Sparkles } from "lucide-react"

interface StepClimateVibeProps {
    climate: string
    onClimateChange: (value: string) => void
    vibes: string[]
    onVibesChange: (value: string[]) => void
}

export function StepClimateVibe({
    climate,
    onClimateChange,
    vibes,
    onVibesChange,
}: StepClimateVibeProps) {
    const toggleVibe = (id: string) => {
        onVibesChange(
            vibes.includes(id) ? vibes.filter((v) => v !== id) : [...vibes, id]
        )
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Heading */}
            <div className="mt-6 text-center">
                <h1 className="text-[28px] font-bold text-[#1F160F] sm:text-[32px] text-balance leading-tight">
                    Climate &amp; Vibe
                </h1>
                <p className="mt-3 text-[15px] font-medium text-[#7A6B57]">
                    Curate the atmosphere of your perfect African journey.
                </p>
            </div>

            {/* Climate Selection */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 px-1">
                    <Sun className="h-4 w-4 text-[#F28A1E]" />
                    <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#1F160F]">
                        Select Climate
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {CLIMATES.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => onClimateChange(c.id)}
                            className={cn(
                                "group flex flex-col overflow-hidden rounded-[24px] border-2 text-left transition-all",
                                climate === c.id
                                    ? "border-[#F28A1E] shadow-[0_4px_20px_rgba(242,138,30,0.15)] bg-white/90"
                                    : "border-white/50 bg-white/70 hover:border-white/80 shadow-sm"
                            )}
                        >
                            <div className="aspect-[4/3] w-full overflow-hidden">
                                <Image
                                    src={c.image}
                                    alt={c.title}
                                    width={200}
                                    height={150}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex-1 p-3">
                                <p className="text-[15px] font-bold text-[#1F160F]">
                                    {c.title}
                                </p>
                                <p className="mt-0.5 text-[11px] font-medium leading-[1.3] text-[#7A6B57]">
                                    {c.subtitle}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Vibe Selection */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 px-1">
                    <Sparkles className="h-4 w-4 text-[#F28A1E]" />
                    <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#1F160F]">
                        Trip Vibe
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {VIBES.map((vibe) => {
                        const Icon = vibe.icon
                        const isSelected = vibes.includes(vibe.id)
                        return (
                            <button
                                key={vibe.id}
                                onClick={() => toggleVibe(vibe.id)}
                                className={cn(
                                    "flex w-full items-center justify-start gap-2 rounded-full border-2 px-4 py-2.5 text-left text-[14px] font-bold leading-[1.1] transition-all",
                                    isSelected
                                        ? "border-[#F28A1E] bg-[#F28A1E]/10 text-[#1F160F]"
                                        : "border-white/60 bg-white/60 text-[#1F160F] hover:bg-white/80"
                                )}
                            >
                                <Icon className="h-4 w-4 text-[#F28A1E]" />
                                {vibe.label}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

"use client"

import Image from "next/image"
import { Search, Globe } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { POPULAR_GEMS } from "@/lib/plan-trip-data"

interface StepDestinationProps {
    destination: string
    onDestinationChange: (value: string) => void
    multiCountry: boolean
    onMultiCountryChange: (value: boolean) => void
}

export function StepDestination({
    destination,
    onDestinationChange,
    multiCountry,
    onMultiCountryChange,
}: StepDestinationProps) {
    return (
        <div className="flex flex-col gap-8">

            <div className="text-center mt-6">
                <h1 className="text-[28px] font-bold text-[#1F160F] sm:text-[32px] text-balance leading-tight">
                    Where would you like to explore?
                </h1>
                <p className="mt-3 text-[15px] font-medium text-[#7A6B57]">
                    Search for a destination or let fate decide your next adventure.
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8C7A6B]" />
                <input
                    type="text"
                    placeholder="Search country or city..."
                    value={destination}
                    onChange={(e) => onDestinationChange(e.target.value)}
                    className="w-full rounded-full border border-white/60 bg-white/40 py-3.5 pl-14 pr-6 text-sm text-[#2D1B06] placeholder:text-[#8C7A6B] focus:border-[#F28A1E]/40 focus:bg-white/60 focus:outline-none focus:ring-4 focus:ring-[#F28A1E]/10 transition-all font-medium"
                />
            </div>

            <div className="flex items-center justify-between rounded-3xl border border-white/40 bg-white/40 p-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/60 shadow-sm border border-white">
                        <Globe className="h-5 w-5 text-[#F28A1E]" />
                    </div>
                    <div>
                        <p className="text-base font-semibold text-[#1F160F]">
                            Multi-country Trip
                        </p>
                        <p className="text-xs font-medium text-[#7A6B57]">Cross-border itineraries</p>
                    </div>
                </div>
                <Switch
                    checked={multiCountry}
                    onCheckedChange={onMultiCountryChange}
                    className="data-[state=checked]:bg-[#9EC1A3] mr-2"
                />
            </div>

            {/* Surprise Me */}
            <div className="relative flex items-center justify-between gap-4 rounded-3xl border border-white/40 bg-white/40 p-4">
                <div className="min-w-0 pl-1">
                    <p className="text-base font-bold text-[#1F160F]">
                        Feeling adventurous?
                    </p>
                    <p className="text-[13px] font-medium text-[#7A6B57]">
                        Let our experts pick a curated experience based on your vibe.
                    </p>
                </div>
                <button className="mr-1 shrink-0 rounded-full bg-[#F28A1E] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#E97D12] active:scale-[0.97]">
                    Surprise Me
                </button>
            </div>

            <div className="flex flex-col items-center gap-5 mt-4">

                <div className="flex w-full items-center gap-4 px-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#B5A48B]/30" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C7A6B]">
                        Popular Gems
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#B5A48B]/30" />
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {POPULAR_GEMS.map((gem) => (
                        <button
                            key={gem.name}
                            onClick={() => onDestinationChange(gem.name)}
                            className="group flex flex-col items-center gap-2"
                        >
                            <div
                                className={cn(
                                    "h-[68px] w-[68px] overflow-hidden rounded-full border-2 transition-colors",
                                    destination === gem.name
                                        ? "border-[#F28A1E] shadow-md shadow-[#F28A1E]/20"
                                        : "border-[#E5DDD0] group-hover:border-[#F28A1E]/50"
                                )}
                            >
                                <Image
                                    src={gem.image}
                                    alt={gem.name}
                                    width={64}
                                    height={64}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <span className="text-xs font-medium text-[#2D1B06]">
                                {gem.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

"use client"

import {
    CheckCircle2,
    MapPin,
    Sun,
    Compass,
    Calendar,
    Wallet,
    Globe,
} from "lucide-react"
import type { TripFormData, SummaryCard } from "@/types/plan-trip"

interface StepSummaryProps {
    data: Omit<TripFormData, "notes">
    onGoToStep: (step: number) => void
}

function buildSummaryCards(data: Omit<TripFormData, "notes">): SummaryCard[] {
    return [
        {
            icon: MapPin,
            label: "Destination",
            value: data.destination || "Not set",
            extra: data.multiCountry ? "MULTI-COUNTRY: YES" : undefined,
            step: 1,
        },
        {
            icon: Sun,
            label: "Climate",
            value: data.climate
                ? data.climate.charAt(0).toUpperCase() + data.climate.slice(1)
                : "Not set",
            step: 2,
        },
        {
            icon: Compass,
            label: "Vibe",
            value:
                data.vibes.length > 0
                    ? data.vibes
                        .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
                        .join(" & ")
                    : "Not set",
            step: 2,
        },
        {
            icon: Calendar,
            label: "Duration",
            value: `${data.duration} Days`,
            step: 3,
        },
        {
            icon: Wallet,
            label: "Budget (USD)",
            value: `$${data.budget.toLocaleString()}`,
            step: 3,
        },
    ]
}

function SummaryCardItem({
    card,
    onEdit,
}: {
    card: SummaryCard
    onEdit: () => void
}) {
    const Icon = card.icon
    return (
        <div className="flex flex-col rounded-[24px] border border-[#E7D9C6]/70 bg-white/40 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-[#E7D9C6]/70 bg-[#F28A1E]/10">
                    <Icon className="h-5 w-5 text-[#F28A1E]" />
                </div>
                <button
                    onClick={onEdit}
                    className="text-[11px] font-bold uppercase tracking-wide text-[#F28A1E] hover:text-[#E97D12]"
                >
                    Edit
                </button>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C7A6B]">
                {card.label}
            </p>
            <p className="mt-1 text-[17px] font-bold text-[#1F160F]">{card.value}</p>
            {card.extra && (
                <div className="mt-3 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.1em] text-[#7A6B57]">
                    <Globe className="h-3.5 w-3.5" />
                    {card.extra}
                </div>
            )}
        </div>
    )
}

export function StepSummary({ data, onGoToStep }: StepSummaryProps) {
    const cards = buildSummaryCards(data)

    return (
        <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="flex justify-center mt-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E7D9C6]/70 bg-white/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#F28A1E] shadow-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    All Steps Complete
                </span>
            </div>

            <div className="text-center mt-2">
                <h1 className="text-[28px] font-bold text-[#1F160F] sm:text-[32px] text-balance leading-tight">
                    Your African Adventure Summary
                </h1>
                <p className="mt-3 text-[15px] font-medium text-[#7A6B57]">
                    We&apos;ve gathered your preferences. Review your selections before we
                    find your perfect matches.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {cards.slice(0, 3).map((card) => (
                    <SummaryCardItem
                        key={card.label}
                        card={card}
                        onEdit={() => onGoToStep(card.step)}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mx-20">
                {cards.slice(3).map((card) => (
                    <SummaryCardItem
                        key={card.label}
                        card={card}
                        onEdit={() => onGoToStep(card.step)}
                    />
                ))}
            </div>

            <p className="mt-1 px-4 text-center text-[10px] font-medium text-[#7A6B57]/80">
                Disclaimer: We facilitate itinerary generation and community connection.
                On-ground services are managed by third-party agents.
            </p>
        </div>
    )
}

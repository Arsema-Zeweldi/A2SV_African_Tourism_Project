"use client"

import { Calendar, Wallet } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import {
    DURATION_MIN,
    DURATION_MAX,
    BUDGET_MIN,
    BUDGET_MAX,
    BUDGET_STEP,
} from "@/lib/plan-trip-data"

interface StepDurationBudgetProps {
    duration: number
    onDurationChange: (value: number) => void
    budget: number
    onBudgetChange: (value: number) => void
}

export function StepDurationBudget({
    duration,
    onDurationChange,
    budget,
    onBudgetChange,
}: StepDurationBudgetProps) {
    return (
        <div className="flex flex-col gap-8">
            {/* Heading */}
            <div className="text-center mt-6">
                <h1 className="text-[28px] font-bold text-[#1F160F] sm:text-[32px] text-balance leading-tight">
                    Set your duration and budget
                </h1>
                <p className="mt-3 text-[15px] font-medium text-[#7A6B57]">
                    Almost there! Define your timeframe and spending limit so we can find
                    the best matches for your adventure.
                </p>
            </div>

            <div className="rounded-[24px] border border-white/40 bg-white/40 p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] border border-white bg-[#F28A1E]/10">
                            <Calendar className="h-5 w-5 text-[#F28A1E]" />
                        </div>
                        <div>
                            <p className="text-[16px] font-bold text-[#1F160F]">Duration</p>
                            <p className="text-[13px] font-medium text-[#7A6B57]">
                                How many days is your ideal trip?
                            </p>
                        </div>
                    </div>
                    <span className="rounded-full bg-gradient-to-r from-[#F59A2B] to-[#ED7F12] px-5 py-2 text-[15px] font-bold text-white shadow-md shadow-[#F28A1E]/20">
                        {duration}{" "}
                        <span className="text-[11px] font-semibold tracking-wider">DAYS</span>
                    </span>
                </div>

                <Slider
                    value={[duration]}
                    onValueChange={([v]) => onDurationChange(v)}
                    min={DURATION_MIN}
                    max={DURATION_MAX}
                    step={1}
                    className="trip-slider mb-3 py-2 cursor-pointer"
                />

                <div className="flex justify-between px-1 text-[11px] font-bold uppercase tracking-widest text-[#7A6B57]">
                    <span>1 DAY</span>
                    <span>15 DAYS</span>
                    <span>30+ DAYS</span>
                </div>
            </div>

            <div className="rounded-[24px] border border-white/40 bg-white/40 p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] border border-white bg-[#F28A1E]/10">
                            <Wallet className="h-5 w-5 text-[#F28A1E]" />
                        </div>
                        <div>
                            <p className="text-[16px] font-bold text-[#1F160F]">Budget (USD)</p>
                            <p className="text-[13px] font-medium text-[#7A6B57]">
                                Estimated spend per person
                            </p>
                        </div>
                    </div>
                    <span className="rounded-full bg-gradient-to-r from-[#F59A2B] to-[#ED7F12] px-5 py-2 text-[15px] font-bold text-white shadow-md shadow-[#F28A1E]/20">
                        ${budget.toLocaleString()}
                    </span>
                </div>

                <Slider
                    value={[budget]}
                    onValueChange={([v]) => onBudgetChange(v)}
                    min={BUDGET_MIN}
                    max={BUDGET_MAX}
                    step={BUDGET_STEP}
                    className="trip-slider mb-3 py-2 cursor-pointer"
                />

                <div className="flex justify-between px-1 text-[11px] font-bold uppercase tracking-widest text-[#7A6B57]">
                    <span>$500</span>
                    <span>$5,000</span>
                    <span>$10,000+</span>
                </div>
            </div>
        </div>
    )
}

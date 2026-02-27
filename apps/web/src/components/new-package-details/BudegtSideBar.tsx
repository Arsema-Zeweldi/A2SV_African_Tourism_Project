// src/components/BudgetSidebar.tsx

import { Info } from "lucide-react";
import { Budget, BudgetCategory } from "../../types/new-package";

// ── Donut chart — segments are calculated dynamically from data ───────────────
function DonutChart({ categories }: { categories: BudgetCategory[] }) {
  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  let offsetAccum = 0;
  const segments = categories.map((cat) => {
    const dash = (cat.amount / total) * circumference;
    const gap = circumference - dash;
    const offset = -offsetAccum;
    // eslint-disable-next-line react-hooks/immutability
    offsetAccum += dash;
    return { ...cat, dash, gap, offset };
  });

  return (
    <div className="flex justify-center mb-3">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="12"
          />
          {/* Segments */}
          {segments.map((seg) => (
            <circle
              key={seg.label}
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={seg.strokeColor}
              strokeWidth="12"
              strokeDasharray={`${seg.dash} ${seg.gap}`}
              strokeDashoffset={seg.offset}
              transform="rotate(-90 50 50)"
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-400 leading-none">TOTAL</span>
          <span className="text-base font-black text-gray-900">${total}</span>
        </div>
      </div>
    </div>
  );
}

interface BudgetSidebarProps {
  budget: Budget;
}

export function BudgetSidebar({ budget }: BudgetSidebarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900">Budget Est.</h3>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            budget.isOnTrack
              ? "text-emerald-500 bg-emerald-50 border-emerald-100"
              : "text-red-500 bg-red-50 border-red-100"
          }`}
        >
          {budget.isOnTrack ? "On Track" : "Over Budget"}
        </span>
      </div>

      {/* Donut */}
      <DonutChart categories={budget.categories} />

      {/* Category breakdown */}
      <div className="space-y-2">
        {budget.categories.map((cat) => (
          <div key={cat.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
              <span className="text-gray-500">{cat.label}</span>
            </div>
            <span className="font-semibold text-gray-800">${cat.amount}</span>
          </div>
        ))}
      </div>

      {/* Footnote */}
      <p className="mt-2 text-[9px] text-gray-400 flex items-center gap-0.5">
        <Info size={8} />
        Real cost ranges sourced from local APIs.
      </p>
    </div>
  );
}
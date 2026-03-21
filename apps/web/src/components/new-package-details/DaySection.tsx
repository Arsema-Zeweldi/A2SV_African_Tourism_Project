// src/components/DaySection.tsx

import { Plus } from "lucide-react";
import { Day } from "../../types/new-package";
import { ActivityCard } from "./ActivityCard";

interface DaySectionProps {
  day: Day;
  isFirst?: boolean;
  onDeleteActivity?: (activityId: string) => void;
  onAddActivity?: (dayId: string) => void;
}

export function DaySection({
  day,
  isFirst = false,
  onDeleteActivity,
  onAddActivity,
}: DaySectionProps) {
  const hasActivities = day.activities.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden">

      {/* ── Day header ── */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50">
        <span
          className={`text-[11px] font-bold px-3 py-1 rounded-full ${
            isFirst
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Day {day.dayNumber}
        </span>

        <div>
          <span className="text-sm font-bold text-gray-900">{day.label}</span>
          <span className="ml-2 text-xs text-gray-400">{day.date}</span>
        </div>
      </div>

      {/* ── Activity list ── */}
      <div className="p-4 space-y-3">
        {hasActivities ? (
          day.activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onDelete={onDeleteActivity}
            />
          ))
        ) : (
          <div className="h-16 rounded-xl bg-linear-to-r from-gray-50 to-gray-100 flex items-center justify-center">
            <span className="text-xs text-gray-400">
              No activities yet — add one below
            </span>
          </div>
        )}

        {/* Add activity */}
        <button
          onClick={() => onAddActivity?.(day.id)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange-500 transition-colors px-1 py-1 group"
        >
          <span className="w-5 h-5 rounded-full border-2 border-dashed border-gray-200 group-hover:border-orange-300 flex items-center justify-center transition-colors">
            <Plus size={9} />
          </span>
          Add Activity
        </button>
      </div>
    </div>
  );
}
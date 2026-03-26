"use client"

import {
  X,
  Clock,
  DollarSign,
  MapPin,
  Zap,
  Landmark,
  UtensilsCrossed,
  Footprints,
  BedDouble,
  Car,
} from "lucide-react"
import type { Activity, ActivityType } from "@/types/new-package"

const ACTIVITY_STYLE: Record<
  ActivityType,
  { bg: string; label: string; icon: React.ReactNode }
> = {
  monument: {
    bg: "bg-orange-100 text-orange-500",
    label: "Culture & Monument",
    icon: <Landmark size={15} />,
  },
  food: {
    bg: "bg-green-100 text-green-600",
    label: "Food & Dining",
    icon: <UtensilsCrossed size={15} />,
  },
  tour: {
    bg: "bg-purple-100 text-purple-500",
    label: "Tour & Adventure",
    icon: <Footprints size={15} />,
  },
  accommodation: {
    bg: "bg-sky-100 text-sky-500",
    label: "Accommodation",
    icon: <BedDouble size={15} />,
  },
  transport: {
    bg: "bg-gray-100 text-gray-500",
    label: "Transport",
    icon: <Car size={15} />,
  },
}

interface ActivityDetailModalProps {
  activity: Activity | null
  onClose: () => void
}

export function ActivityDetailModal({
  activity,
  onClose,
}: ActivityDetailModalProps) {
  if (!activity) return null

  const style = ACTIVITY_STYLE[activity.type] ?? ACTIVITY_STYLE.tour

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Hero / header area */}
        {activity.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-28 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${style.bg}`}
            >
              {style.icon}
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-gray-600 hover:text-gray-900 shadow transition-colors"
        >
          <X size={15} />
        </button>

        {/* Content */}
        <div className="p-5">
          {/* Type badge + AI pick */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${style.bg}`}
            >
              {style.icon}
              {style.label}
            </span>
            {activity.aiPick && (
              <span className="flex items-center gap-0.5 bg-violet-50 text-violet-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-violet-100">
                <Zap size={9} /> AI Pick
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">
            {activity.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            {activity.description}
          </p>

          {/* Meta grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 mb-0.5">Start Time</p>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                <Clock size={11} className="text-gray-400" />
                {activity.time}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 mb-0.5">Duration</p>
              <p className="text-sm font-bold text-gray-900">
                {activity.duration}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 mb-0.5">Est. Cost</p>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-0.5">
                <DollarSign size={11} className="text-gray-400" />
                {activity.cost}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
            <MapPin size={14} className="text-orange-400 shrink-0" />
            {activity.location}
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

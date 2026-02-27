// src/components/ActivityCard.tsx

import {
    Clock,
    DollarSign,
    MapPin,
    Zap,
    Maximize2,
    Trash2,
    Landmark,
    UtensilsCrossed,
    Footprints,
    BedDouble,
    Car,
  } from "lucide-react";
  import { Activity, ActivityType } from "../../types/new-package";
  
  // ── Map activity type → icon + colour ────────────────────────────────────────
  const ACTIVITY_STYLE: Record<
    ActivityType,
    { bg: string; icon: React.ReactNode }
  > = {
    monument:      { bg: "bg-orange-100 text-orange-500", icon: <Landmark size={14} /> },
    food:          { bg: "bg-green-100 text-green-600",   icon: <UtensilsCrossed size={14} /> },
    tour:          { bg: "bg-purple-100 text-purple-500", icon: <Footprints size={14} /> },
    accommodation: { bg: "bg-sky-100 text-sky-500",       icon: <BedDouble size={14} /> },
    transport:     { bg: "bg-gray-100 text-gray-500",     icon: <Car size={14} /> },
  };
  
  interface ActivityCardProps {
    activity: Activity;
    onDelete?: (id: string) => void;
  }
  
  export function ActivityCard({ activity, onDelete }: ActivityCardProps) {
    const style = ACTIVITY_STYLE[activity.type] ?? ACTIVITY_STYLE.tour;
  
    return (
      <div className="group relative flex gap-3 bg-white rounded-xl p-3 shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_3px_12px_rgba(0,0,0,0.12)] transition-all duration-200">
  
        {/* Left: type icon + vertical connector */}
        <div className="flex flex-col items-center gap-1 pt-0.5 min-w-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${style.bg}`}>
            {style.icon}
          </div>
          <div className="flex-1 w-px bg-gray-100 min-h-2" />
        </div>
  
        {/* Center: all text content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: time + duration + AI badge */}
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-xs font-semibold text-gray-800">{activity.time}</span>
  
            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
              <Clock size={9} /> {activity.duration}
            </span>
  
            {activity.aiPick && (
              <span className="flex items-center gap-0.5 bg-violet-50 text-violet-600 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-violet-100">
                <Zap size={8} /> AI Pick
              </span>
            )}
          </div>
  
          {/* Title */}
          <h4 className="text-sm font-bold text-gray-900 mb-0.5">{activity.title}</h4>
  
          {/* Description */}
          <p className="text-[11px] text-gray-500 leading-relaxed mb-1.5">
            {activity.description}
          </p>
  
          {/* Cost + location meta */}
          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-0.5">
              <DollarSign size={9} /> {activity.cost}
            </span>
            <span className="flex items-center gap-0.5">
              <MapPin size={9} /> {activity.location}
            </span>
          </div>
        </div>
  
        {/* Right: thumbnail + hover actions */}
        <div className="flex flex-col items-end gap-1 ml-1 shrink-0">
          {activity.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activity.imageUrl}
              alt={activity.title}
              className="w-16 h-14 rounded-lg object-cover bg-gray-100"
            />
          ) : (
            <div className="w-16 h-14 rounded-lg bg-gray-100" />
          )}
  
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              aria-label="Expand"
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Maximize2 size={10} />
            </button>
            {onDelete && (
              <button
                aria-label="Delete activity"
                onClick={() => onDelete(activity.id)}
                className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={10} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
import React from 'react'
import { Calendar, Bus, AlertTriangle } from 'lucide-react'
import type { Itinerary as PackageDetailsItineraryItem } from '@/types/package-details'

interface ItineraryProps {
  props: PackageDetailsItineraryItem[]
}

const TimelineItem = ({
  day,
  title,
  desc,
  cost,
  requirement,
  isLast,
}: {
  day: number
  title: string
  desc: string
  cost?: string
  requirement?: string
  isLast?: boolean
}) => (
  <div className={`relative pl-7 ${isLast ? '' : 'pb-7'}`}>
    {/* Timeline dot */}
    <div className="absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full bg-primary border-[3px] border-white ring-1 ring-primary" />

    <span className="block text-primary font-extrabold text-[9px] uppercase tracking-widest mb-1">
      Day {day}
    </span>
    <h3 className="text-[13px] font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-[11px] text-slate-500 leading-relaxed pr-3">{desc}</p>

    {/* Requirement badge — styled like Figma */}
    {requirement && (
      <div className="mt-3 flex flex-wrap gap-2">
        <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/15 px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
            <Bus size={13} className="text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-800">{requirement}</p>
            {cost && (
              <p className="text-[10px] text-slate-400">{cost}</p>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
)

const Itenerary = ({ props }: ItineraryProps) => {
  if (props.length === 0) {
    return (
      <div>
        <h2 className="text-[15px] font-bold mb-4 flex items-center gap-2">
          <Calendar size={17} className="text-primary" /> Itinerary
        </h2>
        <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl border border-dashed border-slate-200">
          <AlertTriangle size={20} className="text-slate-300 mb-2" />
          <p className="text-xs text-slate-400">No itinerary items yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-[15px] font-bold mb-4 flex items-center gap-2">
        <Calendar size={17} className="text-primary" /> Itinerary
      </h2>
      <div className="ml-1.5 border-l border-slate-200 flex flex-col">
        {props.map((item, index) => (
          <TimelineItem
            key={index}
            day={item.day}
            title={item.name}
            desc={item.description}
            cost={item.cost}
            requirement={item.requirement}
            isLast={index === props.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

export default Itenerary

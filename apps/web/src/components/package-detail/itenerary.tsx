import React from 'react'
import { Bus, Calendar } from 'lucide-react';
import { Itinerary } from '@/app/package-details/data';

interface ItineraryProps {
    props: Itinerary[];
}

const TimelineItem = ({
  day, title, desc, children, isLast,
}: {
  day: number; title: string; desc: string; children?: React.ReactNode; isLast?: boolean;
}) => (
  <div className={`relative pl-7 ${isLast ? '' : 'pb-7'}`}>
    <div className="absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full bg-[#F97316] border-[3px] border-white ring-1 ring-[#F97316]" />
    <span className="block text-[#F97316] font-extrabold text-[9px] uppercase tracking-widest mb-1">Day {day}</span>
    <h3 className="text-[13px] font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-[11px] text-slate-500 leading-relaxed pr-3">{desc}</p>
    {children}
  </div>
);

const Itenerary = ({ props }: ItineraryProps) => {
  return (
    <div>
        <h2 className="text-[15px] font-bold mb-4 flex items-center gap-2">
            <Calendar size={17} className="text-[#F97316]" /> Itinerary
        </h2>
        <div className="ml-1.5 border-l border-slate-200 flex flex-col">
          {props.map((item, index) => (
            <TimelineItem day={item.day} title={item.name} desc={item.description} key={index}>
               {item.requirement &&
                  <div className="mt-3 bg-[#F2EAE8] border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                      <div className="bg-white p-1.5 rounded-lg shadow-sm"><Bus size={13} className="text-[#F97316]" /></div>
                      <div>
                      <div><p className="text-[11px] font-bold text-slate-800">{item.requirement}</p>
                      <p className="text-[10px] text-slate-400">{item.cost}</p>
                      </div>
                      </div>
                  </div> 
              }
            </TimelineItem>
            ))}
        </div>
    </div>
  )
}

export default Itenerary
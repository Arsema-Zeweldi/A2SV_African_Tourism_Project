import React from 'react'
import { Play } from 'lucide-react'

interface PackageDetailsProps {
  props: { thumbnail?: string; description?: string; } | undefined;
}

const Video = ({ props }: PackageDetailsProps) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-100 cursor-pointer group">
        <img
        src= {props?.thumbnail}
        alt="Video thumbnail"
        className="w-full object-cover h-full group-hover:scale-[1.01] transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-[#F97316] flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Play fill="white" size={22} className="ml-1" />
        </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-14 bg-gradient-to-t from-black/65 to-transparent flex items-center gap-3">
        <span className="bg-[#e11d48] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
            Viral Moment
        </span>
        <span className="text-white text-[12px] font-medium">
            {props?.description}
        </span>
        </div>
    </div>
  )
}

export default Video
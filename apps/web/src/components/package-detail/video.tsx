import React from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface PackageDetailsProps {
  props: { thumbnail?: string; description?: string } | undefined
}

const Video = ({ props }: PackageDetailsProps) => {
  if (!props?.thumbnail) {
    return null
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-100 cursor-pointer group aspect-video bg-slate-100">
      <Image
        src={props.thumbnail}
        alt="Video thumbnail"
        fill
        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
        unoptimized
      />
      <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
          <Play fill="white" size={22} className="ml-1 text-white" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-14 bg-gradient-to-t from-black/70 to-transparent flex items-center gap-3">
        <span className="bg-[#e11d48] text-white text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-wider shrink-0">
          Viral Moment
        </span>
        <span className="text-white text-xs font-medium line-clamp-1">
          {props.description}
        </span>
      </div>
    </div>
  )
}

export default Video

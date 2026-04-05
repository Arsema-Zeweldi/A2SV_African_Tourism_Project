import React from 'react'
import Link from 'next/link'
import { Plane } from 'lucide-react'

interface VisaCardProps {
  destination?: string
}

const VisaCard = ({ destination }: VisaCardProps) => {
  const place = destination || 'your destination'

  return (
    <div className="bg-[#FEF6F0] rounded-2xl border border-orange-100 px-5 py-6 text-center">
      <div className="flex justify-center mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          <Plane size={22} className="text-primary" />
        </div>
      </div>
      <h3 className="text-sm font-black text-slate-800 mb-2">Need a Visa?</h3>
      <p className="text-[11px] text-slate-500 leading-relaxed mb-4 px-2">
        Check visa requirements, safety tips, and travel info for {place}.
      </p>
      <Link
        href="/guides"
        className="text-primary text-xs font-bold flex items-center justify-center gap-1 mx-auto hover:underline"
      >
        View Travel Guide &rarr;
      </Link>
    </div>
  )
}

export default VisaCard

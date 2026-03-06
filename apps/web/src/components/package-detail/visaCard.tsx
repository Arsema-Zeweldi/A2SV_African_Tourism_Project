import React from 'react'
import { Plane } from 'lucide-react'

const VisaCard = () => {
  return (
    <div className="bg-[#FEF6F0] rounded-2xl border border-orange-100 px-5 py-6 text-center">
        <div className="flex justify-center mb-3">
        <Plane size={26} className="text-[#F97316]" />
        </div>
        <h3 className="text-[14px] font-black text-slate-800 mb-2">Need a Visa?</h3>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-4 px-2">
        Get your Benin Republic transit visa processed in 24 hours.
        </p>
        <button className="text-[#F97316] text-[12px] font-bold flex items-center justify-center gap-1 mx-auto hover:underline">
        Check Eligibility →
        </button>
    </div>
  )
}

export default VisaCard
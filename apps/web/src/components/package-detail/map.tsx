import React from 'react'
import { Map as MapIcon } from 'lucide-react'

const Map = () => {
  return (
    <div>
        <h2 className="text-[15px] font-bold mb-4 flex items-center gap-2">
            <MapIcon size={17} className="text-[#F97316]" /> Route Map
        </h2>
        <div className="bg-[#f8f9fa] rounded-2xl border border-slate-200 p-2 flex flex-col gap-2">
            <div className="relative rounded-xl overflow-hidden h-[250px]">
            <img
                src="/images/map-image.png"
                className="w-full object-cover h-full opacity-55 grayscale"
                alt="Map"
            />
            <div className="absolute top-2 right-2 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <button className="block px-2.5 py-1.5 text-base font-medium text-slate-600 border-b border-slate-100 hover:bg-slate-50 leading-none">+</button>
                <button className="block px-2.5 py-1.5 text-base font-medium text-slate-600 hover:bg-slate-50 leading-none">−</button>
            </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex justify-between items-center relative">
            <div className="absolute top-1/2 left-10 right-10 h-[2px] bg-orange-100 -z-0" />
            {[
                { name: 'Lagos', sub: 'Start', active: true },
                { name: 'Lomé', sub: 'Stopover', active: false },
                { name: 'Accra', sub: 'End', active: false },
            ].map((stop) => (
                <div key={stop.name} className="flex flex-col items-center z-10 bg-white px-2">
                <div className={`w-2.5 h-2.5 rounded-full mb-1 ${stop.active ? 'bg-[#F97316]' : 'bg-orange-200'}`} />
                <span className="text-[10px] font-black text-slate-800">{stop.name}</span>
                <span className="text-[9px] text-slate-400">{stop.sub}</span>
                </div>
            ))}
            </div>
        </div>
    </div>
  )
}

export default Map
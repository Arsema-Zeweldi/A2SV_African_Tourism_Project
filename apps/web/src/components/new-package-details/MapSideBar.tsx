// src/components/MapSidebar.tsx
//
// Currently renders a decorative SVG map.
// To use a real map, replace the <MapVisual> component body
// with your preferred embed: Google Maps, Mapbox, Leaflet, etc.

import { Expand } from "lucide-react";
import { MapConfig } from "../../types/new-package";

interface MapSidebarProps {
  config: MapConfig;
  onExpand?: () => void;
}

function MapVisual({
  cityLabel,
  onExpand,
}: {
  cityLabel: string;
  onExpand?: () => void;
}) {
  return (
    <div className="relative w-full h-full bg-[#dce8d8]">
      {/* ── Replace this <svg> with a real map embed if needed ── */}
      <svg
        viewBox="0 0 340 150"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="340" height="150" fill="#dce8d8" />
        {/* Roads */}
        <line x1="0" y1="75" x2="340" y2="75" stroke="#c5d5c0" strokeWidth="8" />
        <line x1="170" y1="0" x2="170" y2="150" stroke="#c5d5c0" strokeWidth="6" />
        <line x1="60" y1="0" x2="110" y2="150" stroke="#c5d5c0" strokeWidth="3" />
        <line x1="240" y1="0" x2="290" y2="150" stroke="#c5d5c0" strokeWidth="3" />
        <line x1="0" y1="30" x2="340" y2="45" stroke="#c5d5c0" strokeWidth="3" />
        <line x1="0" y1="115" x2="340" y2="105" stroke="#c5d5c0" strokeWidth="3" />
        {/* Green patches */}
        <rect x="20" y="20" width="50" height="35" rx="4" fill="#b8ceb4" opacity="0.6" />
        <rect x="210" y="85" width="60" height="40" rx="4" fill="#b8ceb4" opacity="0.6" />
        <rect x="130" y="100" width="40" height="30" rx="4" fill="#b8ceb4" opacity="0.5" />
        {/* City label */}
        <text
          x="168"
          y="20"
          fontSize="9"
          fill="#555"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          {cityLabel}
        </text>
        {/* Activity pins */}
        <circle cx="158" cy="55" r="7" fill="#F97316" opacity="0.9" />
        <circle cx="158" cy="55" r="3" fill="white" />
        <circle cx="200" cy="80" r="7" fill="#F97316" opacity="0.9" />
        <circle cx="200" cy="80" r="3" fill="white" />
        <circle cx="130" cy="90" r="7" fill="#F97316" opacity="0.9" />
        <circle cx="130" cy="90" r="3" fill="white" />
        {/* Dashed route line */}
        <path
          d="M158 55 Q175 68 200 80 Q165 85 130 90"
          stroke="#F97316"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          fill="none"
        />
      </svg>

      {/* Expand button overlay */}
      <button
        onClick={onExpand}
        className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 text-xs text-gray-700 px-2 py-1 rounded shadow hover:bg-white transition-colors font-medium"
      >
        <Expand size={10} /> Expand
      </button>
    </div>
  );
}

export function MapSidebar({ config, onExpand }: MapSidebarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden">
      <div className="h-44">
        <MapVisual cityLabel={config.cityLabel} onExpand={onExpand} />
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-50">
        <span className="text-xs font-semibold text-gray-700">
          {config.routeLabel}
        </span>
        <span className="text-xs text-gray-400">{config.routeDistance}</span>
      </div>
    </div>
  );
}
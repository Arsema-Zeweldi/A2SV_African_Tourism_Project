import { Info } from "lucide-react"

export default function Desclaimer() {
  return (
    <div className="flex items-center justify-center mb-5">
        <div className="flex gap-2 items-center rounded-2xl text-sm bg-amber-50 p-4 text-amber-700">
        <Info/>
        Disclaimer: We facilitate itinerary generation and community connection via package
        chats. We do not provide on-ground staff or tour guides. All on-site services are 
        managed by third-party travel agents and guides.
    </div>
    </div>
  )
}

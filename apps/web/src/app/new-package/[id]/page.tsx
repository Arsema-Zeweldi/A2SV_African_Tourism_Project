import { apiFetch } from "@/lib/api"
import { itineraryResponseToItineraryData } from "@/lib/mappers"
import type { ItineraryResponse } from "@/types/api"
import { ItineraryPage } from "@/components/new-package-details/ItineraryPage"
import Navbar from "@/components/navbar"
import FooterSimple from "@/components/footerSimple"
import Disclaimer from "@/components/Disclaimer"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  let itineraryData

  try {
    const response = await apiFetch<ItineraryResponse>(`/itineraries/${id}`)
    itineraryData = itineraryResponseToItineraryData(response)
  } catch {
    // If the API call fails, show an error state
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f5f3]">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-8 py-6 text-center">
            <h2 className="text-xl font-bold text-red-700">
              Failed to load itinerary
            </h2>
            <p className="mt-2 text-sm text-red-600">
              The itinerary could not be found or you may not have permission to
              view it.
            </p>
          </div>
        </div>
        <FooterSimple />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <ItineraryPage data={itineraryData} itineraryId={id} />
      <Disclaimer />
      <FooterSimple />
    </div>
  )
}

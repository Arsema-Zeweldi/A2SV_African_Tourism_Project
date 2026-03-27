import Navbar from '@/components/navbar'
import FooterSimple from '@/components/footerSimple'
import { MyTripsHeader } from '@/components/my-trips/MyTripsHeader'
import { TripsOverview } from '@/components/my-trips/TripsOverview'
import { UpcomingAdventures } from '@/components/my-trips/UpcomingAdventures'
import { PastAdventures } from '@/components/my-trips/PastAdventures'
import { TripSidebar } from '@/components/my-trips/TripSidebar'

export function MyTripsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 overflow-x-hidden">
      <Navbar />
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col lg:flex-row">
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 lg:py-12 lg:pr-12">
            <MyTripsHeader />
            <div className="mt-10 flex min-w-0 flex-col gap-10">
              <TripsOverview />
              <UpcomingAdventures />
              <PastAdventures />
            </div>
          </main>
          <aside className="w-full lg:w-[320px] bg-white px-4 sm:px-6 lg:px-8 py-10 lg:py-12 relative">
            <div className="absolute inset-y-0 right-[-100vw] w-[100vw] bg-white hidden lg:block" />
            <div className="relative z-10">
              <TripSidebar />
            </div>
          </aside>
        </div>
      </div>
      <FooterSimple />
    </div>
  )
}

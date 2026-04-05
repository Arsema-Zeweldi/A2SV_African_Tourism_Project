import Navbar from '@/components/navbar'
import FooterSimple from '@/components/footerSimple'
import MyPackagesPageShell from '@/components/my-packages/page-shell'
import Link from 'next/link'
import { fetchUserItineraries } from '@/actions/itinerary_actions'
import { Clock, MapPin, CalendarCheck } from 'lucide-react'
import type { MyPackagesPageData } from '@/types/my-packages'

function buildPageData(): MyPackagesPageData {
  return {
    title: 'Past Trips',
    description:
      'Revisit completed adventures and itineraries from previous journeys.',
    sidebar: {
      dashboardItems: [
        { label: 'Current Packages', icon: 'package', href: '/my-packages' },
        {
          label: 'Saved for Later',
          icon: 'bookmark',
          href: '/my-packages/saved-for-later',
        },
        {
          label: 'Past Trips',
          icon: 'history',
          active: true,
          href: '/my-packages/past-trips',
        },
      ],
      preferenceItems: [
        { label: 'Account Settings', icon: 'settings', href: '/profile' },
        {
          label: 'Support Center',
          icon: 'support',
          href: '/my-packages/support-center',
        },
      ],
      tipCard: {
        title: 'Memory Tip',
        description:
          'Review older itineraries to reuse what worked well for your next trip planning session.',
      },
    },
    packages: [],
    recommendations: [],
  }
}

const PastTripsPage = async () => {
  const result = await fetchUserItineraries()
  const allItineraries = result.success ? (result.data.data ?? []) : []

  const now = new Date()
  const pastTrips = allItineraries.filter((i) => {
    if (i.end_date) return new Date(i.end_date) <= now
    if (i.start_date && i.days_count) {
      const end = new Date(i.start_date)
      end.setDate(end.getDate() + i.days_count - 1)
      return end <= now
    }
    // No dates set — treat as planned/unscheduled, show here
    return !i.start_date
  })

  const pageData = buildPageData()

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-900">
      <Navbar />
      <MyPackagesPageShell details={pageData}>
        {pastTrips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DDD2CA] bg-white p-12 text-center">
            <CalendarCheck
              size={40}
              className="mx-auto text-gray-300 mb-4"
            />
            <h2 className="text-lg font-semibold text-slate-700 mb-2">
              No past trips yet
            </h2>
            <p className="text-sm text-[#7A716D] mb-6">
              Once you complete trips or create itineraries, they will appear
              here.
            </p>
            <Link
              href="/plan-your-trip"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              Plan Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pastTrips.map((trip) => (
              <div
                key={trip.itinerary_id}
                className="rounded-2xl border border-[#E6E0DA] bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-[15px] text-slate-900 line-clamp-2">
                    {trip.title}
                  </h3>
                  <span className="shrink-0 ml-2 rounded-full bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-0.5">
                    Completed
                  </span>
                </div>

                {trip.activities?.[0]?.location && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                    <MapPin size={12} />
                    {trip.activities[0].location}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {trip.days_count ?? 0} days, {trip.nights_count ?? 0} nights
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/new-package/${trip.itinerary_id}`}
                    className="flex-1 text-center rounded-xl border border-[#E7E0DA] bg-[#F3F1EE] px-3 py-2.5 text-xs font-semibold text-[#5F5A56] hover:bg-[#ebe7e2] transition-colors"
                  >
                    View Itinerary
                  </Link>
                  <Link
                    href="/plan-your-trip"
                    className="flex-1 text-center rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
                  >
                    Plan Similar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </MyPackagesPageShell>
      <FooterSimple />
    </div>
  )
}

export default PastTripsPage

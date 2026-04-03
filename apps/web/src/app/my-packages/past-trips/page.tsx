import Navbar from '@/components/navbar'
import MyPackagesPageShell from '@/components/my-packages/page-shell'
import type { MyPackagesPageData } from '@/types/my-packages'
import FooterSimple from '@/components/footerSimple'

const pastTripsData: MyPackagesPageData = {
  title: 'Past Trips',
  description:
    'Revisit completed adventures, highlights, and itineraries from previous journeys.',
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
  packages: [
    {
      id: 'past-serengeti-safari',
      title: 'Serengeti Migration Safari',
      location: 'Serengeti, Tanzania',
      image: '/images/elephant.png',
      status: {
        label: 'Completed',
        tone: 'success',
      },
      nextLabel: 'Completed On',
      nextValue: 'Oct 20, 2025',
      metaLabel: 'Guests',
      metaValue: '2 Adults',
      actions: [
        { label: 'View Itinerary', variant: 'secondary', href: '/my-trips' },
        {
          label: 'Plan Similar Trip',
          variant: 'primary',
          href: '/plan-your-trip',
        },
      ],
    },
    {
      id: 'past-masai-cultural',
      title: 'Masai Mara Cultural Trail',
      location: 'Narok County, Kenya',
      image: '/images/village.png',
      status: {
        label: 'Completed',
        tone: 'success',
      },
      nextLabel: 'Completed On',
      nextValue: 'Dec 12, 2025',
      metaLabel: 'Group',
      metaValue: '4 Travelers',
      actions: [
        { label: 'View Itinerary', variant: 'secondary', href: '/my-trips' },
        {
          label: 'Plan Similar Trip',
          variant: 'primary',
          href: '/plan-your-trip',
        },
      ],
    },
  ],
  recommendations: [],
}

const PastTripsPage = () => {
  return (
    <div className="min-h-screen bg-[#FCFAF8] font-sans text-slate-900">
      <Navbar />
      <MyPackagesPageShell details={pastTripsData} />
      <FooterSimple />
    </div>
  )
}

export default PastTripsPage

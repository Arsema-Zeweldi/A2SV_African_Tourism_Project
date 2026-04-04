import React from 'react'
import Image from 'next/image'
import {
  Share2,
  Heart,
  CheckCircle,
  Eye,
  RefreshCcw,
  Info,
  Navigation,
} from 'lucide-react'
import Link from 'next/link'
import CommunityChat from '@/components/package-detail/communityChat'
import Reviews from '@/components/package-detail/reviews'
import Itenerary from '@/components/package-detail/itenerary'
import CostBreakdown from '@/components/package-detail/costBreakdown'
import VisaCard from '@/components/package-detail/visaCard'
import Map from '@/components/package-detail/map'
import Video from '@/components/package-detail/video'
import { getPackageDetailsPageData } from '@/lib/package-data'
import Navbar from '@/components/navbar'
import FooterSimple from '@/components/footerSimple'
import { ShareButton, SaveButton } from './action-buttons'

interface PackageDetailsPageProps {
  params: {
    id: string
  }
}

const PackageDetailsPage = async ({ params }: PackageDetailsPageProps) => {
  const resolvedParams = await params

  const id = resolvedParams.id

  const details = await getPackageDetailsPageData(id).catch(() => null)

  if (!details) {
    return (
      <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-900">
        <Navbar />
        <main className="mx-auto max-w-[960px] px-6 py-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-black text-slate-900">
              Package unavailable
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              The selected package could not be loaded right now.
            </p>
            <Link
              href="/my-packages"
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Back to My Packages
            </Link>
          </div>
        </main>
        <FooterSimple />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-900">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-7 pb-16">
        {/* ── TOP GRID: Hero + Chat ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 mb-0">
          {/* Hero */}
          <section className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-sm bg-slate-200">
            <Image
              src={details.image}
              alt={details.name}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {details.isPublic ? 'Public' : 'Private'}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1 rounded-full border border-white/25 flex items-center gap-1.5">
                  <CheckCircle size={11} /> AI Verified
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1 rounded-full border border-white/25 flex items-center gap-1.5">
                  <Eye size={11} /> {details.viewsCount} Views
                </span>
              </div>

              <h1 className="text-2xl sm:text-[32px] md:text-4xl font-black text-white leading-tight max-w-lg tracking-tight mb-5">
                {details.name}
              </h1>

              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-white/30">
                    <Image
                      src={details.owner.avatar}
                      alt={details.owner.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="text-white/70 text-[11px] mb-0.5">
                      Created by
                    </p>
                    <p className="text-white font-bold text-[13px] flex items-center gap-1">
                      @{details.owner.name}{' '}
                      <CheckCircle size={13} className="text-blue-400" />
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-[11px] mb-0.5">
                    Estimated Cost
                  </p>
                  <p className="text-white text-2xl font-extrabold">
                    {details.cost}{' '}
                    <span className="text-[11px] font-normal opacity-75">
                      / person
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <CommunityChat packageId={id} props={details.communityChat} />
        </div>
        {/* /top-grid */}

        {/* ── Action Bar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4 border-b border-slate-100 mb-7">
          <div className="flex items-center gap-2 text-[#926154] text-xs font-medium">
            <RefreshCcw size={13} /> Last updated {details.updatedAt}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ShareButton name={details.name} />
            <SaveButton />
            <button className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors">
              <Navigation size={13} /> Follow this Path
            </button>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7">
          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-7">
            {/* Description */}
            <p className="text-[14px] text-[#5A4B46] leading-[1.8]">
              {details.description}
            </p>

            {/* Video */}
            <Video props={details.viralMoment} />

            {/* Map + Itinerary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Route Map */}
              <Map stops={details.routeStops} />

              {/* Itinerary */}
              <Itenerary props={details.itinerary} />
            </div>

            {/* Cost Breakdown */}
            <CostBreakdown
              props={details.costBreakdown}
              currency={details.currency}
              totalCost={details.totalCost}
              updatedAt={details.updatedAt}
            />
          </div>
          {/* /left col */}

          {/* ── SIDEBAR ── */}
          <aside className="flex flex-col gap-5">
            {/* Reviews */}
            <Reviews
              packageId={id}
              props={details.review}
              ratingAvg={details.ratingAvg}
              reviewsCount={details.reviewsCount}
            />

            {/* Visa Card */}
            <VisaCard destination={details.location} />
          </aside>
        </div>
        {/* /content-grid */}
        {/* Disclaimer */}
        <div className="mt-8 bg-orange-50/60 border border-orange-100 rounded-xl px-4 py-3 flex items-start gap-2 text-xs text-orange-900 leading-relaxed">
          <Info size={13} className="shrink-0 mt-0.5" />
          <p>
            Disclaimer: Amona facilitates itinerary generation and community
            connection via package chats. We do not provide on-ground staff or
            tour guides. All on-site services are managed by third-party travel
            agents and guides.
          </p>
        </div>
      </main>

      <FooterSimple />
    </div>
  )
}

export default PackageDetailsPage

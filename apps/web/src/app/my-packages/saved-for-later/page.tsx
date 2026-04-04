'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'
import FooterSimple from '@/components/footerSimple'
import MyPackagesPageShell from '@/components/my-packages/page-shell'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Tag } from 'lucide-react'
import { getFallbackImage } from '@/lib/fallback-images'
import type { ApiPackage } from '@/services/packagesService'
import type { MyPackagesPageData } from '@/types/my-packages'

const WISHLIST_KEY = 'amona_wishlist'

function WishlistImage({ pkg }: { pkg: ApiPackage }) {
  const fallback = getFallbackImage(pkg.package_id)
  const [src, setSrc] = useState(pkg.image_url || fallback)

  return (
    <Image
      src={src}
      alt={pkg.title}
      fill
      className="object-cover"
      unoptimized
      onError={() => setSrc(fallback)}
    />
  )
}

const pageData: MyPackagesPageData = {
  title: 'Saved for Later',
  description: 'Keep tabs on packages you want to revisit before booking.',
  sidebar: {
    dashboardItems: [
      { label: 'Current Packages', icon: 'package', href: '/my-packages' },
      {
        label: 'Saved for Later',
        icon: 'bookmark',
        active: true,
        href: '/my-packages/saved-for-later',
      },
      {
        label: 'Past Trips',
        icon: 'history',
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
      title: 'Planning Tip',
      description:
        'Save packages while comparing routes, then come back when your travel window and budget are set.',
    },
  },
  packages: [],
  recommendations: [],
}

const SavedForLaterPage = () => {
  const [wishlist, setWishlist] = useState<ApiPackage[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY)
      if (stored) setWishlist(JSON.parse(stored))
    } catch {
      // corrupted data — ignore
    }
    setHydrated(true)
  }, [])

  const removeFromWishlist = (packageId: string) => {
    const updated = wishlist.filter((p) => p.package_id !== packageId)
    setWishlist(updated)
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-900">
      <Navbar />
      <MyPackagesPageShell details={pageData}>
        {!hydrated ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DDD2CA] bg-white p-12 text-center">
            <Heart size={40} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold text-slate-700 mb-2">
              No saved packages yet
            </h2>
            <p className="text-sm text-[#7A716D] mb-6">
              Browse the marketplace and tap the heart icon to save packages
              here.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((pkg) => (
              <div
                key={pkg.package_id}
                className="rounded-2xl border border-[#E6E0DA] bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-44">
                  <WishlistImage pkg={pkg} />
                  <button
                    onClick={() => removeFromWishlist(pkg.package_id)}
                    className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart
                      size={16}
                      className="fill-primary text-primary"
                    />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[15px] text-slate-900 line-clamp-1 mb-1">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                    <MapPin size={12} />
                    {[pkg.location, pkg.country].filter(Boolean).join(', ')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary flex items-center gap-1">
                      <Tag size={12} />
                      {pkg.currency} {pkg.price}
                    </span>
                    <Link
                      href={`/package-details/${pkg.package_id}`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
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

export default SavedForLaterPage

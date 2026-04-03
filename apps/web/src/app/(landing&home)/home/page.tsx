import HeroSection from '@/components/homepage/HeroSection'
import TopRatedPackages from '@/components/homepage/TopRatedPackages'
import CommunityFeed from '@/components/homepage/CommunityFeed'
import { Button } from '@/components/ui/button'
import { fetchRecentPosts, getTrending } from '@/services/homeService'

import Link from 'next/link'

export default async function HomePage() {
  const posts = await fetchRecentPosts()
  const trendingPackages = await getTrending()

  return (
    <>
      <main>
        <HeroSection />

        {/* Top-Rated Packages */}
        <TopRatedPackages packages={trendingPackages} />

        {/* Divider */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <hr className="border-gray-100" />
        </div>

        {/* Community Feed */}
        <CommunityFeed posts={posts} />

        {/* Load More */}
        <div className="flex justify-center pb-20">
          <Button
            asChild
            variant="default"
            className="rounded-full bg-[#221810] px-8 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Link href="/feed">Load More Stories</Link>
          </Button>
        </div>
      </main>
    </>
  )
}

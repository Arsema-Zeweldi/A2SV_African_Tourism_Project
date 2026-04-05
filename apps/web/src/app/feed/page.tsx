'use client'
import { useEffect, useState } from 'react'
import NewPost from '@/components/feedPage/NewPost'
import TrendingNow from '@/components/feedPage/TrendingNow'
import PostCard from '@/components/feedPage/PostCard'
import FooterSimple from '@/components/footerSimple'
import { getAllPosts } from '@/services/feedServices'
import Navbar from '@/components/navbar'
import PageLoading from '@/components/page-loading'
import { Post } from '@/types/feed'
import { RefreshCcw, WifiOff } from 'lucide-react'

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllPosts()
      setPosts(data)
    } catch {
      setError('Failed to load posts. Check your connection or login status.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <PageLoading
        title="Gathering the latest travel stories"
        subtitle="We are loading community posts, fresh moments, and trending adventures from across Africa."
      />
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf8f5]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <WifiOff className="h-7 w-7 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Couldn&apos;t load the feed
            </h2>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <RefreshCcw size={15} />
              Try again
            </button>
          </div>
        </div>
        <FooterSimple />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar />
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Community Feed
            </h1>
            <p className="text-sm text-gray-500">
              Discover authentic stories and tips from fellow travelers across
              Africa.
            </p>
          </header>

          <NewPost />

          <div className="space-y-5">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-700">No posts yet</p>
                <p className="mt-1 max-w-xs text-sm text-gray-400">
                  Be the first to share your African travel experience!
                </p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.post_id} post={post} />)
            )}
          </div>
        </div>

        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="font-bold text-gray-900 text-base">Trending Now</h3>
              <a
                className="text-xs font-semibold text-primary hover:underline"
                href="/marketplace"
              >
                View all
              </a>
            </div>
            <TrendingNow />
          </div>
        </aside>
      </div>

      <FooterSimple />
    </div>
  )
}

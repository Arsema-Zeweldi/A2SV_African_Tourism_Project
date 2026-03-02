import React from 'react'
import NewPost from '@/components/feedPage/NewPost'
import TrendingNow from '@/components/feedPage/TrendingNow'
import PostCard from '@/components/feedPage/PostCard'
import Navbar from '@/components/navbar'
import FooterSimple from '@/components/footerSimple'
import { getAllPosts } from '@/app/feed/data'

export default async function FeedPage() {
  const posts = await getAllPosts()
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <header className="flex flex-col gap-2 mb-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Community Feed
            </h1>
            <p className="text-slate-500 text-base">
              Discover authentic stories and tips from fellow travelers across
              Africa.
            </p>
          </header>

          <NewPost />

          <div className="space-y-4">
            {posts?.length === 0 && <div>No Posts Found</div>}
            {posts?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right Column / Sidebar (Spans 4 of 12 columns) */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-main text-lg">Trending Now</h3>
              <a
                className="text-xs font-bold text-primary hover:underline"
                href="#"
              >
                View all
              </a>
            </div>
            <TrendingNow />
          </div>
        </aside>
      </main>

      <FooterSimple />
    </div>
  )
}

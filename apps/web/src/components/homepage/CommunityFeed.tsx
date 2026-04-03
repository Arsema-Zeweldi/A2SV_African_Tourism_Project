import PostCard from '@/components/feedPage/PostCard'
import type { Post } from '@/types/feed'

interface CommunityFeedProps {
  posts: Post[]
}

export default function CommunityFeed({ posts }: CommunityFeedProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Community Feed
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Discover Africa through the eyes of our travelers.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-700">No stories yet</p>
          <p className="mt-1 max-w-xs text-sm text-gray-400">
            Be the first to share your African travel experience with the community.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.post_id} post={post} />
          ))}
        </div>
      )}
    </section>
  )
}

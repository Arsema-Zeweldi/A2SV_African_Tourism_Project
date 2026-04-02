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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.post_id} post={post} />
        ))}
      </div>
    </section>
  )
}

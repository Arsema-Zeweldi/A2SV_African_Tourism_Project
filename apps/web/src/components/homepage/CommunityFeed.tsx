import CommunityCard from "@/components/homepage/CommunityCard";
import { communityPosts } from "@/lib/homepage-data";

export default function CommunityFeed() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            {/* Header */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Community Feed
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Discover Africa through the eyes of our travelers.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {communityPosts.map((post) => (
                    <CommunityCard key={post.id} post={post} />
                ))}
            </div>
        </section>
    );
}

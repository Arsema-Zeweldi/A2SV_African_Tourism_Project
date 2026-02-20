import Image from "next/image";
import { CommunityPostData } from "@/types/homepage";

interface CommunityCardProps {
    post: CommunityPostData;
}

export default function CommunityCard({ post }: CommunityCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow duration-300 hover:shadow-md">
            {/* Author Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                <div className="relative h-9 w-9 overflow-hidden rounded-full">
                    <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                    />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                    {post.author.name}
                </span>
            </div>

            {/* Post Image */}
            <div className="relative aspect-square w-full overflow-hidden">
                <Image
                    src={post.image}
                    alt={`Post by ${post.author.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>

            {/* Description */}
            <div className="px-4 pt-3 pb-2">
                <p className="line-clamp-3 text-xs leading-relaxed text-gray-600 sm:text-sm">
                    {post.description}
                </p>
            </div>

            {/* Engagement Bar */}
            <div className="flex items-center gap-5 border-t border-gray-50 px-4 py-3">
                {/* Likes */}
                <button className="flex items-center gap-1.5 text-gray-500 transition-colors hover:text-red-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <span className="text-xs font-medium">{post.likes}</span>
                </button>

                {/* Comments */}
                <button className="flex items-center gap-1.5 text-gray-500 transition-colors hover:text-blue-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    </svg>
                    <span className="text-xs font-medium">{post.comments}</span>
                </button>

                {/* Share */}
                <button className="ml-auto text-gray-500 transition-colors hover:text-[#ec6d13]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" x2="12" y1="2" y2="15" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

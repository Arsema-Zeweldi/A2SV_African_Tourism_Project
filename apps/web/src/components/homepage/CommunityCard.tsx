import Image from "next/image";
import { CommunityPostData } from "@/types/homepage";

interface CommunityCardProps {
    post: CommunityPostData;
}

export default function CommunityCard({ post }: CommunityCardProps) {
    // Format numbers (e.g., 1200 -> 1.2k)
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    return (
        <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-lg flex flex-col h-full">
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

            <div className="flex flex-col flex-grow p-6">
                {/* Author Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-gray-900 leading-tight">
                            {post.author.name}
                        </span>
                        <span className="text-[13px] text-gray-400">
                            {post.timeAgo}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6 flex-grow">
                    <p className="text-[14px] leading-[1.6] text-gray-500">
                        {post.description}
                    </p>
                </div>

                {/* Engagement Bar */}
                <div className="flex items-center gap-6 mt-auto pt-2">
                    {/* Likes */}
                    <button className="flex items-center gap-2 text-[#ec6d13] transition-colors hover:text-[#d56211]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        <span className="text-[13px] font-semibold">{formatNumber(post.likes)}</span>
                    </button>

                    {/* Comments */}
                    <button className="flex items-center gap-2 text-gray-400 transition-colors hover:text-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className="text-[13px] font-semibold">{formatNumber(post.comments)}</span>
                    </button>

                    {/* Share */}
                    <button className="ml-auto text-gray-400 transition-colors hover:text-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

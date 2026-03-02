'use client'
import React, { useRef, useState } from 'react'
import { FaPlay, FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa'
import { MdRestaurant } from 'react-icons/md'
import { IoChatbubbleSharp } from 'react-icons/io5'
import { HiDotsHorizontal } from 'react-icons/hi'
import { Post } from '@/app/feed/data'
import Image from 'next/image'

interface PostCardProps {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.liked)
  const [likesCount, setLikesCount] = useState(post.likesCount)

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const [showComments, setShowComments] = useState(false)

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleToggleLike = () => {
    if (isLiked) {
      setLikesCount((prev) => prev - 1)
    } else {
      setLikesCount((prev) => prev + 1)
    }
    setIsLiked(!isLiked)
  }

  return (
    <article className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative size-10 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={post.userAvatar || '/default-avatar.png'} // Fallback to a local placeholder
              alt="User Avatar"
              fill
              className="object-cover"
              unoptimized={!post.userAvatar?.startsWith('http')} // Optional safety
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-main dark:text-white text-sm">
                {post.userName}
              </span>
            </div>
            <span className="text-xs text-text-muted">
              {post.timeAgo} • {post.location}
            </span>
          </div>
        </div>
        <button className="text-text-muted hover:text-text-main dark:hover:text-white">
          <HiDotsHorizontal className="text-primary/70" size={20} />
        </button>
      </div>
      <div className="relative w-full aspect-4/3 sm:aspect-video bg-gray-100 dark:bg-gray-800 group cursor-pointer">
        <div className="relative w-full h-full overflow-hidden">
          {post.photo && (
            <Image
              src={post.photo}
              alt="User Post"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {post.video && (
            <video
              ref={videoRef}
              src={post.video}
              muted
              playsInline
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
        </div>
        {post.video && (
          <div
            onClick={handlePlayToggle}
            className={`absolute inset-0 flex items-center justify-center transition-colors ${
              isPlaying
                ? 'bg-transparent'
                : 'bg-black/20 group-hover:bg-black/10'
            }`}
          >
            {!isPlaying && (
              <div className="size-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/50 text-white shadow-lg group-hover:scale-110 transition-transform">
                <FaPlay size={23} className="ml-1" />{' '}
                {/* ml-1 offsets play icon visually center */}
              </div>
            )}
          </div>
        )}

        <a
          className="absolute bottom-4 left-4 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-colors border border-white/10"
          href="#"
        >
          <MdRestaurant size={16} className="text-primary" />
          Linked to: {post.packageName}
        </a>
      </div>
      <div className="p-4">
        {/* <h3 className="text-lg font-bold text-text-main dark:text-white mb-1">
          Best Jollof in Town! 🍛
        </h3> */}
        <p className="text-text-main dark:text-gray-300 leading-relaxed mb-4">
          {post.content}
        </p>

        <div className="flex items-center gap-6 border-t border-border-light dark:border-border-dark pt-3">
          <button
            onClick={handleToggleLike}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group/btn"
          >
            {isLiked ? (
              <FaHeart className="group-hover/btn:text-primary text-primary transition-colors cursor-pointer" />
            ) : (
              <FaRegHeart className="group-hover/btn:text-primary transition-colors cursor-pointer" />
            )}
            <span className="text-sm font-bold">{likesCount}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-text-muted hover:text-text-main dark:hover:text-white transition-colors group/btn"
          >
            <IoChatbubbleSharp className="text-primary cursor-pointer" />
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </button>
          <button className="flex items-center gap-2 text-text-muted hover:text-text-main dark:hover:text-white transition-colors ml-auto">
            <FaShareAlt className="text-primary/70" size={20} />
          </button>
        </div>
        {showComments && post.comments && (
          <div className="mt-4 space-y-4 pt-3 border-t border-border-light dark:border-border-dark">
            {post.comments.slice(0, 3).map((comment, index) => (
              <div key={index} className="flex gap-3 items-start">
                {/* Comment Author Avatar */}
                <div className="relative size-8 shrink-0 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={comment.authorAvatar || '/default-avatar.png'}
                    alt={comment.authorAvatar}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Comment Content */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-main dark:text-white text-sm">
                      {comment.author}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      2h {/* Placeholder for comment timestamp */}
                    </span>
                  </div>
                  <p className="text-sm text-text-main dark:text-gray-300">
                    {comment.text}
                  </p>
                  <button className="text-[10px] font-bold text-text-muted hover:text-primary w-fit mt-1">
                    Reply
                  </button>
                </div>
              </div>
            ))}

            {post.comments.length > 3 && (
              <button className="text-xs font-bold text-primary hover:underline mt-2 ml-11">
                View all {post.commentsCount} comments
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard

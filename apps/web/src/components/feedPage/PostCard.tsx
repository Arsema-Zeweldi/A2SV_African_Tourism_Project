'use client'
import React, { useRef, useState } from 'react'
import { FaPlay, FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa'
import { FiShare2 } from 'react-icons/fi'
import { IoSend } from 'react-icons/io5'
import { toast } from 'sonner'
import { MdRestaurant } from 'react-icons/md'
import { IoChatbubbleSharp } from 'react-icons/io5'
import { Post, Comment as PostComment } from '@/types/feed'
import { getComments, toggleLike, postComment } from '@/services/feedServices'
import { useCurrentUserAvatar } from '@/hooks/useCurrentUserAvatar'
import Image from 'next/image'
import { useEffect } from 'react'

interface PostCardProps {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  const { avatar: currentUserAvatar, handleAvatarError } =
    useCurrentUserAvatar()
  const mediaUrl = post.media_url?.trim()
  const hasImageMedia = post.media_type === 'image' && Boolean(mediaUrl)
  const hasVideoMedia = post.media_type === 'video' && Boolean(mediaUrl)
  const hasRenderableMedia = hasImageMedia || hasVideoMedia
  const [isLiked, setIsLiked] = useState(post.liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [commentCount, setCommentCount] = useState(post.comments_count)

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const [comments, setComments] = useState<PostComment[]>([])

  const [showComments, setShowComments] = useState(false)

  const [isLoadingComments, setIsLoadingComments] = useState(false)

  const [newCommentText, setNewCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLikePending, setIsLikePending] = useState(false)

  const handleAddComment = async () => {
    if (!newCommentText.trim() || !post.post_id) return

    setIsSubmitting(true)
    try {
      const savedComment = await postComment(post.post_id, newCommentText)

      setComments((prev) => [savedComment, ...prev])
      setCommentCount((prev) => {
        const currentCount = prev ?? 0
        return currentCount + 1
      })
      setNewCommentText('')
    } catch {
      toast.error('Comment failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      if (showComments && comments.length === 0 && post.post_id) {
        setIsLoadingComments(true)
        try {
          const data = await getComments(post.post_id)
          setComments(data)
        } catch {
          // Comments failed to load — non-critical
        } finally {
          setIsLoadingComments(false)
        }
      }
    }

    fetchComments()
  }, [showComments, post.post_id, comments.length])

  const getElapsedTime = (createdAt: string | Date): string => {
    const now = new Date()
    const past = new Date(createdAt)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    // Fallback for future dates or clock desync
    if (diffInSeconds < 5) return 'just now'

    const units = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ]

    for (const unit of units) {
      const interval = Math.floor(diffInSeconds / unit.seconds)
      if (interval >= 1) {
        return `${interval} ${unit.label}${interval > 1 ? 's' : ''} ago`
      }
    }

    return 'just now'
  }

  const [isShowingAllComments, setIsShowingAllComments] = useState(false)

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

  const handleToggleLike = async () => {
    if (!post.post_id || isLikePending) return

    const previousIsLiked = isLiked
    const previousLikesCount = likesCount

    setIsLiked(!isLiked)
    setLikesCount((prev) => {
      const currentCount = prev ?? 0
      return isLiked ? currentCount - 1 : currentCount + 1
    })
    setIsLikePending(true)

    try {
      const response = await toggleLike(post.post_id)

      setIsLiked(response.liked)
    } catch (err) {
      setIsLiked(previousIsLiked)
      setLikesCount(previousLikesCount)
      const msg = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Could not update like: ${msg}`)
    } finally {
      setIsLikePending(false)
    }
  }

  return (
    <article className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative size-10 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={post.user_avatar || '/images/user-icon.png'}
              alt="User Avatar"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-main dark:text-white text-sm">
                {post.user_name}
              </span>
            </div>
            <span className="text-xs text-text-muted">
              {post.created_at && getElapsedTime(post.created_at)}
              {post.created_at && post.location && ' • '}
              {post.location}
            </span>
          </div>
        </div>
      </div>
      {hasRenderableMedia && (
        <div className="relative w-full aspect-4/3 sm:aspect-video bg-gray-100 dark:bg-gray-800 group cursor-pointer">
          <div className="relative w-full h-full overflow-hidden">
            {hasImageMedia && (
              <Image
                src={mediaUrl!}
                alt="User Post"
                fill
                className="object-cover"
                unoptimized
              />
            )}
            {hasVideoMedia && (
              <video
                ref={videoRef}
                src={mediaUrl}
                muted
                playsInline
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
          </div>
          {hasVideoMedia && (
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
                </div>
              )}
            </div>
          )}

          <a
            className="absolute bottom-4 left-4 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-colors border border-white/10"
            href="#"
          >
            <MdRestaurant size={16} className="text-primary" />
            Linked to: {post.package_name}
          </a>
        </div>
      )}
      <div className="p-4">
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
            {showComments ? (
              <IoChatbubbleSharp className="text-primary cursor-pointer" />
            ) : (
              <FaRegComment className="text-primary cursor-pointer" />
            )}
            <span className="text-sm font-medium">{commentCount}</span>
          </button>
          <button
            onClick={async () => {
              const url = `${window.location.origin}/feed`
              try {
                if (navigator.share) {
                  await navigator.share({
                    title: post.user_name + "'s post",
                    text: post.content,
                    url,
                  })
                } else {
                  await navigator.clipboard.writeText(url)
                  toast.success('Link copied!')
                }
              } catch {
                /* user cancelled */
              }
            }}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors ml-auto"
          >
            <FiShare2 className="text-primary/70" size={18} />
          </button>
        </div>

        {showComments && (
          <div className="mt-4 space-y-4 pt-3 border-t border-border-light dark:border-border-dark">
            <div className="flex gap-3 items-center mb-6">
              <div className="relative size-8 shrink-0 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={currentUserAvatar}
                  alt="My Avatar"
                  fill
                  className="object-cover"
                  unoptimized
                  onError={handleAvatarError}
                />
              </div>
              <div className="flex-1 relative group">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  className="w-full bg-gray-100 dark:bg-zinc-900 border-none rounded-full py-2 px-4 pr-10 text-sm focus:ring-1 focus:ring-primary transition-all"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newCommentText.trim() || isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary disabled:opacity-30 cursor-pointer"
                >
                  <IoSend size={16} />
                </button>
              </div>
            </div>

            {isLoadingComments ? (
              <div className="text-xs text-text-muted animate-pulse py-2 text-center">
                Loading comments...
              </div>
            ) : (
              <>
                {(isShowingAllComments ? comments : comments.slice(0, 3)).map(
                  (comment, index) => (
                    <div
                      key={comment.comment_id || index}
                      className="flex gap-3 items-start"
                    >
                      <div className="relative size-8 shrink-0 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={comment.user_avatar || '/images/user-icon.png'}
                          alt={`${comment.user_name}'s avatar`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-text-main dark:text-white text-sm">
                            {comment.user_name}
                          </span>
                          <span className="text-[10px] text-text-muted">
                            {getElapsedTime(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-text-main dark:text-gray-300">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  )
                )}

                {/* Only show "View all" if we have more than 3 AND we aren't already showing them */}
                {comments.length > 3 && !isShowingAllComments && (
                  <button
                    onClick={() => setIsShowingAllComments(true)}
                    className="text-xs font-bold text-primary hover:underline mt-2 ml-11"
                  >
                    View all {commentCount} comments
                  </button>
                )}

                {/* Optional: Add a "Show less" button */}
                {isShowingAllComments && comments.length > 3 && (
                  <button
                    onClick={() => setIsShowingAllComments(false)}
                    className="text-xs font-bold text-text-muted hover:underline mt-2 ml-11"
                  >
                    Show less
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard

'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { fetchProfile } from '@/actions/profile_actions'
import { submitPackageReviewAction } from '@/actions/package_reviews_actions'
import type { Reviews as PackageDetailsReview } from '@/types/package-details'

const FALLBACK_AVATAR = '/images/user-icon.png'

interface UsePackageReviewsOptions {
  packageId: string
  initialReviews: PackageDetailsReview[]
  initialRatingAvg?: number
  initialReviewsCount?: number
}

export function usePackageReviews({
  packageId,
  initialReviews,
  initialRatingAvg = 0,
  initialReviewsCount = 0,
}: UsePackageReviewsOptions) {
  const [reviews, setReviews] = useState(initialReviews)
  const [ratingAvg, setRatingAvg] = useState(initialRatingAvg)
  const [reviewsCount, setReviewsCount] = useState(initialReviewsCount)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const visibleReviews = useMemo(() => reviews.slice(0, 3), [reviews])

  const submitReview = async () => {
    const trimmedComment = comment.trim()

    if (!trimmedComment || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      await submitPackageReviewAction(packageId, {
        rating,
        comment: trimmedComment,
      })

      const profile = await fetchProfile()
      const authorName =
        profile.success &&
        [profile.data.first_name, profile.data.last_name].filter(Boolean).length > 0
          ? [profile.data.first_name, profile.data.last_name]
              .filter(Boolean)
              .join(' ')
          : 'You'
      const authorAvatar =
        profile.success && profile.data.avatar_url
          ? profile.data.avatar_url
          : FALLBACK_AVATAR

      setReviews((prev) => [
        {
          author: authorName,
          avatar: authorAvatar,
          text: trimmedComment,
          date: 'Just now',
          rating,
        },
        ...prev,
      ])

      const nextCount = reviewsCount + 1
      const totalScore = ratingAvg * reviewsCount + rating
      setReviewsCount(nextCount)
      setRatingAvg(totalScore / nextCount)
      setComment('')
      setRating(5)
      setIsComposerOpen(false)
      toast.success('Review submitted successfully')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit review.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    comment,
    isComposerOpen,
    isSubmitting,
    rating,
    ratingAvg,
    reviewsCount,
    visibleReviews,
    setComment,
    setIsComposerOpen,
    setRating,
    submitReview,
  }
}

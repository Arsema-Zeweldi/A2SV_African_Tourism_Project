'use client'

import React from 'react'
import { Star } from 'lucide-react'
import type { Reviews as PackageDetailsReview } from '@/types/package-details'
import { usePackageReviews } from '@/services/packageReviewsService'

interface ReviewsProps {
  packageId: string
  props: PackageDetailsReview[]
  ratingAvg?: number
  reviewsCount?: number
}

const Reviews = ({
  packageId,
  props,
  ratingAvg = 0,
  reviewsCount = 0,
}: ReviewsProps) => {
  const {
    comment,
    isComposerOpen,
    isSubmitting,
    rating,
    setComment,
    setIsComposerOpen,
    setRating,
    submitReview,
    visibleReviews,
    ratingAvg: liveRatingAvg,
    reviewsCount: liveReviewsCount,
  } = usePackageReviews({
    packageId,
    initialReviews: props,
    initialRatingAvg: ratingAvg,
    initialReviewsCount: reviewsCount,
  })

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-[13px] font-black text-slate-800 mb-1.5">
            Reviews
          </h3>
          <div className="flex items-end gap-2.5">
            <span className="text-[38px] font-black text-slate-900 leading-none">
              {liveRatingAvg.toFixed(1)}
            </span>
            <div className="pb-1">
              <div className="flex text-[#F97316] gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < Math.round(liveRatingAvg) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-400">
                {liveReviewsCount} verified reviews
              </p>
            </div>
          </div>
        </div>
        <button className="text-[#F97316] text-[11px] font-bold hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-4 mb-5">
        {visibleReviews.map((review: PackageDetailsReview, index: number) => (
          <div key={index} className="pb-4 border-b border-slate-50">
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-[12px] font-bold text-slate-800">
                  {review.author}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">{review.date}</span>
            </div>
            <div className="mb-2 flex text-[#F97316] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  fill={i < (review.rating ?? 5) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              &quot;{review.text}&quot;
            </p>
          </div>
        ))}
      </div>

      {isComposerOpen ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div>
            <p className="text-[11px] font-bold text-slate-700 mb-2">
              Your rating
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="text-[#F97316] transition-transform hover:scale-110"
                >
                  <Star size={18} fill={value <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share what stood out about this trip..."
            className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-[#F97316]"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void submitReview()}
              disabled={isSubmitting || comment.trim().length === 0}
              className="flex-1 rounded-xl bg-primary py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setIsComposerOpen(false)}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-[12px] font-semibold text-slate-600 hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsComposerOpen(true)}
          className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 transition-colors"
        >
          Write a Review
        </button>
      )}
    </div>
  )
}

export default Reviews

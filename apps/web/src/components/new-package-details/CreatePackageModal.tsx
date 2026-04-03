'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2, AlertTriangle } from 'lucide-react'
import type { ItineraryData } from '@/types/new-package'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  summary: z
    .string()
    .min(10, 'Summary must be at least 10 characters')
    .max(300, 'Summary must be under 300 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z
    .number({ error: 'Enter a valid number' })
    .min(0, 'Price cannot be negative'),
  country: z.string().min(2, 'Country is required'),
  location: z.string().min(2, 'Location is required'),
  currency: z.string().min(1),
  duration_days: z.number().int().min(1),
  category: z.string().min(2, 'Category is required'),
  group_size: z.string().min(1, 'Group size is required'),
})

export type CreatePackageFormData = z.infer<typeof schema>

const CATEGORIES = [
  'Adventure',
  'Cultural',
  'Wildlife',
  'Beach & Coastal',
  'City Explorer',
  'Culinary',
  'Eco-Tourism',
  'Historical',
]

const GROUP_SIZES = [
  'Solo',
  'Couple',
  'Small Group (3–6)',
  'Medium Group (7–15)',
  'Large Group (16+)',
]

const CURRENCIES = ['USD', 'EUR', 'GBP', 'ETB', 'KES', 'ZAR', 'NGN']

const MIN_ACTIVITIES = 3

interface CreatePackageModalProps {
  open: boolean
  itineraryData: Pick<ItineraryData, 'title' | 'daysCount'>
  totalActivities: number
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: CreatePackageFormData) => Promise<void>
}

export function CreatePackageModal({
  open,
  itineraryData,
  totalActivities,
  isSubmitting,
  onClose,
  onSubmit,
}: CreatePackageModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePackageFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: itineraryData.title,
      currency: 'USD',
      duration_days: itineraryData.daysCount,
      price: 0,
    },
  })

  if (!open) return null

  const isBelowMinActivities = totalActivities < MIN_ACTIVITIES
  const canPublish = !isBelowMinActivities && !isSubmitting

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : undefined}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Sticky header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Publish Package
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Share your trip with the community
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Min-activities warning */}
        {isBelowMinActivities && (
          <div className="mx-6 mt-4 flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle
              size={14}
              className="text-amber-500 mt-0.5 shrink-0"
            />
            <p className="text-xs text-amber-700 font-medium">
              Your itinerary needs at least {MIN_ACTIVITIES} activities to
              publish. It currently has {totalActivities}. Add more activities
              first.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Package Title *
            </label>
            <input
              {...register('title')}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
            {errors.title && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Summary */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Short Summary *
            </label>
            <textarea
              {...register('summary')}
              rows={2}
              placeholder="A tagline that captures the essence of this trip..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none placeholder:text-gray-300"
            />
            {errors.summary && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.summary.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Full Description *
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Describe the experience, highlights, and what makes this trip special..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none placeholder:text-gray-300"
            />
            {errors.description && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Country + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Country *
              </label>
              <input
                {...register('country')}
                placeholder="e.g. Kenya"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-300"
              />
              {errors.country && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Location *
              </label>
              <input
                {...register('location')}
                placeholder="e.g. Nairobi"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-300"
              />
              {errors.location && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Price + Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Price *
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                placeholder="0"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-300"
              />
              {errors.price && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Currency *
              </label>
              <select
                {...register('currency')}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category + Group Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Group Size *
              </label>
              <select
                {...register('group_size')}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              >
                <option value="">Select size...</option>
                {GROUP_SIZES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.group_size && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.group_size.message}
                </p>
              )}
            </div>
          </div>

          {/* Hidden field */}
          <input
            type="hidden"
            {...register('duration_days', { valueAsNumber: true })}
          />

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canPublish}
              className="flex-1 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-[0_4px_14px_rgba(249,115,22,0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Package'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

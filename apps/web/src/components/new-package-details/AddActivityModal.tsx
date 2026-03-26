"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"
import type { ActivityType } from "@/types/new-package"

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  type: z.enum(["monument", "food", "tour", "accommodation", "transport"]),
  time_label: z.string().min(1, "Start time is required"),
  duration_label: z.string().min(1, "Duration is required"),
  cost_label: z.string().min(1, "Cost is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
})

export type AddActivityFormData = z.infer<typeof schema>

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: "food", label: "Food & Dining" },
  { value: "tour", label: "Tour & Adventure" },
  { value: "monument", label: "Culture & Monument" },
  { value: "accommodation", label: "Accommodation" },
  { value: "transport", label: "Transport" },
]

interface AddActivityModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AddActivityFormData) => void
}

export function AddActivityModal({
  open,
  onClose,
  onSubmit,
}: AddActivityModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddActivityFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "tour",
      time_label: "09:00 AM",
      duration_label: "~2 Hours",
      cost_label: "Free",
    },
  })

  if (!open) return null

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: AddActivityFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Add Activity</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Title *
            </label>
            <input
              {...register("title")}
              placeholder="e.g. Visit Bwindi Impenetrable Forest"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent placeholder:text-gray-300"
            />
            {errors.title && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Activity Type *
            </label>
            <select
              {...register("type")}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Start Time *
              </label>
              <input
                {...register("time_label")}
                placeholder="09:00 AM"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-300"
              />
              {errors.time_label && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.time_label.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Duration *
              </label>
              <input
                {...register("duration_label")}
                placeholder="~2 Hours"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-300"
              />
              {errors.duration_label && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.duration_label.message}
                </p>
              )}
            </div>
          </div>

          {/* Cost + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Cost *
              </label>
              <input
                {...register("cost_label")}
                placeholder="$30 entry"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-300"
              />
              {errors.cost_label && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.cost_label.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Location *
              </label>
              <input
                {...register("location")}
                placeholder="City, Area"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-300"
              />
              {errors.location && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Description *
            </label>
            <textarea
              {...register("description")}
              placeholder="Brief description of this activity..."
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none placeholder:text-gray-300"
            />
            {errors.description && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-[0_4px_14px_rgba(249,115,22,0.3)]"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

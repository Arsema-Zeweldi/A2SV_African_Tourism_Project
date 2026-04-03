'use client'

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"

interface DeleteTripConfirmationModalProps {
  open: boolean
  tripTitle?: string
  isSubmitting?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteTripConfirmationModal({
  open,
  tripTitle,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: DeleteTripConfirmationModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onCancel()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isSubmitting, onCancel, open])

  if (!open || !isMounted) {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[#20160f]/55 p-4"
      onClick={() => {
        if (!isSubmitting) {
          onCancel()
        }
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-trip-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(32,22,15,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ec6d13]">
          Delete Trip
        </p>
        <h2
          id="delete-trip-title"
          className="mt-3 text-2xl font-semibold text-[#2f241c]"
        >
          Remove this itinerary?
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#6f6258]">
          {tripTitle
            ? `This will permanently remove "${tripTitle}" from your trips.`
            : "This will permanently remove this itinerary from your trips."}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 rounded-full border-stone-300 px-6 text-stone-700"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="lg"
            className="h-11 rounded-full bg-[#dc2626] px-6 text-white hover:bg-[#b91c1c]"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete Trip"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

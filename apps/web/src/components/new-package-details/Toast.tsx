"use client"

import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import type { Toast, ToastType } from "@/hooks/useToast"

const STYLES: Record<
  ToastType,
  { container: string; icon: React.ReactNode }
> = {
  success: {
    container: "bg-emerald-50 border-emerald-200 text-emerald-800",
    icon: <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />,
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: <AlertCircle size={16} className="text-red-500 shrink-0" />,
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: <Info size={16} className="text-blue-500 shrink-0" />,
  },
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => {
        const { container, icon } = STYLES[t.type]
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${container}`}
          >
            {icon}
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => onDismiss(t.id)}
              className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Check, Eye, EyeOff, AlertCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { changePassword } from "@/actions/profile_actions"

const schema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

type FormData = z.infer<typeof schema>

function PasswordInput({
  id,
  placeholder,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string
  placeholder?: string
  error?: string
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className="border-stone-200 bg-stone-50 focus-visible:ring-orange-400 text-sm pr-10"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function SecurityPage() {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    setSuccess(false)

    const result = await changePassword({
      current_password: data.current_password,
      new_password: data.new_password,
      password_confirm: data.confirm_password,
    })

    if (!result.success) {
      setServerError(result.error)
      return
    }

    setSuccess(true)
    reset()
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Security
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Keep your account safe by using a strong, unique password.
        </p>
      </div>

      {/* Change password card */}
      <Card className="border-stone-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-stone-900">
            <span className="block w-0.5 h-5 rounded-full bg-orange-500" />
            Change Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            {/* Server error */}
            {serverError && (
              <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {serverError}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="current_password" className="text-xs font-medium text-stone-500">
                Current Password
              </Label>
              <PasswordInput
                id="current_password"
                placeholder="Enter current password"
                error={errors.current_password?.message}
                {...register("current_password")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new_password" className="text-xs font-medium text-stone-500">
                New Password
              </Label>
              <PasswordInput
                id="new_password"
                placeholder="At least 8 characters"
                error={errors.new_password?.message}
                {...register("new_password")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm_password" className="text-xs font-medium text-stone-500">
                Confirm New Password
              </Label>
              <PasswordInput
                id="confirm_password"
                placeholder="Repeat new password"
                error={errors.confirm_password?.message}
                {...register("confirm_password")}
              />
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={
                  success
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating…
                  </>
                ) : success ? (
                  <>
                    <Check className="h-4 w-4" />
                    Password Updated!
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info card */}
      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-blue-50">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-800 mb-1">
                Account Protection Tips
              </p>
              <ul className="space-y-1 text-xs text-stone-500 list-disc list-inside">
                <li>Use at least 8 characters with a mix of letters, numbers and symbols</li>
                <li>Never share your password with anyone</li>
                <li>Use a different password for each online account</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

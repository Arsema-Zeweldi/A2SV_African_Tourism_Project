'use client'
import React, { useState, useEffect } from 'react'
import {
  MdLockOutline,
  MdUpdate,
  MdArrowBack,
  MdErrorOutline,
} from 'react-icons/md'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import LoginForgotLayout from '../layout'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { resetPassword } from '@/services/authService'
import { toast } from 'sonner'

interface ResetFormData {
  password: string
  confirmPassword: string
}

const ResetPasswordPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [isUpdating, setIsUpdating] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormData>({
    mode: 'onTouched',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = watch('password')

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token.')
      router.push('/login')
    }
  }, [token, router])

  const onSubmit = async (data: ResetFormData) => {
    setIsUpdating(true)
    try {
      await resetPassword(data.password, data.confirmPassword, token)

      toast.success('Password updated successfully! Redirecting to login...')

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update password.'
      toast.error(errorMessage)
      setIsUpdating(false)
    }
  }

  return (
    <LoginForgotLayout>
      <div className="w-full max-w-125 overflow-hidden flex flex-col justify-center mt-10 bg-white/70 rounded-2xl items-center md:ml-[90%] lg:ml-[110%]">
        <div className="glass-effect rounded-lg p-8 md:p-12 w-full shadow-2xl text-left">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Set New Password
              </h2>
              <p className="text-slate-700 font-medium leading-relaxed">
                Almost there! Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2 text-left">
                <Label
                  className="text-sm font-bold text-slate-800 block mb-2 ml-4"
                  htmlFor="password"
                >
                  New Password
                </Label>
                <div className="relative">
                  <MdLockOutline
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    size={20}
                  />
                  <Input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-12 h-12 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 ml-4 mt-1 font-semibold flex items-center gap-1">
                    <MdErrorOutline /> {errors.password.message as string}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2 text-left">
                <Label
                  className="text-sm font-bold text-slate-800 block mb-2 ml-4"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <MdLockOutline
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    size={20}
                  />
                  <Input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === passwordValue || 'Passwords do not match',
                    })}
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-12 h-12 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 ml-4 mt-1 font-semibold flex items-center gap-1">
                    <MdErrorOutline />{' '}
                    {errors.confirmPassword.message as string}
                  </p>
                )}
              </div>

              <Button
                className={`w-full text-white bg-orange-500 hover:bg-orange-600 rounded-full font-bold h-12 flex items-center justify-center gap-2 transition-all ${isUpdating ? 'opacity-70' : ''}`}
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Update Password</span>
                    <MdUpdate size={20} />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <Link
                className="inline-flex items-center gap-2 text-slate-800 font-bold hover:text-orange-500 transition-colors"
                href="/login"
              >
                <MdArrowBack /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LoginForgotLayout>
  )
}

export default ResetPasswordPage

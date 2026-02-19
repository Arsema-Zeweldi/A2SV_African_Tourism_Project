/* eslint-disable react/no-unescaped-entities */
'use client'
import { useForm } from 'react-hook-form'
import { MdMailOutline, MdLockOpen, MdArrowForward } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import LoginForgotLayout from '../layout'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface LoginFormData {
  email: string
  password: string
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ mode: 'onTouched' })
  const onSubmit = async (data: LoginFormData) => {
    await new Promise((r) => setTimeout(r, 900))
    console.log('submit', data)
  }

  return (
    <LoginForgotLayout>
      <div
        className="w-full max-w-125
         flex flex-col justify-center bg-white/70 rounded-2xl items-center md:items-end mt-10 md:ml-[90%] lg:ml-[110%]"
      >
        <div className="glass-effect rounded-lg p-8 md:p-12 w-full shadow-2xl">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-700 font-medium">
                Log in to continue your journey across the continent.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="space-y-2">
                <Label
                  className="text-sm font-bold text-slate-800 ml-4 block mb-4"
                  htmlFor="email"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <MdMailOutline
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    size={20}
                  />
                  <Input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Enter a valid email',
                      },
                    })}
                    className="w-full pl-12 pr-4 py-4 input-glass ring-2 ring-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-full transition-all outline-none text-slate-900 placeholder:text-slate-500"
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-2 ml-4">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-4">
                  <Label
                    className="text-sm font-bold text-slate-800 block mb-4"
                    htmlFor="password"
                  >
                    Password
                  </Label>
                  <Link
                    className="text-sm font-bold text-primary hover:underline"
                    href="/forgot-password"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <MdLockOpen
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
                    className="w-full pl-12 pr-4 py-4 input-glass ring-2 ring-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-full transition-all outline-none text-slate-900 placeholder:text-slate-500"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-2 ml-4">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                className={`w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full shadow-lg shadow-primary/40 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    <span>Logging in</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <MdArrowForward size={20} />
                  </>
                )}
              </Button>
            </form>
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-900/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-slate-700 font-semibold">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <Button className="flex items-center justify-center gap-3 w-full py-4 input-glass rounded-full bg-white hover:bg-white/40 transition-colors">
                <FcGoogle size={24} />
                <span className="text-sm font-bold">Sign in with Google</span>
              </Button>
            </div>
            <p className="mt-12 text-center text-slate-800 font-medium">
              Don't have an account?{' '}
              <Link
                className="text-primary font-bold hover:underline"
                href="/signup"
              >
                Start your adventure
              </Link>
            </p>
          </div>
        </div>
      </div>
    </LoginForgotLayout>
  )
}

export default LoginPage

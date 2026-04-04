'use client'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { User, Mail, Lock } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { userSignupInfo } from '@/types/auth'
import { signup, resendVerification } from '@/services/authService'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AxiosError } from 'axios'
import { signIn } from 'next-auth/react'

interface SignUpFormData {
  name: string
  email: string
  password: string
  terms: boolean
}

const SignUpPage = () => {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({ mode: 'onTouched' })

  const handleGoogleSignup = () => {
    signIn('google', {
      callbackUrl: '/home',
    })
  }

  const onSubmit = async (data: SignUpFormData) => {
    setApiError(null)

    try {
      const nameParts = data.name.trim().split(/\s+/)
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ')

      const payload: userSignupInfo = {
        email: data.email,
        password: data.password,
        first_name: firstName,
        last_name: lastName,
      }

      await signup(payload)

      try {
        await resendVerification(data.email)
      } catch {
        // Verification email is best-effort
      }

      router.push('/login?message=check_email')
    } catch (err) {
      const error = err as AxiosError<{ error: string }>

      if (error.response?.status === 409) {
        setApiError(
          'This email address is already registered. Please try logging in.'
        )
      } else {
        const message = error.response?.data?.error || 'Registration failed.'
        setApiError(message)
      }

      // Error already displayed via apiError state
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
      <div className="flex min-h-screen relative">
        <div className="fixed inset-0 z-0">
          <Image
            alt="African Safari Sunset"
            className="w-full h-full object-cover"
            data-alt="Fiery sunset with silhouetted acacia tree landscape"
            height="1280"
            width="1024"
            src="/images/African-Safari-Sunset2.png"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background-dark/40 via-transparent to-transparent"></div>
        </div>
        <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-16">
          <div className="hidden md:fixed md:top-80 md:bottom-0 md:left-0 md:flex md:w-2/5 lg:w-1/2 flex-col justify-center pb-12 lg:pb-20 text-white pr-12 md:pl-12">
            <h1 className="text-4xl lg:text-7xl font-bold leading-tight mb-6">
              Begin Your <span className="text-primary">Adventure</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-200 max-w-lg">
              Discover curated African experiences and connect with fellow
              travelers.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative z-20">
          <div className="w-full max-w-md space-y-8 p-10 bg-white/85 dark:bg-background-dark/90 glass-effect rounded-xl shadow-2xl border border-white/20 dark:border-white/10">
            <Image
              src="/images/logo&name.png"
              alt="African Tourism Logo"
              className="z-20 fixed top-4 left-4 sm:top-8 sm:left-10 hidden sm:block"
              width={100}
              height={100}
            />
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Create Account
              </h2>
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                Join our community and plan your dream adventure.
              </p>
            </div>
            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-full text-sm text-center mb-4">
                {apiError}
              </div>
            )}
            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="space-y-2">
                <Label
                  className="text-sm font-bold text-slate-800 dark:text-slate-200 ml-1"
                  htmlFor="name"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </span>
                  <Input
                    {...register('name', { required: 'Full name is required' })}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none backdrop-blur-sm"
                    id="name"
                    placeholder="John Doe"
                    type="text"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-2 ml-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  className="text-sm font-bold text-slate-800 dark:text-slate-200 ml-1"
                  htmlFor="email"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </span>
                  <Input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Enter a valid email',
                      },
                    })}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none backdrop-blur-sm"
                    id="email"
                    placeholder="john@example.com"
                    type="email"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-2 ml-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  className="text-sm font-bold text-slate-800 dark:text-slate-200 ml-1"
                  htmlFor="password"
                >
                  Password
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </span>
                  <Input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none backdrop-blur-sm"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-2 ml-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 px-1">
                <Input
                  {...register('terms', {
                    required: 'You must accept the Terms of Service',
                  })}
                  className="h-4 w-4 rounded border-slate-300 accent-primary  focus:ring-primary"
                  id="terms"
                  type="checkbox"
                />
                <Label
                  className="text-xs text-slate-700  font-medium"
                  htmlFor="terms"
                >
                  I agree to the{' '}
                  <a
                    className="text-primary hover:underline font-bold"
                    href="/terms"
                    target="_blank"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    className="text-primary hover:underline font-bold"
                    href="/privacy"
                    target="_blank"
                  >
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-600 mt-2 ml-1">
                  {errors.terms.message}
                </p>
              )}
              <Button
                className={`w-full text-white font-bold rounded-full ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                    <span>Creating</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </Button>
            </form>
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-900/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-slate-700 font-semibold">
                  Or Sign Up with
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                className="flex items-center justify-center gap-3 w-full py-4 input-glass rounded-full bg-white hover:bg-white/40 transition-colors"
                onClick={handleGoogleSignup}
              >
                <FcGoogle size={24} />
                <span className="text-sm text-black font-bold">
                  Sign in with Google
                </span>
              </button>
            </div>
            <div className="text-center pt-2">
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                Already have an account?
                <Link
                  className="text-primary font-bold hover:underline ml-1 transition-colors"
                  href="/login"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage

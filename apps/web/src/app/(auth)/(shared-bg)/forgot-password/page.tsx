/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState } from 'react'
import { MdMailOutline, MdSend, MdArrowBack } from 'react-icons/md'
import LoginForgotLayout from '../layout'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const ForgotPasswordPage = () => {
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSending) return
    setIsSending(true)
    try {
      // simulate async send — replace with real API call
      await new Promise((res) => setTimeout(res, 1400))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <LoginForgotLayout>
      <div
        className="w-full max-w-125 overflow-hidden
         flex flex-col justify-center mt-10 bg-white/70 rounded-2xl items-center md:items-center md:ml-[90%] lg:ml-[110%]"
      >
        <div className="glass-effect rounded-lg p-8 md:p-12 w-full shadow-2xl">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Forgot Password?
              </h2>
              <p className="text-slate-700 font-medium leading-relaxed">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label
                  className="text-sm font-bold text-slate-800 block mb-4 ml-4"
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
                    id="email"
                    placeholder="name@example.com"
                    required
                    type="email"
                  />
                </div>
              </div>
              <Button
                className={`w-full text-white rounded-full font-bold ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={isSending}
                aria-busy={isSending}
              >
                {isSending ? (
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
                    <span>Sending</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <MdSend />
                  </>
                )}
              </Button>
            </form>
            <div className="mt-8 text-center">
              <Link
                className="inline-flex items-center gap-2 text-slate-800  font-bold hover:text-primary transition-colors group"
                href="/login"
              >
                <MdArrowBack />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LoginForgotLayout>
  )
}

export default ForgotPasswordPage

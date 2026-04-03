'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import { clearAuthCookie } from '@/actions/auth_actions'
import { fetchProfile } from '@/actions/profile_actions'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Search, LogOut, X } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import LogoutConfirmationModal from '@/components/logout-confirmation-modal'

const navLinks = [
  { name: 'Home', href: '/home' },
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'My Packages', href: '/my-packages' },
  { name: 'My Trips', href: '/my-trips' },
  { name: 'Feed', href: '/feed' },
]

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading, logout } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState('/images/user-icon.png')

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
      await clearAuthCookie()
      router.refresh()
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
      setIsLogoutModalOpen(false)
    }
  }

  const isLandingPage = pathname === '/' || pathname === '/landing'
  const isHomePage = pathname === '/home'
  const isInteriorPage = !isLandingPage && !isHomePage

  const [isScrolled, setIsScrolled] = useState(false)

  const HOME_TEXT_SWITCH_SCROLL_Y = 400

  useEffect(() => {
    if (!isHomePage) return

    const onScroll = () => {
      const passed = window.scrollY >= HOME_TEXT_SWITCH_SCROLL_Y
      setIsScrolled(passed)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHomePage])

  useEffect(() => {
    let cancelled = false

    const loadProfileAvatar = async () => {
      if (!isAuthenticated) {
        setAvatarSrc('/images/user-icon.png')
        return
      }

      const result = await fetchProfile()

      if (cancelled) {
        return
      }

      if (result.success && result.data.avatar_url) {
        setAvatarSrc(result.data.avatar_url)
        return
      }

      setAvatarSrc('/images/user-icon.png')
    }

    loadProfileAvatar()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const query = searchTerm.trim()
    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    const search = params.toString()
    const target = search ? `/marketplace?${search}` : '/marketplace'

    router.push(target)
  }

  // Styling adapts to route (transparent on landing/home, solid on interior)
  const useDarkText = isInteriorPage || (isHomePage && isScrolled)
  const textColorClass = useDarkText ? 'text-gray-800' : 'text-white'

  const navClassName = isInteriorPage
    ? 'sticky top-0 z-50 w-full border-b border-[#ebe5dc] bg-white/95 px-5 backdrop-blur-sm md:px-10'
    : 'sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 px-5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xs md:px-10'

  // ── Not authenticated: show Log In + Get Started ──
  if (isLoading) {
    return (
      <nav className={navClassName}>
        <div className="max-w-360 mx-auto flex items-center justify-between h-15 md:h-18">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo&name.png"
              alt="Amona"
              width={100}
              height={100}
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>
        </div>
      </nav>
    )
  }

  if (!isAuthenticated) {
    return (
      <nav className={navClassName}>
        <div className="max-w-360 mx-auto flex items-center justify-between h-15 md:h-18">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo&name.png"
              alt="Amọnà"
              width={100}
              height={100}
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-5 md:gap-8">
            <Link
              href="/login"
              className={`${textColorClass} text-sm md:text-base font-medium tracking-wide hover:opacity-80 transition-opacity`}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-primary hover:bg-[#f48c25] text-white text-sm md:text-base font-semibold tracking-wide px-5 md:px-7 py-2 md:py-2.5 rounded-full transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  // ── Authenticated: show nav links + avatar + logout ──
  return (
    <nav className={navClassName}>
      <div className="max-w-360 mx-auto flex items-center justify-between h-15 md:h-18">
        <Link href="/home" className="flex items-center">
          <Image
            src="/images/logo&name.png"
            alt="Amọnà"
            width={100}
            height={100}
            className="h-8 md:h-10 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm md:text-base font-medium transition-colors ${
                  isActive
                    ? 'text-[#ec6d13] border-b-2 border-[#ec6d13] pb-1'
                    : `${textColorClass} hover:text-[#ec6d13] pb-1`
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={() => {
              if (!isSearchOpen) {
                setSearchTerm(searchParams.get('q') ?? '')
              }

              setIsSearchOpen((prev) => !prev)
            }}
            aria-label={
              isSearchOpen ? 'Close package search' : 'Open package search'
            }
            className={`${textColorClass} hover:text-[#ec6d13] transition-colors`}
          >
            {isSearchOpen ? (
              <X className="h-5 w-5 md:h-6 md:w-6" />
            ) : (
              <Search className="h-5 w-5 md:h-6 md:w-6" />
            )}
          </button>

          <Link
            href="/profile"
            aria-label="Go to profile page"
            className={`block h-8 w-8 md:h-10 md:w-10 rounded-full overflow-hidden cursor-pointer ${
              isInteriorPage
                ? 'border border-[#f0d8c6]'
                : 'border-2 border-white'
            }`}
          >
            <Image
              src={avatarSrc}
              alt="User"
              width={100}
              height={100}
              className="object-cover h-full w-full"
              unoptimized
              onError={() => setAvatarSrc('/images/user-icon.png')}
            />
          </Link>

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            aria-label="Log out"
            className={`${textColorClass} hover:text-[#ec6d13] transition-colors`}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isSearchOpen ? (
        <div className="max-w-360 mx-auto pb-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 rounded-2xl border border-[#E6E0DA] bg-white px-3 py-2 shadow-sm"
          >
            <Search className="h-4 w-4 text-[#9A908A]" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search packages by title, place, or category"
              className="w-full bg-transparent text-[14px] text-[#2C2825] outline-none placeholder:text-[#9A908A]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#F48C25] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#de7b1e]"
            >
              Search
            </button>
          </form>
        </div>
      ) : null}

      <LogoutConfirmationModal
        open={isLogoutModalOpen}
        isSubmitting={isLoggingOut}
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </nav>
  )
}

export default Navbar

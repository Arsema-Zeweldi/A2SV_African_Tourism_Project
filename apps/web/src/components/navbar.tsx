"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const isLandingPage = pathname === "/landing";

  const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "My Packages", href: "/my-packages" },
    { name: "My Trips", href: "/my-trips" },
    { name: "Feed", href: "/feed" },
  ];

  if (isLandingPage) {
    return (
      <nav
        className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 px-5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xs md:px-10"
      >
        <div className="max-w-360 mx-auto flex items-center justify-between h-15 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo&name.png"
              alt="Amọnà"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-5 md:gap-8">
            <Link
              href="/login"
              className="text-white text-sm md:text-base font-medium tracking-wide hover:opacity-80 transition-opacity"
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
    );
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 px-5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xs md:px-10"
    >
      <div className="max-w-360 mx-auto flex items-center justify-between h-15 md:h-18">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            width={500}
            height={500}  
            src="/images/logo&name.png"
            alt="Amọnà"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm md:text-base pb-1 font-medium text-[#ec6d13]  transition-colors ${isActive
                  ? "border-b-2 border-[#ec6d13] "
                  : ""
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-white hover:text-[#ec6d13] transition-colors">
            <Search className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full overflow-hidden border-2 border-white cursor-pointer">
            <Link href="/profile">
              <User className="h-full w-full object-cover" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

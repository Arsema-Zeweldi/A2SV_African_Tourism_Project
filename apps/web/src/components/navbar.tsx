"use client";

import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav
      className="w-full glass-effect bg-white/25 sticky top-0 z-50 px-5 md:px-10 border-b border-white/[0.08]"
    // style={{
    //   background:
    //     "linear-gradient(135deg, #8b6914 0%, #b8860b 25%, #c4943d 50%, #a07830 75%, #7a6032 100%)",
    // }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-[60px] md:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
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
};

export default Navbar;
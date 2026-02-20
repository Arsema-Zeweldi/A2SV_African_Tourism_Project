"use client";

import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="absolute left-0 right-0 top-0 z-50 w-full pt-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between relative">
                {/* Logo (Left) */}
                <Link href="/" className="relative z-10 flex-shrink-0">
                    <Image
                        src="/images/logo&name.png"
                        alt="Amònà"
                        width={140}
                        height={40}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Nav Links (Absolutely Centered) - Use pointer-events-none on parent if problematic, but centered absolute is standard */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <ul className="pointer-events-auto hidden items-center gap-12 lg:flex">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "relative font-sans text-[15px] font-semibold tracking-wide transition-all duration-300 hover:text-[#ec6d13]",
                                        link.active
                                            ? "text-[#ec6d13]"
                                            : "text-white/90 drop-shadow-md hover:drop-shadow-none"
                                    )}
                                >
                                    {link.label}
                                    {link.active && (
                                        <span className="absolute -bottom-2.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#ec6d13] shadow-[0_0_8px_rgba(236,109,19,0.6)]" />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Actions (Search + Profile) */}
                <div className="relative z-10 flex items-center gap-6">
                    <button
                        className="text-white/90 drop-shadow-md transition-colors hover:text-[#ec6d13]"
                        aria-label="Search"
                    >
                        <Search className="h-6 w-6 stroke-[2.5px]" />
                    </button>

                    <button
                        className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white/30 transition-all hover:border-[#ec6d13] hover:shadow-[0_0_12px_rgba(236,109,19,0.4)]"
                        aria-label="Profile"
                    >
                        <Image
                            src="/homepage/community1.png" // Placeholder avatar
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </button>
                </div>
            </div>
        </nav>
    );
}

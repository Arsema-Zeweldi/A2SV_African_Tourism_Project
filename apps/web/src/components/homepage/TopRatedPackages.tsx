"use client";

import PackageCard from "@/components/homepage/PackageCard";
import { topRatedPackages } from "@/lib/homepage-data";

export default function TopRatedPackages() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            {/* Header */}
            <div className="mb-10 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Top-Rated Packages
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Curated by experts, loved by our community.
                    </p>
                </div>

                {/* Navigation Arrows */}
                <div className="hidden gap-2 sm:flex">
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-[#ec6d13] hover:text-[#ec6d13]"
                        aria-label="Previous packages"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-[#ec6d13] hover:text-[#ec6d13]"
                        aria-label="Next packages"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {topRatedPackages.map((pkg) => (
                    <PackageCard key={pkg.id} package_={pkg} />
                ))}
            </div>
        </section>
    );
}

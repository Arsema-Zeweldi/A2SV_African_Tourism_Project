import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden pt-24 sm:pt-32 lg:pt-0">
            {/* Background Image */}
            <div className="absolute inset-0 h-full w-full">
                <Image
                    src="/homepage/home_hero.png"
                    alt="African sunset with acacia trees"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />

                {/* Subtle dark overlay for text contrast */}
                <div className="absolute inset-0 bg-black/25" />
            </div>

            {/* Top Gradient for Navbar */}
            <div className=" inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />

            {/* Bottom White Gradient Fade */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/70 to-transparent" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 text-center">
                {/* Badge */}
                <div className="mb-8 inline-flex items-center rounded-full bg-[#ec6d13] px-6 py-2.5 shadow-lg shadow-orange-900/40 ring-1 ring-white/20 backdrop-blur-sm transition-transform hover:scale-105 hover:shadow-orange-900/60">
                    <span className="font-sans text-xs font-bold tracking-[0.2em] text-white uppercase sm:text-sm">
                        AUTHENTIC EXPERIENCES
                    </span>
                </div>

                {/* Heading */}
                <h1 className="mb-8 font-serif text-5xl font-bold leading-[1.1] text-white drop-shadow-2xl sm:text-7xl md:text-8xl lg:text-[7rem]">
                    Experience
                    <span className="block">Africa</span>
                    <span className="block bg-gradient-to-r from-[#ec6d13] to-[#ff9f5a] bg-clip-text text-transparent drop-shadow-sm">
                        Like Never
                    </span>
                    <span className="block bg-gradient-to-r from-[#ff9f5a] to-[#ec6d13] bg-clip-text text-transparent drop-shadow-sm">
                        Before
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mb-12 max-w-2xl font-sans text-lg font-medium leading-relaxed text-white drop-shadow-lg sm:text-xl md:text-2xl">
                    Join a community of explorers and book curated adventures through the world&apos;s most breathtaking landscapes.
                </p>

                {/* CTAs */}
                <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row">
                    <Button
                        size="lg"
                        className="group h-16 min-w-[200px] gap-3 rounded-full bg-[#ec6d13] pl-8 pr-10 text-lg font-bold text-white shadow-2xl shadow-orange-900/50 transition-all hover:bg-[#d4600f] hover:translate-y-[-2px] hover:shadow-orange-900/70"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30">
                            <MapPin className="h-4 w-4 fill-current" />
                        </div>
                        Plan Your Trip
                    </Button>

                    <Button
                        variant="ghost"
                        size="lg"
                        className="group h-16 min-w-[200px] gap-3 rounded-full border border-white/40 bg-white/10 px-10 text-lg font-bold text-white backdrop-blur-md transition-all hover:border-white/60 hover:bg-white/20 hover:text-white hover:shadow-lg"
                    >
                        Start Exploring
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </section>
    );
}

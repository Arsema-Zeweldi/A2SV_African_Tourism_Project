import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="flex min-h-[120vh] w-full items-center overflow-hidden pt-10 sm:pt-14 md:min-h-[calc(100vh-64px)] lg:pt-0">
            {/* Background Image */}
            <div className="absolute inset-0 h-full w-full">
                <Image
                    src="/homepage/home_hero.png"
                    alt="African sunset with acacia trees"
                    fill
                    priority
                    className="object-fit"
                    sizes="100vw"
                />

                {/* Subtle dark overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/25 " />
            </div>

            {/* Top Gradient for Navbar */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 via-black/35 to-transparent" />

            {/* Bottom White Gradient Fade */}
            <div className="absolute inset-x-0 bottom-0 h-3/16 bg-gradient-to-t from-white via-white/50 to-transparent" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-start justify-center px-5 pb-14 text-left md:px-8 lg:px-10">
                {/* Badge */}
                <div className="mb-6 inline-flex items-center rounded-full bg-[#ec6d13] px-4 py-1.5 shadow-lg shadow-orange-900/35 ring-1 ring-white/20 backdrop-blur-sm">
                    <span className="font-sans text-[10px] font-semibold tracking-[0.16em] text-white uppercase sm:text-xs">
                        AUTHENTIC EXPERIENCES
                    </span>
                </div>

                {/* Heading */}
                <h1 className="mb-6 max-w-[42rem] font-serif text-[3.1rem] font-semibold leading-[0.96] text-white drop-shadow-2xl sm:text-[3.8rem] md:text-[4.25rem] lg:text-[4.75rem]">
                    Experience
                    <span className="block">Africa</span>
                    <span className="block bg-[#EC6D13] bg-clip-text text-transparent drop-shadow-sm">
                        Like Never
                    </span>
                    <span className="block bg-[#EC6D13] bg-clip-text text-transparent drop-shadow-sm">
                        Before
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mb-9 max-w-[35rem] font-sans text-base font-light leading-relaxed text-white/95 drop-shadow-lg sm:text-[1.1rem] pr-32">
                    Join a community of explorers and book curated adventures through the world&apos;s most breathtaking landscapes.
                </p>

                {/* CTAs */}
                <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <Button
                        size="lg"
                        className="group h-12 min-w-[160px] gap-2.5 rounded-full bg-[#ec6d13] pl-5 pr-7 text-sm font-semibold text-white shadow-xl shadow-orange-900/45 transition-all hover:bg-[#d4600f] hover:translate-y-[-1px] hover:shadow-orange-900/65"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30">
                            <MapPin className="h-3.5 w-3.5 fill-current" />
                        </div>
                        Plan Your Trip
                    </Button>

                    <Button
                        variant="ghost"
                        size="lg"
                        className="group h-12 min-w-[160px] gap-2.5 rounded-full border border-white/40 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/60 hover:bg-white/20 hover:text-white hover:shadow-lg"
                    >
                        Start Exploring
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </section>
    );
}

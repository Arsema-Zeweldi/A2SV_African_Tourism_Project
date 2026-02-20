import React from "react";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col -mt-[60px] md:-mt-[72px] pt-[60px] md:pt-[72px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/landing-page.png')" }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f5f0e8]"></div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
          {/* Badge */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#f0a030]" />
            <span className="text-white/90 text-xs font-semibold tracking-[0.15em] uppercase">
              New: Serengeti Expeditions 2024
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6">
            Explore Africa,
            <br />
            <span className="text-primary italic">Your Way</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/75 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            Discover curated experiences, plan bespoke itineraries, and connect
            with a community of fellow explorers on the continent of light.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-primary hover:bg-[#f48c25] text-white text-base font-semibold px-10 py-3.5 rounded-full transition-colors min-w-[200px]"
            >
              Start Your Journey
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white text-base font-semibold px-10 py-3.5 rounded-full transition-colors min-w-[200px]"
            >
              Welcome Back
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 flex flex-col items-center gap-2 pb-10">
          <span className="text-white/50 text-xs font-semibold tracking-[0.2em] uppercase">
            Scroll Discover
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════ */}
      <section className="bg-[#f5f0e8] py-20 md:py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-[#1a1008] leading-tight mb-5">
              Crafted for the Modern Explorer
            </h2>
            <div className="w-12 h-1 bg-[#f0a030] mx-auto rounded-full" />
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Card 1 - Expert Curation */}
            <div className="flex flex-col">
              <div className="rounded-2xl overflow-hidden mb-5 aspect-[4/3]">
                <img
                  src="/images/lion.png"
                  alt="Expert Curation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f0a030]/10 mb-3">
                <svg className="w-5 h-5 text-[#f0a030]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1a1008] mb-2">
                Expert Curation
              </h3>
              <p className="text-sm leading-relaxed text-[#6b5e4b]">
                Hand-picked destinations and hidden gems curated by local experts
                who live and breathe the African terrain.
              </p>
            </div>

            {/* Card 2 - Community Feed */}
            <div className="flex flex-col">
              <div className="rounded-2xl overflow-hidden mb-5 aspect-[4/3]">
                <img
                  src="/images/community-feed.png"
                  alt="Community Feed"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f0a030]/10 mb-3">
                <svg className="w-5 h-5 text-[#f0a030]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1a1008] mb-2">
                Community Feed
              </h3>
              <p className="text-sm leading-relaxed text-[#6b5e4b]">
                Share your stories and get real-time advice from our global
                network of travelers currently on the ground.
              </p>
            </div>

            {/* Card 3 - Personalized Planner */}
            <div className="flex flex-col">
              <div className="rounded-2xl overflow-hidden mb-5 aspect-[4/3]">
                <img
                  src="/images/personalized-planner.png"
                  alt="Personalized Planner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f0a030]/10 mb-3">
                <svg className="w-5 h-5 text-[#f0a030]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1a1008] mb-2">
                Personalized Planner
              </h3>
              <p className="text-sm leading-relaxed text-[#6b5e4b]">
                AI-driven itineraries tailored to your pace, budget, and
                interests. From luxury lodges to rugged camping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════ */}
      <section className="bg-primary py-10 md:py-14 px-6">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50+", label: "Countries" },
            { value: "12k", label: "Experiences" },
            { value: "85k", label: "Explorers" },
            { value: "4.9/5", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-white leading-none mb-2">
                {stat.value}
              </span>
              <span className="text-white/80 text-xs font-semibold tracking-[0.2em] uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MAP SECTION
      ═══════════════════════════════════════════ */}
      <section className="bg-[#f5f0e8] py-20 md:py-28 px-6 overflow-hidden">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-[#1a1008] leading-tight mb-6">
              Your Map to the
              <br />
              <span className="text-primary">Untamed</span>
            </h2>
            <p className="text-[15px] leading-[1.8] text-[#6b5e4b] mb-8 max-w-md">
              Our interactive platform provides real-time updates on weather,
              wildlife sightings, and border requirements. Navigate the diverse
              landscapes of Africa with confidence and ease.
            </p>

            {/* Checkmarks */}
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-[#3a3020] font-medium">
                  Offline map access for remote regions
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-[#3a3020] font-medium">
                  Live park gate status and fees
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="/map-explorer"
              className="inline-flex items-center justify-center bg-[#221810] hover:bg-[#2a1f12] text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Launch Map Explorer
            </a>
          </div>

          {/* Right - Map Mockup */}
          <div className="relative flex items-center justify-center p-12">
            {/* Relative wrapper for absolute positioning of the overlapping card */}
            <div className="relative w-[300px] sm:w-[340px] md:w-[380px]">

              {/* Map Card - Straight, with thick white frame */}
              <div className="bg-white p-3.5 rounded-[32px] shadow-2xl" style={{ transform: "rotate(3deg)" }}>
                <img
                  src="/images/africa-map.png"
                  alt="Interactive Africa Map"
                  className="w-full h-auto rounded-[20px]"
                />
              </div>

              {/* Live Sighting Card Overlay - Bottom Left & Overlapping */}
              <div className="absolute -bottom-6 -left-8 bg-white rounded-3xl p-5 shadow-xl w-[90%] sm:w-[85%] z-10" style={{ transform: "rotate(3deg)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">
                    Live Sighting
                  </span>
                </div>
                <p className="text-[17px] font-bold text-gray-800 leading-snug mb-1">
                  Leopard spotted near Seronera river bed
                </p>
                <p className="text-[13px] font-medium text-gray-400 mt-1.5">
                  2 minutes ago · Serengeti
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

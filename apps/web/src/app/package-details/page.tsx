import React from 'react';
import {
  Share2, Heart,
  CheckCircle, Eye, RefreshCcw,
  Info, Navigation
} from "lucide-react";
import CommunityChat from '@/components/package-detail/communityChat';
import Reviews from '@/components/package-detail/reviews';
import Itenerary from '@/components/package-detail/itenerary';
import CostBreakdown from '@/components/package-detail/costBreakdown';
import VisaCard from '@/components/package-detail/visaCard';
import Map from '@/components/package-detail/map';
import Video from '@/components/package-detail/video';
import Navbar from '@/components/navbar';
import { packageDetails } from './data';

const PackageDetailsPage = () => {
  const details = packageDetails;
  return (
    <div className="min-h-screen bg-[#FCFCFD] font-sans text-slate-900">

      {/* ── Navbar ── */}
      <Navbar />

      <main className="max-w-[1280px] mx-auto py-7 pb-16">

        {/* ── TOP GRID: Hero + Chat ── */}
        <div className="grid grid-cols-[1fr_340px] gap-5 mb-0">

          {/* Hero */}
          <section className="relative h-[500px] rounded-2xl overflow-hidden shadow-sm">
            <img
              src= {details.image}
              alt="Lagos to Accra Roadtrip"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {details.isPublic ? "Public" : "Private"}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1 rounded-full border border-white/25 flex items-center gap-1.5">
                  <CheckCircle size={11} /> AI Verified
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1 rounded-full border border-white/25 flex items-center gap-1.5">
                  <Eye size={11} /> 15k Views
                </span>
              </div>

              <h1 className="text-[32px] md:text-4xl font-black text-white leading-tight max-w-lg tracking-tight mb-5">
                {details.name}
              </h1>

              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src= {details.owner.avatar}
                    alt="Creator"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white/70 text-[11px] mb-0.5">Created by</p>
                    <p className="text-white font-bold text-[13px] flex items-center gap-1">
                      {details.owner.name} <CheckCircle size={13} className="text-blue-400" />
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-[11px] mb-0.5">Estimated Cost</p>
                  <p className="text-white text-2xl font-extrabold">
                    {details.cost} <span className="text-[11px] font-normal opacity-75">/ person</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

        <CommunityChat props={details.communityChat}/>

        </div>{/* /top-grid */}

        {/* ── Action Bar ── */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100 mb-7">
          <div className="flex items-center gap-2 text-[#926154] text-[12px] font-medium">
            <RefreshCcw size={13} /> Last updated 2 days ago
            <div id='buttons' className="ml-auto flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors text-[12px] font-semibold text-slate-700">
              <Share2 size={14} /> Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors text-[12px] font-semibold text-slate-700">
                <Heart size={14} /> Save
              </button>
              <button className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-orange-600 text-white rounded-xl text-[12px] font-bold transition-colors">
                <Navigation size={13} /> Follow this Path
              </button>
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-[1fr_340px] gap-7">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-7">

            {/* Description */}
            <p className="text-[14px] text-[#5A4B46] leading-[1.8]">
              {details.description}
            </p>

            {/* Video */}
            <Video  props={details.viralMoment}/>

            {/* Map + Itinerary */}
            <div className="grid grid-cols-2 gap-6">

              {/* Route Map */}
              <Map />

              {/* Itinerary */}
              <Itenerary props={details.itinerary} />
            </div>

            {/* Cost Breakdown */}
            <CostBreakdown props={details.costBreakdown} />
            

          </div>{/* /left col */}

          {/* ── SIDEBAR ── */}
          <aside className="flex flex-col gap-5">

            {/* Reviews */}
            <Reviews props={details.review} />

            {/* Visa Card */}
            <VisaCard />            

          </aside>
        </div>{/* /content-grid */}

      </main>
      <div className="bg-orange-50/60 border border-orange-100 rounded-xl px-3.5 py-2.5 flex items-start gap-2 text-[11px] text-orange-900 leading-relaxed">
        <Info size={13} className="shrink-0 mt-0.5" />
        <p>Disclaimer: Amọnà facilitates itinerary generation and community connection via package chats. We do not provide on-ground staff or tour guides. All on-site services are managed by third-party travel agents and guides.</p>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white text-center py-6 text-[12px] text-[#926154]">
        © 2026 Amọnà. All rights reserved.
      </footer>

    </div>
  );
};

export default PackageDetailsPage;
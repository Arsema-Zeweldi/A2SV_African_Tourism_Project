"use client";

import React, { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="relative bg-[#221810] text-[#d4c5a9] overflow-hidden pt-12 md:pt-20">
      {/* Decorative Animals */}
      <img
        src="/images/rhino.png"
        alt=""
        className="absolute bottom-0 left-0 h-[130px] md:h-[180px] lg:h-[280px] w-auto object-contain opacity-30 lg:opacity-55 pointer-events-none z-0"
        aria-hidden="true"
      />
      <img
        src="/images/giraffe.png"
        alt=""
        className="absolute bottom-0 right-0 h-[180px] md:h-[250px] lg:h-[380px] w-auto object-contain opacity-30 lg:opacity-55 pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Inner Container */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 pb-8 md:pb-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1.2fr] gap-9 md:gap-10 lg:gap-16 pb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-5">
            <a href="/" className="inline-flex items-center">
              <img
                src="/images/logo&name.png"
                alt="Amọnà"
                className="h-10 md:h-[42px] w-auto object-contain"
              />
            </a>
            <p className="text-[15px] leading-[1.7] text-[#a89878] max-w-[320px]">
              Empowering travelers to discover the authentic beauty of the
              African continent through technology and community.
            </p>
            <div className="flex items-center gap-3.5 mt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border-[1.5px] border-[#a89878]/50 text-[#d4c5a9] hover:border-[#f0a030] hover:text-[#f0a030] hover:bg-[#f0a030]/[0.08] transition-all"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border-[1.5px] border-[#a89878]/50 text-[#d4c5a9] hover:border-[#f0a030] hover:text-[#f0a030] hover:bg-[#f0a030]/[0.08] transition-all"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* Share */}
              <a
                href="#share"
                className="flex items-center justify-center w-10 h-10 rounded-full border-[1.5px] border-[#a89878]/50 text-[#d4c5a9] hover:border-[#f0a030] hover:text-[#f0a030] hover:bg-[#f0a030]/[0.08] transition-all"
                aria-label="Share"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore Column */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
              Explore
            </h3>
            <ul className="flex flex-col gap-3.5 list-none p-0 m-0">
              <li>
                <a
                  href="/safari-packages"
                  className="text-[15px] text-[#a89878] hover:text-[#f0a030] transition-colors"
                >
                  Safari Packages
                </a>
              </li>
              <li>
                <a
                  href="/coastal-retreats"
                  className="text-[15px] text-[#a89878] hover:text-[#f0a030] transition-colors"
                >
                  Coastal Retreats
                </a>
              </li>
              <li>
                <a
                  href="/mountain-treks"
                  className="text-[15px] text-[#a89878] hover:text-[#f0a030] transition-colors"
                >
                  Mountain Treks
                </a>
              </li>
              <li>
                <a
                  href="/cultural-tours"
                  className="text-[15px] text-[#a89878] hover:text-[#f0a030] transition-colors"
                >
                  Cultural Tours
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
              Get Updates
            </h3>
            <p className="text-[15px] leading-relaxed text-[#a89878]">
              Subscribe for curated deals and travel tips.
            </p>
            <form
              className="flex items-center mt-3 bg-white/[0.06] border border-white/10 rounded-full pl-5 pr-1 py-1 max-w-[380px]"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[#d4c5a9] text-sm py-2.5 min-w-0 placeholder:text-[#7a6e58]"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-[#f48c25] text-white rounded-full px-6 py-2.5 text-sm font-bold tracking-widest whitespace-nowrap transition-colors cursor-pointer"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(168,152,120,0.25) 20%, rgba(168,152,120,0.25) 80%, transparent 100%)",
          }}
        />

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-2.5 pt-7 text-center">
          <p className="text-sm text-[#7a6e58]">
            &copy; 2026 Amọnà. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <a
              href="/privacy"
              className="text-[13px] text-[#7a6e58] hover:text-[#d4c5a9] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-[13px] text-[#7a6e58] hover:text-[#d4c5a9] transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              className="text-[13px] text-[#7a6e58] hover:text-[#d4c5a9] transition-colors"
            >
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";

interface SponsorBannerProps {
  sponsorImage: StaticImageData;
  clubLogo?: StaticImageData;
  className?: string;
}

const SponsorBanner: React.FC<SponsorBannerProps> = ({
  sponsorImage,
  clubLogo,
  className = "",
}) => {
  return (
    <section
      className={`relative w-full overflow-hidden bg-gradient-to-r from-[#6CABDD] via-[#5fa8dc] to-[#1B365D] ${className}`}
    >
      {/* Top White Fade (Smooth transition from navbar) */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-white to-transparent z-10" />

      {/* Soft Radial Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-300/20 blur-3xl rounded-full" />

      {/* Watermark Logo */}
      {clubLogo && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="relative w-80 h-80 hidden md:block">
            <Image
              src={clubLogo}
              alt="Club Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 py-3 md:py-28 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* TEXT */}
        <div className="text-black text-center md:text-left space-y-2">
          <p className="uppercase tracking-widest text-xs text-black/70">
            Official Project Sponsor
          </p>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            Dr. Nekezieh Francis Jonathan Ekeh
          </h1>
        </div>

        {/* IMAGE */}
        <div className="relative w-24 h-24 md:w-28 md:h-32 rounded-full overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-1">
          <Image
            src={sponsorImage}
            alt="Sponsor"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default SponsorBanner;

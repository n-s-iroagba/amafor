"use client";

import HeroSection from "@/features/home/components/HeroSection";
import NextFixtureSection from "@/features/home/components/NextFixtureSection";
import AcademyScoutingSection from "@/features/home/components/AcademyScoutingSection";
import TrialistsSection from "@/features/home/components/TrialistsSection";
import LatestNewsSection from "@/features/home/components/LatestNewsSection";
import VideoSection from "@/features/home/components/VideoSection";
import SupportSection from "@/features/home/components/SupportSection";
import { Header } from "@/shared/components/Header";
import { CookieConsent } from "@/features/home/components/CookieConsent";
import { Footer } from "@/shared/components/Footer";
import { WhatsAppWidget } from "@/shared/components/WhatsAppWidget";
import FixtureGallerySection from "@/features/fixture/components/FixtureGallerySection";
import FeaturedNews from "@/features/home/components/FeaturedNews";
import sponsor from "@/images/mr_nekezieh.jpeg";
import clubLogo from "@/images/logo.jpeg";
import SponsorBanner from "@/features/home/components/SponsorBanner";

/**
 * Homepage
 * 
 * Club landing page displaying hero section, news highlights, fixtures, 
 * patron recognition, and academy onboarding CTAs.
 * 
 * @screen SC-001
 * @implements REQ-PUB-01, REQ-PUB-04, REQ-PUB-08, REQ-SUP-06, REQ-SUP-08, REQ-ACA-01
 * @usecase UC-FAN-01, UC-FAN-07, UC-FAN-08, UC-TRI-03, UC-SCT-01
 * @performance NFR-PERF-01 (Public pages < 2s load)
 * @observability SRS-OBS-001 Track homepage visits and CTA conversion
 */
export default function Home() {
  return (
    <>
      <SponsorBanner sponsorImage={sponsor} clubLogo={clubLogo} />
      <Header />
      <HeroSection />

      <NextFixtureSection />
      <AcademyScoutingSection />
      <TrialistsSection />
      <FixtureGallerySection />
      <LatestNewsSection />
      <VideoSection />
      <FeaturedNews />
      <SupportSection />
      <Footer />
      <CookieConsent />
      <WhatsAppWidget />
    </>
  );
}

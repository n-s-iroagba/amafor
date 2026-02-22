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
 * Page: Homepage
 * Description: Landing page with featured news, matches, and call-to-actions.
 * Requirements: REQ-PUB-01 to 09 (General Access)
 * User Story: US-PUB-001 (View Fixture List), US-PUB-003 (Browse News)
 * User Journey: UJ-PUB-001, UJ-PUB-002
 * API: Multiple (News, Fixtures, Videos)
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

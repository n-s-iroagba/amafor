'use client';

import HeroSection from '@/features/home/components/HeroSection'
import NextFixtureSection from '@/features/home/components/NextFixtureSection'
import AcademyScoutingSection from '@/features/home/components/AcademyScoutingSection'
import TrialistsSection from '@/features/home/components/TrialistsSection'
import LatestNewsSection from '@/features/home/components/LatestNewsSection'
import VideoSection from '@/features/home/components/VideoSection'
import SupportSection from '@/features/home/components/SupportSection'
import { Header } from '@/shared/components/Header';
import { CookieConsent } from '@/features/home/components/CookieConsent';
import { Footer } from '@/shared/components/Footer';
import { WhatsAppWidget } from '@/shared/components/WhatsAppWidget';
import MatchGallerySection from '@/features/fixture/components/MatchGallerySection';

export default function Homepage() {
  return (
    <>
      <Header />
      <HeroSection />
      <NextFixtureSection />
      <AcademyScoutingSection />
      <TrialistsSection />
      <MatchGallerySection />
      <LatestNewsSection />
      <VideoSection />
      <SupportSection />
      <Footer />
      <CookieConsent />
      <WhatsAppWidget />
    </>
  )
}
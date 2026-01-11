'use client';

import { Header } from '@/features/home/components/Header'
import HeroSection from '@/features/home/components/HeroSection'
import NextFixtureSection from '@/features/home/components/NextFixtureSection'
import AcademyScoutingSection from '@/features/home/components/AcademyScoutingSection'
import TrialistsSection from '@/features/home/components/TrialistsSection'
import MatchGallerySection from '@/features/home/components/MatchGallerySection'
import LatestNewsSection from '@/features/home/components/LatestNewsSection'
import VideoSection from '@/features/home/components/VideoSection'
import SupportSection from '@/features/home/components/SupportSection'
import { WhatsAppWidget } from '@/features/shared/WhatsAppWidget';
import { CookieConsent } from '@/features/shared/CookieConsent';
import { Footer } from '@/features/shared/Footer';

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
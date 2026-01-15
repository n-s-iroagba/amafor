'use client';

import Link from 'next/link'
import { GraduationCap, Eye, ArrowRight } from 'lucide-react'
import { ACADEMY_SCOUTING_TEST_IDS } from '../test-ids/academy-scouting-test-ids';


interface FeatureCardProps {
  title: string;
  description: string;
  features: readonly string[];
  href: string;
  ctaLabel: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ReactNode;
  iconBgColor: string;
  bulletColor: string;
  testId: string;
  linkTestId: string;
}

function FeatureCard({
  title,
  description,
  features,
  href,
  ctaLabel,
  gradientFrom,
  gradientTo,
  icon,
  iconBgColor,
  bulletColor,
  testId,
  linkTestId,
}: FeatureCardProps) {
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} p-8 md:p-12 text-white group hover:shadow-2xl transition-shadow`}
      data-testid={testId}
      role="article"
      aria-label={`${title} information`}
    >
      {/* Decorative background circle */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
        aria-hidden="true"
      />
      
      <div className="relative z-10">
        {/* Icon */}
        <div 
          className={`w-16 h-16 ${iconBgColor} rounded-lg flex items-center justify-center mb-6`}
          aria-hidden="true"
        >
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-3xl md:text-4xl font-black mb-4">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-white/90 mb-6 leading-relaxed text-lg">
          {description}
        </p>
        
        {/* Features list */}
        <ul className="space-y-3 mb-8" aria-label={`${title} features`}>
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div 
                className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                aria-hidden="true"
              >
                <div className={`w-2 h-2 ${bulletColor} rounded-full`} />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* CTA Link */}
        <Link
          href={href}
          className="inline-flex items-center gap-2 bg-white text-sky-600 hover:bg-gray-100 px-8 py-4 font-bold transition-all group-hover:gap-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-4 rounded-lg"
          data-testid={linkTestId}
          aria-label={`${ctaLabel} for ${title}`}
        >
          {ctaLabel}
          <ArrowRight 
            className="w-5 h-5 transition-transform group-hover:translate-x-1" 
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

export default function AcademyScoutingSection() {
  return (
    <section 
      className="py-24 bg-gray-50"
      data-testid={ACADEMY_SCOUTING_TEST_IDS.ROOT}
      role="region"
      aria-label="Academy and Pro View Scouting"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
{/* Academy Card */}
          <FeatureCard
            title="ACADEMY"
            description="Join our world-class youth development program. We nurture talent from grassroots to professional level with expert coaching and modern facilities."
            features={[
              "Professional coaching staff",
              "Age groups from U-8 to U-19",
              "Clear pathway to professional football"
            ]}
            href="/academy"
            ctaLabel="LEARN MORE"
            gradientFrom="from-sky-600"
            gradientTo="to-blue-800"
            icon={<GraduationCap className="w-8 h-8 text-white" />}
            iconBgColor="bg-white/20"
            bulletColor="bg-white"
            testId={ACADEMY_SCOUTING_TEST_IDS.ACADEMY_SECTION}
            linkTestId={ACADEMY_SCOUTING_TEST_IDS.ACADEMY_LINK}
          />

          {/* Scouting Card */}
          <FeatureCard
            title="PRO VIEW PORTAL"
            description="Are you a professional scout or agent? Get exclusive access to verified player profiles, full match archives, and comprehensive performance data."
            features={[
              "Access to full match video archives",
              "Verified player profiles with audit trails",
              "Downloadable player reports"
            ]}
            href="/pro-view"
            ctaLabel="APPLY FOR ACCESS"
            gradientFrom="from-slate-700"
            gradientTo="to-slate-900"
            icon={<Eye className="w-8 h-8 text-sky-400" />}
            iconBgColor="bg-sky-500/30"
            bulletColor="bg-sky-400"
            testId={ACADEMY_SCOUTING_TEST_IDS.SCOUTING_SECTION}
            linkTestId={ACADEMY_SCOUTING_TEST_IDS.SCOUTING_LINK}
          />
        </div>
      </div>
    </section>
  );
}
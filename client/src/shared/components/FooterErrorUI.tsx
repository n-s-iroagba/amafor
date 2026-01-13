'use client';

import { FOOTER_TEST_IDS } from "../test-ids/footer-test-ids";

interface FooterErrorUIProps {
  error: string;
}

/**
 * Error UI for footer component
 * 
 * @remarks
 * Rendered when footer encounters a critical error
 * Provides graceful degradation for users
 * 
 * @param error - Error message to display
 */
export function FooterErrorUI({ error }: FooterErrorUIProps) {
  return (
    <footer 
      className="bg-sky-900 text-white"
      data-testid={FOOTER_TEST_IDS.ROOT}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-slate-300">
          <p className="mb-2">Footer temporarily unavailable</p>
          <p className="text-xs opacity-75">
            Please contact support if this issue persists
          </p>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-slate-300">
          <p>&copy; {new Date().getFullYear()} Amafor Gladiators FC</p>
        </div>
      </div>
    </footer>
  )
}
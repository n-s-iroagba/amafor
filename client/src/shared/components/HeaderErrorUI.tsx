'use client';

import { HEADER_TEST_IDS } from "../test-ids/header-test-ids";



interface HeaderErrorUIProps {
  error: string;
}

/**
 * Error UI for header component
 * 
 * @remarks
 * Rendered when header encounters a critical error
 * Provides graceful degradation for users
 * 
 * @param error - Error message to display
 */
export function HeaderErrorUI({ error }: HeaderErrorUIProps) {
  return (
    <header 
      className="bg-red-50 border-b border-red-200 shadow-sm sticky top-0 z-50"
      data-testid={HEADER_TEST_IDS.ROOT}
      role="banner"
      aria-label="Site header"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-red-600 text-sm">
            Header temporarily unavailable
          </div>
        </div>
      </div>
    </header>
  )
}
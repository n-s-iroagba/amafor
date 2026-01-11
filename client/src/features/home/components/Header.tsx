'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import logo from '@/images/logo.jpeg'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'News', href: '/news' },
    { name: 'Fixtures', href: '/fixtures' },
    { name: 'Team', href: '/team' },
    { name: 'Academy', href: '/academy' },
    { name: 'Support', href: '/support' },
    { name: 'Advertise', href: '/advertise' },
    { name: 'Pro View', href: '/pro-view' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - FIXED */}
          <Link href="/" className="flex items-center gap-3 group">
      <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
  <Image
    src={logo}
    alt="Amafor Gladiators FC"
    width={56}  // Larger on desktop
    height={56}
    className="object-contain rounded-full border-2 border-sky-500"
    priority
    quality={85}
    sizes="(max-width: 640px) 40px, 56px" // Responsive sizing
  />
</div>
            <div className="hidden sm:block">
              <div className="text-gray-900 font-black text-lg leading-tight tracking-tight">
                AMAFOR GLADIATORS
              </div>
              <div className="text-sky-500 text-xs font-bold uppercase tracking-wider">
                FOOTBALL CLUB
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                  pathname?.startsWith(item.href)
                    ? 'text-sky-600 bg-sky-50 border-b-2 border-sky-500'
                    : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-2.5 text-sm font-bold rounded-md transition-all shadow-sm hover:shadow"
            >
              LOGIN
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-sky-600 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-gray-100 bg-white">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-3 text-base font-medium rounded-md transition-colors ${
                    pathname?.startsWith(item.href)
                      ? 'text-sky-600 bg-sky-50 border-l-4 border-sky-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:pl-5'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="mt-4 px-4">
                <Link
                  href="/auth/login"
                  className="block bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-5 py-3 text-center font-bold rounded-md transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  LOGIN
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
'use client'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-sky-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-heading mb-4">Amafor Gladiators FC</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Building champions through dedication, discipline, and elite performance since our founding.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-sky-600 flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-sky-600 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-sky-600 flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-sky-600 flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/news" className="text-slate-300 hover:text-sky-400 transition-colors">News & Updates</Link></li>
              <li><Link href="/fixtures" className="text-slate-300 hover:text-sky-400 transition-colors">Fixtures & Results</Link></li>
              <li><Link href="/academy" className="text-slate-300 hover:text-sky-400 transition-colors">Academy Program</Link></li>
              <li><Link href="/supporter-wall" className="text-slate-300 hover:text-sky-400 transition-colors">Supporter Wall</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-heading mb-4">Support Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support" className="text-slate-300 hover:text-sky-400 transition-colors">Donate Now</Link></li>
              <li><Link href="/support" className="text-slate-300 hover:text-sky-400 transition-colors">Become a Patron</Link></li>
              <li><Link href="/advertise" className="text-slate-300 hover:text-sky-400 transition-colors">Advertise With Us</Link></li>
              <li><Link href="/pro-view" className="text-slate-300 hover:text-sky-400 transition-colors">Pro View Access</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-heading mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Amafor Gladiators Stadium</li>
              <li>Lagos, Nigeria</li>
              <li className="pt-2">
                <a href="mailto:info@amaforgladiatorsfc.com" className="hover:text-sky-400 transition-colors">
                  info@amaforgladiatorsfc.com
                </a>
              </li>
              <li>
                <a href="tel:+234XXXXXXXXXX" className="hover:text-sky-400 transition-colors">
                  +234 XXX XXX XXXX
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-300">
          <p>&copy; {new Date().getFullYear()} Amafor Gladiators FC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/help" className="hover:text-sky-400 transition-colors">Help & Contact</Link>
            <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

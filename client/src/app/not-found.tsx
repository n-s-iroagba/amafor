'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Logo/Club Badge */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-white p-5 rounded-full border-4 border-sky-500 shadow-lg">
              <ShieldAlert className="w-16 h-16 text-sky-600" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-2 rounded-full border border-sky-200 mb-6">
            <span className="text-sky-600 font-bold text-sm uppercase tracking-wider">
              404 - Page Not Found
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            OOPS! <span className="text-sky-600">PAGE OUT OF PLAY</span>
          </h1>

          <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            The page you're looking for has either been moved, removed, or never existed.
            It might have been substituted or is currently under maintenance.
          </p>

          {/* Fixture Info Style Box */}
          <div className="bg-white border-2 border-sky-100 rounded-xl p-6 max-w-md mx-auto shadow-sm mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Current Status
                </div>
                <div className="text-gray-900 font-bold">Resource Unavailable</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Error Code
                </div>
                <div className="text-sky-600 font-mono font-bold">404</div>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent my-4"></div>
            <div className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Last Checked:</span> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 min-w-[240px] justify-center"
          >
            <Home className="w-5 h-5" />
            <span>RETURN TO HOMEPAGE</span>
            <ArrowLeft className="w-5 h-5 transform rotate-180 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/news"
            className="bg-white border-2 border-sky-500 text-sky-600 hover:bg-sky-50 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-sm hover:shadow flex items-center gap-3 min-w-[240px] justify-center"
          >
            <span>LATEST NEWS</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4 text-center">
            Quick Navigation
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Fixtures', 'Team', 'Academy', 'Support'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sky-600 hover:text-sky-700 font-medium px-4 py-2 hover:bg-sky-50 rounded-lg transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="text-xs text-gray-400 font-mono tracking-wide">
            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-sky-400 rounded-full"></div>
              <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
              <div className="w-3 h-3 bg-sky-600 rounded-full"></div>
            </div>
            <p className="text-gray-400">
              Amafor Gladiators FC • Official Website
            </p>
            <p className="text-gray-400 mt-1 text-[10px] uppercase tracking-widest">
              If this persists, contact <span className="text-sky-500">support@amaforgladiators.fc</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Error({ 
  error, 
  reset 
}: { 
  error: Error; 
  reset: () => void 
}) {
  useEffect(() => {
    console.error('Ecosystem Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center text-center px-4 py-12">
      {/* Error Icon with Animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative bg-white p-8 rounded-2xl shadow-2xl border-2 border-red-100">
          <AlertCircle className="w-24 h-24 text-red-500" />
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-2 tracking-tight">
          TECHNICAL FOUL
        </h1>
        <div className="h-2 w-32 bg-red-500 mx-auto"></div>
      </div>

      {/* Description */}
      <p className="text-lg text-gray-600 font-semibold mb-3 max-w-md">
        The system encountered a runtime exception
      </p>
      <p className="text-sm text-gray-500 uppercase tracking-wider mb-12 max-w-md">
        The internal integrity log has been notified
      </p>

      {/* Error Details (Optional - can be shown in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-900 text-white rounded-lg p-6 mb-8 max-w-2xl w-full text-left overflow-auto">
          <p className="text-xs font-mono text-red-400 mb-2">ERROR DETAILS:</p>
          <p className="text-sm font-mono break-all">{error.message}</p>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => reset()}
          className="group bg-sky-500 hover:bg-sky-600 text-white rounded-lg flex items-center justify-center gap-3 py-5 px-10 font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span>REBOOT SESSION</span>
        </button>
        
        <Link 
          href="/" 
          className="group bg-gray-900 hover:bg-gray-800 text-white rounded-lg flex items-center justify-center gap-3 py-5 px-10 font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>RETURN HOME</span>
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </div>
  );
}
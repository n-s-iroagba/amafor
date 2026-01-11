'use client';
import Link from 'next/link'


export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-sky-500">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[85vh] py-20">
          <div className="text-white space-y-6">
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black leading-none">
              AMAFOR<br />
              <span className="text-white/90">GLADIATORS</span>
            </h1>
           
            <p className="text-xl text-white/95 leading-relaxed max-w-lg font-light">
              Building champions through dedication, discipline, and elite performance
            </p>
            
            <div className="flex flex-wrap gap-4 pt-6">
              <Link
                href="/support"
                className="bg-white text-sky-600 hover:bg-gray-100 px-10 py-4 font-bold transition-all"
              >
                SUPPORT THE CLUB
              </Link>
              <Link
                href="/news"
                className="border-2 border-white text-white hover:bg-white hover:text-sky-600 px-10 py-4 font-bold transition-all"
              >
                LATEST NEWS
              </Link>
            </div>
          </div>  
          
          <div className="relative h-[600px] lg:h-[700px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)',
                  clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
                }}
              />
              
              <div className="absolute inset-0 bg-white" style={{
                clipPath: 'polygon(0 85%, 100% 70%, 100% 100%, 0 100%)',
              }}></div>
              
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-sky-400"></div>
              
              <div className="absolute top-8 right-8 bg-sky-500/95 backdrop-blur-sm p-6 text-white">
                <div className="text-4xl font-black mb-1">2026</div>
                <div className="text-xs font-bold uppercase tracking-widest">Season</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
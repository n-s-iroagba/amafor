import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-sky-600">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 z-0" />

      {/* Soft glow accents */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-15">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[85vh] py-20">
          {/* LEFT CONTENT */}
          <div className="text-white space-y-6">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none"
            >
              AMAFOR<br />
              <span className="text-white/90">GLADIATORS</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg sm:text-xl text-white/95 max-w-lg font-light"
            >
              Building champions through dedication, discipline, and elite performance
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap gap-4 pt-6"
            >
              <Link
                href="/patron"
                className="bg-white text-sky-600 hover:bg-gray-100 px-10 py-4 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                SUPPORT THE CLUB
              </Link>

              <Link
                href="/news"
                className="border-2 border-white text-white hover:bg-white hover:text-sky-600 px-10 py-4 font-bold transition-all hover:scale-105 active:scale-95"
              >
                LATEST NEWS
              </Link>
            </motion.div>
          </div>

          {/* RIGHT IMAGE BLOCK - SIMPLIFIED */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-[450px] sm:h-[550px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Direct Image container - no extra nesting */}
            <Image
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018"
              alt="Football action"
              fill
              priority
              quality={90}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* IMAGE CLIP SHAPE */}
            <div
              className="absolute inset-0 z-10"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.25))',
              }}
            />

            {/* WHITE ACCENT CUT */}
            <div
              className="absolute bottom-0 left-0 right-0 h-20 bg-white z-20"
              style={{
                clipPath: 'polygon(0 25%, 100% 0, 100% 100%, 0 100%)',
              }}
            />

            {/* COLOR STRIPE */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-sky-400 z-30" />

            {/* SEASON BADGE */}
            <div className="absolute top-8 right-8 bg-sky-500/95 backdrop-blur-sm p-6 text-white z-30">
              <div className="text-4xl font-black mb-1">2026</div>
              <div className="text-xs font-bold uppercase tracking-widest">
                Season
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
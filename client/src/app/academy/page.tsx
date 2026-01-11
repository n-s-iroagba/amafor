'use client'

import { Header } from '@/features/home/components/Header'
import { Footer } from '@/features/home/components/Footer'
import Link from 'next/link'
import { Target, BookOpen, Users, TrendingUp } from 'lucide-react'

export default function AcademyHub({ params }: { params: { section?: string[] } }) {
  const activeSection = params.section?.[0] || 'overview'

  const sections = [
    { id: 'overview', name: 'Overview', icon: Target },
    { id: 'philosophy', name: 'Philosophy', icon: BookOpen },
    { id: 'curriculum', name: 'Curriculum', icon: BookOpen },
    { id: 'staff', name: 'Staff', icon: Users },
    { id: 'pathway', name: 'Player Pathway', icon: TrendingUp }
  ]

  return (
    <>
      <Header />
      
      <main className="py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl mb-8 font-heading">Youth Academy</h1>

          {/* Sub-Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {sections.map((sec) => {
              const Icon = sec.icon
              return (
                <Link
                  key={sec.id}
                  href={`/academy/${sec.id}`}
                  className={`px-6 py-3 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeSection === sec.id
                      ? 'bg-sky-700 text-white font-medium'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                  aria-current={activeSection === sec.id ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {sec.name}
                </Link>
              )
            })}
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-card p-8">
            {activeSection === 'overview' && (
              <div>
                <h2 className="text-3xl mb-6 font-heading">Academy Overview</h2>
                <div className="prose max-w-none">
                  <p className="text-lg text-slate-700 mb-4">
                    The Amafor Gladiators FC Youth Academy is committed to developing the next generation 
                    of football talent in Nigeria. Our comprehensive program focuses on technical skill 
                    development, tactical understanding, physical conditioning, and character building.
                  </p>
                  <p className="text-slate-700 mb-4">
                    We provide a structured pathway from grassroots football through to professional level, 
                    with state-of-the-art facilities and experienced coaching staff dedicated to nurturing 
                    young talent.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 my-8">
                    <div className="bg-sky-50 p-6 rounded-lg shadow-card">
                      <div className="text-3xl font-bold text-sky-700 mb-2 font-heading">150+</div>
                      <div className="text-slate-700">Academy Players</div>
                    </div>
                    <div className="bg-sky-50 p-6 rounded-lg shadow-card">
                      <div className="text-3xl font-bold text-sky-700 mb-2 font-heading">15</div>
                      <div className="text-slate-700">Coaching Staff</div>
                    </div>
                    <div className="bg-sky-50 p-6 rounded-lg shadow-card">
                      <div className="text-3xl font-bold text-sky-700 mb-2 font-heading">8</div>
                      <div className="text-slate-700">Age Groups</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'philosophy' && (
              <div>
                <h2 className="text-3xl mb-6 font-heading">Our Philosophy</h2>
                <div className="prose max-w-none">
                  <p className="text-lg text-slate-700 mb-4">
                    At Amafor Gladiators FC Academy, we believe in developing complete players who excel 
                    both on and off the field. Our philosophy is built on four core pillars:
                  </p>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-sky-700 mb-2 font-heading">Technical Excellence</h3>
                      <p className="text-slate-700">
                        We focus on building strong fundamental skills including ball control, passing, 
                        shooting, and dribbling. Every player receives individualized technical coaching 
                        tailored to their position and development needs.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-sky-700 mb-2 font-heading">Tactical Intelligence</h3>
                      <p className="text-slate-700">
                        Understanding the game is as important as physical ability. We teach players to 
                        read the game, make smart decisions, and adapt to different tactical systems.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-sky-700 mb-2 font-heading">Physical Development</h3>
                      <p className="text-slate-700">
                        Age-appropriate conditioning programs ensure players develop strength, speed, 
                        agility, and endurance while minimizing injury risk.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-sky-700 mb-2 font-heading">Character & Values</h3>
                      <p className="text-slate-700">
                        We instill discipline, teamwork, respect, and perseverance. Our players are 
                        ambassadors of the club and positive role models in their communities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'curriculum' && (
              <div>
                <h2 className="text-3xl mb-6 font-heading">Training Curriculum</h2>
                <div className="prose max-w-none">
                  <p className="text-lg text-slate-700 mb-6">
                    Our structured curriculum is designed to progressively develop players from ages 6-18:
                  </p>
                  <div className="space-y-6">
                    <div className="border-l-4 border-sky-700 pl-6">
                      <h3 className="text-xl font-semibold mb-2 font-heading">Ages 6-10: Foundation Phase</h3>
                      <ul className="list-disc list-inside text-slate-700 space-y-1">
                        <li>Basic ball mastery and coordination</li>
                        <li>Fun, game-based learning approach</li>
                        <li>Introduction to teamwork concepts</li>
                        <li>3-4 training sessions per week</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-sky-700 pl-6">
                      <h3 className="text-xl font-semibold mb-2 font-heading">Ages 11-14: Development Phase</h3>
                      <ul className="list-disc list-inside text-slate-700 space-y-1">
                        <li>Technical skill refinement</li>
                        <li>Tactical awareness and positioning</li>
                        <li>Competitive match experience</li>
                        <li>4-5 training sessions per week</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-sky-700 pl-6">
                      <h3 className="text-xl font-semibold mb-2 font-heading">Ages 15-18: Elite Phase</h3>
                      <ul className="list-disc list-inside text-slate-700 space-y-1">
                        <li>Advanced tactical systems</li>
                        <li>Position-specific specialization</li>
                        <li>Physical conditioning programs</li>
                        <li>First team integration opportunities</li>
                        <li>6 training sessions per week</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'staff' && (
              <div>
                <h2 className="text-3xl mb-6 font-heading">Coaching Staff</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg shadow-card">
                    <div className="w-20 h-20 bg-gradient-to-br from-sky-600 to-sky-800 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      SA
                    </div>
                    <h3 className="text-xl mb-2 text-center font-heading">Samuel Adeleke</h3>
                    <p className="text-sky-700 text-center mb-3 font-medium">Academy Director</p>
                    <p className="text-sm text-slate-600 text-center">
                      Former professional player with 15 years coaching experience. 
                      UEFA Pro License holder.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-lg shadow-card">
                    <div className="w-20 h-20 bg-gradient-to-br from-sky-600 to-sky-800 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      CO
                    </div>
                    <h3 className="text-xl mb-2 text-center font-heading">Chioma Okafor</h3>
                    <p className="text-sky-700 text-center mb-3 font-medium">Head of Youth Development</p>
                    <p className="text-sm text-slate-600 text-center">
                      Specialist in youth player development with CAF A License. 
                      10 years experience in academy coaching.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-lg shadow-card">
                    <div className="w-20 h-20 bg-gradient-to-br from-sky-600 to-sky-800 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      IM
                    </div>
                    <h3 className="text-xl mb-2 text-center font-heading">Ibrahim Musa</h3>
                    <p className="text-sky-700 text-center mb-3 font-medium">Goalkeeping Coach</p>
                    <p className="text-sm text-slate-600 text-center">
                      Former international goalkeeper. Certified GK coach with 
                      experience at all age levels.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-lg shadow-card">
                    <div className="w-20 h-20 bg-gradient-to-br from-sky-600 to-sky-800 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      FE
                    </div>
                    <h3 className="text-xl mb-2 text-center font-heading">Funke Eze</h3>
                    <p className="text-sky-700 text-center mb-3 font-medium">Fitness & Conditioning Coach</p>
                    <p className="text-sm text-slate-600 text-center">
                      Sports science degree with specialization in youth athlete development. 
                      8 years experience.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'pathway' && (
              <div>
                <h2 className="text-3xl mb-6 font-heading">Player Pathway to Success</h2>
                <div className="prose max-w-none">
                  <p className="text-lg text-slate-700 mb-6">
                    We provide a clear pathway for talented young players to progress from the academy 
                    to the first team and beyond:
                  </p>
                  <div className="relative">
                    <div className="space-y-8">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-sky-700 text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                          1
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2 font-heading">Recruitment & Trials</h3>
                          <p className="text-slate-700">
                            Open trials held twice yearly. Scouts identify talent at local schools and 
                            community programs. Players can join from age 6.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-sky-700 text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                          2
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2 font-heading">Academy Development</h3>
                          <p className="text-slate-700">
                            Players progress through age-group teams (U8, U10, U12, U14, U16, U18) 
                            with regular assessments and personalized development plans.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-sky-700 text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                          3
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2 font-heading">Reserve Team Integration</h3>
                          <p className="text-slate-700">
                            Top U18 players train with the reserve team, competing against adult 
                            opposition to bridge the gap to professional football.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-sky-700 text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                          4
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2 font-heading">First Team Opportunity</h3>
                          <p className="text-slate-700">
                            Outstanding academy graduates are promoted to the first team squad. 
                            Recent success stories include Tunde Bakare, Ngozi Okeke, and Fatima Ibrahim.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-sky-700 text-white rounded-full flex items-center justify-center shrink-0 font-bold">
                          5
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2 font-heading">Professional Career</h3>
                          <p className="text-slate-700">
                            We support players in achieving professional contracts, whether at 
                            Amafor Gladiators FC or with partner clubs. Career guidance and education 
                            support ensure well-rounded development.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-2xl mb-4 font-heading">Interested in Joining Our Academy?</h3>
              <p className="text-slate-700 mb-6">
                Contact us to learn more about trial dates and enrollment information.
              </p>
              <div className="flex gap-4">
                <Link href="/help" className="bg-sky-700 hover:bg-sky-800 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                  Contact Us
                </Link>
                <button 
                  onClick={() => {
                    const phoneNumber = '234XXXXXXXXXX'
                    const message = encodeURIComponent('Hello, I\'m interested in joining the Amafor Gladiators FC Academy...')
                    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
                  }}
                  className="border border-sky-700 text-sky-700 hover:bg-sky-50 px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  WhatsApp Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

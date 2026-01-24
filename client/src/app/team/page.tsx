'use client';

import { API_ROUTES } from '@/config/routes';
import { useState } from 'react';
import Image from 'next/image';
import { Coach } from '@/features/coach/types';
import { Player } from '@/features/player/types';
import { useGet } from '@/shared/hooks/useApiQuery';
import { Header } from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';
import { Users, Shield, Star, Trophy, ArrowRight, X, Info, ChevronRight, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

/**
 * Page: Team Squad
 * Description: Showcases the team roster including players and coaching staff.
 * Requirements: REQ-PUB-05 (Team Roster)
 * User Story: US-PUB-005 (View Team Squad)
 * User Journey: UJ-PUB-003 (View Team & Players)
 * API: GET /players, GET /academy-staff (Coaches)
 * Hook: useGet(API_ROUTES.PLAYERS.LIST), useGet(API_ROUTES.COACHES.LIST)
 */
export default function TeamSquad() {
  const [selectedTab, setSelectedTab] = useState<'coaches' | 'players'>('players');
  const [selectedMember, setSelectedMember] = useState<Player | Coach | null>(null);

  const {
    data: coaches,
    loading: coachesLoading,
    error: coachesError,
  } = useGet<Coach[]>(API_ROUTES.COACHES.LIST);

  const {
    data: players,
    loading: playersLoading,
    error: playersError,
  } = useGet<Player[]>(API_ROUTES.PLAYERS.LIST);

  const calculateAge = (birthDate: Date | string) => {
    const today = new Date();
    const dob = new Date(birthDate);
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      return age - 1;
    }
    return age;
  };

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'goalkeeper': return 'from-rose-500 to-rose-600 bg-rose-500';
      case 'defender': return 'from-blue-500 to-indigo-600 bg-blue-500';
      case 'midfielder': return 'from-emerald-500 to-teal-600 bg-emerald-500';
      case 'forward': return 'from-orange-500 to-amber-600 bg-orange-500';
      default: return 'from-slate-500 to-slate-600 bg-slate-500';
    }
  };

  if (playersLoading || coachesLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400/20 border-t-sky-400 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-sky-400 font-black uppercase text-[10px] tracking-[0.3em]">Initializing Squad Protocols...</p>
        </div>
      </div>
    );
  }

  const playersData = players ?? [];
  const coachesData = coaches ?? [];

  const MemberCard = ({ member, type }: { member: Player | Coach; type: 'player' | 'coach' }) => {
    const isPlayer = type === 'player';
    const player = member as Player;
    const coach = member as Coach;

    return (
      <div
        className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 border border-slate-100"
        onClick={() => setSelectedMember(member)}
      >
        <div className="relative h-80 w-full overflow-hidden bg-slate-100">
          {member.imageUrl ? (
            <Image
              fill
              src={member.imageUrl}
              alt={member.name}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <Users className="w-20 h-20 text-slate-300" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {isPlayer && (
            <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center font-black text-slate-900 text-lg group-hover:bg-sky-400 group-hover:text-white transition-colors">
              {player.jerseyNumber}
            </div>
          )}

          <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest bg-sky-400 px-3 py-1.5 rounded-full">
              View Dossier <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${getPositionColor(isPlayer ? player.position : coach.role)}`}>
              {isPlayer ? player.position : coach.role}
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight truncate group-hover:text-sky-500 transition-colors">
            {member.name}
          </h3>
          <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            {isPlayer && player.nationality && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {player.nationality}
              </span>
            )}
            {isPlayer && player.dateOfBirth && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Age {calculateAge(player.dateOfBirth)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 bg-slate-900 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-sky-400/5 -skew-x-12 transform origin-top-right pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-400/10 border border-sky-400/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-8">
                <Shield className="w-3.5 h-3.5" /> AGFC Elite Personnel
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tight leading-tight">
                The <span className="text-sky-400 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Gladiators</span> Squad
              </h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
                Meet the world-class professionals committed to excellence. Our technical staff and elite athletes pushing boundaries every match day.
              </p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 -mt-10 relative z-20 mb-20">
          <div className="max-w-md mx-auto bg-white p-3 rounded-[2.5rem] shadow-2xl border border-slate-100 flex gap-2">
            <button
              onClick={() => setSelectedTab('players')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all duration-300 ${selectedTab === 'players'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100'
                }`}
            >
              <Users className={`w-4 h-4 ${selectedTab === 'players' ? 'text-sky-400' : ''}`} />
              Players ({playersData.length})
            </button>
            <button
              onClick={() => setSelectedTab('coaches')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all duration-300 ${selectedTab === 'coaches'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100'
                }`}
            >
              <Shield className={`w-4 h-4 ${selectedTab === 'coaches' ? 'text-sky-400' : ''}`} />
              Staff ({coachesData.length})
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {selectedTab === 'players'
              ? playersData.map((player) => (
                <MemberCard key={player.id} member={player} type="player" />
              ))
              : coachesData.map((coach) => (
                <MemberCard key={coach.id} member={coach} type="coach" />
              ))}
          </div>

          {((selectedTab === 'players' && playersData.length === 0) ||
            (selectedTab === 'coaches' && coachesData.length === 0)) && (
              <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <Users className="w-20 h-20 text-slate-100 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Personnel Manifest empty</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No active profiles detected in the database</p>
              </div>
            )}

          {/* Detailed Statistics Dashboard */}
          <div className="mt-32 bg-slate-900 rounded-[3.5rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-center text-sky-400 font-black text-xs uppercase tracking-[0.4em] mb-16">Squad Biometrics & Analytics</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                <div>
                  <div className="text-6xl font-black text-white mb-2 tracking-tighter">{playersData.length}</div>
                  <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Active Assets</div>
                </div>
                <div>
                  <div className="text-6xl font-black text-white mb-2 tracking-tighter">{coachesData.length}</div>
                  <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Technical Staff</div>
                </div>
                <div>
                  <div className="text-6xl font-black text-white mb-2 tracking-tighter">
                    {new Set(playersData.map((p) => p.nationality)).size}
                  </div>
                  <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Territories</div>
                </div>
                <div>
                  <div className="text-6xl font-black text-white mb-2 tracking-tighter">
                    {playersData.length > 0
                      ? Math.round(
                        playersData.reduce((acc, p) => p.dateOfBirth ? acc + calculateAge(p.dateOfBirth) : acc, 0) /
                        playersData.filter(p => p.dateOfBirth).length
                      )
                      : 0}
                  </div>
                  <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Avg Age Profiling</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Profile Dossier Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl" onClick={() => setSelectedMember(null)} />

          <div className="relative bg-white w-full max-w-5xl max-h-full overflow-hidden rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-8 right-8 z-20 w-12 h-12 bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 rounded-2xl flex items-center justify-center transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full md:w-1/2 h-80 md:h-[700px] bg-slate-100">
              {selectedMember.imageUrl ? (
                <Image
                  fill
                  src={selectedMember.imageUrl}
                  alt={selectedMember.name}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                  <Users className="w-32 h-32 text-slate-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:hidden" />
            </div>

            <div className="flex-1 p-10 md:p-16 overflow-y-auto">
              <div className="mb-8">
                <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${getPositionColor('position' in selectedMember ? selectedMember.position : selectedMember.role)} mb-6`}>
                  {'position' in selectedMember ? selectedMember.position : selectedMember.role}
                </span>
                <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tight leading-none mb-4">
                  {selectedMember.name}
                </h2>
                {'jerseyNumber' in selectedMember && (
                  <p className="text-sky-500 font-black text-xl mb-4">SQUAD NUMBER: {selectedMember.jerseyNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12">
                {'nationality' in selectedMember && selectedMember.nationality && (
                  <div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1.5">Territory</p>
                    <p className="text-slate-900 font-black tracking-tight flex items-center gap-2 uppercase">
                      <MapPin className="w-4 h-4 text-sky-400" /> {selectedMember.nationality}
                    </p>
                  </div>
                )}
                {'dateOfBirth' in selectedMember && selectedMember.dateOfBirth && (
                  <div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1.5">Age Profiling</p>
                    <p className="text-slate-900 font-black tracking-tight flex items-center gap-2 uppercase">
                      <Calendar className="w-4 h-4 text-sky-400" /> {calculateAge(selectedMember.dateOfBirth)} YEARS
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest mb-4">
                    <Info className="w-4 h-4 text-sky-400" /> Operational Bio
                  </h4>
                  <p className="text-slate-600 font-medium leading-relaxed text-lg italic">
                    {selectedMember.bio || "No biographical data initialized for this personnel profile."}
                  </p>
                </div>

                <div className="pt-8 border-t border-slate-100 flex gap-4">
                  {'position' in selectedMember && (
                    <Link
                      href={`/player/${selectedMember.id}`}
                      className="inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 duration-200"
                    >
                      Full Performance Metrics
                      <ArrowRight className="w-4 h-4 text-sky-400" />
                    </Link>
                  )}
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 text-slate-900 px-10 py-5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border border-slate-200 active:scale-95 duration-200"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

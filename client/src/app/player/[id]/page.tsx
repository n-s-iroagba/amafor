'use client'
import React from 'react';
import { notFound, useParams } from 'next/navigation';
import { Shirt, Calendar, MapPin, Award, Zap, BarChart2, Shield, Activity, Target } from 'lucide-react';

import { API_ROUTES } from '@/config/routes';
import { Player } from '@/features/player/types';
import { useGet } from '@/shared/hooks/useApiQuery';

/**
 * Player Detail Page
 * 
 * Displays comprehensive player information including bio-data,
 * performance metrics, and professional status.
 * 
 * @requirement REQ-PUB-05: Detailed player profiles with stats.
 */

const PlayerPage: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const {
    data: player,
    loading,
    error,
  } = useGet<Player>(API_ROUTES.PLAYERS.VIEW(id as string));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-sky-400/20 border-t-sky-400 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">Fetching Talent Dossier...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    notFound();
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const calculateAge = (dob: Date | string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const performanceStats = [
    { label: 'Appearances', value: player.appearances || player.stats?.appearances || 0, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Goals', value: player.goals || player.stats?.goals || 0, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Assists', value: player.assists || player.stats?.assists || 0, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Minutes', value: player.minutesPlayed || player.stats?.minutesPlayed || 0, icon: BarChart2, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-500 bg-slate-800">
                {player.imageUrl ? (
                  <img
                    src={player.imageUrl}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Shirt className="h-24 w-24 text-slate-700" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-sky-400 text-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg">
                #{player.jerseyNumber || '??'}
              </div>
            </div>

            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-400/10 border border-sky-400/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Shield className="w-3.5 h-3.5" /> Verified Athlete
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase whitespace-pre-wrap">{player.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <Shirt className="h-5 w-5 text-sky-400" />
                  <span className="font-bold uppercase tracking-tight">{player.position}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-5 w-5 text-sky-400" />
                  <span className="font-bold uppercase tracking-tight">{player.nationality || 'Unspecified'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Activity className="h-5 w-5 text-sky-400" />
                  <span className="font-bold uppercase tracking-tight">{player.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {performanceStats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                  <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Biography */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                  <Award className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Professional Profile</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                {player.biography || player.bio || 'Professional background information is currently being updated for this athlete.'}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center">
                <Activity className="w-5 h-5 mr-3 text-sky-400" /> Vital Statistics
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                      <Calendar className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</div>
                      <div className="font-bold text-slate-900">{player.dateOfBirth ? formatDate(player.dateOfBirth) : 'N/A'}</div>
                    </div>
                  </div>
                  {player.dateOfBirth && (
                    <div className="bg-sky-50 text-sky-700 px-3 py-1 rounded-lg text-xs font-black">
                      {calculateAge(player.dateOfBirth)}Y
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                    <Shield className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Height</div>
                    <div className="font-bold text-slate-900">{player.height ? `${player.height}m` : 'N/A'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nationality</div>
                    <div className="font-bold text-slate-900">{player.nationality || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-slate-50">
                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95 duration-200">
                  Request Full Metrics
                </button>
              </div>
            </div>

            {/* Pro-View CTA */}
            <div className="bg-sky-400 p-8 rounded-[2.5rem] shadow-lg shadow-sky-400/20 text-slate-900 relative overflow-hidden group">
              <Shield className="absolute -bottom-4 -right-4 w-32 h-32 text-sky-300 opacity-20 blur-sm group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Professional View</h3>
                <p className="text-xs font-bold text-slate-900/70 mb-6 tracking-tight leading-relaxed">
                  Are you a scout or agent? Access full performance logs, video archives, and biometric data.
                </p>
                <div
                  onClick={() => window.location.href = '/pro-view'}
                  className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Apply for Access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Spacer */}
      <div className="h-20" />
    </div>
  );
};

export default PlayerPage;


'use client';
import React, { useState } from 'react';
import { MOCK_PLAYERS } from '../../../../constants';
import { Shield, Plus, Edit2, Trash2, Filter, Search, ArrowLeft, UserCheck, AlertCircle, Save } from 'lucide-react';
import Link from 'next/link';

export default function PlayerAdminPage() {
  const [players, setPlayers] = useState(MOCK_PLAYERS);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
        </Link>

        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight">Roster Management (ADM-04)</h1>
            <p className="text-gray-500 text-sm">Update player profiles, verify performance metrics, and manage availability.</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-white px-6 py-4 rounded-2xl border text-[10px] font-black text-[#2F4F4F] hover:border-[#87CEEB] transition-all uppercase tracking-widest">
              BATCH UPDATE (CSV)
            </button>
            <button className="sky-button flex items-center space-x-2 py-4">
              <Plus className="w-5 h-5" />
              <span>REGISTER NEW PLAYER</span>
            </button>
          </div>
        </header>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-12 flex flex-wrap items-center gap-8 border border-gray-100">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search by name, squad number..." className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-sm" />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="bg-gray-50 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#2F4F4F] outline-none border-none">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Injured</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#2F4F4F] text-[#87CEEB]">
              <tr className="text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6">Player</th>
                <th className="px-10 py-6 text-center">No.</th>
                <th className="px-10 py-6">Position</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6">Last Verified</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {players.map(player => (
                <tr key={player.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                        <img src={player.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-[#2F4F4F] text-lg">{player.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center font-mono font-black text-gray-400">#{player.squadNumber}</td>
                  <td className="px-10 py-8 text-xs font-black text-[#2F4F4F] tracking-widest">{player.position}</td>
                  <td className="px-10 py-8">
                    <select className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border-none cursor-pointer">
                      <option>Active</option>
                      <option>Injured</option>
                      <option>Suspended</option>
                      <option>Transferred</option>
                    </select>
                  </td>
                  <td className="px-10 py-8 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    <div className="flex items-center">
                      <UserCheck className="w-3 h-3 mr-2 text-green-500" /> Today, 09:45
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/dashboard/admin/players/${player.id}`} className="p-3 bg-gray-50 text-gray-400 hover:text-[#2F4F4F] hover:bg-[#87CEEB]/20 rounded-xl transition-all">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
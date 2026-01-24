'use client';

import React from 'react';
import { Search, Filter, UserPlus, ArrowLeft, Mail, Clock, Edit2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/shared/hooks/useApiQuery';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const { data: usersData, loading, error } = useGet<User[]>(API_ROUTES.USERS.LIST);

  // Fallback to empty array if data isn't in expected format or null
  const users = Array.isArray(usersData) ? usersData : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/admin" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
        </Link>

        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl text-[#2F4F4F] mb-2 uppercase tracking-tight">User Management (ADM-02)</h1>
            <p className="text-gray-500 text-sm">Control platform access, assign roles, and manage verification states.</p>
          </div>
          <Link href="/dashboard/admin/users/invite" className="sky-button flex items-center space-x-3 py-4">
            <UserPlus className="w-5 h-5" />
            <span>INVITE SYSTEM USER</span>
          </Link>
        </header>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-12 flex flex-wrap items-center gap-8 border border-gray-100">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
            <input type="text" placeholder="Search by name, email, or role..." className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#87CEEB] text-sm font-bold" />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="bg-gray-50 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#2F4F4F] outline-none border-none">
              <option>All Roles</option>
              <option>Scouts</option>
              <option>Advertisers</option>
              <option>Admins</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-[#87CEEB]" /></div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#2F4F4F] text-[#87CEEB]">
                <tr className="text-[10px] font-black uppercase tracking-widest">
                  <th className="px-10 py-6">User Entity</th>
                  <th className="px-10 py-6">Role & Permissions</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6">Joined Date</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#87CEEB]/10 flex items-center justify-center text-[#2F4F4F] font-black text-lg shadow-inner">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#2F4F4F] text-lg leading-tight">{user.name}</div>
                          <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            <Mail className="w-3 h-3 mr-1.5" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[#2F4F4F] uppercase tracking-widest">{user.role}</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">Level {user.role === 'Admin' ? '3' : '1'} Access</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                        {user.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-2" /> {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <Link href={`/dashboard/admin/users/${user.id}`} className="p-3 text-gray-300 hover:text-[#87CEEB] hover:bg-[#87CEEB]/10 rounded-xl transition-all inline-block">
                        <Edit2 className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-10 py-8 text-center text-gray-500 font-bold">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
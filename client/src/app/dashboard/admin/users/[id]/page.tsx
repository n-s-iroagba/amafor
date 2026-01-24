'use client';

import React, { useState } from 'react';
import { Lock, ArrowLeft, Save, Mail, Trash2, ShieldAlert, Key, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import { useGet, usePut, useDelete } from '@/shared/hooks/useApiQuery';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function UserPermissionPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: user, loading, error, refetch } = useGet<UserData>(
    API_ROUTES.USERS.VIEW(id as string)
  );

  const { put, isPending: isSaving } = usePut(
    API_ROUTES.USERS.MUTATE(Number(id))
  );

  const { delete: deleteUser, isPending: isDeleting } = useDelete(
    API_ROUTES.USERS.DELETE
  );

  const [localRole, setLocalRole] = useState(user?.role || '');

  // Sync state when data loads
  React.useEffect(() => {
    if (user) {
      setLocalRole(user.role);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await put({ ...user, role: localRole });
      alert('User permissions updated successfully.');
      refetch();
    } catch (err) {
      console.error('Failed to update permissions:', err);
      alert('Failed to update permissions.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await deleteUser(id as string);
      router.push('/dashboard/admin/users');
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-[#87CEEB]" /></div>;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <p>User not found or error loading data.</p>
        <button onClick={() => router.back()} className="mt-4 text-[#87CEEB] font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard/admin/users" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to User List
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-[2rem] bg-[#2F4F4F] flex items-center justify-center text-[#87CEEB] font-black text-3xl shadow-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl text-[#2F4F4F] font-black uppercase tracking-tight">{user.name}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Mail className="w-3 h-3 mr-1.5" /> {user.email}
                </div>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest">{user.role}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              {isDeleting ? 'DELETING...' : 'DEACTIVATE USER'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="sky-button flex items-center space-x-3 py-4 px-10 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>{isSaving ? 'UPDATING...' : 'SAVE PERMISSIONS'}</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100">
              <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-10 flex items-center">
                <Lock className="w-4 h-4 mr-3 text-[#87CEEB]" /> Granular System Permissions
              </h2>

              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Assign Role</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Admin', 'Scout', 'Advertiser', 'User'].map((role) => (
                      <label key={role} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${localRole === role ? 'bg-[#2F4F4F] text-[#87CEEB] border-[#2F4F4F]' : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'}`}>
                        <span className="text-xs font-bold uppercase">{role}</span>
                        <input
                          type="radio"
                          name="role"
                          checked={localRole === role}
                          onChange={() => setLocalRole(role)}
                          className="w-5 h-5 accent-[#87CEEB]"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <ShieldAlert className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
              <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-red-400">Security Guard</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-8 uppercase font-bold">
                Role changes trigger a password reset for the target user and log an entry in the system audit trail (ADM-02).
              </p>
              <button
                onClick={() => alert("Password reset initiated. Feature coming soon.")}
                className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-[#2F4F4F] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center"
              >
                <Key className="w-4 h-4 mr-2" /> FORCE PWD RESET
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

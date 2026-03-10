/**
 * Admin User Detail
 *
 * Full view of a user's profile with multi-role management, status controls,
 * and security actions (force password reset, soft-delete).
 *
 * @screen SC-084
 * @implements REQ-ADM-05
 * @usecase UC-ADM-05 (Manage Users)
 * @requires SRS-I-040 (Users API - GET /users/:id, PUT /users/:id)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-038 Monitor administrative access to sensitive user profile data
 */
'use client';

import React, { useState } from 'react';
import { Lock, ArrowLeft, Save, Mail, Trash2, ShieldAlert, Key, Loader2, CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import { useGet, usePut, useDelete, usePost } from '@/shared/hooks/useApiQuery';
import type { UserRole } from '@/shared/types/auth';

/** All roles that can be assigned to a system user. 'fan' is excluded — fans self-register. */
const ALL_ASSIGNABLE_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full system access' },
  { value: 'scout', label: 'Scout', description: 'Player scouting & reports' },
  { value: 'academy_staff', label: 'Academy Staff', description: 'Youth academy management' },
  { value: 'commercial_manager', label: 'Commercial Manager', description: 'Revenue & partnerships' },
  { value: 'sports_admin', label: 'Sports Admin', description: 'Competitions & fixtures' },
  { value: 'finance_officer', label: 'Finance Officer', description: 'Payments & accounting' },
  { value: 'it_security', label: 'IT / Security', description: 'System & infrastructure' },
  { value: 'advertiser', label: 'Advertiser', description: 'Commercial campaigns' },
];

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];   // multi-role array
  status: string;
  createdAt: string;
}

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: user, loading, error, refetch } = useGet<UserData>(
    API_ROUTES.USERS.VIEW(id as string)
  );

  const { put, isPending: isSaving } = usePut(
    API_ROUTES.USERS.MUTATE(id as string)
  );

  const { delete: deleteUser, isPending: isDeleting } = useDelete(
    API_ROUTES.USERS.DELETE
  );

  // Multi-role state — initialised from server data
  const [localRoles, setLocalRoles] = useState<UserRole[]>([]);

  React.useEffect(() => {
    if (user) {
      setLocalRoles(user.roles ?? []);
    }
  }, [user]);

  const toggleRole = (role: UserRole) => {
    setLocalRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    if (localRoles.length === 0) {
      alert('A user must have at least one role.');
      return;
    }
    try {
      await put({ roles: localRoles });
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

  const { post: postReset, isPending: isResetting } = usePost(API_ROUTES.AUTH.FORGOT_PASSWORD);

  const handleForceReset = async () => {
    if (!user) return;
    if (!confirm(`Send password reset instruction to ${user.email}?`)) return;
    try {
      await postReset({ email: user.email });
      alert('Password reset link has been sent to the user.');
    } catch (err) {
      console.error('Failed to send reset link:', err);
      alert('Failed to initiate password reset.');
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

  const displayName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard/admin/users" className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to User List
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-[2rem] bg-[#2F4F4F] flex items-center justify-center text-[#87CEEB] font-black text-3xl shadow-xl">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl text-[#2F4F4F] font-black uppercase tracking-tight" data-testid="user-info-name">{displayName}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Mail className="w-3 h-3 mr-1.5" /> {user.email}
                </div>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                {/* Show all current roles as badges */}
                <div className="flex gap-1 flex-wrap">
                  {user.roles.map(r => (
                    <span key={r} className="text-[10px] font-black text-[#87CEEB] uppercase tracking-widest bg-[#2F4F4F]/10 px-2 py-0.5 rounded-full" data-testid="role-badge">
                      {r.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center disabled:opacity-50"
              data-testid="btn-delete-user"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              {isDeleting ? 'DELETING...' : 'DEACTIVATE USER'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || localRoles.length === 0}
              className="sky-button flex items-center space-x-3 py-4 px-10 disabled:opacity-50"
              data-testid="btn-save-permissions"
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
                <Lock className="w-4 h-4 mr-3 text-[#87CEEB]" /> Assign Roles
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">
                Users can hold multiple roles. Select all that apply.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ALL_ASSIGNABLE_ROLES.map((r) => {
                  const isChecked = localRoles.includes(r.value);
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => toggleRole(r.value)}
                      className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border text-left w-full ${isChecked
                          ? 'bg-[#2F4F4F] text-[#87CEEB] border-[#2F4F4F]'
                          : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                        }`}
                      data-testid={`checkbox-role-${r.value}`}
                    >
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest">{r.label}</div>
                        <div className={`text-[10px] mt-0.5 ${isChecked ? 'text-[#87CEEB]/70' : 'text-gray-400'}`}>{r.description}</div>
                      </div>
                      {isChecked
                        ? <CheckSquare className="w-5 h-5 flex-none" />
                        : <Square className="w-5 h-5 flex-none text-gray-300" />
                      }
                    </button>
                  );
                })}
              </div>
              {localRoles.length === 0 && (
                <p className="mt-4 text-xs text-red-500 font-bold">⚠ At least one role must be selected.</p>
              )}
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-[#2F4F4F] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <ShieldAlert className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
              <h3 className="text-lg font-black mb-6 uppercase tracking-tight text-red-400">Security Guard</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-8 uppercase font-bold">
                Role changes are logged in the system audit trail. Force-reset sends a password link to the user.
              </p>
              <button
                onClick={handleForceReset}
                disabled={isResetting}
                className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-[#2F4F4F] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center disabled:opacity-50"
                data-testid="btn-force-reset"
              >
                {isResetting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                {isResetting ? 'SENDING LINK...' : 'FORCE PWD RESET'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

"use client";

/**
 * Invite New User
 *
 * Sends an admin invitation to a new system user with one or more pre-assigned roles.
 * The invited user will receive a verification email and must complete verification before logging in.
 *
 * @screen SC-083
 * @implements REQ-ADM-05
 * @usecase UC-ADM-05 (Manage Users)
 * @requires SRS-I-039 (Users API - POST /auth/invite)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-037 Track invitation success rates and role distribution of new invites
 */
import React, { useState } from "react";
import {
  UserPlus,
  ArrowLeft,
  Mail,
  Shield,
  Send,
  Loader2,
  CheckCircle,
  CheckSquare,
  Square,
} from "lucide-react";
import Link from "next/link";
import { API_ROUTES } from "@/config/routes";
import { usePost } from "@/shared/hooks/useApiQuery";
import type { UserRole } from "@/shared/types/auth";

/**
 * All roles that can be assigned by an admin during invitation.
 * 'fan' is intentionally excluded — fans self-register via /auth/signup.
 */
const ASSIGNABLE_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: "admin", label: "Admin", description: "Full system access" },
  { value: "scout", label: "Scout", description: "Player scouting & reports" },
  { value: "academy_staff", label: "Academy Staff", description: "Youth academy management" },
  { value: "commercial_manager", label: "Commercial Manager", description: "Revenue & partnerships" },
  { value: "sports_admin", label: "Sports Admin", description: "Competitions & fixtures" },
  { value: "finance_officer", label: "Finance Officer", description: "Payments & accounting" },
  { value: "it_security", label: "IT / Security", description: "System & infrastructure" },
  { value: "advertiser", label: "Advertiser", description: "Commercial campaigns" },
];

export default function InviteUserPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [sent, setSent] = useState(false);

  const { post, isPending, error } = usePost<
    { email: string; roles: UserRole[]; firstName?: string; lastName?: string },
    { verificationToken: string; id: string }
  >(API_ROUTES.AUTH.INVITE);

  const toggleRole = (role: UserRole) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || selectedRoles.length === 0) return;

    try {
      await post({ email, roles: selectedRoles, firstName, lastName });
      setSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-[#2F4F4F] uppercase tracking-tight mb-2">
            Invitation Sent
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            A verification email has been sent to <strong>{email}</strong>. They
            must verify their email before they can log in.
          </p>
          <Link
            href="/dashboard/admin/users"
            className="inline-flex items-center gap-2 text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest hover:text-[#87CEEB] transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard/admin/users"
          className="inline-flex items-center text-gray-400 font-bold text-[10px] mb-8 hover:text-[#87CEEB] uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Directory
        </Link>

        <header className="mb-12">
          <div className="bg-[#2F4F4F] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <UserPlus className="w-8 h-8 text-[#87CEEB]" />
          </div>
          <h1 className="text-4xl text-[#2F4F4F] font-black uppercase tracking-tight">
            Invite System User
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            The invited user will receive a verification email and must verify before logging in.
            Fans and end-users self-register; only non-fan system roles can be invited.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 space-y-8"
        >
          {/* Email */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">
              Official Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@organization.com"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border outline-none focus:border-[#87CEEB] font-bold"
                required
                data-testid="input-user-email"
              />
            </div>
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border outline-none focus:border-[#87CEEB] font-bold"
                data-testid="input-first-name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border outline-none focus:border-[#87CEEB] font-bold"
                data-testid="input-last-name"
              />
            </div>
          </div>

          {/* Roles — multi-select checkboxes */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-[#2F4F4F] uppercase tracking-widest">
              Assign Roles * <span className="text-gray-400 normal-case font-normal">(select one or more)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ASSIGNABLE_ROLES.map((r) => {
                const isChecked = selectedRoles.includes(r.value);
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => toggleRole(r.value)}
                    className={`flex items-center justify-between p-4 border-2 rounded-2xl text-left transition-all w-full ${isChecked
                        ? "border-[#87CEEB] text-[#2F4F4F] bg-sky-50"
                        : "border-gray-100 text-gray-400 hover:border-[#87CEEB] hover:text-[#2F4F4F]"
                      }`}
                    data-testid={`checkbox-role-${r.value}`}
                  >
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest">{r.label}</div>
                      <div className="text-[10px] mt-1 text-gray-400">{r.description}</div>
                    </div>
                    {isChecked
                      ? <CheckSquare className="w-5 h-5 text-[#87CEEB] flex-none" />
                      : <Square className="w-5 h-5 text-gray-300 flex-none" />
                    }
                  </button>
                );
              })}
            </div>
            {selectedRoles.length === 0 && (
              <p className="text-[10px] text-amber-600 font-bold">Please select at least one role.</p>
            )}
          </div>

          {/* Info banner */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-blue-500 flex-none" />
              <p className="text-[10px] text-blue-600 font-bold uppercase leading-relaxed">
                A verification email will be sent. The user must verify their email before they can log in.
                They will be prompted to set a new password on first login. Fans must self-register via the public signup page.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <button
            type="submit"
            disabled={isPending || !email || selectedRoles.length === 0}
            className="w-full py-5 bg-[#2F4F4F] text-white rounded-2xl uppercase tracking-[0.2em] flex items-center justify-center gap-3 font-black text-xs hover:bg-[#3d6363] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            data-testid="btn-send-invite"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Send Invitation
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

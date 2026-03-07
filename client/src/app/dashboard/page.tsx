"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, Users } from "lucide-react";
import { useAuthContext } from "@/shared/hooks/useAuthContext";


/**
 * Roles Selection / Dashboard Landing
 * 
 * Central entry point for authenticated users to select their active persona and navigate to role-specific dashboards.
 * 
 * @screen SC-125
 * @implements REQ-AUTH-01
 * @usecase UC-AUTH-05 (Switch Roles)
 * @requires None (Client-side routing)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-076 Track role selection patterns and cross-role navigation frequency
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Auto-redirect if user has only one role
    if (user.roles && user.roles.length === 1) {
      const role = user.roles[0];
      redirectToDashboard(role);
    }
  }, [router, user, loading]);

  const redirectToDashboard = (role: string) => {
    switch (role) {
      case 'admin':
      case 'sports_admin':
      case 'finance_officer':
      case 'it_security':
        router.push('/dashboard/admin');
        break;
      case 'scout':
        router.push('/dashboard/scout');
        break;
      case 'advertiser':
      case 'commercial_manager':
        router.push('/dashboard/advertiser');
        break;
      case 'academy_staff':
        router.push('/dashboard/admin/academy/trialist');
        break;
      default:
        router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="bg-[#2F4F4F] p-8 rounded-[3rem] shadow-2xl mb-8">
          <Loader2 className="w-16 h-16 text-[#87CEEB] animate-spin" />
        </div>
        <h2 className="text-2xl font-black text-[#2F4F4F] uppercase tracking-tighter mb-2">
          Loading Session
        </h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!user || (user.roles && user.roles.length === 1)) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="bg-[#2F4F4F] p-8 rounded-[3rem] shadow-2xl animate-bounce mb-8">
          <Shield className="w-16 h-16 text-[#87CEEB]" />
        </div>
        <h2 className="text-2xl font-black text-[#2F4F4F] uppercase tracking-tighter mb-2">
          Authenticating Arena Session
        </h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
          Establishing secure role-based bridge...
        </p>
      </div>
    );
  }

  // Multi-role selection UI
  const roleCards = [
    {
      id: 'admin',
      label: 'Infrastructure & Ops',
      description: 'System administration, user management, and core operations.',
      icon: <Shield className="w-8 h-8" />,
      color: 'bg-blue-600',
      roles: ['admin', 'sports_admin', 'finance_officer', 'it_security']
    },
    {
      id: 'scout',
      label: 'Talent Center',
      description: 'Player scouting, performance analysis, and talent discovery.',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-emerald-600',
      roles: ['scout']
    },
    {
      id: 'advertiser',
      label: 'Commercial Hub',
      description: 'Manage advertising campaigns, sponsorships, and placements.',
      icon: <Shield className="w-8 h-8" />,
      color: 'bg-sky-600',
      roles: ['advertiser', 'commercial_manager']
    }
  ];

  const availableCards = roleCards.filter(card =>
    card.roles.some(r => user.roles.includes(r as any))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-[#2F4F4F] rounded-2xl shadow-lg mb-6">
            <Shield className="w-8 h-8 text-[#87CEEB]" />
          </div>
          <h1 className="text-4xl font-black text-[#2F4F4F] uppercase tracking-tighter mb-4">
            Welcome, {user.username}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">
            You have multiple access levels assigned to your account.
            Please select which dashboard you would like to enter for this session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {availableCards.map((card) => (
            <button
              key={card.id}
              onClick={() => redirectToDashboard(card.id)}
              className="group relative bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left border border-gray-100 flex flex-col h-full"
            >
              <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-black text-[#2F4F4F] uppercase tracking-tight mb-3">
                {card.label}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                {card.description}
              </p>
              <div className="flex items-center text-[#2F4F4F] font-black text-xs uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                Enter Dashboard
                <span className="text-[#87CEEB]">→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center pt-8">
          <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">
            Amafor Gladiators Digital Ecosystem
          </p>
        </div>
      </div>
    </div>
  );
}

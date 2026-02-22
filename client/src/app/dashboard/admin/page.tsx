"use client";
import React from "react";
import {
  Shield,
  Users,
  Activity,
  Bell,
  FileSearch,
  Settings,
  ChevronRight,
  UserCheck,
  TrendingUp,
  BarChart2,
  UserCircle,
  Calendar,
  Heart,
  DollarSign,
  HardDrive,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGet } from "@/shared/hooks/useApiQuery";
import { API_ROUTES } from "@/config/routes";

interface DashboardStats {
  revenue: {
    total: number;
    advertising: number;
    donations: number;
    patronage: number;
  };
  infrastructure: {
    uptime: string;
    securityAudit: string;
    apiLatency: string;
  };
}

/**
 * Page: Admin Dashboard Overview
 * Description: System-wide command center for administrators. Displays key metrics for revenue, security, and infrastructure.
 * Requirements: REQ-ADM-02 (Admin Dashboard), REQ-ADM-01 (RBAC Entry)
 * User Story: US-ADM-001 (Overview)
 * User Journey: UJ-ADM-001 (System Administration)
 * API: GET /api/admin/metrics (API_ROUTES.ANALYTICS.DASHBOARD)
 * Hook: useGet(API_ROUTES.ANALYTICS.DASHBOARD)
 */
export default function AdminDashboard() {
  const pathname = usePathname();

  const { data: stats, loading } = useGet<DashboardStats>(
    API_ROUTES.ANALYTICS.DASHBOARD,
  );

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard/admin",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      name: "User Management",
      path: "/dashboard/admin/users",
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "Scout Verification",
      path: "/dashboard/admin/scouts",
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      name: "Advertiser Verification",
      path: "/dashboard/admin/advertisers",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      name: "Roster Management",
      path: "/dashboard/admin/players",
      icon: <UserCircle className="w-4 h-4" />,
    },
    {
      name: "Fixtures & Results",
      path: "/dashboard/admin/leagues",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      name: "Patronage Program",
      path: "/dashboard/admin/patrons",
      icon: <Heart className="w-4 h-4" />,
    },
    {
      name: "Advertising Rates",
      path: "/dashboard/admin/ad-plans",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      name: "Audit Trails",
      path: "/dashboard/admin/audit",
      icon: <FileSearch className="w-4 h-4" />,
    },
    {
      name: "Notifications",
      path: "/dashboard/admin/notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      name: "Infra Health",
      path: "/dashboard/admin/health",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      name: "Data Backups",
      path: "/dashboard/admin/backups",
      icon: <HardDrive className="w-4 h-4" />,
    },
    {
      name: "System Settings",
      path: "/dashboard/admin/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const revenueData = stats?.revenue || {
    total: 0,
    advertising: 0,
    donations: 0,
    patronage: 0,
  };

  const infraData = stats?.infrastructure || {
    uptime: "Loading...",
    securityAudit: "Loading...",
    apiLatency: "Loading...",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-20 lg:w-64 bg-[#2F4F4F] flex flex-col text-white sticky top-0 h-screen transition-all duration-300">
        <div className="p-4 lg:p-8 border-b border-white/5 flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3">
          <Shield className="w-8 h-8 text-[#87CEEB]" />
          <span className="font-black text-xs tracking-widest uppercase hidden lg:inline">
            Admin Command
          </span>
        </div>
        <nav className="flex-1 py-8 px-2 lg:px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 p-3 lg:p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                pathname === item.path
                  ? "bg-[#87CEEB] text-[#2F4F4F]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
              data-testid={`admin-nav-link-${item.name.toLowerCase().replace(/ /g, "-")}`}
              title={item.name}
            >
              {item.icon} <span className="hidden lg:inline">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 hidden lg:block">
          <div className="bg-[#2F4F4F] text-white p-6 rounded-[2.5rem] relative overflow-hidden shadow-xl border border-white/5">
            <Shield className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5" />
            <h4 className="text-sm mb-4 font-black uppercase tracking-tight relative z-10">
              ISO 27001
            </h4>
            <Link
              href="/dashboard/admin/settings"
              className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-[#2F4F4F] rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-center block relative z-10"
            >
              Audit Config
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 lg:mb-12">
          <div>
            <div className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.3em] mb-2">
              Central Infrastructure Console
            </div>
            <h1 className="text-2xl lg:text-4xl text-[#2F4F4F]">
              Arena Operations
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          <div className="lg:col-span-2 space-y-6 lg:space-y-12">
            <section
              className="bg-white rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 border border-gray-100 shadow-sm"
              data-testid="stat-card-revenue"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-10 gap-4">
                <h2 className="text-xs lg:text-sm font-black text-[#2F4F4F] uppercase tracking-widest flex items-center">
                  <BarChart2 className="w-5 h-5 mr-3 text-[#87CEEB]" /> Revenue
                  by Source
                </h2>
                <div className="text-2xl lg:text-3xl font-black text-[#2F4F4F]">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    formatCurrency(revenueData.total)
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Advertising
                  </div>
                  <div className="text-lg lg:text-xl font-bold text-[#2F4F4F]">
                    {loading ? "..." : formatCurrency(revenueData.advertising)}
                  </div>
                  <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{
                        width: revenueData.total
                          ? `${(revenueData.advertising / revenueData.total) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Donations
                  </div>
                  <div className="text-lg lg:text-xl font-bold text-[#2F4F4F]">
                    {loading ? "..." : formatCurrency(revenueData.donations)}
                  </div>
                  <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full"
                      style={{
                        width: revenueData.total
                          ? `${(revenueData.donations / revenueData.total) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Patronage
                  </div>
                  <div className="text-lg lg:text-xl font-bold text-[#2F4F4F]">
                    {loading ? "..." : formatCurrency(revenueData.patronage)}
                  </div>
                  <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#87CEEB] h-full"
                      style={{
                        width: revenueData.total
                          ? `${(revenueData.patronage / revenueData.total) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section
              className="bg-white rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 border border-gray-100 shadow-sm"
              data-testid="stat-card-infrastructure"
            >
              <h2 className="text-xs lg:text-sm font-black text-[#2F4F4F] uppercase tracking-widest mb-6 lg:mb-10">
                Infrastructure Health (ADM-17)
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    Platform Uptime
                  </div>
                  <div className="text-base lg:text-lg font-black text-[#2F4F4F]">
                    {infraData.uptime}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    Security Audit
                  </div>
                  <div className="text-base lg:text-lg font-black text-[#2F4F4F]">
                    {infraData.securityAudit}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    API Latency
                  </div>
                  <div className="text-base lg:text-lg font-black text-[#2F4F4F]">
                    {infraData.apiLatency}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

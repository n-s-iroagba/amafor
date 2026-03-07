"use client";
import React from "react";
import {
  Shield,
  Users,
  Activity,
  Bell,
  FileSearch,
  UserCheck,
  TrendingUp,
  BarChart2,
  UserCircle,
  Calendar,
  Heart,
  DollarSign,
  HardDrive,
  Loader2,
  BookOpen,
  Video,
  Newspaper,
  AlertTriangle,
  CreditCard,
  Rss,
  GraduationCap,
  ChevronRight,
  LogOut,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGet } from "@/shared/hooks/useApiQuery";
import { API_ROUTES } from "@/config/routes";
import { useRoleGuard } from "@/shared/hooks/useRoleGuard";
import { useAuthContext } from "@/shared/hooks/useAuthContext";
import { UserRole } from "@/shared/types";

interface DashboardStats {
  users: {
    total: number;
    newToday: number;
  };
  content: {
    articles: number;
    players: number;
  };
  commercial: {
    activeCampaigns: number;
    revenue: number;
  };
  timestamp: string;
}

/**
 * Page: Admin Dashboard Overview
 * Description: System-wide command center for administrators. Displays key metrics for revenue, security, and infrastructure.
 * Requirements: REQ-ADM-02 (Admin Dashboard), REQ-ADM-01 (RBAC Entry)
 * User Story: US-ADM-001 (Overview)
 * User Journey: UJ-ADM-001 (System Administration)
 * API: GET /analytics/dashboard (API_ROUTES.ANALYTICS.DASHBOARD)
 * Hook: useGet(API_ROUTES.ANALYTICS.DASHBOARD)
 */
export default function AdminDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useRoleGuard(['admin', 'sports_admin', 'finance_officer', 'it_security'] as UserRole[]);

  const { data: stats, loading } = useGet<DashboardStats>(
    API_ROUTES.ANALYTICS.DASHBOARD,
  );

  const navGroups = [
    {
      label: "Overview",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard/admin",
          icon: <Activity className="w-4 h-4" />,
        },
      ],
    },
    {
      label: "People",
      items: [
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
          name: "Coaches",
          path: "/dashboard/admin/coaches",
          icon: <UserCog className="w-4 h-4" />,
        },
        {
          name: "Academy",
          path: "/dashboard/admin/academy/trialist",
          icon: <GraduationCap className="w-4 h-4" />,
        },
      ],
    },
    {
      label: "Content",
      items: [
        {
          name: "Articles",
          path: "/dashboard/admin/cms/articles",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          name: "Videos",
          path: "/dashboard/admin/cms/videos",
          icon: <Video className="w-4 h-4" />,
        },
        {
          name: "RSS Feeds",
          path: "/dashboard/admin/rss-feeds",
          icon: <Rss className="w-4 h-4" />,
        },
      ],
    },
    {
      label: "Competition",
      items: [
        {
          name: "Fixtures & Results",
          path: "/dashboard/admin/leagues",
          icon: <Calendar className="w-4 h-4" />,
        },
      ],
    },
    {
      label: "Commerce",
      items: [
        {
          name: "Patronage Program",
          path: "/dashboard/admin/patrons",
          icon: <Heart className="w-4 h-4" />,
        },
        {
          name: "Subscriptions",
          path: "/dashboard/admin/subscriptions",
          icon: <CreditCard className="w-4 h-4" />,
        },
        {
          name: "Disputes",
          path: "/dashboard/admin/disputes",
          icon: <AlertTriangle className="w-4 h-4" />,
        },
      ],
    },
    {
      label: "Operations",
      items: [
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
      ],
    },
  ];

  const quickActions = [
    {
      label: "User Management",
      description: "View, search, and role-assign platform users",
      path: "/dashboard/admin/users",
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Scout Verification",
      description: "Review pending scout applications",
      path: "/dashboard/admin/scouts",
      icon: <UserCheck className="w-6 h-6" />,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Advertiser Verification",
      description: "Approve or reject advertiser accounts",
      path: "/dashboard/admin/advertisers",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-sky-50 text-sky-600",
    },
    {
      label: "Publish Article",
      description: "Create or manage CMS articles",
      path: "/dashboard/admin/cms/articles",
      icon: <Newspaper className="w-6 h-6" />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Fixtures & Results",
      description: "Manage leagues, fixtures and match data",
      path: "/dashboard/admin/leagues",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Disputes",
      description: "Resolve active advertiser disputes",
      path: "/dashboard/admin/disputes",
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Patron Packages",
      description: "Manage patronage tiers and subscribers",
      path: "/dashboard/admin/patrons",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-rose-50 text-rose-600",
    },
    {
      label: "Audit Trails",
      description: "Review system-wide activity logs",
      path: "/dashboard/admin/audit",
      icon: <FileSearch className="w-6 h-6" />,
      color: "bg-teal-50 text-teal-600",
    },
    {
      label: "Academy Trialists",
      description: "Manage trialist registrations and status",
      path: "/dashboard/admin/academy/trialist",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const usersData = stats?.users || { total: 0, newToday: 0 };
  const contentData = stats?.content || { articles: 0, players: 0 };
  const commercialData = stats?.commercial || { activeCampaigns: 0, revenue: 0 };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ── */}
      <aside className="w-16 lg:w-64 bg-[#2F4F4F] flex flex-col text-white sticky top-0 h-screen transition-all duration-300 overflow-hidden">
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-white/10 flex items-center justify-center lg:justify-start gap-0 lg:gap-3 shrink-0">
          <Shield className="w-7 h-7 text-[#87CEEB] shrink-0" />
          <span className="font-black text-[11px] tracking-widest uppercase hidden lg:inline leading-tight">
            Admin Command
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 lg:px-3 space-y-5 overflow-y-auto custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="hidden lg:block px-2 mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                {group.label}
              </div>
              {group.items.map((item) => {
                // highlight if the pathname starts with the item path
                // (exact match for dashboard root, prefix match for others)
                const isActive =
                  item.path === "/dashboard/admin"
                    ? pathname === item.path
                    : pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-3 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isActive
                      ? "bg-[#87CEEB] text-[#2F4F4F]"
                      : "text-white/50 hover:text-white hover:bg-white/8"
                      }`}
                    data-testid={`admin-nav-link-${item.name.toLowerCase().replace(/ /g, "-")}`}
                    title={item.name}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="hidden lg:inline truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Role Switcher & Logout */}
        <div className="p-2 lg:p-3 border-t border-white/10 shrink-0 space-y-1">
          {user && user.roles.length > 1 && (
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-3 py-3 rounded-xl text-[#87CEEB] hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-widest"
              data-testid="admin-switch-role-btn"
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">Switch Role</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-3 py-3 rounded-xl text-white/40 hover:text-white hover:bg-red-500/20 transition-all font-black text-[10px] uppercase tracking-widest"
            data-testid="admin-logout-btn"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.3em] mb-1">
            Central Infrastructure Console
          </div>
          <h1 className="text-2xl lg:text-4xl font-black text-[#2F4F4F]">
            Arena Operations
          </h1>
        </header>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {/* Total Users */}
          <div
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            data-testid="stat-card-users"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#87CEEB]" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Total Users
              </span>
            </div>
            <div className="text-xl font-black text-[#2F4F4F]">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
              ) : (
                usersData.total.toLocaleString()
              )}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              +{loading ? "—" : usersData.newToday} today
            </div>
          </div>

          {/* Published Articles */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Articles
              </span>
            </div>
            <div className="text-xl font-black text-[#2F4F4F]">
              {loading ? "—" : contentData.articles.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              {loading ? "—" : contentData.players.toLocaleString()} players
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-rose-400" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Active Campaigns
              </span>
            </div>
            <div className="text-xl font-black text-[#2F4F4F]">
              {loading ? "—" : commercialData.activeCampaigns.toLocaleString()}
            </div>
          </div>

          {/* Revenue */}
          <div
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            data-testid="stat-card-revenue"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Revenue
              </span>
            </div>
            <div className="text-xl font-black text-[#2F4F4F]">
              {loading ? "—" : formatCurrency(commercialData.revenue)}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-5">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                href={action.path}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-start gap-4"
                data-testid={`quick-action-${action.label.toLowerCase().replace(/ /g, "-")}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${action.color}`}
                >
                  {action.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-black text-[#2F4F4F] text-sm uppercase tracking-tight leading-tight mb-1">
                    {action.label}
                  </div>
                  <div className="text-[11px] text-gray-400 leading-snug">
                    {action.description}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-[#87CEEB] shrink-0 mt-1 ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Infra snapshot */}
        <section className="mt-8 bg-[#2F4F4F] rounded-2xl p-6 text-white flex flex-wrap gap-8 items-center">
          <div>
            <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">
              Last Updated
            </div>
            <div className="text-base font-black">
              {stats?.timestamp ? new Date(stats.timestamp).toLocaleTimeString() : "—"}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">
              New Users Today
            </div>
            <div className="text-base font-black">{loading ? "—" : usersData.newToday}</div>
          </div>
          <div>
            <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">
              Registered Players
            </div>
            <div className="text-base font-black">{loading ? "—" : contentData.players.toLocaleString()}</div>
          </div>
          <div className="ml-auto flex items-center">
            <Link
              href="/dashboard/admin/health"
              className="text-[9px] font-black uppercase tracking-widest text-[#87CEEB] hover:text-white transition-colors flex items-center gap-1"
            >
              Full Diagnostics <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

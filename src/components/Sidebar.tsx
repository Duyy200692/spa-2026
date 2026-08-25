import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Calculator,
  Package,
  UserCog,
  Clock,
  TicketPercent,
  TrendingUp,
} from 'lucide-react';
import { Role, Language, TabType } from '../types';
import { translations } from '../i18n';

interface SidebarProps {
  activeTab: TabType;
  onTabSelect: (tab: TabType) => void;
  onTabChange?: (tab: TabType) => void;
  currentRole: Role;
  lang: Language;
  appointmentBadgeCount?: number;
  lowStockCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabSelect,
  onTabChange,
  currentRole,
  lang,
  appointmentBadgeCount = 0,
  lowStockCount = 0,
}) => {
  const t = translations[lang];
  const handleSelect = (tab: TabType) => {
    onTabSelect?.(tab);
    onTabChange?.(tab);
  };

  // RBAC checks for tabs strictly based on user role requirements
  const allowedTabs: { id: TabType; label: string; icon: any; badge?: number; roles: Role[] }[] = [
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
      roles: ['owner', 'manager'],
    },
    {
      id: 'appointments',
      label: t.appointments,
      icon: Calendar,
      badge: appointmentBadgeCount,
      roles: ['owner', 'manager', 'technician', 'receptionist'],
    },
    {
      id: 'customers',
      label: t.customers,
      icon: Users,
      roles: ['owner', 'manager'],
    },
    {
      id: 'cost_calculation',
      label: t.costCalc,
      icon: Calculator,
      roles: ['owner', 'manager'],
    },
    {
      id: 'inventory',
      label: t.inventory,
      icon: Package,
      badge: lowStockCount,
      roles: ['owner', 'manager'],
    },
    {
      id: 'staff',
      label: currentRole === 'receptionist' ? (lang === 'vi' ? 'Nhân Viên & Xếp Tour' : 'Staff & Shifts') : t.staff,
      icon: UserCog,
      roles: ['owner', 'manager', 'receptionist'],
    },
    {
      id: 'timekeeping',
      label: t.timekeeping,
      icon: Clock,
      roles: ['owner', 'manager', 'technician', 'receptionist'],
    },
    {
      id: 'promotions',
      label: t.promotions,
      icon: TicketPercent,
      roles: ['owner', 'manager', 'technician', 'receptionist'],
    },
    {
      id: 'reports',
      label: t.reports,
      icon: TrendingUp,
      roles: ['owner', 'manager'],
    },
  ];

  const visibleTabs = allowedTabs.filter(tab => tab.roles.includes(currentRole));

  const opTabs = visibleTabs.filter(t => ['dashboard', 'appointments', 'customers', 'cost_calculation', 'inventory'].includes(t.id));
  const hrTabs = visibleTabs.filter(t => ['staff', 'timekeeping', 'promotions', 'reports'].includes(t.id));

  const roleRoleDetails: Record<Role, { title: string; desc: string; badgeClass: string }> = {
    owner: {
      title: lang === 'vi' ? 'Chủ Spa (Admin)' : 'Spa Owner (Admin)',
      desc: lang === 'vi' ? 'Toàn quyền điều hành, tài chính & hệ thống' : 'Full system & financial access',
      badgeClass: 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-800 dark:border-zinc-200',
    },
    manager: {
      title: lang === 'vi' ? 'Quản Lý Spa' : 'Spa Manager',
      desc: lang === 'vi' ? 'Toàn quyền vận hành (Giới hạn bảo mật hệ thống)' : 'Operations access (Security limited)',
      badgeClass: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700',
    },
    technician: {
      title: lang === 'vi' ? 'Kỹ Thuật Viên' : 'Therapist',
      desc: lang === 'vi' ? 'Xem Lịch hẹn, Chấm công, Khuyến mãi & Tin' : 'Appointments, Timekeeping, Promotions',
      badgeClass: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700',
    },
    receptionist: {
      title: lang === 'vi' ? 'Lễ Tân / Thu Ngân' : 'Receptionist / Cashier',
      desc: lang === 'vi' ? 'Lịch hẹn, Chấm công, Khuyến mãi, Xếp tour KTV' : 'Bookings, Timekeeping, Shifts & Tours',
      badgeClass: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700',
    },
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-5 shrink-0 transition-colors shadow-sm flex flex-col justify-between min-h-[580px]">
      <div className="space-y-5">
        {/* Active Role Status Card */}
        <div className={`p-3 rounded-xl border text-xs ${roleRoleDetails[currentRole].badgeClass}`}>
          <div className="flex items-center space-x-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{roleRoleDetails[currentRole].title}</span>
          </div>
          <p className="text-[11px] opacity-90 mt-0.5 leading-snug">
            {roleRoleDetails[currentRole].desc}
          </p>
        </div>

        {/* Category: Vận Hành Spa */}
        {opTabs.length > 0 && (
          <div>
            <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-3 mb-1.5 font-mono">
              {lang === 'vi' ? 'Quản Trị Vận Hành' : 'Operations'}
            </div>
            <nav className="space-y-1">
              {opTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`sidebar-tab-${tab.id}`}
                    onClick={() => handleSelect(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-950 dark:hover:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-500 dark:text-zinc-400'}`} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && tab.badge > 0 ? (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Category: Nhân Sự & Tiếp Thị / Tài Chính */}
        {hrTabs.length > 0 && (
          <div>
            <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-3 mb-1.5 font-mono">
              {lang === 'vi' ? 'Nhân Sự & Dịch Vụ' : 'People & Services'}
            </div>
            <nav className="space-y-1">
              {hrTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`sidebar-tab-${tab.id}`}
                    onClick={() => handleSelect(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-950 dark:hover:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-500 dark:text-zinc-400'}`} />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* System info / Role note */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-xl p-2.5 text-[11px] space-y-1 border border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center space-x-1.5 text-zinc-900 dark:text-zinc-100 font-semibold">
            <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white" />
            <span>Phân quyền RBAC Chuẩn</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] leading-tight">
            {lang === 'vi'
              ? 'Tự động mở/khóa tính năng và bảo mật lương theo đúng vai trò.'
              : 'Auto restricts modules & masks payroll per security role.'}
          </p>
        </div>
      </div>
    </aside>
  );
};

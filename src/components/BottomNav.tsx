import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Calculator,
  Clock,
  TrendingUp,
  UserCog,
  TicketPercent,
  BookOpen,
  Tag,
  Sparkles,
  Newspaper
} from 'lucide-react';
import { Role, Language, TabType } from '../types';
import { translations } from '../i18n';

interface BottomNavProps {
  activeTab: TabType;
  onTabSelect: (tab: TabType) => void;
  onTabChange?: (tab: TabType) => void;
  currentRole: Role;
  lang: Language;
  appointmentBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabSelect,
  onTabChange,
  currentRole,
  lang,
  appointmentBadgeCount = 0,
}) => {
  const t = translations[lang];
  const handleSelect = (tab: TabType) => {
    onTabSelect?.(tab);
    onTabChange?.(tab);
  };

  if (currentRole === 'customer') {
    const customerItems: { id: TabType; label: string; icon: any }[] = [
      { id: 'customer_intro', label: 'Giới Thiệu', icon: BookOpen },
      { id: 'customer_promotions', label: 'Khuyến Mãi', icon: Tag },
      { id: 'customer_services', label: 'Bảng Giá', icon: Sparkles },
      { id: 'customer_news', label: 'Tin Tức', icon: Newspaper },
    ];

    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141619]/95 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {customerItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (activeTab === 'customer_portal' && item.id === 'customer_intro');
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-zinc-950 dark:text-zinc-50 font-bold'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Mobile navigation items based on role
  const mobileNavItems: { id: TabType; label: string; icon: any; badge?: number; roles: Role[] }[] = [
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
      id: 'staff',
      label: currentRole === 'receptionist' ? (lang === 'vi' ? 'Xếp Tour' : 'Tours') : t.staff,
      icon: UserCog,
      roles: ['owner', 'manager', 'receptionist'],
    },
    {
      id: 'timekeeping',
      label: t.timekeeping,
      icon: Clock,
      roles: ['technician', 'receptionist', 'owner', 'manager'],
    },
    {
      id: 'promotions',
      label: t.promotions,
      icon: TicketPercent,
      roles: ['technician', 'receptionist', 'owner', 'manager'],
    },
    {
      id: 'cost_calculation',
      label: t.costCalc,
      icon: Calculator,
      roles: ['owner', 'manager'],
    },
    {
      id: 'customers',
      label: t.customers,
      icon: Users,
      roles: ['owner', 'manager'],
    },
    {
      id: 'reports',
      label: t.reports,
      icon: TrendingUp,
      roles: ['owner', 'manager'],
    },
  ];

  const visibleItems = mobileNavItems.filter((item) => item.roles.includes(currentRole));

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141619]/95 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => handleSelect(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-zinc-950 dark:text-zinc-50 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

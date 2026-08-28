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
  BookOpen,
  Sparkles,
  Tag,
  Newspaper,
  Lock,
  LogOut,
  Building,
  Target,
  Handshake
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
  onRequestStaffLogin?: () => void;
  onSwitchToCustomer?: () => void;
  onOpenEditSpaProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabSelect,
  onTabChange,
  currentRole,
  lang,
  appointmentBadgeCount = 0,
  lowStockCount = 0,
  onRequestStaffLogin,
  onSwitchToCustomer,
  onOpenEditSpaProfile,
}) => {
  const t = translations[lang];
  const handleSelect = (tab: TabType) => {
    onTabSelect?.(tab);
    onTabChange?.(tab);
  };

  // When currentRole is customer
  if (currentRole === 'customer') {
    const customerTabs: { id: TabType; label: string; icon: any }[] = [
      { id: 'customer_intro', label: 'Bài Giới Thiệu Spa', icon: BookOpen },
      { id: 'customer_promotions', label: 'Khuyến Mãi & Ưu Đãi', icon: Tag },
      { id: 'customer_services', label: 'Menu Dịch Vụ & Bảng Giá', icon: Sparkles },
      { id: 'customer_news', label: 'Tin Tức & Cẩm Nang', icon: Newspaper },
    ];

    return (
      <aside className="w-64 bg-white border border-zinc-200 rounded-3xl p-4 space-y-5 shrink-0 transition-colors shadow-sm flex flex-col justify-between min-h-[580px]">
        <div className="space-y-5">
          {/* Active Role Status Card */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-zinc-950">
              <span className="w-2 h-2 rounded-full bg-zinc-900" />
              <span>Cổng Khách Hàng (Public)</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-snug">
              Xem bài giới thiệu, khuyến mãi, bảng giá & tin tức spa an toàn.
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-3 mb-2 font-mono">
              Trang Khách Hàng
            </div>
            <nav className="space-y-1">
              {customerTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id || (activeTab === 'customer_portal' && tab.id === 'customer_intro');
                return (
                  <button
                    key={tab.id}
                    id={`sidebar-tab-${tab.id}`}
                    onClick={() => handleSelect(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-sm font-semibold'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Staff / Owner Login Button */}
        <div className="pt-3 border-t border-zinc-200 space-y-2">
          <button
            onClick={() => onRequestStaffLogin && onRequestStaffLogin()}
            className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Đăng Nhập Quản Trị (PIN)</span>
          </button>
          <p className="text-[10px] text-center text-zinc-400">
            Dành cho Chủ Spa, Quản lý & Nhân viên
          </p>
        </div>
      </aside>
    );
  }

  // RBAC checks for staff/manager/owner roles
  const allowedTabs: { id: TabType; label: string; icon: any; badge?: number; roles: Role[] }[] = [
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
      roles: ['owner', 'manager'],
    },
    {
      id: 'analytics',
      label: lang === 'vi' ? 'Phân Tích Phễu & AI' : 'Funnel & AI Analytics',
      icon: Target,
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
      label: currentRole === 'technician' || currentRole === 'receptionist'
        ? (lang === 'vi' ? 'Quy Trình SOP Kỹ Thuật' : 'SOP Manuals')
        : t.costCalc,
      icon: BookOpen,
      roles: ['owner', 'manager', 'technician', 'receptionist'],
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
    {
      id: 'b2b_management',
      label: lang === 'vi' ? 'Quản Lý Nội Dung B2B' : 'B2B Content Config',
      icon: Handshake,
      roles: ['owner', 'manager'],
    },
  ];

  const visibleTabs = allowedTabs.filter((tab) => tab.roles.includes(currentRole));

  const opTabs = visibleTabs.filter((t) =>
    ['dashboard', 'analytics', 'appointments', 'customers', 'cost_calculation', 'inventory'].includes(t.id)
  );
  const hrTabs = visibleTabs.filter((t) =>
    ['staff', 'timekeeping', 'promotions', 'reports', 'b2b_management'].includes(t.id)
  );

  const roleRoleDetails: Record<Role, { title: string; desc: string; badgeClass: string }> = {
    owner: {
      title: lang === 'vi' ? 'Chủ Spa (Admin)' : 'Spa Owner (Admin)',
      desc: lang === 'vi' ? 'Toàn quyền tài chính, chi phí, kho & hệ thống' : 'Full system & financial access',
      badgeClass: 'bg-emerald-900 text-white border-emerald-800',
    },
    manager: {
      title: lang === 'vi' ? 'Quản Lý Spa' : 'Spa Manager',
      desc: lang === 'vi' ? 'Toàn quyền vận hành lịch hẹn, kho & dịch vụ' : 'Operations access',
      badgeClass: 'bg-emerald-50 text-emerald-950 border-emerald-200',
    },
    technician: {
      title: lang === 'vi' ? 'Kỹ Thuật Viên' : 'Therapist',
      desc: lang === 'vi' ? 'Xem Lịch hẹn cá nhân & Chấm công' : 'Appointments, Timekeeping',
      badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    },
    receptionist: {
      title: lang === 'vi' ? 'Lễ Tân / Thu Ngân' : 'Receptionist / Cashier',
      desc: lang === 'vi' ? 'Lịch hẹn, Chấm công, Xếp ca & Thu tiền' : 'Bookings, Shifts & Checkout',
      badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    },
    customer: {
      title: 'Khách Hàng',
      desc: 'Xem bài giới thiệu & khuyến mãi',
      badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    },
  };

  return (
    <aside className="w-64 bg-white border border-zinc-200 rounded-3xl p-4 space-y-5 shrink-0 transition-colors shadow-sm flex flex-col justify-between min-h-[580px]">
      <div className="space-y-5">
        {/* Active Role Status Card */}
        <div className={`p-3.5 rounded-2xl border text-xs ${roleRoleDetails[currentRole].badgeClass}`}>
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
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-3 mb-1.5 font-mono">
              {lang === 'vi' ? 'Quản Trị Vận Hành' : 'Operations'}
            </div>
            <nav className="space-y-1">
              {opTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`sidebar-tab-${tab.id}`}
                    onClick={() => handleSelect(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-sm font-semibold'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`}
                      />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && tab.badge > 0 ? (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-white text-zinc-950'
                            : 'bg-zinc-200 text-zinc-800'
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

        {/* Category: Nhân Sự & Dịch Vụ */}
        {hrTabs.length > 0 && (
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-3 mb-1.5 font-mono">
              {lang === 'vi' ? 'Nhân Sự & Dịch Vụ' : 'People & Services'}
            </div>
            <nav className="space-y-1">
              {hrTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`sidebar-tab-${tab.id}`}
                    onClick={() => handleSelect(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-sm font-semibold'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`}
                      />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
        {/* Edit Spa Profile Action for Owner/Manager */}
        {(currentRole === 'owner' || currentRole === 'manager') && onOpenEditSpaProfile && (
          <div className="pt-1">
            <button
              id="sidebar-btn-edit-spa-profile"
              onClick={onOpenEditSpaProfile}
              className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-900 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all text-left"
              title="Chỉnh sửa thông tin cơ sở, địa chỉ, logo & bài giới thiệu"
            >
              <Building className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">Sửa Info, Logo & Địa Chỉ</span>
            </button>
          </div>
        )}
      </div>

      {/* Switch back to Customer Portal for safety */}
      <div className="pt-3 border-t border-zinc-200 space-y-2">
        <button
          id="sidebar-btn-exit-to-home"
          onClick={() => onSwitchToCustomer && onSwitchToCustomer()}
          className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 border border-rose-500/30 text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-sm"
          title="Thoát quyền truy cập và quay về Trang Chủ Khách Hàng"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Thoát Ra Trang Chủ</span>
        </button>
      </div>
    </aside>
  );
};

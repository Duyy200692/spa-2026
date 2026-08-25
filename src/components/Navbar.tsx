import React, { useState } from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  Globe,
  Bell,
  UserCheck,
  Plus,
  Receipt,
  CalendarPlus,
  CheckCircle,
  X,
  Database,
  CloudCheck,
  RefreshCw,
  Building
} from 'lucide-react';
import { Role, Language, Theme, AppNotification, TabType, SpaProfile } from '../types';
import { translations } from '../i18n';
import { FIREBASE_PROJECT_ID } from '../firebase';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onRequestRoleSwitch?: (role: Role) => void;
  lang: Language;
  onLangChange?: (lang: Language) => void;
  onLangToggle?: () => void;
  theme?: Theme;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onDarkModeToggle?: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkNotificationsRead?: () => void;
  onOpenBookingModal?: () => void;
  onOpenQuickBooking?: () => void;
  onOpenCheckoutModal?: () => void;
  onOpenCheckout?: () => void;
  onOpenFirebaseSync?: () => void;
  isFirebaseSyncing?: boolean;
  activeTab?: TabType;
  onTabSelect?: (tab: TabType) => void;
  spaProfile?: SpaProfile;
  onOpenEditSpaProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onRequestRoleSwitch,
  lang,
  onLangChange,
  onLangToggle,
  theme,
  isDarkMode,
  onToggleTheme,
  onDarkModeToggle,
  notifications,
  onMarkNotificationRead,
  onMarkNotificationsRead,
  onOpenBookingModal,
  onOpenQuickBooking,
  onOpenCheckoutModal,
  onOpenCheckout,
  onOpenFirebaseSync,
  isFirebaseSyncing = false,
  spaProfile,
  onOpenEditSpaProfile,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const t = translations[lang];

  const effectiveDarkMode = isDarkMode ?? (theme === 'dark');
  const handleToggleDark = () => {
    if (onDarkModeToggle) onDarkModeToggle();
    else if (onToggleTheme) onToggleTheme();
  };
  const handleToggleLang = () => {
    if (onLangToggle) onLangToggle();
    else if (onLangChange) onLangChange(lang === 'vi' ? 'en' : 'vi');
  };
  const handleBooking = () => {
    if (onOpenBookingModal) onOpenBookingModal();
    if (onOpenQuickBooking) onOpenQuickBooking();
  };
  const handleCheckout = () => {
    if (onOpenCheckoutModal) onOpenCheckoutModal();
    if (onOpenCheckout) onOpenCheckout();
  };
  const handleMarkRead = (id: string) => {
    if (onMarkNotificationRead) onMarkNotificationRead(id);
    if (id === 'all' && onMarkNotificationsRead) onMarkNotificationsRead();
  };

  const handleSelectRole = (target: Role) => {
    setShowRoleMenu(false);
    if (target === currentRole) return;
    if (target === 'customer') {
      onRoleChange('customer');
      return;
    }
    if (onRequestRoleSwitch) {
      onRequestRoleSwitch(target);
    } else {
      onRoleChange(target);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<Role, { label: string; badgeColor: string }> = {
    owner: { label: t.roleOwner || 'Chủ Spa', badgeColor: 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-800 dark:border-zinc-200' },
    manager: { label: t.roleManager || 'Quản Lý', badgeColor: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700' },
    technician: { label: t.roleTech || 'Kỹ Thuật Viên', badgeColor: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700' },
    receptionist: { label: t.roleReception || 'Lễ Tân / Thu Ngân', badgeColor: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700' },
    customer: { label: 'Khách Hàng (Portal)', badgeColor: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#141619]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shadow-sm transition-colors overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
              {spaProfile?.logo ? (
                <img
                  src={spaProfile.logo}
                  alt="Spa logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as any).style.display = 'none';
                  }}
                />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-zinc-950 dark:text-zinc-50 truncate max-w-[200px] sm:max-w-[280px]">
                  {spaProfile?.name || t.appName}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {currentRole === 'customer' ? 'PORTAL' : 'PRO'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block truncate max-w-[320px]">
                {currentRole === 'customer'
                  ? (spaProfile?.address || 'Cổng Thông Tin & Khuyến Mãi Khách Hàng')
                  : (spaProfile?.tagline || t.appTagline)}
              </p>
            </div>
          </div>

          {/* Controls: Role switcher, Quick actions, Language, Theme, Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Edit Spa Info & Logo Button for Admin/Manager */}
            {onOpenEditSpaProfile && (currentRole === 'owner' || currentRole === 'manager') && (
              <button
                id="btn-nav-edit-spa-profile"
                onClick={onOpenEditSpaProfile}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 transition-all shadow-sm"
                title="Chỉnh sửa thông tin cơ sở, địa chỉ & logo Spa"
              >
                <Building className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                <span>Sửa Info & Logo</span>
              </button>
            )}

            {/* Quick Action Button */}
            <div className="flex items-center space-x-2">
              <button
                id="btn-nav-quick-booking"
                onClick={handleBooking}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm transition-all"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>{currentRole === 'customer' ? 'Đặt Lịch Hẹn' : t.newBooking}</span>
              </button>

              {currentRole !== 'technician' && currentRole !== 'customer' && (
                <button
                  id="btn-nav-quick-invoice"
                  onClick={handleCheckout}
                  className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/80 transition-all"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>{t.newInvoice}</span>
                </button>
              )}
            </div>

            {/* Role Switcher (RBAC with Password Protection) */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${roleLabels[currentRole].badgeColor}`}
                title={t.currentRole}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{roleLabels[currentRole].label}</span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#18181B] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 space-y-1.5">
                  <div className="px-2 py-1 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-1.5 flex items-center justify-between">
                    <span>Phân Quyền & Bảo Mật Mật Khẩu:</span>
                    <span className="text-[10px] font-mono text-zinc-900 dark:text-zinc-100">PIN LOCK</span>
                  </div>

                  {[
                    {
                      role: 'customer' as Role,
                      title: 'Khách Hàng (Customer Portal)',
                      desc: 'Chỉ xem Bài giới thiệu, Menu dịch vụ, Khuyến mãi & Tin tức (Công khai, không cần mật khẩu)',
                      badge: 'Công Khai',
                    },
                    {
                      role: 'owner' as Role,
                      title: 'Chủ Spa (Admin)',
                      desc: 'Toàn quyền tài chính P&L, Nhân sự, Costing, Kho, Báo cáo & Cài đặt hệ thống (PIN: 123456)',
                      badge: 'Mật Khẩu',
                    },
                    {
                      role: 'manager' as Role,
                      title: 'Quản Lý Spa (Manager)',
                      desc: 'Vận hành lịch hẹn, danh sách khách hàng, kho mỹ phẩm & dịch vụ (PIN: 888888)',
                      badge: 'Mật Khẩu',
                    },
                    {
                      role: 'technician' as Role,
                      title: 'Kỹ Thuật Viên (Therapist)',
                      desc: 'Xem lịch hẹn điều trị cá nhân, chấm công ca làm & quy trình dịch vụ (PIN: 666666)',
                      badge: 'Mật Khẩu',
                    },
                    {
                      role: 'receptionist' as Role,
                      title: 'Lễ Tân / Thu Ngân',
                      desc: 'Đặt lịch hẹn, xuất hóa đơn tính tiền, tiếp đón & điều phối tour (PIN: 666666)',
                      badge: 'Mật Khẩu',
                    },
                  ].map(item => (
                    <button
                      key={item.role}
                      id={`btn-select-role-${item.role}`}
                      onClick={() => handleSelectRole(item.role)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                        currentRole === item.role
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-sm'
                          : 'border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center space-x-1.5">
                          <span>{item.title}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                            currentRole === item.role
                              ? 'bg-white/20 dark:bg-black/20 text-current'
                              : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}>
                            {item.badge}
                          </span>
                        </span>
                        {currentRole === item.role && (
                          <CheckCircle className="w-4 h-4 text-current shrink-0" />
                        )}
                      </div>
                      <p className={`text-[11px] mt-0.5 leading-snug ${
                        currentRole === item.role ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'
                      }`}>
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Logout to Customer Portal if logged in as staff/owner */}
            {currentRole !== 'customer' && (
              <button
                onClick={() => onRoleChange('customer')}
                className="hidden lg:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Đăng xuất về chế độ Khách Hàng an toàn"
              >
                <span>Cổng Khách</span>
              </button>
            )}

            {/* Firebase Realtime Cloud Sync Status Button */}
            {onOpenFirebaseSync && (
              <button
                id="btn-firebase-sync-center"
                onClick={onOpenFirebaseSync}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all shadow-sm group"
                title="Firebase Firestore Tự Động Đồng Bộ Realtime (spa2026-68441)"
              >
                <div className="relative">
                  <Database className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <span className="hidden sm:inline">Firebase Live</span>
                {isFirebaseSyncing && (
                  <RefreshCw className="w-3 h-3 text-zinc-600 dark:text-zinc-400 animate-spin" />
                )}
              </button>
            )}

            {/* Language Switcher */}
            <button
              id="btn-lang-toggle"
              onClick={handleToggleLang}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-1 text-xs font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              title="Đổi ngôn ngữ / Switch Language"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase text-[11px] font-bold">{lang}</span>
            </button>

            {/* Dark / Light Mode Minimalist Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={handleToggleDark}
              className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 transition-all active:scale-95 shadow-sm"
              title={effectiveDarkMode ? (lang === 'vi' ? 'Chuyển sang chế độ Sáng (Light Mode)' : 'Switch to Light Mode') : (lang === 'vi' ? 'Chuyển sang chế độ Tối (Dark Mode)' : 'Switch to Dark Mode')}
              aria-label="Toggle Dark Mode"
            >
              {effectiveDarkMode ? (
                <Sun className="w-4 h-4 text-zinc-100 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-900 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 transition-colors"
                title={t.notifications}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-zinc-900 dark:bg-white ring-2 ring-white dark:ring-zinc-900" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#18181B] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-zinc-950 dark:text-zinc-50">
                        {t.notifications}
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950">
                          {unreadCount} mới
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => handleMarkRead('all')}
                          className="text-[11px] text-zinc-900 dark:text-zinc-100 font-semibold hover:underline"
                        >
                          Đọc hết
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-center py-4 text-xs text-zinc-500 dark:text-zinc-400">
                        Không có thông báo mới
                      </p>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => handleMarkRead(notif.id)}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                            notif.read
                              ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-950 dark:border-white'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-0.5">
                            <span>{notif.title}</span>
                            <span className="text-[10px] text-zinc-400">{notif.timestamp}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

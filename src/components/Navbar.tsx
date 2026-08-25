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
  RefreshCw
} from 'lucide-react';
import { Role, Language, Theme, AppNotification, TabType } from '../types';
import { translations } from '../i18n';
import { FIREBASE_PROJECT_ID } from '../firebase';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
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
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<Role, { label: string; badgeColor: string }> = {
    owner: { label: t.roleOwner, badgeColor: 'bg-[#8BA888]/15 text-[#4D6E4A] dark:text-[#8BA888] border-[#8BA888]/30' },
    manager: { label: t.roleManager, badgeColor: 'bg-[#D4A373]/15 text-[#9E6B38] dark:text-[#D4A373] border-[#D4A373]/30' },
    technician: { label: t.roleTech, badgeColor: 'bg-[#6B9080]/15 text-[#4B7060] dark:text-[#A4C3B2] border-[#6B9080]/30' },
    receptionist: { label: t.roleReception, badgeColor: 'bg-[#A3B18A]/20 text-[#588157] dark:text-[#CCD5AE] border-[#A3B18A]/30' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#1A1C19]/90 backdrop-blur-md border-b border-[#E2E6DF] dark:border-[#2D312C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5A7D57] to-[#8BA888] dark:from-[#8BA888] dark:to-[#A3C2A0] flex items-center justify-center text-white dark:text-[#121412] shadow-md shadow-[#8BA888]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-[#1C211B] dark:text-[#E0E2DF]">
                  {t.appName}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-[#8BA888]/20 text-[#4D6E4A] dark:text-[#8BA888]">
                  PRO
                </span>
              </div>
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198] hidden sm:block">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Controls: Role switcher, Quick actions, Language, Theme, Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Action Button (Desktop & Tablet) */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                id="btn-nav-quick-booking"
                onClick={handleBooking}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm transition-all"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>{t.newBooking}</span>
              </button>
              {currentRole !== 'technician' && (
                <button
                  id="btn-nav-quick-invoice"
                  onClick={handleCheckout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F0F3EF] hover:bg-[#E5EAE3] dark:bg-[#222621] dark:hover:bg-[#2A2F29] text-[#1C211B] dark:text-[#E0E2DF] border border-[#E2E6DF] dark:border-[#2D312C] transition-all"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>{t.newInvoice}</span>
                </button>
              )}
            </div>

            {/* Role Switcher (RBAC) */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${roleLabels[currentRole].badgeColor}`}
                title={t.currentRole}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{roleLabels[currentRole].label}</span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1A1C19] rounded-2xl shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 space-y-1.5">
                  <div className="px-2 py-1 text-[11px] font-bold text-[#5E665B] dark:text-[#9BA198] uppercase tracking-wider border-b border-[#E2E6DF] dark:border-[#2D312C] pb-1.5 flex items-center justify-between">
                    <span>{t.currentRole} (Phân Quyền):</span>
                    <span className="text-[10px] font-normal text-[#5A7D57] dark:text-[#8BA888]">RBAC</span>
                  </div>
                  {[
                    {
                      role: 'owner' as Role,
                      title: 'Chủ Spa (Admin)',
                      desc: 'Toàn quyền tất cả (Tài chính, P&L, Cấu hình, Nhân sự, Cost, Kho)',
                      badge: 'Toàn Quyền',
                    },
                    {
                      role: 'manager' as Role,
                      title: 'Quản Lý Spa',
                      desc: 'Toàn quyền vận hành (Giới hạn bảo mật lương gốc & cấu hình admin)',
                      badge: 'Vận Hành',
                    },
                    {
                      role: 'technician' as Role,
                      title: 'Kỹ Thuật Viên',
                      desc: 'Chỉ xem Lịch hẹn cá nhân, Chấm công ca & Khuyến mãi/Tin tức',
                      badge: 'Chuyên Môn',
                    },
                    {
                      role: 'receptionist' as Role,
                      title: 'Lễ Tân / Thu Ngân',
                      desc: 'Lịch hẹn, Chấm công, Khuyến mãi & Xem Nhân viên/Ca để xếp tour',
                      badge: 'Điều Phối',
                    },
                  ].map(item => (
                    <button
                      key={item.role}
                      id={`btn-select-role-${item.role}`}
                      onClick={() => {
                        onRoleChange(item.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                        currentRole === item.role
                          ? 'bg-[#5A7D57]/10 dark:bg-[#8BA888]/20 border-[#5A7D57]/40 dark:border-[#8BA888]/40 ring-1 ring-[#5A7D57]/30'
                          : 'border-transparent hover:bg-[#F5F7F4] dark:hover:bg-[#222621]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
                          <span>{item.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-normal bg-[#E2E6DF]/60 dark:bg-[#2D312C] text-[#5E665B] dark:text-[#9BA198]">
                            {item.badge}
                          </span>
                        </span>
                        {currentRole === item.role && (
                          <CheckCircle className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198] mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Firebase Realtime Cloud Sync Status Button */}
            {onOpenFirebaseSync && (
              <button
                id="btn-firebase-sync-center"
                onClick={onOpenFirebaseSync}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition-all shadow-sm group"
                title="Quản lý kết nối & Dữ liệu sạch Firebase Firestore (spa2026-68441)"
              >
                <div className="relative">
                  <Database className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <span className="hidden sm:inline">Firebase Cloud</span>
                {isFirebaseSyncing && (
                  <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                )}
              </button>
            )}

            {/* Language Switcher */}
            <button
              id="btn-lang-toggle"
              onClick={handleToggleLang}
              className="p-2 rounded-lg text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621] transition-colors flex items-center space-x-1 text-xs font-medium"
              title="Đổi ngôn ngữ / Switch Language"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase text-[11px] font-bold">{lang}</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={handleToggleDark}
              className="p-2 rounded-lg text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621] transition-colors"
              title={effectiveDarkMode ? t.lightMode : t.darkMode}
            >
              {effectiveDarkMode ? (
                <Sun className="w-4 h-4 text-[#D4A373]" />
              ) : (
                <Moon className="w-4 h-4 text-[#5E665B]" />
              )}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621] transition-colors"
                title={t.notifications}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#8BA888] ring-2 ring-white dark:ring-[#1A1C19]" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1A1C19] rounded-xl shadow-xl border border-[#E2E6DF] dark:border-[#2D312C] p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E6DF] dark:border-[#2D312C]">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-[#1C211B] dark:text-[#E0E2DF]">
                        {t.notifications}
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8BA888]/20 text-[#4D6E4A] dark:text-[#8BA888]">
                          {unreadCount} mới
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => handleMarkRead('all')}
                          className="text-[11px] text-[#5A7D57] dark:text-[#8BA888] hover:underline"
                        >
                          Đọc hết
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-center py-4 text-xs text-[#5E665B] dark:text-[#9BA198]">
                        Không có thông báo mới
                      </p>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => handleMarkRead(notif.id)}
                          className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                            notif.read
                              ? 'bg-[#F0F3EF] dark:bg-[#222621]/60 text-[#5E665B] dark:text-[#9BA198]'
                              : 'bg-[#8BA888]/10 dark:bg-[#8BA888]/15 text-[#1C211B] dark:text-[#E0E2DF] border-l-2 border-[#5A7D57] dark:border-[#8BA888]'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-0.5">
                            <span>{notif.title}</span>
                            <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">{notif.timestamp}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-[#5E665B] dark:text-[#9BA198]">
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

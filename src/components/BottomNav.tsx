import React, { useState } from 'react';
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
  Menu,
  X,
  Building,
  CloudCheck,
  Lock,
  Plus,
  Receipt,
  CalendarPlus,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  LogOut,
  Home,
  Target
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
  lowStockCount?: number;
  onOpenQuickBooking?: () => void;
  onOpenCheckout?: () => void;
  onOpenEditSpaProfile?: () => void;
  onOpenFirebaseSync?: () => void;
  onSwitchToCustomer?: () => void;
  onRequestRoleSwitch?: (role: Role) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabSelect,
  onTabChange,
  currentRole,
  lang,
  appointmentBadgeCount = 0,
  lowStockCount = 0,
  onOpenQuickBooking,
  onOpenCheckout,
  onOpenEditSpaProfile,
  onOpenFirebaseSync,
  onSwitchToCustomer,
  onRequestRoleSwitch,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const t = translations[lang];

  const handleSelect = (tab: TabType) => {
    onTabSelect?.(tab);
    onTabChange?.(tab);
    setIsMenuOpen(false);
  };

  // CUSTOMER PORTAL BOTTOM NAV
  if (currentRole === 'customer') {
    const customerItems: { id: TabType; label: string; icon: any }[] = [
      { id: 'customer_intro', label: 'Giới Thiệu', icon: BookOpen },
      { id: 'customer_promotions', label: 'Khuyến Mãi', icon: Tag },
      { id: 'customer_services', label: 'Bảng Giá', icon: Sparkles },
      { id: 'customer_news', label: 'Cẩm Nang', icon: Newspaper },
    ];

    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141619]/95 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 px-3 py-2 shadow-2xl safe-area-pb">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {customerItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (activeTab === 'customer_portal' && item.id === 'customer_intro');
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-zinc-950 dark:text-zinc-50 font-bold scale-105'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ADMIN / STAFF BOTTOM NAV: STRICTLY 5 MAX TARGETS
  // 1. Dashboard (or Appointments for technician)
  // 2. Appointments
  // 3. Quick Action (+)
  // 4. Customers (or Staff for receptionist)
  // 5. Menu (Bottom Sheet)

  const isMoreMenuActive = [
    'inventory',
    'staff',
    'timekeeping',
    'promotions',
    'cost_calculation',
    'reports',
  ].includes(activeTab) || isMenuOpen;

  const roleTitleMap: Record<Role, string> = {
    owner: lang === 'vi' ? 'Chủ Spa (Admin)' : 'Spa Owner (Admin)',
    manager: lang === 'vi' ? 'Quản Lý Spa' : 'Spa Manager',
    technician: lang === 'vi' ? 'Kỹ Thuật Viên' : 'Therapist',
    receptionist: lang === 'vi' ? 'Lễ Tân / Thu Ngân' : 'Receptionist',
    customer: 'Khách Hàng',
  };

  return (
    <>
      {/* 1. COMPACT 5-TAB BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141619]/95 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800/80 px-2 py-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="max-w-md mx-auto flex items-center justify-around">
          
          {/* TAB 1: Tổng Quan (Owner / Manager) OR Ca làm việc (Tech) */}
          {(currentRole === 'owner' || currentRole === 'manager') ? (
            <button
              id="bottom-nav-dashboard"
              onClick={() => handleSelect('dashboard')}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'text-zinc-950 dark:text-zinc-50 font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-1 tracking-tight font-medium whitespace-nowrap">Tổng Quan</span>
            </button>
          ) : (
            <button
              id="bottom-nav-timekeeping"
              onClick={() => handleSelect('timekeeping')}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                activeTab === 'timekeeping'
                  ? 'text-zinc-950 dark:text-zinc-50 font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Clock className={`w-5 h-5 ${activeTab === 'timekeeping' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-1 tracking-tight font-medium whitespace-nowrap">Chấm Công</span>
            </button>
          )}

          {/* TAB 2: Lịch Hẹn (Có Badge) */}
          <button
            id="bottom-nav-appointments"
            onClick={() => handleSelect('appointments')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
              activeTab === 'appointments'
                ? 'text-zinc-950 dark:text-zinc-50 font-bold'
                : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <div className="relative">
              <Calendar className={`w-5 h-5 ${activeTab === 'appointments' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {appointmentBadgeCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-600 text-white shadow-sm">
                  {appointmentBadgeCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight font-medium whitespace-nowrap">Lịch Hẹn</span>
          </button>

          {/* TAB 3: CENTER ACTION BUTTON (Đặt lịch / Thu ngân POS) */}
          <div className="flex-1 flex items-center justify-center">
            <button
              id="bottom-nav-quick-action"
              onClick={() => {
                if (onOpenQuickBooking) onOpenQuickBooking();
              }}
              className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-md active:scale-95 transition-transform"
              title="Đặt Lịch Hẹn Nhanh"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* TAB 4: Khách Hàng (hoặc Xếp Tour cho Lễ Tân) */}
          {currentRole === 'receptionist' ? (
            <button
              id="bottom-nav-staff"
              onClick={() => handleSelect('staff')}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                activeTab === 'staff'
                  ? 'text-zinc-950 dark:text-zinc-50 font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <UserCog className={`w-5 h-5 ${activeTab === 'staff' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-1 tracking-tight font-medium whitespace-nowrap">Xếp Tour</span>
            </button>
          ) : (
            <button
              id="bottom-nav-customers"
              onClick={() => handleSelect('customers')}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                activeTab === 'customers'
                  ? 'text-zinc-950 dark:text-zinc-50 font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Users className={`w-5 h-5 ${activeTab === 'customers' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-1 tracking-tight font-medium whitespace-nowrap">Khách Hàng</span>
            </button>
          )}

          {/* TAB 5: Menu Quản Trị Mở Rộng (More Sheet) */}
          <button
            id="bottom-nav-more-menu"
            onClick={() => setIsMenuOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
              isMoreMenuActive
                ? 'text-zinc-950 dark:text-zinc-50 font-bold'
                : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <div className="relative">
              <Menu className={`w-5 h-5 ${isMoreMenuActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight font-medium whitespace-nowrap">Thêm</span>
          </button>

        </div>
      </div>

      {/* 2. ERGONOMIC ADMIN BOTTOM SHEET DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
          {/* Backdrop Click to close */}
          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />

          <div className="bg-white dark:bg-[#16181B] rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 p-5 max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Header & Role Info */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    {roleTitleMap[currentRole]}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Chọn phân hệ quản trị spa cần truy cập
                </p>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                title="Đóng menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick POS & Booking Shortcut Banner */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onOpenQuickBooking) onOpenQuickBooking();
                }}
                className="p-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center space-x-2 shadow-sm active:scale-95"
              >
                <CalendarPlus className="w-4 h-4" />
                <span className="text-xs font-bold">Đặt Lịch Nhanh</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onOpenCheckout) onOpenCheckout();
                }}
                className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center space-x-2 active:scale-95 border border-zinc-200 dark:border-zinc-700"
              >
                <Receipt className="w-4 h-4" />
                <span className="text-xs font-bold">Thu Ngân & POS</span>
              </button>
            </div>

            {/* GROUP 1: QUẢN TRỊ VẬN HÀNH & QUY TRÌNH SOP */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">
                Quy Trình SOP & Vận Hành
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleSelect('cost_calculation')}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    activeTab === 'cost_calculation'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Định Mức & Quy Trình SOP Kỹ Thuật</h4>
                      <p className="text-[11px] opacity-75">Quy trình từng bước KTV, chuẩn bị & định lượng mỹ phẩm</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                  <button
                    onClick={() => handleSelect('inventory')}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      activeTab === 'inventory'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                        : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-bold">Kho & Dược Mỹ Phẩm</h4>
                          {lowStockCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                              {lowStockCount} sắp hết
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] opacity-75">Tồn kho, nhập xuất & trừ kho tự động</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                </div>
              </div>

            {/* GROUP 2: NHÂN SỰ & CA TRỰC */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">
                Nhân Sự & Ca Kíp
              </div>
              <div className="grid grid-cols-1 gap-2">
                {(currentRole === 'owner' || currentRole === 'manager' || currentRole === 'receptionist') && (
                  <button
                    onClick={() => handleSelect('staff')}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      activeTab === 'staff'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                        : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <UserCog className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">Nhân Viên & Xếp Tour</h4>
                        <p className="text-[11px] opacity-75">Danh sách KTV, điều phối tour & phân ca</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                )}

                <button
                  onClick={() => handleSelect('timekeeping')}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    activeTab === 'timekeeping'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Chấm Công & Bảng Lương</h4>
                      <p className="text-[11px] opacity-75">Ghi nhận giờ vào/ra, tính công & hoa hồng</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              </div>
            </div>

            {/* GROUP 3: DOANH THU & MARKETING */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">
                Doanh Thu & Tiếp Thị
              </div>
              <div className="grid grid-cols-1 gap-2">
                {(currentRole === 'owner' || currentRole === 'manager') && (
                  <button
                    onClick={() => handleSelect('analytics')}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      activeTab === 'analytics'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                        : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">Phân Tích Phễu & AI Trend</h4>
                        <p className="text-[11px] opacity-75">Tỷ lệ chuyển đổi phễu, AI dự báo & cứu khách rơi bỏ</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                )}

                {(currentRole === 'owner' || currentRole === 'manager') && (
                  <button
                    onClick={() => handleSelect('reports')}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      activeTab === 'reports'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                        : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">Báo Cáo Doanh Thu</h4>
                        <p className="text-[11px] opacity-75">Doanh số dịch vụ, mỹ phẩm & phương thức thanh toán</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                )}

                <button
                  onClick={() => handleSelect('promotions')}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    activeTab === 'promotions'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <TicketPercent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Khuyến Mãi & Voucher</h4>
                      <p className="text-[11px] opacity-75">Tạo mã ưu đãi, voucher giảm giá & gửi thông báo</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              </div>
            </div>

            {/* GROUP 4: CÀI ĐẶT & CHUYỂN TRANG KHÁCH HÀNG */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">
                Hệ Thống & Tiện Ích
              </div>
              <div className="grid grid-cols-2 gap-2">
                {onOpenEditSpaProfile && (currentRole === 'owner' || currentRole === 'manager') && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenEditSpaProfile();
                    }}
                    className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-left space-y-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Building className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                    <h5 className="text-xs font-bold">Thông Tin Spa</h5>
                    <p className="text-[10px] text-zinc-500">Logo, Hotline & Địa chỉ</p>
                  </button>
                )}

                {onOpenFirebaseSync && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenFirebaseSync();
                    }}
                    className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-left space-y-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <CloudCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h5 className="text-xs font-bold">Đồng Bộ Cloud</h5>
                    <p className="text-[10px] text-zinc-500">Firebase Firestore</p>
                  </button>
                )}
              </div>

              {/* View Customer Portal / Exit to Home */}
              <button
                id="bottom-nav-exit-to-home"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onSwitchToCustomer) onSwitchToCustomer();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 flex items-center justify-between text-xs font-bold shadow-sm transition-all"
              >
                <div className="flex items-center space-x-2">
                  <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Thoát Ra Trang Chủ (Customer Landing Page)</span>
                </div>
                <Home className="w-4 h-4 opacity-70" />
              </button>

              {/* Role Switcher Button */}
              {onRequestRoleSwitch && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRequestRoleSwitch('owner');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-center text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium"
                >
                  🔒 Đổi Vai Trò & Mật Khẩu PIN Quản Trị
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};


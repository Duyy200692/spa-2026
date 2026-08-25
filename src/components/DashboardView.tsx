import React, { useState } from 'react';
import {
  TrendingUp,
  CalendarCheck,
  Users,
  Percent,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  DollarSign,
  Package,
  CalendarPlus,
  Receipt,
  Building
} from 'lucide-react';
import { Appointment, Customer, Service, Staff, InventoryItem, Language, Role, TabType, Invoice } from '../types';
import { translations, formatCurrency } from '../i18n';

interface DashboardViewProps {
  appointments: Appointment[];
  customers: Customer[];
  services: Service[];
  staff: Staff[];
  inventory: InventoryItem[];
  lang: Language;
  currentRole: Role;
  invoices?: Invoice[];
  onNavigate?: (tab: TabType) => void;
  onNavigateTab?: (tab: TabType) => void;
  onCheckInAppointment?: (id: string) => void;
  onStartServiceAppointment?: (id: string) => void;
  onCheckoutAppointment?: (appointment: Appointment) => void;
  onOpenBookingModal?: () => void;
  onOpenQuickBooking?: () => void;
  onOpenCheckoutModal?: () => void;
  onOpenCheckout?: (appointment?: Appointment) => void;
  onUpdateAppointmentStatus?: (id: string, status: Appointment['status']) => void;
  onOpenEditSpaProfile?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  appointments,
  customers,
  services,
  staff,
  inventory,
  lang,
  currentRole,
  invoices,
  onNavigate,
  onNavigateTab,
  onCheckInAppointment,
  onStartServiceAppointment,
  onCheckoutAppointment,
  onOpenBookingModal,
  onOpenQuickBooking,
  onOpenCheckoutModal,
  onOpenCheckout,
  onUpdateAppointmentStatus,
  onOpenEditSpaProfile,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'7d' | '30d' | 'year'>('7d');
  const t = translations[lang];

  const handleNav = (tab: TabType) => {
    if (onNavigate) onNavigate(tab);
    if (onNavigateTab) onNavigateTab(tab);
  };

  const handleCheckIn = (id: string) => {
    if (onCheckInAppointment) onCheckInAppointment(id);
    else if (onUpdateAppointmentStatus) onUpdateAppointmentStatus(id, 'arrived');
  };

  const handleStartService = (id: string) => {
    if (onStartServiceAppointment) onStartServiceAppointment(id);
    else if (onUpdateAppointmentStatus) onUpdateAppointmentStatus(id, 'in_progress');
  };

  const handleCheckout = (apt: Appointment) => {
    if (onCheckoutAppointment) onCheckoutAppointment(apt);
    if (onOpenCheckout) onOpenCheckout(apt);
  };

  const handleOpenBooking = () => {
    if (onOpenBookingModal) onOpenBookingModal();
    if (onOpenQuickBooking) onOpenQuickBooking();
  };

  const handleOpenInvoice = () => {
    if (onOpenCheckoutModal) onOpenCheckoutModal();
    if (onOpenCheckout) onOpenCheckout();
  };

  // Calculated KPI stats
  const todayAppointments = appointments.filter(a => a.date === '2026-08-25');
  const todayRevenue = 1890000; // Today's collected revenue VND
  const monthlyRevenue = 84500000;
  const avgMargin = Math.round(
    services.reduce((acc, s) => acc + s.profitMarginPercent, 0) / (services.length || 1)
  );

  const lowStockItems = inventory.filter(
    item => item.stockSubUnits <= item.minThresholdSubUnits
  );

  // Revenue chart data points
  const chartData = [
    { day: 'T2 (19/8)', rev: 5200000, profit: 3600000 },
    { day: 'T3 (20/8)', rev: 6800000, profit: 4700000 },
    { day: 'T4 (21/8)', rev: 4900000, profit: 3400000 },
    { day: 'T5 (22/8)', rev: 8100000, profit: 5600000 },
    { day: 'T6 (23/8)', rev: 9400000, profit: 6500000 },
    { day: 'T7 (24/8)', rev: 14500000, profit: 10100000 },
    { day: 'CN (25/8)', rev: 12200000, profit: 8500000 },
  ];

  const maxChartVal = 16000000;

  const statusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#8BA888]/20 text-[#3F613C] dark:bg-[#8BA888]/20 dark:text-[#8BA888]">
            {t.statusConfirmed}
          </span>
        );
      case 'arrived':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#D4A373]/20 text-[#9E6B38] dark:bg-[#D4A373]/20 dark:text-[#D4A373]">
            {t.statusArrived}
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#A3B18A]/20 text-[#4A7049] dark:bg-[#A3B18A]/20 dark:text-[#CCD5AE] animate-pulse">
            {t.statusInProgress}
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#5A7D57]/20 text-[#385936] dark:bg-[#5A7D57]/30 dark:text-[#A3C2A0]">
            {t.statusCompleted}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E2E6DF] text-[#5E665B] dark:bg-[#222621] dark:text-[#9BA198]">
            {t.statusCancelled}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner & Quick Action */}
      <div className="bg-gradient-to-r from-[#5A7D57] via-[#6D8E6A] to-[#8BA888] dark:from-[#1E251D] dark:via-[#263025] dark:to-[#2F3A2E] rounded-2xl p-5 sm:p-6 text-white dark:text-[#E0E2DF] border border-transparent dark:border-[#2D312C] shadow-lg shadow-[#5A7D57]/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 dark:bg-[#8BA888]/20 backdrop-blur-md text-white dark:text-[#8BA888]">
                Spa Live Dashboard
              </span>
              <span className="text-xs text-white/80 dark:text-[#9BA198]">
                Thứ 3, 25 Tháng 8, 2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {lang === 'vi' ? 'Chào mừng bạn quay trở lại!' : 'Welcome back to SpaMaster!'}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 dark:text-[#9BA198] max-w-xl">
              {lang === 'vi'
                ? 'Hôm nay có 4 lịch hẹn đã lên lịch, doanh thu tạm tính đang tăng 18.5% so với tuần trước.'
                : 'You have 4 bookings scheduled today. Estimated revenue is up 18.5% compared to last week.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto flex-wrap gap-2">
            {onOpenEditSpaProfile && (currentRole === 'owner' || currentRole === 'manager') && (
              <button
                id="btn-dash-edit-spa"
                onClick={onOpenEditSpaProfile}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/20 dark:bg-[#1A1C19] hover:bg-white/30 dark:hover:bg-[#222621] text-white dark:text-[#E0E2DF] border border-white/30 dark:border-[#2D312C] transition-all shadow-sm"
                title="Chỉnh sửa thông tin cơ sở, địa chỉ & logo Spa"
              >
                <Building className="w-4 h-4" />
                <span>Sửa Info & Logo</span>
              </button>
            )}

            <button
              id="btn-dash-booking"
              onClick={onOpenBookingModal}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#8BA888] text-[#334A31] dark:text-[#121412] hover:bg-[#F0F3EF] dark:hover:bg-[#7A9877] transition-all shadow-md"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>{t.newBooking}</span>
            </button>
            <button
              id="btn-dash-invoice"
              onClick={onOpenCheckoutModal}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/20 dark:bg-[#1A1C19] hover:bg-white/30 dark:hover:bg-[#222621] text-white dark:text-[#E0E2DF] border border-white/30 dark:border-[#2D312C] transition-all"
            >
              <Receipt className="w-4 h-4" />
              <span>{t.newInvoice}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Alert if any */}
      {lowStockItems.length > 0 && (
        <div className="bg-[#D4A373]/10 dark:bg-[#D4A373]/10 border border-[#D4A373]/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#B88352] dark:bg-[#D4A373] text-white dark:text-[#121412]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                {t.lowStockAlerts} ({lowStockItems.length} sản phẩm)
              </h2>
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                {lowStockItems.map(i => `${i.name} (còn ${i.stockSubUnits} ${i.subUnitName})`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="text-xs font-semibold text-[#B88352] dark:text-[#D4A373] hover:underline flex items-center shrink-0 ml-2"
          >
            <span>{lang === 'vi' ? 'Nhập kho ngay' : 'Restock now'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Key Real-time Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today Revenue */}
        <div className="bg-white dark:bg-[#1A1C19] p-4 sm:p-5 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5E665B] dark:text-[#9BA198]">
              {t.todayRevenue}
            </span>
            <div className="p-2 rounded-xl bg-[#8BA888]/15 text-[#4D6E4A] dark:text-[#8BA888]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#1C211B] dark:text-[#E0E2DF]">
            {formatCurrency(todayRevenue, lang)}
          </div>
          <div className="flex items-center space-x-1 text-xs text-[#4D6E4A] dark:text-[#8BA888] font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% {lang === 'vi' ? 'so với hôm qua' : 'vs yesterday'}</span>
          </div>
        </div>

        {/* Metric 2: Today Bookings */}
        <div className="bg-white dark:bg-[#1A1C19] p-4 sm:p-5 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5E665B] dark:text-[#9BA198]">
              {t.todayBookings}
            </span>
            <div className="p-2 rounded-xl bg-[#A3B18A]/20 text-[#4A7049] dark:text-[#CCD5AE]">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#1C211B] dark:text-[#E0E2DF]">
            {todayAppointments.length} <span className="text-xs font-normal text-[#5E665B] dark:text-[#9BA198]">{lang === 'vi' ? 'lượt hẹn' : 'slots'}</span>
          </div>
          <div className="text-xs text-[#5E665B] dark:text-[#9BA198]">
            1 đang làm • 1 đã đến • 2 đã đặt
          </div>
        </div>

        {/* Metric 3: Active Clients */}
        <div className="bg-white dark:bg-[#1A1C19] p-4 sm:p-5 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5E665B] dark:text-[#9BA198]">
              {t.activeCustomers}
            </span>
            <div className="p-2 rounded-xl bg-[#D4A373]/20 text-[#9E6B38] dark:text-[#D4A373]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#1C211B] dark:text-[#E0E2DF]">
            {customers.length * 18} <span className="text-xs font-normal text-[#5E665B] dark:text-[#9BA198]">{lang === 'vi' ? 'khách' : 'clients'}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-[#4D6E4A] dark:text-[#8BA888] font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8 khách mới tháng này</span>
          </div>
        </div>

        {/* Metric 4: Avg Profit Margin % */}
        <div className="bg-white dark:bg-[#1A1C19] p-4 sm:p-5 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5E665B] dark:text-[#9BA198]">
              {t.profitMarginAvg}
            </span>
            <div className="p-2 rounded-xl bg-[#8BA888]/20 text-[#4D6E4A] dark:text-[#8BA888]">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-[#5A7D57] dark:text-[#8BA888]">
            {avgMargin}%
          </div>
          <div className="text-xs text-[#5E665B] dark:text-[#9BA198] flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#B88352] dark:text-[#D4A373]" />
            <span>{lang === 'vi' ? 'Tính từ cost mỹ phẩm & KTV' : 'Calculated from BOM & labor'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue & Profit Chart + Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue & Profit Analysis Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                <span>{t.revenueTrends}</span>
              </h3>
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                {lang === 'vi' ? 'Đối chiếu Doanh Thu và Lợi Nhuận Gộp theo thời gian' : 'Revenue vs Gross Profit breakdown'}
              </p>
            </div>

            <div className="flex items-center space-x-1 bg-[#F0F3EF] dark:bg-[#222621] p-1 rounded-xl text-xs">
              {(['7d', '30d', 'year'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    chartPeriod === p
                      ? 'bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] shadow-xs'
                      : 'text-[#5E665B] hover:text-[#1C211B] dark:text-[#9BA198] dark:hover:text-[#E0E2DF]'
                  }`}
                >
                  {p === '7d' ? '7 Ngày' : p === '30d' ? '30 Ngày' : 'Năm Nay'}
                </button>
              ))}
            </div>
          </div>

          {/* Visual SVG & Bar Hybrid Chart */}
          <div className="pt-4">
            <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198] mb-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-md bg-[#5A7D57] dark:bg-[#8BA888]" />
                  <span>{lang === 'vi' ? 'Doanh Thu' : 'Revenue'}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-md bg-[#B88352] dark:bg-[#D4A373]" />
                  <span>{lang === 'vi' ? 'Lợi Nhuận Gộp' : 'Gross Profit'}</span>
                </div>
              </div>
              <span>Đơn vị: Triệu VNĐ</span>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end pt-4 pb-2 border-b border-[#E2E6DF] dark:border-[#2D312C]">
              {chartData.map((d, idx) => {
                const revHeightPercent = Math.round((d.rev / maxChartVal) * 100);
                const profitHeightPercent = Math.round((d.profit / maxChartVal) * 100);
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <div className="w-full flex items-end justify-center space-x-1 h-full">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${revHeightPercent}%` }}
                        className="w-3.5 sm:w-5 bg-gradient-to-t from-[#5A7D57] to-[#8BA888] rounded-t-md transition-all group-hover:brightness-110 relative"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1C19] text-[#E0E2DF] text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                          {(d.rev / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      {/* Profit Bar */}
                      <div
                        style={{ height: `${profitHeightPercent}%` }}
                        className="w-3.5 sm:w-5 bg-gradient-to-t from-[#B88352] to-[#D4A373] rounded-t-md transition-all group-hover:brightness-110 relative"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1C19] text-[#E0E2DF] text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                          Lãi: {(d.profit / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-[#5E665B] dark:text-[#9BA198] mt-2 truncate max-w-full">
                      {d.day.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198] pt-3">
              <span>Tổng doanh thu tuần: <strong className="text-[#1C211B] dark:text-[#E0E2DF]">61.100.000đ</strong></span>
              <span>Lợi nhuận ròng ước tính: <strong className="text-[#4D6E4A] dark:text-[#8BA888]">42.400.000đ (69.4%)</strong></span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Star Services & Cost Calculator Teaser */}
        <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF]">
              {t.topServices}
            </h3>
            <button
              onClick={() => onNavigateTab('costCalc')}
              className="text-xs font-semibold text-[#5A7D57] dark:text-[#8BA888] hover:underline flex items-center"
            >
              <span>{t.costCalc}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {services.slice(0, 4).map(srv => (
              <div
                key={srv.id}
                onClick={() => onNavigateTab('costCalc')}
                className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]/60 hover:bg-[#8BA888]/10 dark:hover:bg-[#8BA888]/10 transition-colors cursor-pointer border border-transparent hover:border-[#8BA888]/30 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] line-clamp-1">
                    {srv.name}
                  </span>
                  <span className="text-xs font-bold text-[#5A7D57] dark:text-[#8BA888] shrink-0 ml-2">
                    {formatCurrency(srv.price, lang)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                  <span>Cost gốc: {formatCurrency(srv.totalCalculatedCost, lang)}</span>
                  <span className="font-semibold text-[#4D6E4A] dark:text-[#8BA888]">
                    Lãi {srv.profitMarginPercent}%
                  </span>
                </div>
                <div className="w-full bg-[#E2E6DF] dark:bg-[#2D312C] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#5A7D57] dark:bg-[#8BA888] h-full rounded-full"
                    style={{ width: `${srv.profitMarginPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Appointments Action Board */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
              <CalendarCheck className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
              <span>{t.recentAppointments} (Hôm nay 25/08)</span>
            </h3>
            <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
              {lang === 'vi' ? 'Tiếp đón khách hàng, check-in và thực hiện dịch vụ' : 'Check-in clients and initiate treatments'}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('appointments')}
            className="text-xs font-semibold text-[#5A7D57] dark:text-[#8BA888] hover:underline flex items-center"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {appointments.map(apt => (
            <div
              key={apt.id}
              className="p-4 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4]/60 dark:bg-[#222621]/40 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#5E665B] dark:text-[#9BA198]" />
                    <span>{apt.time} ({apt.duration}p)</span>
                  </span>
                  {statusBadge(apt.status)}
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <img
                    src={apt.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={apt.customerName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#8BA888]/40"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                      {apt.customerName}
                    </div>
                    <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                      {apt.customerPhone}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#1C211B] dark:text-[#E0E2DF] font-medium line-clamp-1">
                  💆‍♀️ {apt.serviceName}
                </div>

                <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                  KTV: <strong className="text-[#1C211B] dark:text-[#E0E2DF]">{apt.staffName}</strong> • {apt.roomBed}
                </div>
              </div>

              {/* Action Buttons depending on status */}
              <div className="pt-2 border-t border-[#E2E6DF] dark:border-[#2D312C] flex items-center space-x-2">
                {apt.status === 'confirmed' && (
                  <button
                    id={`btn-checkin-${apt.id}`}
                    onClick={() => onCheckInAppointment(apt.id)}
                    className="w-full py-1.5 rounded-lg text-xs font-semibold bg-[#B88352] hover:bg-[#A57445] dark:bg-[#D4A373] dark:hover:bg-[#C2956A] text-white dark:text-[#121412] transition-colors"
                  >
                    {t.checkIn}
                  </button>
                )}

                {apt.status === 'arrived' && (
                  <button
                    id={`btn-start-${apt.id}`}
                    onClick={() => onStartServiceAppointment(apt.id)}
                    className="w-full py-1.5 rounded-lg text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors"
                  >
                    {t.startService}
                  </button>
                )}

                {apt.status === 'in_progress' && (
                  <button
                    id={`btn-checkout-${apt.id}`}
                    onClick={() => onCheckoutAppointment(apt)}
                    className="w-full py-1.5 rounded-lg text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors flex items-center justify-center space-x-1"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>{t.checkout}</span>
                  </button>
                )}

                {apt.status === 'completed' && (
                  <div className="w-full text-center text-xs font-semibold text-[#4D6E4A] dark:text-[#8BA888] py-1 flex items-center justify-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t.statusCompleted}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

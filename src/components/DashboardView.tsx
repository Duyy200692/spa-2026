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
  Building,
  BarChart2,
  Zap,
  Target
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Appointment, Customer, Service, Staff, InventoryItem, Language, Role, TabType, Invoice } from '../types';
import { translations, formatCurrency } from '../i18n';
import { getTrendingServices, getSeasonalFutureTrends, getFunnelMetrics } from '../utils/analyticsUtils';

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

  const trendingServices = getTrendingServices();
  const seasonalTrend = getSeasonalFutureTrends();
  const funnelData = getFunnelMetrics();

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

  // Recharts Revenue Data
  const revenueChartData = [
    { day: 'T2', doanhThu: 5200000, loiNhuan: 3600000 },
    { day: 'T3', doanhThu: 6800000, loiNhuan: 4700000 },
    { day: 'T4', doanhThu: 4900000, loiNhuan: 3400000 },
    { day: 'T5', doanhThu: 8100000, loiNhuan: 5600000 },
    { day: 'T6', doanhThu: 9400000, loiNhuan: 6500000 },
    { day: 'T7', doanhThu: 14500000, loiNhuan: 10100000 },
    { day: 'CN', doanhThu: 12200000, loiNhuan: 8500000 },
  ];

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
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner & Quick Action */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 rounded-2xl p-5 sm:p-6 text-emerald-950 border border-emerald-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600/15 text-emerald-800">
                Spa Live Dashboard
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                Thứ 3, 25 Tháng 8, 2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-950">
              {lang === 'vi' ? 'Chào mừng bạn quay trở lại!' : 'Welcome back to SpaMaster!'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-800 font-medium max-w-xl">
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
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 transition-all shadow-xs"
                title="Chỉnh sửa thông tin cơ sở, địa chỉ & logo Spa"
              >
                <Building className="w-4 h-4 text-emerald-700" />
                <span>Sửa Info & Logo</span>
              </button>
            )}

            <button
              id="btn-dash-booking"
              onClick={onOpenBookingModal}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-xs"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>{t.newBooking}</span>
            </button>
            <button
              id="btn-dash-invoice"
              onClick={onOpenCheckoutModal}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs"
            >
              <Receipt className="w-4 h-4" />
              <span>{t.newInvoice}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Alert if any */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-600 text-white">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-amber-950">
                {t.lowStockAlerts} ({lowStockItems.length} sản phẩm)
              </h2>
              <p className="text-xs text-amber-800">
                {lowStockItems.map(i => `${i.name} (còn ${i.stockSubUnits} ${i.subUnitName})`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="text-xs font-semibold text-amber-800 hover:underline flex items-center shrink-0 ml-2"
          >
            <span>{lang === 'vi' ? 'Nhập kho ngay' : 'Restock now'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Key Real-time Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">
              {t.todayRevenue}
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-zinc-950">
            {formatCurrency(todayRevenue, lang)}
          </div>
          <div className="flex items-center space-x-1 text-xs text-emerald-700 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% {lang === 'vi' ? 'so với hôm qua' : 'vs yesterday'}</span>
          </div>
        </div>

        {/* Metric 2: Today Bookings */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">
              {t.todayBookings}
            </span>
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-zinc-950">
            {todayAppointments.length} <span className="text-xs font-normal text-zinc-500">{lang === 'vi' ? 'lượt hẹn' : 'slots'}</span>
          </div>
          <div className="text-xs text-zinc-500 font-medium">
            1 đang làm • 1 đã đến • 2 đã đặt
          </div>
        </div>

        {/* Metric 3: Active Clients */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">
              {t.activeCustomers}
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-zinc-950">
            {customers.length * 18} <span className="text-xs font-normal text-zinc-500">{lang === 'vi' ? 'khách' : 'clients'}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-emerald-700 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8 khách mới tháng này</span>
          </div>
        </div>

        {/* Metric 4: Avg Profit Margin % */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">
              {t.profitMarginAvg}
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-emerald-700">
            {avgMargin}%
          </div>
          <div className="text-xs text-zinc-500 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>{lang === 'vi' ? 'Tính từ cost mỹ phẩm & KTV' : 'Calculated from BOM & labor'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue & Profit Chart + Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue & Profit Analysis Recharts */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-zinc-950 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>{t.revenueTrends} (Biểu đồ Recharts)</span>
              </h3>
              <p className="text-xs text-zinc-500">
                {lang === 'vi' ? 'Đối chiếu Doanh Thu và Lợi Nhuận Gộp theo ngày trong tuần' : 'Revenue vs Gross Profit breakdown'}
              </p>
            </div>

            <div className="flex items-center space-x-1 bg-zinc-100 p-1 rounded-xl text-xs">
              {(['7d', '30d', 'year'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    chartPeriod === p
                      ? 'bg-white text-zinc-950 shadow-xs font-bold'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {p === '7d' ? '7 Ngày' : p === '30d' ? '30 Ngày' : 'Năm Nay'}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Bar Chart Container */}
          <div className="pt-2 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" opacity={0.7} />
                <XAxis dataKey="day" stroke="#71717A" fontSize={11} />
                <YAxis stroke="#71717A" fontSize={11} tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value), lang)}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    color: '#09090B',
                    border: '1px solid #E4E4E7',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="doanhThu" name="Doanh Thu" fill="#059669" radius={[6, 6, 0, 0]} />
                <Bar dataKey="loiNhuan" name="Lợi Nhuận" fill="#D97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-600 pt-2 border-t border-zinc-100">
            <span>Tổng tuần: <strong className="text-zinc-950 font-bold">61.100.000đ</strong></span>
            <span>Lợi nhuận ròng: <strong className="text-emerald-700 font-bold">42.400.000đ (69.4%)</strong></span>
          </div>
        </div>

        {/* Right 1 Col: Star Services & Cost Calculator Teaser */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-950">
              {t.topServices}
            </h3>
            <button
              onClick={() => onNavigateTab('costCalc')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center"
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
                className="p-3 rounded-xl bg-zinc-50 hover:bg-emerald-50/70 transition-colors cursor-pointer border border-zinc-200 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-950 line-clamp-1">
                    {srv.name}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 shrink-0 ml-2">
                    {formatCurrency(srv.price, lang)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Cost gốc: {formatCurrency(srv.totalCalculatedCost, lang)}</span>
                  <span className="font-semibold text-emerald-700">
                    Lãi {srv.profitMarginPercent}%
                  </span>
                </div>
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${srv.profitMarginPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Appointments Action Board */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 flex items-center space-x-2">
              <CalendarCheck className="w-4 h-4 text-emerald-700" />
              <span>{t.recentAppointments} (Hôm nay 25/08)</span>
            </h3>
            <p className="text-xs text-zinc-500">
              {lang === 'vi' ? 'Tiếp đón khách hàng, check-in và thực hiện dịch vụ' : 'Check-in clients and initiate treatments'}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('appointments')}
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {appointments.map(apt => (
            <div
              key={apt.id}
              className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/80 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{apt.time} ({apt.duration}p)</span>
                  </span>
                  {statusBadge(apt.status)}
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <img
                    src={apt.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={apt.customerName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div>
                    <div className="text-xs font-bold text-zinc-950">
                      {apt.customerName}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {apt.customerPhone}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-zinc-900 font-semibold line-clamp-1">
                  💆‍♀️ {apt.serviceName}
                </div>

                <div className="text-[11px] text-zinc-500">
                  KTV: <strong className="text-zinc-900">{apt.staffName}</strong> • {apt.roomBed}
                </div>
              </div>

              {/* Action Buttons depending on status */}
              <div className="pt-2 border-t border-zinc-200 flex items-center space-x-2">
                {apt.status === 'confirmed' && (
                  <button
                    id={`btn-checkin-${apt.id}`}
                    onClick={() => onCheckInAppointment(apt.id)}
                    className="w-full py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                  >
                    {t.checkIn}
                  </button>
                )}

                {apt.status === 'arrived' && (
                  <button
                    id={`btn-start-${apt.id}`}
                    onClick={() => onStartServiceAppointment(apt.id)}
                    className="w-full py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                  >
                    {t.startService}
                  </button>
                )}

                {apt.status === 'in_progress' && (
                  <button
                    id={`btn-checkout-${apt.id}`}
                    onClick={() => onCheckoutAppointment(apt)}
                    className="w-full py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center justify-center space-x-1"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>{t.checkout}</span>
                  </button>
                )}

                {apt.status === 'completed' && (
                  <div className="w-full text-center text-xs font-semibold text-emerald-700 py-1 flex items-center justify-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t.statusCompleted}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics & AI Future Trends Section (Requested by User) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel Analytics */}
        <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
              <Target className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
              <span>Phễu Chuyển Đổi Khách Hàng (Funnel Analytics)</span>
            </h3>
            <button
              onClick={() => handleNav('analytics')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 dark:text-emerald-400 underline flex items-center space-x-1"
            >
              <span>Mở Module Phân Tích Chuyên Sâu →</span>
            </button>
          </div>
          <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
            Theo dõi hành vi từ lúc khách tìm kiếm dịch vụ cho đến khi hoàn tất thanh toán hóa đơn tại Spa.
          </p>

          <div className="space-y-3 pt-2">
            {funnelData.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-[#1C211B] dark:text-[#E0E2DF]">
                  <span>{step.step}</span>
                  <span className="font-bold text-[#5A7D57] dark:text-[#8BA888]">{step.count} ({step.rate})</span>
                </div>
                <div className="w-full bg-[#E2E6DF] dark:bg-[#2D312C] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#5A7D57] to-[#8BA888] h-full rounded-full transition-all duration-500"
                    style={{ width: step.rate }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Seasonality & Future Trends Advisory */}
        <div className="bg-gradient-to-br from-[#5A7D57]/10 via-[#8BA888]/5 to-transparent dark:from-[#222621] dark:to-[#1A1C19] rounded-2xl p-5 border border-[#5A7D57]/30 dark:border-[#8BA888]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#B88352] dark:text-[#D4A373]" />
              <span>Dự Báo Xu Hướng & AI Gợi Ý (Future Trends)</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#B88352]/20 text-[#9E6B38] dark:text-[#D4A373] font-semibold">
              {seasonalTrend.seasonName}
            </span>
          </div>

          <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
            {seasonalTrend.highlightReason}
          </p>

          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] block">
              🚀 Các gói dịch vụ nên đẩy mạnh tuần tới:
            </span>
            {seasonalTrend.suggestedBoosts.map((boost, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white/80 dark:bg-[#1A1C19]/80 border border-[#E2E6DF] dark:border-[#2D312C] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">{boost.title}</span>
                <span className="text-[11px] text-[#5A7D57] dark:text-[#8BA888] font-medium">{boost.reason}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#5A7D57]/15 dark:bg-[#8BA888]/15 border border-[#5A7D57]/30 text-xs text-[#385936] dark:text-[#A3C2A0] flex items-start space-x-2">
            <Zap className="w-4 h-4 shrink-0 mt-0.5 text-[#B88352] dark:text-[#D4A373]" />
            <div>
              <strong className="block font-semibold mb-0.5">Lời khuyên chiến lược từ AI Gemini:</strong>
              {seasonalTrend.aiAdvisorTip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

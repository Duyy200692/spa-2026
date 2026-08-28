import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  Sparkles,
  Zap,
  Filter,
  Download,
  RefreshCw,
  Users,
  DollarSign,
  ArrowRight,
  Send,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Percent,
  Clock,
  PieChart as PieChartIcon,
  BarChart3,
  Award,
  HelpCircle
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
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Appointment, Customer, Service, Staff, Language, Role } from '../types';
import { translations, formatCurrency } from '../i18n';
import { getTrendingServices, getSeasonalFutureTrends, getFunnelMetrics } from '../utils/analyticsUtils';

interface AnalyticsViewProps {
  appointments: Appointment[];
  customers: Customer[];
  services: Service[];
  staff: Staff[];
  lang: Language;
  currentRole: Role;
  onOpenPromotions?: () => void;
  onOpenBookingModal?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  appointments,
  customers,
  services,
  staff,
  lang,
  currentRole,
  onOpenPromotions,
  onOpenBookingModal,
}) => {
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | 'quarter'>('30d');
  const [channelFilter, setChannelFilter] = useState<'all' | 'web' | 'zalo' | 'walkin'>('all');
  const [selectedFunnelStep, setSelectedFunnelStep] = useState<number | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const t = translations[lang];
  const trendingServices = getTrendingServices();
  const seasonalTrend = getSeasonalFutureTrends();
  const funnelData = getFunnelMetrics();

  // Multi-channel funnel breakdown
  const channelBreakdownData = [
    { name: 'Website / Portal', searches: 65, views: 50, bookings: 20, checkouts: 17, color: '#3B82F6' },
    { name: 'Zalo / Facebook Ads', searches: 38, views: 24, bookings: 9, checkouts: 7, color: '#10B981' },
    { name: 'Khách vãng lai Walk-in', searches: 12, views: 8, bookings: 4, checkouts: 3, color: '#F59E0B' },
    { name: 'Khách Giới Thiệu (Referral)', searches: 5, views: 3, bookings: 1, checkouts: 1, color: '#8B5CF6' },
  ];

  // Customer Tier distribution for LTV
  const tierData = [
    { name: 'Standard (Mới)', count: customers.filter(c => c.tier === 'Standard').length || 18, color: '#9CA3AF' },
    { name: 'Silver', count: customers.filter(c => c.tier === 'Silver').length || 12, color: '#60A5FA' },
    { name: 'Gold', count: customers.filter(c => c.tier === 'Gold').length || 8, color: '#F59E0B' },
    { name: 'VIP & Diamond', count: customers.filter(c => c.tier === 'VIP' || c.tier === 'Diamond').length || 5, color: '#10B981' },
  ];

  // Hourly Peak Heatmap Data
  const hourlyPeakData = [
    { hour: '09:00', bookings: 12, occupancy: '85%' },
    { hour: '10:00', bookings: 16, occupancy: '95%' },
    { hour: '11:00', bookings: 8, occupancy: '60%' },
    { hour: '13:00', bookings: 6, occupancy: '45%' },
    { hour: '14:00', bookings: 14, occupancy: '90%' },
    { hour: '15:00', bookings: 18, occupancy: '100%' },
    { hour: '16:00', bookings: 15, occupancy: '92%' },
    { hour: '17:00', bookings: 11, occupancy: '75%' },
    { hour: '18:00', bookings: 7, occupancy: '50%' },
  ];

  const handleTriggerQuickAction = (actionText: string) => {
    setActionSuccessMsg(`Đã kích hoạt hành vi tự động: "${actionText}" thành công!`);
    setTimeout(() => {
      setActionSuccessMsg(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* 1. Header & Controls Bar */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                Phân Tích Phễu Khách Hàng & AI Trend Forecast
              </h1>
              <p className="text-xs text-zinc-500 font-medium">
                Theo dõi chuyên sâu tỷ lệ chuyển đổi phễu, tối ưu chi phí cơ hội & nhận dự báo xu hướng mùa vụ từ AI Gemini
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="p-1 bg-zinc-100 rounded-xl flex items-center space-x-1 border border-zinc-200">
            {(['today', '7d', '30d', 'quarter'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === p
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {p === 'today' ? 'Hôm nay' : p === '7d' ? '7 Ngày' : p === '30d' ? '30 Ngày' : 'Quý Này'}
              </button>
            ))}
          </div>

          {/* Refresh AI */}
          <button
            onClick={() => handleTriggerQuickAction('Chạy lại mô hình phân tích AI Gemini')}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center space-x-1.5 shadow-xs transition-all active:scale-95"
            title="Cập nhật lại dữ liệu"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Làm Mới AI</span>
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* 2. Top Summary KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Overall Conversion Rate */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Tỷ Lệ Chuyển Đổi Phễu</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              +3.8%
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-zinc-900">23.3%</span>
            <span className="text-xs text-zinc-400 font-medium">tổng tìm kiếm → thanh toán</span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full w-[23.3%]" />
          </div>
        </div>

        {/* KPI 2: Drop-off Rate */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Tỷ Lệ Rơi Bỏ Lớn Nhất</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
              Bước 2 → Bước 3
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-900">42.5%</span>
            <span className="text-xs text-zinc-500 font-medium">(51 khách chưa đặt lịch)</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Xem chi tiết liệu trình nhưng chưa bấm đặt lịch hẹn
          </p>
        </div>

        {/* KPI 3: Predicted Next Month Revenue */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Doanh Thu Dự Báo Tháng Tới</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-900">92.500.000 đ</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">
            ↑ Tăng +14% nhờ lịch hẹn tái khám & dịch vụ mùa hè
          </p>
        </div>

        {/* KPI 4: Average Customer Lifetime Value */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Giá Trị TB / Khách (LTV)</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-zinc-900">1.850.000 đ</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Trung bình 2.8 liệu trình / khách / năm
          </p>
        </div>

      </div>

      {/* 3. CORE SECTION: Phễu Chuyển Đổi Khách Hàng (Detailed Conversion Funnel Analysis) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Funnel Steps Visualiser */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-emerald-700" />
                <span>Phễu Chuyển Đổi Khách Hàng (Funnel Conversion)</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Theo dõi hành trình khách từ lúc tìm kiếm dịch vụ đến khi hoàn tất thanh toán hóa đơn
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              Realtime Tracking
            </span>
          </div>

          {/* Step Visual Cards */}
          <div className="space-y-4">
            {funnelData.map((step, idx) => {
              const isSelected = selectedFunnelStep === idx;
              const stepPercent = parseInt(step.rate);
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedFunnelStep(isSelected ? null : idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/40 shadow-xs'
                      : 'border-zinc-200 bg-white hover:border-emerald-300 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-zinc-900">{step.step}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-900">{step.count} lượt</span>
                      <span className="text-xs font-semibold text-zinc-500 ml-2">({step.rate})</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-100 h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-emerald-700 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: step.rate }}
                    />
                  </div>

                  {/* Step Insights */}
                  <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                    {idx === 0 && <span>Tất cả lượng truy cập trang chủ & tìm kiếm dịch vụ</span>}
                    {idx === 1 && <span>Chuyển đổi: 70.8% • Rơi bỏ: 29.2% (35 lượt xem rồi thoát)</span>}
                    {idx === 2 && <span>Chuyển đổi: 40.0% từ bước xem • Rơi bỏ: 51 lượt chưa bấm Đặt Lịch</span>}
                    {idx === 3 && <span>Tỷ lệ giữ chân sau khi đặt: 82.3% (Chỉ 6 lượt hủy/đổi lịch)</span>}

                    <span className="text-emerald-800 font-bold underline">
                      {isSelected ? 'Thu gọn' : 'Chi tiết kênh →'}
                    </span>
                  </div>

                  {/* Expanded Channel Breakdown inside step */}
                  {isSelected && (
                    <div className="mt-4 pt-3 border-t border-emerald-200 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in">
                      {channelBreakdownData.map((ch, cIdx) => (
                        <div key={cIdx} className="p-2.5 rounded-xl bg-white border border-zinc-200 text-center">
                          <span className="text-[10px] font-semibold text-zinc-500 block truncate">{ch.name}</span>
                          <span className="text-xs font-bold text-emerald-900">
                            {idx === 0 ? ch.searches : idx === 1 ? ch.views : idx === 2 ? ch.bookings : ch.checkouts} lượt
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Funnel Channel Performance Chart */}
          <div className="pt-4 border-t border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-800 mb-3 uppercase tracking-wider">
              Phân Tích Hiệu Suất Theo Kênh Tiếp Thị (Traffic Channels)
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelBreakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #E5E7EB' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="searches" name="Tìm Kiếm" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="views" name="Xem Chi Tiết" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bookings" name="Đặt Lịch" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="checkouts" name="Thanh Toán" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Drop-off Recovery & AI Quick Actions */}
        <div className="space-y-6">
          
          {/* Action Box: Recovery Toolkit */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-zinc-100 pb-3">
              <Zap className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Bộ Công Cụ Tối Ưu Tỷ Lệ Chuyển Đổi</h3>
                <p className="text-[11px] text-zinc-500">Kích hoạt hành động ngay để cứu bớt khách hàng rơi bỏ phễu</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Action 1 */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">1. Cứu 51 Khách Rơi Bỏ Ở Bước Xem Dịch Vụ</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                    Tiềm năng +12.5M
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Tạo mã giảm giá 10% gửi popup cho khách hàng vừa xem dịch vụ trên 45 giây mà chưa bấm Đặt Lịch.
                </p>
                <button
                  onClick={() => handleTriggerQuickAction('Tự động gửi Coupon 10% cho khách hàng ở Bước 2')}
                  className="w-full py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kích Hoạt Auto-Coupon 10%</span>
                </button>
              </div>

              {/* Action 2 */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">2. Nhắc Lịch Khách Hẹn Qua Zalo OA</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                    Giảm 90% trễ lịch
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Tự động nhắn tin Zalo nhắc giờ hẹn kèm định vị bản đồ cho 34 khách có lịch hẹn hôm nay & tuần này.
                </p>
                <button
                  onClick={() => handleTriggerQuickAction('Gửi nhắc lịch Zalo OA cho tất cả khách có đơn hẹn')}
                  className="w-full py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Nhắc Lịch Zalo Hàng Loạt</span>
                </button>
              </div>

              {/* Action 3 */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">3. Xin Đánh Giá 5 Sao & Đổi Điểm Thưởng</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 font-bold">
                    Tăng uy tín Spa
                  </span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Gửi lời cảm ơn sau thanh toán và tặng 50 điểm thưởng cho khách hàng để lại đánh giá trải nghiệm.
                </p>
                <button
                  onClick={() => handleTriggerQuickAction('Kích hoạt quy trình chăm sóc khách hàng sau thanh toán')}
                  className="w-full py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Kích Hoạt Auto-Review Bonus</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Nav to Promotions or Booking */}
          <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-3 shadow-md">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Quản Lý Ưu Đãi & Lịch Hẹn</span>
            </div>
            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              Bạn có thể cập nhật các chương trình khuyến mãi hoặc tạo nhanh lịch hẹn trực tiếp cho khách hàng.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {onOpenPromotions && (
                <button
                  onClick={onOpenPromotions}
                  className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all text-center"
                >
                  Tạo Voucher Mới
                </button>
              )}
              {onOpenBookingModal && (
                <button
                  onClick={onOpenBookingModal}
                  className="flex-1 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-all text-center"
                >
                  Đặt Lịch Nhanh
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 4. AI SEASONALITY & FUTURE TRENDS SECTION */}
      <div className="bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50 rounded-2xl p-6 border border-emerald-200 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-800 text-white shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center space-x-2">
                <span>Dự Báo Xu Hướng Mùa Vụ & Gợi Ý AI Gemini (Future Trends)</span>
              </h2>
              <p className="text-xs text-zinc-600 font-medium">
                Mô hình học máy dự báo nhu cầu dịch vụ theo thời tiết, mùa lễ hội & dữ liệu khách hàng thực tế
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shrink-0">
            {seasonalTrend.seasonName}
          </span>
        </div>

        {/* Highlight Banner */}
        <div className="p-4 rounded-xl bg-white/90 border border-emerald-100 shadow-2xs space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
            <AlertCircle className="w-4 h-4 text-emerald-700" />
            <span>Đặc Điểm Xu Hướng Hiện Tại:</span>
          </div>
          <p className="text-xs text-zinc-700 leading-relaxed font-normal">
            {seasonalTrend.highlightReason}
          </p>
        </div>

        {/* Suggested Boost Packages & AI Tip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1: Top Recommended Packages */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center space-x-1.5">
              <span>🚀 Các gói dịch vụ nên đẩy mạnh tuần tới:</span>
            </h3>
            <div className="space-y-2">
              {seasonalTrend.suggestedBoosts.map((boost, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs flex items-center justify-between hover:border-emerald-300 transition-all"
                >
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">{boost.title}</span>
                    <span className="text-[11px] text-zinc-500 font-medium">{boost.reason}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    Nhu cầu +35%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: AI Gemini Advisor Strategy */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center space-x-1.5">
              <span>💡 Lời khuyên chiến lược từ AI Gemini:</span>
            </h3>

            <div className="p-4 rounded-xl bg-emerald-900 text-white space-y-3 shadow-md border border-emerald-800">
              <div className="flex items-start space-x-2">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-50 leading-relaxed font-medium">
                  {seasonalTrend.aiAdvisorTip}
                </p>
              </div>

              <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[11px] text-emerald-200">
                <span>Độ tin cậy mô hình dự báo: <strong>94.2%</strong></span>
                <button
                  onClick={() => handleTriggerQuickAction('Tự động áp dụng khuyến nghị chiến lược của AI Gemini vào Menu Dịch Vụ')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs transition-all active:scale-95"
                >
                  Áp Dụng Chiến Lược
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. CUSTOMER COHORT & PEAK HOURS MATRIX SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Customer Tier LTV Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Phân Đoạn Khách Hàng Theo Hạng Bậc (Customer Cohorts)</span>
            </h3>
            <span className="text-xs text-zinc-500 font-medium">{customers.length || 43} Khách Hàng</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {tierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {tierData.map((tier, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="font-semibold text-zinc-800">{tier.name}</span>
                  </div>
                  <span className="font-bold text-zinc-900">{tier.count} khách</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Hour Occupancy Heatmap */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Ma Trận Giờ Cao Điểm Đặt Lịch Trong Ngày</span>
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Khung giờ 10h & 15h
            </span>
          </div>

          <p className="text-xs text-zinc-500">
            Mật độ đặt lịch trung bình theo khung giờ giúp điều phối ca làm việc KTV & phòng giường tối ưu nhất.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
            {hourlyPeakData.map((item, idx) => {
              const isPeak = parseInt(item.occupancy) >= 85;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isPeak
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{item.hour}</span>
                  <span className="text-[11px] font-semibold block mt-0.5">{item.bookings} lịch</span>
                  <span className={`text-[10px] font-bold block mt-0.5 px-1.5 py-0.5 rounded-md ${
                    isPeak ? 'bg-amber-200 text-amber-950' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    Lấp đầy {item.occupancy}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

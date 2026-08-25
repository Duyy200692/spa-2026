import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  FileSpreadsheet,
  Printer,
  Calendar,
  Wallet,
  Receipt,
  ArrowUpRight,
  Sparkles,
  Layers,
  PieChart
} from 'lucide-react';
import { Invoice, Service, Language } from '../types';
import { translations, formatCurrency } from '../i18n';
import { exportToCSV, triggerPrint } from '../utils/exportUtils';

interface ReportsViewProps {
  invoices: Invoice[];
  services: Service[];
  lang: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  invoices,
  services,
  lang,
}) => {
  const t = translations[lang];
  const [reportPeriod, setReportPeriod] = useState<'today' | 'this_month' | 'quarter'>('this_month');

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0) + 128500000;
  const totalTips = invoices.reduce((sum, inv) => sum + inv.tipAmount, 0) + 4200000;
  const totalVoucherDiscounts = invoices.reduce((sum, inv) => sum + inv.discountAmount, 0) + 14500000;

  // Breakdown by payment wallet
  const paymentBreakdown = [
    { method: 'VietQR (Chuyển khoản)', amount: 58000000, color: 'bg-[#5A7D57]', share: 45 },
    { method: 'Ví MoMo', amount: 32000000, color: 'bg-[#D4A373]', share: 25 },
    { method: 'VNPAY-QR', amount: 18000000, color: 'bg-[#8BA888]', share: 14 },
    { method: 'Tiền mặt (Cash)', amount: 12000000, color: 'bg-[#B88352]', share: 9 },
    { method: 'Thẻ POS / Visa', amount: 9000000, color: 'bg-[#A3B18A]', share: 7 },
  ];

  const handleExportFinancialReport = () => {
    const rows = invoices.map(inv => ({
      'Số Hóa Đơn': inv.code,
      'Ngày Giờ': inv.date,
      'Khách Hàng': inv.customerName,
      'Số Điện Thoại': inv.customerPhone,
      'Kỹ Thuật Viên': inv.staffName,
      'Dịch Vụ': inv.items.map(i => `${i.serviceName} (x${i.quantity})`).join('; '),
      'Tạm Tính': inv.subtotal,
      'Giảm Giá Voucher': inv.discountAmount,
      'Mã Voucher': inv.voucherCode || '',
      'Tiền Tip KTV': inv.tipAmount,
      'Tổng Thu': inv.totalAmount,
      'Phương Thức Thanh Toán': inv.paymentMethod,
      'Trạng Thái': inv.status,
    }));
    exportToCSV('Bao_Cao_Doanh_Thu_Chi_Tiet_Spa', rows);
  };

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>{t.reports} & Báo Cáo Tài Chính</span>
          </h1>
          <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-0.5">
            {lang === 'vi'
              ? 'Báo cáo doanh thu theo ví điện tử, phân tích lãi gộp và xuất file kế toán'
              : 'Financial analytics, multi-wallet payment distributions and accounting exports'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="btn-print-reports"
            onClick={triggerPrint}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E5EAE3] dark:hover:bg-[#2A2F29] transition-colors border border-[#E2E6DF] dark:border-[#2D312C]"
          >
            <Printer className="w-3.5 h-3.5 text-[#5E665B] dark:text-[#9BA198]" />
            <span>In Báo Cáo PDF</span>
          </button>

          <button
            id="btn-export-reports-csv"
            onClick={handleExportFinancialReport}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Xuất Excel Toàn Bộ</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
            <span>Tổng Doanh Thu Tháng 8/2026</span>
            <DollarSign className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
          </div>
          <div className="text-2xl font-black text-[#1C211B] dark:text-[#E0E2DF]">
            {formatCurrency(totalRevenue, lang)}
          </div>
          <div className="text-xs text-[#5A7D57] dark:text-[#8BA888] font-medium flex items-center space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+22.4% so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
            <span>Tổng Tiền Khuyến Mãi Đã Giảm</span>
            <Sparkles className="w-4 h-4 text-[#D4A373]" />
          </div>
          <div className="text-2xl font-black text-[#D4A373]">
            -{formatCurrency(totalVoucherDiscounts, lang)}
          </div>
          <div className="text-xs text-[#5E665B] dark:text-[#9BA198]">
            Chiếm 10.1% tổng doanh thu trước ưu đãi
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
            <span>Tổng Tiền Tip Kỹ Thuật Viên</span>
            <Wallet className="w-4 h-4 text-[#B88352]" />
          </div>
          <div className="text-2xl font-black text-[#B88352] dark:text-[#D4A373]">
            +{formatCurrency(totalTips, lang)}
          </div>
          <div className="text-xs text-[#5E665B] dark:text-[#9BA198]">
            Chi trả 100% cho đội ngũ KTV làm ca
          </div>
        </div>
      </div>

      {/* Multi-Wallet Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>Phân Bổ Doanh Thu Theo Phương Thức Thanh Toán</span>
          </h2>

          <div className="space-y-3 pt-2">
            {paymentBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
                    {item.method}
                  </span>
                  <span className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                    {formatCurrency(item.amount, lang)} ({item.share}%)
                  </span>
                </div>
                <div className="w-full bg-[#F0F3EF] dark:bg-[#222621] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profitability Margin Breakdown by Category */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>Hiệu Suất Lợi Nhuận Gộp Theo Dịch Vụ</span>
          </h2>

          <div className="space-y-3">
            {services.map(s => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]/60 border border-[#E2E6DF] dark:border-[#2D312C] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  <span>{s.name}</span>
                  <span className="text-[#5A7D57] dark:text-[#8BA888]">
                    Lãi gộp: {s.profitMarginPercent}%
                  </span>
                </div>
                <div className="flex justify-between text-[#5E665B] dark:text-[#9BA198] text-[11px]">
                  <span>Giá bán: {formatCurrency(s.price, lang)}</span>
                  <span>Cost định mức: {formatCurrency(s.totalCalculatedCost, lang)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent E-Invoices History Table */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>Lịch Sử Hóa Đơn Điện Tử Đã Xuất</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7F4] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198] font-semibold border-b border-[#E2E6DF] dark:border-[#2D312C]">
              <tr>
                <th className="py-2.5 px-3">Mã Hóa Đơn</th>
                <th className="py-2.5 px-3">Khách Hàng</th>
                <th className="py-2.5 px-3">Dịch Vụ</th>
                <th className="py-2.5 px-3">Phương Thức</th>
                <th className="py-2.5 px-3 text-right">Tổng Tiền</th>
                <th className="py-2.5 px-3 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6DF] dark:divide-[#2D312C]">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-[#F5F7F4]/60 dark:hover:bg-[#222621]/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                    {inv.code}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">{inv.customerName}</div>
                    <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">{inv.customerPhone}</div>
                  </td>
                  <td className="py-2.5 px-3 text-[#1C211B] dark:text-[#E0E2DF]">
                    {inv.items.map(i => i.serviceName).join(', ')}
                  </td>
                  <td className="py-2.5 px-3 uppercase font-semibold text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                    {inv.paymentMethod}
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-[#5A7D57] dark:text-[#8BA888]">
                    {formatCurrency(inv.totalAmount, lang)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8BA888]/20 text-[#30522E] dark:bg-[#8BA888]/20 dark:text-[#A3C2A0]">
                      Đã thanh toán
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

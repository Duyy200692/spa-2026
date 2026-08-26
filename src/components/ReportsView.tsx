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
  PieChart,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info
} from 'lucide-react';
import { Invoice, Service, Language } from '../types';
import { translations, formatCurrency } from '../i18n';
import { exportToCSV, triggerPrint } from '../utils/exportUtils';
import { ServiceBadgeTag } from './ServiceBadgeTag';
import { ServiceDetailModal, ServiceDetailMeta } from './ServiceDetailModal';
import { resolveServiceMeta } from '../utils/serviceUtils';

interface ReportsViewProps {
  invoices: Invoice[];
  services: Service[];
  lang: Language;
  onDeleteInvoice?: (invoiceId: string) => void;
  onClearAllInvoices?: () => Promise<void> | void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  invoices,
  services,
  lang,
  onDeleteInvoice,
  onClearAllInvoices,
}) => {
  const t = translations[lang];
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [showClearInvoicesModal, setShowClearInvoicesModal] = useState(false);
  const [isWipingInvoices, setIsWipingInvoices] = useState(false);
  const [wipeSuccessMsg, setWipeSuccessMsg] = useState<string | null>(null);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceDetailMeta | null>(null);

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalTips = invoices.reduce((sum, inv) => sum + (inv.tipAmount || 0), 0);
  const totalVoucherDiscounts = invoices.reduce((sum, inv) => sum + (inv.discountAmount || 0), 0);

  // Breakdown by payment wallet calculated from real invoice data
  const paymentMethodsMap: Record<string, number> = {
    vietqr: 0,
    momo: 0,
    vnpay: 0,
    cash: 0,
    pos: 0,
  };

  invoices.forEach(inv => {
    const method = (inv.paymentMethod || 'cash').toLowerCase();
    if (paymentMethodsMap[method] !== undefined) {
      paymentMethodsMap[method] += inv.totalAmount || 0;
    } else {
      paymentMethodsMap.cash += inv.totalAmount || 0;
    }
  });

  const paymentBreakdown = [
    {
      method: 'VietQR (Chuyển khoản)',
      amount: paymentMethodsMap.vietqr,
      color: 'bg-[#5A7D57]',
      share: totalRevenue > 0 ? Math.round((paymentMethodsMap.vietqr / totalRevenue) * 100) : 0,
    },
    {
      method: 'Ví MoMo',
      amount: paymentMethodsMap.momo,
      color: 'bg-[#D4A373]',
      share: totalRevenue > 0 ? Math.round((paymentMethodsMap.momo / totalRevenue) * 100) : 0,
    },
    {
      method: 'VNPAY-QR',
      amount: paymentMethodsMap.vnpay,
      color: 'bg-[#8BA888]',
      share: totalRevenue > 0 ? Math.round((paymentMethodsMap.vnpay / totalRevenue) * 100) : 0,
    },
    {
      method: 'Tiền mặt (Cash)',
      amount: paymentMethodsMap.cash,
      color: 'bg-[#B88352]',
      share: totalRevenue > 0 ? Math.round((paymentMethodsMap.cash / totalRevenue) * 100) : 0,
    },
    {
      method: 'Thẻ POS / Visa',
      amount: paymentMethodsMap.pos,
      color: 'bg-[#A3B18A]',
      share: totalRevenue > 0 ? Math.round((paymentMethodsMap.pos / totalRevenue) * 100) : 0,
    },
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

  const handleConfirmDeleteInvoice = () => {
    if (!invoiceToDelete) return;
    if (onDeleteInvoice) {
      onDeleteInvoice(invoiceToDelete.id);
    }
    setInvoiceToDelete(null);
  };

  const handleExecuteWipeInvoices = async () => {
    setIsWipingInvoices(true);
    setWipeSuccessMsg(null);
    try {
      if (onClearAllInvoices) {
        await onClearAllInvoices();
      }
      setWipeSuccessMsg('Đã xóa toàn bộ hóa đơn test thành công!');
      setTimeout(() => {
        setShowClearInvoicesModal(false);
        setWipeSuccessMsg(null);
      }, 2000);
    } catch (err: any) {
      alert(`Lỗi: ${err.message || err}`);
    } finally {
      setIsWipingInvoices(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#5A7D57] dark:text-[#8BA888]" />
              <span>{t.reports} & Báo Cáo Tài Chính</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8BA888]/15 text-[#325230] dark:text-[#A3C2A0] border border-[#8BA888]/30">
              {invoices.length} Hóa đơn
            </span>
          </div>
          <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-0.5">
            {lang === 'vi'
              ? 'Báo cáo doanh thu theo ví điện tử, phân tích lãi gộp và xuất file kế toán'
              : 'Financial analytics, multi-wallet payment distributions and accounting exports'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {invoices.length > 0 && onClearAllInvoices && (
            <button
              onClick={() => setShowClearInvoicesModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 transition-colors shadow-xs"
              title="Xóa danh sách hóa đơn test để doanh thu bắt đầu chuẩn từ đầu"
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Xóa Hóa Đơn Test</span>
            </button>
          )}

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
            <span>Tổng Doanh Thu Đã Thu</span>
            <DollarSign className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
          </div>
          <div className="text-2xl font-black text-[#1C211B] dark:text-[#E0E2DF]">
            {formatCurrency(totalRevenue, lang)}
          </div>
          <div className="text-xs text-[#5A7D57] dark:text-[#8BA888] font-medium flex items-center space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Tổng cộng {invoices.length} giao dịch thanh toán</span>
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
            Ưu đãi từ các mã Voucher & Chiến dịch
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

          {services.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#5E665B] dark:text-[#9BA198] bg-[#F5F7F4] dark:bg-[#222621]/40 rounded-xl">
              Chưa có dịch vụ nào trong bảng định mức giá vốn.
            </div>
          ) : (
            <div className="space-y-2.5">
              {services.map(s => {
                const meta = resolveServiceMeta(s.name, s.id, s.code, services);
                return (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]/60 border border-[#E2E6DF] dark:border-[#2D312C] space-y-1.5 text-xs hover:border-[#5A7D57]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <ServiceBadgeTag
                        serviceName={s.name}
                        serviceId={s.id}
                        serviceCode={s.code}
                        allServices={services}
                        onOpenDetail={setSelectedServiceForDetail}
                        className="font-bold min-w-0"
                      />
                      <span className="font-bold text-[#5A7D57] dark:text-[#8BA888] shrink-0">
                        Lãi gộp: {s.profitMarginPercent}%
                      </span>
                    </div>
                    <div className="flex justify-between text-[#5E665B] dark:text-[#9BA198] text-[11px] pt-0.5">
                      <span>Giá bán: {formatCurrency(s.price, lang)}</span>
                      <span>Cost định mức: {formatCurrency(s.totalCalculatedCost, lang)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent E-Invoices History Table */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
              <span>Lịch Sử Hóa Đơn Điện Tử Đã Xuất</span>
            </h2>
            <span className="text-[11px] text-[#5E665B] dark:text-[#9BA198] hidden sm:inline">
              (Bấm vào mã dịch vụ để xem tên đầy đủ & chi tiết)
            </span>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#5E665B] dark:text-[#9BA198] bg-[#F5F7F4] dark:bg-[#222621]/40 rounded-xl space-y-1">
            <p className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">Chưa có hóa đơn nào</p>
            <p>Khi bạn thực hiện thanh toán tại quầy thu ngân (POS), hóa đơn điện tử sẽ tự động xuất hiện ở đây.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-[#F5F7F4] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198] font-semibold border-b border-[#E2E6DF] dark:border-[#2D312C]">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">Mã Hóa Đơn</th>
                  <th className="py-2.5 px-3 min-w-[150px]">Khách Hàng</th>
                  <th className="py-2.5 px-3 min-w-[220px]">Dịch Vụ (Ký Hiệu & Rút Gọn)</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Phương Thức</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Tổng Tiền</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Trạng Thái</th>
                  {onDeleteInvoice && <th className="py-2.5 px-3 text-center whitespace-nowrap">Thao Tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E6DF] dark:divide-[#2D312C]">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-[#F5F7F4]/60 dark:hover:bg-[#222621]/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#1C211B] dark:text-[#E0E2DF] whitespace-nowrap">
                      {inv.code}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">{inv.customerName}</div>
                      <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198] font-mono">{inv.customerPhone}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[#1C211B] dark:text-[#E0E2DF]">
                      <div className="flex flex-col gap-1.5 py-0.5">
                        {inv.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-center space-x-1.5 flex-wrap">
                            <ServiceBadgeTag
                              serviceName={item.serviceName}
                              serviceId={item.serviceId}
                              serviceCode={item.serviceCode}
                              allServices={services}
                              onOpenDetail={setSelectedServiceForDetail}
                            />
                            {item.quantity > 1 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#E2E6DF] dark:bg-[#2D312C] text-[#5E665B] dark:text-[#9BA198]">
                                x{item.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 uppercase font-semibold text-[11px] text-[#5E665B] dark:text-[#9BA198] whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-[#F0F3EF] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C]">
                        {inv.paymentMethod}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-[#5A7D57] dark:text-[#8BA888] whitespace-nowrap">
                      {formatCurrency(inv.totalAmount, lang)}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8BA888]/20 text-[#30522E] dark:bg-[#8BA888]/20 dark:text-[#A3C2A0]">
                        Đã thanh toán
                      </span>
                    </td>
                    {onDeleteInvoice && (
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => setInvoiceToDelete(inv)}
                          className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Xóa hóa đơn test này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Single Invoice Confirmation Modal */}
      {invoiceToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-md shadow-2xl border border-rose-200 dark:border-rose-900/50 p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  Xóa Hóa Đơn {invoiceToDelete.code}
                </h3>
                <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                  Thao tác sẽ xóa hóa đơn này khỏi hệ thống báo cáo và database.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] text-xs space-y-1">
              <p><strong>Khách hàng:</strong> {invoiceToDelete.customerName} ({invoiceToDelete.customerPhone})</p>
              <p><strong>Số tiền:</strong> {formatCurrency(invoiceToDelete.totalAmount, lang)}</p>
              <p><strong>Ngày lập:</strong> {invoiceToDelete.date}</p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setInvoiceToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteInvoice}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Xóa Hóa Đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wipe All Invoices Modal */}
      {showClearInvoicesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-md shadow-2xl border border-amber-300 dark:border-amber-700/60 p-6 space-y-4">
            <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  Xóa Toàn Bộ Hóa Đơn Test
                </h3>
                <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                  Đặt lại số liệu doanh thu về 0đ để bắt đầu vận hành thực tế
                </p>
              </div>
            </div>

            {wipeSuccessMsg ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{wipeSuccessMsg}</span>
              </div>
            ) : (
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                Bạn có chắc chắn muốn xóa sạch <strong>{invoices.length} hóa đơn</strong> hiện có trong cơ sở dữ liệu? Doanh thu và tiền tip sẽ được tính toán lại từ đầu.
              </p>
            )}

            {!wipeSuccessMsg && (
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  disabled={isWipingInvoices}
                  onClick={() => setShowClearInvoicesModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  disabled={isWipingInvoices}
                  onClick={handleExecuteWipeInvoices}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                >
                  {isWipingInvoices ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang Xóa...</span>
                    </>
                  ) : (
                    <span>Xác Nhận Xóa Sạch</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service Detail Modal Popup */}
      <ServiceDetailModal
        meta={selectedServiceForDetail}
        lang={lang}
        onClose={() => setSelectedServiceForDetail(null)}
      />
    </div>
  );
};

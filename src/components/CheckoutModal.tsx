import React, { useState } from 'react';
import {
  X,
  Receipt,
  CreditCard,
  QrCode,
  Wallet,
  Sparkles,
  CheckCircle,
  Printer,
  DollarSign,
  Gift,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Appointment,
  Customer,
  Service,
  Staff,
  Promotion,
  Invoice,
  PaymentMethodType,
  Language
} from '../types';
import { translations, formatCurrency } from '../i18n';
import { triggerPrint } from '../utils/exportUtils';
import { generateServiceCode, getServiceShortName, resolveServiceMeta } from '../utils/serviceUtils';

interface CheckoutModalProps {
  initialAppointment?: Appointment | null;
  customers: Customer[];
  services: Service[];
  staff: Staff[];
  promotions: Promotion[];
  lang: Language;
  onClose: () => void;
  onConfirmPayment: (invoice: Invoice) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  initialAppointment,
  customers,
  services,
  staff,
  promotions,
  lang,
  onClose,
  onConfirmPayment,
}) => {
  const t = translations[lang];

  // Selected entities
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialAppointment?.customerId || customers[0]?.id || ''
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialAppointment?.serviceId || services[0]?.id || ''
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    initialAppointment?.staffId || staff[0]?.id || ''
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('vietqr');
  const [voucherCodeInput, setVoucherCodeInput] = useState<string>('SPASUMMER20');
  const [appliedVoucher, setAppliedVoucher] = useState<Promotion | null>(
    promotions.find(p => p.code === 'SPASUMMER20') || null
  );
  const [tipAmount, setTipAmount] = useState<number>(50000);
  const [includeVAT, setIncludeVAT] = useState<boolean>(false);
  const [paymentSuccessInvoice, setPaymentSuccessInvoice] = useState<Invoice | null>(null);

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const activeService = services.find(s => s.id === selectedServiceId) || services[0];
  const activeStaff = staff.find(st => st.id === selectedStaffId) || staff[0];

  // Financial calculations
  const subtotal = activeService ? activeService.price : 450000;
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedVoucher.discountValue) / 100);
      if (appliedVoucher.maxDiscount) {
        discountAmount = Math.min(discountAmount, appliedVoucher.maxDiscount);
      }
    } else {
      discountAmount = appliedVoucher.discountValue;
    }
  }

  const taxAmount = includeVAT ? Math.round((subtotal - discountAmount) * 0.08) : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount + tipAmount);

  const handleApplyVoucher = () => {
    const found = promotions.find(
      p => p.code.toUpperCase() === voucherCodeInput.trim().toUpperCase() && p.status === 'active'
    );
    if (found) {
      setAppliedVoucher(found);
    } else {
      alert(lang === 'vi' ? 'Mã ưu đãi không hợp lệ hoặc đã hết hạn!' : 'Invalid or expired voucher code!');
    }
  };

  const handleFinalCheckout = () => {
    const srvMeta = resolveServiceMeta(activeService);
    const invoice: Invoice = {
      id: `inv-rec-${Date.now()}`,
      code: `HD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 900 + 100)}`,
      appointmentId: initialAppointment?.id,
      customerId: activeCustomer.id,
      customerName: activeCustomer.name,
      customerPhone: activeCustomer.phone,
      staffId: activeStaff.id,
      staffName: activeStaff.name,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      items: [
        {
          serviceId: activeService.id,
          serviceCode: srvMeta.code,
          serviceShortName: srvMeta.shortName,
          serviceName: activeService.name,
          quantity: 1,
          price: activeService.price,
        }
      ],
      subtotal,
      discountAmount,
      voucherCode: appliedVoucher?.code,
      taxAmount,
      tipAmount,
      totalAmount,
      paymentMethod: selectedPaymentMethod,
      status: 'paid',
      notes: `Thanh toán qua ${selectedPaymentMethod.toUpperCase()} thành công.`,
    };

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setPaymentSuccessInvoice(invoice);
    onConfirmPayment(invoice);
  };

  const paymentOptions: { id: PaymentMethodType; label: string; icon: string; bg: string }[] = [
    { id: 'vietqr', label: 'VietQR (Ngân hàng)', icon: '🏦', bg: 'hover:border-emerald-500' },
    { id: 'momo', label: 'Ví MoMo', icon: '🟣', bg: 'hover:border-pink-500' },
    { id: 'vnpay', label: 'VNPAY-QR', icon: '🔵', bg: 'hover:border-blue-500' },
    { id: 'zalopay', label: 'Ví ZaloPay', icon: '🟢', bg: 'hover:border-teal-500' },
    { id: 'card', label: 'Thẻ POS / Visa', icon: '💳', bg: 'hover:border-purple-500' },
    { id: 'cash', label: 'Tiền mặt', icon: '💵', bg: 'hover:border-amber-500' },
    { id: 'apple_pay', label: 'Apple Pay', icon: '🍎', bg: 'hover:border-zinc-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1A1C19] rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A7D57] dark:bg-[#8BA888] flex items-center justify-center text-white dark:text-[#121412] shadow-sm">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                {paymentSuccessInvoice ? 'Hóa Đơn Thanh Toán Điện Tử' : t.paymentTitle}
              </h2>
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                {paymentSuccessInvoice ? `Mã: ${paymentSuccessInvoice.code}` : 'Thanh toán tức thì đa ví & in biên lai'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State 1: SUCCESS RECEIPT VIEW */}
        {paymentSuccessInvoice ? (
          <div className="space-y-6 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-[#E5ECE3] dark:bg-[#233322] text-[#466543] dark:text-[#8BA888] flex items-center justify-center mx-auto ring-8 ring-[#EEF2EC] dark:ring-[#1E271D]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                {lang === 'vi' ? 'Thanh Toán Thành Công!' : 'Payment Completed!'}
              </h3>
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-1">
                {lang === 'vi' ? 'Hóa đơn đã được lưu và gửi thông báo tích điểm tới khách hàng.' : 'Receipt recorded and points credited.'}
              </p>
            </div>

            {/* Printable Invoice Card */}
            <div
              id="printable-invoice-card"
              className="p-5 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] text-left text-xs space-y-3 print:border-none print:shadow-none"
            >
              <div className="flex justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-2">
                <div>
                  <div className="font-bold text-sm text-[#1C211B] dark:text-[#E0E2DF]">SPAMASTER BEAUTY CLINIC</div>
                  <div className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-[#5A7D57] dark:text-[#8BA888]">{paymentSuccessInvoice.code}</div>
                  <div className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">{paymentSuccessInvoice.date}</div>
                </div>
              </div>

              <div className="space-y-1 text-[#1C211B] dark:text-[#E0E2DF]">
                <div>Khách hàng: <strong>{paymentSuccessInvoice.customerName}</strong> ({paymentSuccessInvoice.customerPhone})</div>
                <div>Kỹ thuật viên: <strong>{paymentSuccessInvoice.staffName}</strong></div>
              </div>

              <div className="border-t border-b border-[#E2E6DF] dark:border-[#2D312C] py-2 space-y-1">
                {paymentSuccessInvoice.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      {it.serviceCode && (
                        <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-[#8BA888]/20 text-[#30522E] dark:text-[#A3C2A0] border border-[#8BA888]/30">
                          {it.serviceCode}
                        </span>
                      )}
                      <span className="text-[#1C211B] dark:text-[#E0E2DF] font-medium truncate">
                        {it.serviceShortName || it.serviceName}
                      </span>
                    </div>
                    <span className="font-bold text-[#1C211B] dark:text-[#E0E2DF] shrink-0 ml-2">{formatCurrency(it.price, lang)}</span>
                  </div>
                ))}
                {paymentSuccessInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-[#8A504B] dark:text-[#D98A84]">
                    <span>Giảm giá ({paymentSuccessInvoice.voucherCode})</span>
                    <span>-{formatCurrency(paymentSuccessInvoice.discountAmount, lang)}</span>
                  </div>
                )}
                {paymentSuccessInvoice.tipAmount > 0 && (
                  <div className="flex justify-between text-[#9C7030] dark:text-[#D4A559]">
                    <span>Tiền tip KTV</span>
                    <span>+{formatCurrency(paymentSuccessInvoice.tipAmount, lang)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-sm font-black text-[#1C211B] dark:text-[#E0E2DF] pt-1">
                <span>TỔNG THANH TOÁN ({paymentSuccessInvoice.paymentMethod.toUpperCase()}):</span>
                <span className="text-base text-[#5A7D57] dark:text-[#8BA888]">{formatCurrency(paymentSuccessInvoice.totalAmount, lang)}</span>
              </div>

              <div className="text-center pt-2 text-[10px] text-[#5E665B] dark:text-[#9BA198] italic">
                {t.thankYou}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                id="btn-print-invoice-action"
                onClick={triggerPrint}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1C211B] text-white dark:bg-[#E0E2DF] dark:text-[#121412] hover:opacity-90 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>{t.printInvoice}</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412]"
              >
                {t.close}
              </button>
            </div>
          </div>
        ) : (
          /* State 2: BILLING FORM & PAYMENT SELECTION */
          <div className="space-y-5 text-xs">
            {/* Customer & Service Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Khách hàng thanh toán:
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.tier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Dịch vụ đã thực hiện:
                </label>
                <select
                  value={selectedServiceId}
                  onChange={e => setSelectedServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                >
                  {services.map(s => {
                    const meta = resolveServiceMeta(s);
                    return (
                      <option key={s.id} value={s.id}>
                        [{meta.code}] {meta.shortName} — {formatCurrency(s.price, lang)}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Voucher code input & Tip addition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Mã khuyến mãi / Voucher:
                </label>
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    placeholder="SPASUMMER20"
                    value={voucherCodeInput}
                    onChange={e => setVoucherCodeInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="px-3 py-2 rounded-xl bg-[#2D312C] hover:bg-[#3D423B] text-[#E0E2DF] dark:bg-[#3A3F38] dark:hover:bg-[#4A5047] font-semibold"
                  >
                    Áp dụng
                  </button>
                </div>
                {appliedVoucher && (
                  <span className="text-[11px] text-[#466543] dark:text-[#8BA888] font-semibold mt-1 block">
                    ✓ Đã áp dụng {appliedVoucher.code} (-{formatCurrency(discountAmount, lang)})
                  </span>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  {t.tipForStaff} (VNĐ):
                </label>
                <div className="flex space-x-1.5">
                  {[0, 20000, 50000, 100000].map(tip => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setTipAmount(tip)}
                      className={`flex-1 py-2 rounded-xl border font-bold transition-all ${
                        tipAmount === tip
                          ? 'border-[#8BA888] bg-[#E5ECE3] dark:bg-[#233322] text-[#2C4829] dark:text-[#8BA888]'
                          : 'border-[#E2E6DF] dark:border-[#2D312C] text-[#5E665B] dark:text-[#9BA198]'
                      }`}
                    >
                      {tip === 0 ? '0' : `${tip / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method Selector Cards */}
            <div className="space-y-2">
              <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
                {t.selectPaymentMethod}:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {paymentOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(opt.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      selectedPaymentMethod === opt.id
                        ? 'border-[#5A7D57] dark:border-[#8BA888] bg-[#E5ECE3]/60 dark:bg-[#233322]/60 text-[#2C4829] dark:text-[#8BA888] ring-1 ring-[#5A7D57] dark:ring-[#8BA888] font-bold'
                        : 'border-[#E2E6DF] dark:border-[#2D312C] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]'
                    }`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span className="text-[11px] truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic VietQR Simulator */}
            {selectedPaymentMethod === 'vietqr' && (
              <div className="p-4 rounded-2xl bg-[#E5ECE3]/40 dark:bg-[#233322]/40 border border-[#8BA888]/30 flex flex-col sm:flex-row items-center gap-4">
                {/* Visual Realistic QR Code */}
                <div className="bg-white p-3 rounded-2xl shadow-sm shrink-0 flex flex-col items-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=2|99|0918889901|SPAMASTER|${totalAmount}|THANHTOAN_SPA`}
                    alt="VietQR Payment Code"
                    className="w-28 h-28 object-contain"
                  />
                  <span className="text-[9px] font-black text-[#2C4829] tracking-wider mt-1">VIETQR 24/7</span>
                </div>

                <div className="space-y-1 text-xs text-[#1C211B] dark:text-[#E0E2DF]">
                  <div className="font-bold text-[#466543] dark:text-[#8BA888] flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quét mã VietQR chuyển khoản nhanh 24/7</span>
                  </div>
                  <div>Ngân hàng: <strong>Vietcombank (VCB)</strong></div>
                  <div>Số tài khoản: <strong className="font-mono text-[#1C211B] dark:text-[#E0E2DF]">0071001234567</strong></div>
                  <div>Chủ tài khoản: <strong>CTY TNHH SPAMASTER CLINIC</strong></div>
                  <div>Nội dung CK: <strong className="font-mono text-[#5A7D57] dark:text-[#8BA888]">{activeCustomer.phone.replace(/\s/g, '')} SPA</strong></div>
                </div>
              </div>
            )}

            {/* Summary Line Items */}
            <div className="p-4 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] space-y-2 border border-[#E2E6DF] dark:border-[#2D312C]">
              <div className="flex justify-between text-[#5E665B] dark:text-[#9BA198]">
                <span>{t.subtotal}:</span>
                <span className="font-medium text-[#1C211B] dark:text-[#E0E2DF]">{formatCurrency(subtotal, lang)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#8A504B] dark:text-[#D98A84] font-semibold">
                  <span>{t.voucherDiscount} ({appliedVoucher?.code}):</span>
                  <span>-{formatCurrency(discountAmount, lang)}</span>
                </div>
              )}
              {tipAmount > 0 && (
                <div className="flex justify-between text-[#9C7030] dark:text-[#D4A559] font-semibold">
                  <span>{t.tipForStaff}:</span>
                  <span>+{formatCurrency(tipAmount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-black text-[#1C211B] dark:text-[#E0E2DF] pt-2 border-t border-[#E2E6DF] dark:border-[#2D312C]">
                <span>{t.totalPayment}:</span>
                <span className="text-lg text-[#5A7D57] dark:text-[#8BA888] font-black">
                  {formatCurrency(totalAmount, lang)}
                </span>
              </div>
            </div>

            {/* Action Checkout Button */}
            <button
              id="btn-confirm-final-payment"
              type="button"
              onClick={handleFinalCheckout}
              className="w-full py-3.5 rounded-2xl text-sm font-bold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t.confirmPayment} ({formatCurrency(totalAmount, lang)})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

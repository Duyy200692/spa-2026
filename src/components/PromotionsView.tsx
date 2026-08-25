import React, { useState } from 'react';
import {
  TicketPercent,
  Plus,
  Send,
  Sparkles,
  Users,
  Calendar,
  CheckCircle2,
  Bell,
  MessageSquare,
  Gift,
  X
} from 'lucide-react';
import { Promotion, Customer, Language, AppNotification } from '../types';
import { translations, formatCurrency } from '../i18n';

interface PromotionsViewProps {
  promotions: Promotion[];
  customers: Customer[];
  lang: Language;
  onAddPromotion: (promo: Promotion) => void;
  onBroadcastNotification: (notif: AppNotification) => void;
}

export const PromotionsView: React.FC<PromotionsViewProps> = ({
  promotions,
  customers,
  lang,
  onAddPromotion,
  onBroadcastNotification,
}) => {
  const t = translations[lang];
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [broadcastTitle, setBroadcastTitle] = useState<string>('🔥 Ưu đãi tri ân đặc quyền dành riêng cho bạn!');
  const [broadcastMessage, setBroadcastMessage] = useState<string>(
    'Nhập ngay mã SPASUMMER20 để được giảm 20% tất cả liệu trình cấy tảo và trị mụn hôm nay tại SpaMaster.'
  );
  const [broadcastSent, setBroadcastSent] = useState(false);

  // New promo form state
  const [newPromo, setNewPromo] = useState<Partial<Promotion>>({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 300000,
    startDate: '2026-08-25',
    endDate: '2026-09-30',
    usageLimit: 100,
    targetTier: 'All',
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    let targetCount = customers.length;
    if (selectedAudience === 'vip') {
      targetCount = customers.filter(c => c.tier === 'VIP' || c.tier === 'Diamond').length;
    }

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: broadcastTitle,
      message: `${broadcastMessage} (Đã gửi tới ${targetCount} khách hàng qua SMS/App Push)`,
      timestamp: 'Vừa xong',
      type: 'promo',
      read: false,
      targetAudience: selectedAudience,
    };

    onBroadcastNotification(notif);
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code || !newPromo.title) return;

    const created: Promotion = {
      id: `promo-${Date.now()}`,
      code: newPromo.code.toUpperCase(),
      title: newPromo.title,
      description: newPromo.description || '',
      discountType: newPromo.discountType as any || 'percentage',
      discountValue: Number(newPromo.discountValue) || 10,
      minOrderValue: Number(newPromo.minOrderValue) || 0,
      startDate: newPromo.startDate || '2026-08-25',
      endDate: newPromo.endDate || '2026-09-30',
      usageLimit: Number(newPromo.usageLimit) || 100,
      usedCount: 0,
      status: 'active',
      targetTier: newPromo.targetTier || 'All',
      bannerColor: 'from-rose-500 to-amber-500',
    };

    onAddPromotion(created);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
            <TicketPercent className="w-5 h-5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>{t.promotionsTitle}</span>
          </h1>
          <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-0.5">
            {lang === 'vi'
              ? 'Tạo voucher giảm giá, mã tri ân và gửi thông báo tin nhắn hàng loạt tới tệp khách hàng'
              : 'Create marketing vouchers, discounts and broadcast push campaigns'}
          </p>
        </div>

        <button
          id="btn-create-promo-modal"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{t.createPromotion}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Active Promotions Grid */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] uppercase tracking-wider">
            Các Chương Trình Ưu Đãi Đang Chạy ({promotions.length})
          </h2>

          <div className="space-y-3">
            {promotions.map(promo => (
              <div
                key={promo.id}
                className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-[#8BA888]/20 text-[#325230] dark:bg-[#8BA888]/20 dark:text-[#A3C2A0] border border-[#8BA888]/40">
                      {promo.code}
                    </span>
                    <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] pt-1">
                      {promo.title}
                    </h3>
                    <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                      {promo.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-[#5A7D57] dark:text-[#8BA888]">
                      {promo.discountType === 'percentage'
                        ? `-${promo.discountValue}%`
                        : `-${formatCurrency(promo.discountValue, lang)}`}
                    </div>
                    <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">
                      Đơn tối thiểu: {formatCurrency(promo.minOrderValue, lang)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#5E665B] dark:text-[#9BA198] pt-2 border-t border-[#E2E6DF] dark:border-[#2D312C]">
                  <span>Hạn dùng: <strong>{promo.startDate}</strong> đến <strong>{promo.endDate}</strong></span>
                  <span>Đã dùng: <strong className="text-[#5A7D57] dark:text-[#8BA888]">{promo.usedCount}/{promo.usageLimit}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 Cols): Broadcast Notification Studio */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-[#8BA888]/20 text-[#325230] dark:text-[#8BA888]">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  {t.broadcastNotification}
                </h3>
                <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                  Gửi tin thông báo / Zalo ZNS / SMS tự động tới khách hàng
                </p>
              </div>
            </div>

            {broadcastSent && (
              <div className="p-3 rounded-xl bg-[#8BA888]/20 border border-[#8BA888]/40 text-[#2C492A] dark:text-[#CCD5AE] text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888] shrink-0" />
                <span>Đã phát thông báo khuyến mãi thành công tới toàn bộ khách hàng!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  {t.selectAudience}:
                </label>
                <select
                  value={selectedAudience}
                  onChange={e => setSelectedAudience(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                >
                  <option value="all">{t.allCustomers} ({customers.length} khách)</option>
                  <option value="vip">{t.vipOnly} (VIP & Diamond)</option>
                  <option value="birthday">{t.birthdayMonth}</option>
                  <option value="inactive">{t.inactiveCustomers}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tiêu đề thông báo:
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Nội dung tin nhắn khuyến mãi:
                </label>
                <textarea
                  rows={4}
                  required
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <button
                id="btn-broadcast-now"
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-all shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.sendCampaign}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Create Promotion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePromo}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-lg shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                {t.createPromotion}
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Mã Voucher (Code) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: SPAVIP50K"
                    value={newPromo.code}
                    onChange={e => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl font-mono uppercase font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Loại giảm giá
                  </label>
                  <select
                    value={newPromo.discountType}
                    onChange={e => setNewPromo({ ...newPromo, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  >
                    <option value="percentage">Giảm theo %</option>
                    <option value="fixed_amount">Giảm số tiền cố định (VNĐ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tên chương trình khuyến mãi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Giảm 20% Chăm Sóc Da Mùa Hè"
                  value={newPromo.title}
                  onChange={e => setNewPromo({ ...newPromo, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Mức giảm ({newPromo.discountType === 'percentage' ? '%' : 'VNĐ'})
                  </label>
                  <input
                    type="number"
                    value={newPromo.discountValue}
                    onChange={e => setNewPromo({ ...newPromo, discountValue: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Đơn hàng tối thiểu (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={newPromo.minOrderValue}
                    onChange={e => setNewPromo({ ...newPromo, minOrderValue: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={newPromo.startDate}
                    onChange={e => setNewPromo({ ...newPromo, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={newPromo.endDate}
                    onChange={e => setNewPromo({ ...newPromo, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm"
              >
                Tạo Voucher
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

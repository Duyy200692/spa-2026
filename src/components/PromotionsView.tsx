import React, { useState, useRef } from 'react';
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
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit3,
  Copy,
  Check,
  Tag,
  Clock,
  Flame,
  Percent,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Crown
} from 'lucide-react';
import { Promotion, Customer, Language, AppNotification } from '../types';
import { translations, formatCurrency } from '../i18n';

interface PromotionsViewProps {
  promotions: Promotion[];
  customers: Customer[];
  lang: Language;
  onAddPromotion: (promo: Promotion) => void;
  onUpdatePromotion?: (promo: Promotion) => void;
  onDeletePromotion?: (promoId: string) => void;
  onBroadcastNotification: (notif: AppNotification) => void;
}

// Preset Luxury Spa Marketing Banner Templates
const PRESET_SPA_BANNERS = [
  {
    name: 'Cấy Tinh Chất & Trẻ Hóa Da Mặt',
    badge: 'HOT DEAL • FACIAL GLOW',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    category: 'facial' as const,
  },
  {
    name: 'Massage Body & Đá Nóng Thư Giãn',
    badge: 'RELAX RITUAL • BODY CARE',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    category: 'body' as const,
  },
  {
    name: 'Liệu Trình Triệt Lông & Tái Sinh Da',
    badge: 'SIÊU ƯU ĐÃI • SMOOTH SKIN',
    url: 'https://images.unsplash.com/photo-1512290900672-1f4864c20577?w=800&q=80',
    category: 'body' as const,
  },
  {
    name: 'Gội Đầu Dưỡng Sinh Thảo Mộc',
    badge: 'DƯỠNG SINH • THƯ GIÃN',
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80',
    category: 'combo' as const,
  },
  {
    name: 'Đại Tiệc Ưu Đãi Mùa Hè 2026',
    badge: 'MEGA SALE • UP TO 50%',
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    category: 'special' as const,
  },
  {
    name: 'Đặc Quyền Hội Viên & Sinh Nhật',
    badge: 'VIP CLUB • EXCLUSIVE',
    url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    category: 'special' as const,
  },
];

export const PromotionsView: React.FC<PromotionsViewProps> = ({
  promotions,
  customers,
  lang,
  onAddPromotion,
  onUpdatePromotion,
  onDeletePromotion,
  onBroadcastNotification,
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'facial' | 'body' | 'combo' | 'special'>('all');

  // Broadcast campaign state
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [broadcastTitle, setBroadcastTitle] = useState<string>('🔥 Ưu đãi tri ân đặc quyền dành riêng cho bạn!');
  const [broadcastMessage, setBroadcastMessage] = useState<string>(
    'Nhập ngay mã SPASUMMER20 để được giảm 20% tất cả liệu trình cấy tảo và trị mụn hôm nay tại SpaMaster.'
  );
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Form State
  const defaultPromoState: Partial<Promotion> = {
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 300000,
    maxDiscount: undefined,
    originalPrice: undefined,
    promotionalPrice: undefined,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    targetTier: 'All',
    category: 'facial',
    highlightBadge: 'HOT DEAL',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    featured: false,
  };

  const [formData, setFormData] = useState<Partial<Promotion>>(defaultPromoState);
  const [isDragOver, setIsDragOver] = useState(false);

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const handleOpenCreateModal = () => {
    setEditingPromoId(null);
    setFormData(defaultPromoState);
    setShowModal(true);
  };

  const handleOpenEditModal = (promo: Promotion) => {
    setEditingPromoId(promo.id);
    setFormData({ ...promo });
    setShowModal(true);
  };

  // Image Upload via File (FileReader base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh (PNG, JPG, WEBP)!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard?.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.title) return;

    if (editingPromoId && onUpdatePromotion) {
      const existing = promotions.find((p) => p.id === editingPromoId);
      const updated: Promotion = {
        ...(existing || {}),
        id: editingPromoId,
        code: formData.code.toUpperCase().trim(),
        title: formData.title.trim(),
        description: formData.description || '',
        discountType: formData.discountType as any || 'percentage',
        discountValue: Number(formData.discountValue) || 10,
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        promotionalPrice: formData.promotionalPrice ? Number(formData.promotionalPrice) : undefined,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: Number(formData.usageLimit) || 100,
        usedCount: existing?.usedCount || 0,
        status: (formData.status as any) || 'active',
        targetTier: formData.targetTier || 'All',
        category: formData.category || 'all',
        highlightBadge: formData.highlightBadge || 'ƯU ĐÃI',
        image: formData.image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
        featured: Boolean(formData.featured),
        bannerColor: formData.bannerColor || 'from-rose-500 to-amber-500',
      };
      onUpdatePromotion(updated);
    } else {
      const created: Promotion = {
        id: `promo-${Date.now()}`,
        code: formData.code.toUpperCase().trim(),
        title: formData.title.trim(),
        description: formData.description || '',
        discountType: formData.discountType as any || 'percentage',
        discountValue: Number(formData.discountValue) || 10,
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        promotionalPrice: formData.promotionalPrice ? Number(formData.promotionalPrice) : undefined,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: Number(formData.usageLimit) || 100,
        usedCount: 0,
        status: 'active',
        targetTier: formData.targetTier || 'All',
        category: formData.category || 'all',
        highlightBadge: formData.highlightBadge || 'ƯU ĐÃI',
        image: formData.image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
        featured: Boolean(formData.featured),
        bannerColor: 'from-rose-500 to-amber-500',
      };
      onAddPromotion(created);
    }

    setShowModal(false);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    let targetCount = customers.length;
    if (selectedAudience === 'vip') {
      targetCount = customers.filter((c) => c.tier === 'VIP' || c.tier === 'Diamond').length;
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

  // Filter promotions list
  const filteredPromotions = promotions.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
            <TicketPercent className="w-5 h-5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>Quản Lý Ưu Đãi, Voucher & Banner Post</span>
          </h1>
          <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-0.5">
            Tải lên hình ảnh poster thiết kế, phát hành mã giảm giá và gửi thông báo marketing tự động tới khách hàng
          </p>
        </div>

        <button
          id="btn-create-promo-modal"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Mã Ưu Đãi & Tải Banner Mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7-8 Cols): Active Promotions Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <h2 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] uppercase tracking-wider">
                Danh Sách Ưu Đãi Đang Hoạt Động ({filteredPromotions.length})
              </h2>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Tìm mã hoặc tên ưu đãi..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-[#1A1C19] border border-[#E2E6DF] dark:border-[#2D312C] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-1 focus:ring-[#5A7D57]"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl text-xs bg-white dark:bg-[#1A1C19] border border-[#E2E6DF] dark:border-[#2D312C] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="facial">Chăm sóc da mặt</option>
                <option value="body">Body & Massage</option>
                <option value="combo">Combo tiết kiệm</option>
                <option value="special">Đặc quyền / VIP</option>
              </select>
            </div>
          </div>

          {filteredPromotions.length === 0 ? (
            <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-10 border border-[#E2E6DF] dark:border-[#2D312C] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#5A7D57]/10 text-[#5A7D57] dark:text-[#8BA888] flex items-center justify-center mx-auto">
                <TicketPercent className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF]">Chưa có mã ưu đãi nào phù hợp</h3>
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198] max-w-sm mx-auto">
                Hãy nhấn nút "Tạo Mã Ưu Đãi & Tải Banner Mới" để thiết kế chương trình khuyến mãi với hình ảnh ấn tượng.
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] text-white hover:bg-[#4D6D4A] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo Ưu Đãi Ngay</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPromotions.map((promo) => {
                const isCopied = copiedCode === promo.code;

                return (
                  <div
                    key={promo.id}
                    className="bg-white dark:bg-[#1A1C19] rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                  >
                    {/* Visual Banner / Poster Image Header */}
                    <div className="relative h-40 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={promo.image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'}
                        alt={promo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as any).src = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Badge Top Left */}
                      <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-zinc-950/90 text-white backdrop-blur-md border border-white/20 shadow">
                          {promo.highlightBadge || 'ƯU ĐÃI'}
                        </span>
                        {promo.featured && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500 text-zinc-950 shadow flex items-center space-x-1">
                            <Crown className="w-3 h-3" />
                            <span>Ghim Banner</span>
                          </span>
                        )}
                      </div>

                      {/* Discount & Expiry on Image */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-black/60 text-zinc-200 backdrop-blur-md flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>HSD: {promo.endDate}</span>
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <div className="text-base font-black tracking-tight text-white drop-shadow">
                            {promo.promotionalPrice && promo.originalPrice ? (
                              <div className="flex items-baseline space-x-1.5">
                                <span>{formatVND(promo.promotionalPrice)}</span>
                                <span className="text-xs text-zinc-300 line-through opacity-80">
                                  {formatVND(promo.originalPrice)}
                                </span>
                              </div>
                            ) : promo.discountType === 'percentage' ? (
                              `GIẢM ${promo.discountValue}%`
                            ) : (
                              `GIẢM ${formatCurrency(promo.discountValue, lang)}`
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-200 opacity-90 block">
                            Đơn tối thiểu: {formatCurrency(promo.minOrderValue, lang)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(promo)}
                            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-zinc-900 shadow-sm transition-colors"
                            title="Chỉnh sửa ưu đãi & ảnh post"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {onDeletePromotion && (
                            <button
                              onClick={() => {
                                if (confirm(`Bạn có chắc chắn muốn xóa mã ưu đãi "${promo.code}" không?`)) {
                                  onDeletePromotion(promo.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-white shadow-sm transition-colors"
                              title="Xóa ưu đãi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <span className="px-2 py-0.5 rounded-md font-mono text-xs font-black bg-[#8BA888]/20 text-[#325230] dark:bg-[#8BA888]/20 dark:text-[#A3C2A0] border border-[#8BA888]/40">
                              {promo.code}
                            </span>
                            <button
                              onClick={() => handleCopyCode(promo.code)}
                              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                              title="Sao chép mã"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                            Đã dùng: <strong>{promo.usedCount}/{promo.usageLimit}</strong>
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] line-clamp-1">
                          {promo.title}
                        </h3>

                        <p className="text-xs text-[#5E665B] dark:text-[#9BA198] line-clamp-2 leading-relaxed font-light">
                          {promo.description || 'Áp dụng cho khách đặt lịch trực tuyến hoặc trải nghiệm tại quầy.'}
                        </p>
                      </div>

                      {/* Progress Bar & Status */}
                      <div className="pt-2 border-t border-[#E2E6DF] dark:border-[#2D312C] flex items-center justify-between text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                        <span>Thời hạn: <strong>{promo.startDate}</strong> → <strong>{promo.endDate}</strong></span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          promo.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600'
                        }`}>
                          {promo.status === 'active' ? 'Đang chạy' : 'Tạm dừng'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (4 Cols): Broadcast Push Campaign Studio */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#8BA888]/20 text-[#325230] dark:text-[#8BA888]">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  {t.broadcastNotification}
                </h3>
                <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                  Gửi tin nhắn ưu đãi hàng loạt qua SMS/App Push
                </p>
              </div>
            </div>

            {broadcastSent && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Đã phát chiến dịch khuyến mãi thành công tới toàn bộ khách hàng!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  {t.selectAudience}:
                </label>
                <select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                >
                  <option value="all">{t.allCustomers} ({customers.length} khách)</option>
                  <option value="vip">{t.vipOnly} (Hội viên VIP & Diamond)</option>
                  <option value="birthday">{t.birthdayMonth} (Khách sinh nhật tháng này)</option>
                  <option value="inactive">{t.inactiveCustomers} (Khách chưa quay lại &gt; 30 ngày)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tiêu đề chiến dịch:
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="VD: 🔥 Ưu đãi tri ân đặc quyền..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Nội dung thông điệp gửi khách:
                </label>
                <textarea
                  rows={4}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Nhập nội dung thông điệp marketing..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] leading-relaxed"
                />
              </div>

              <button
                id="btn-broadcast-now"
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-all shadow-sm flex items-center justify-center space-x-1.5 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi Chiến Dịch Marketing Ngay</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* CREATE & EDIT PROMOTION MODAL WITH RICH IMAGE UPLOAD */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSavePromo}
            className="bg-white dark:bg-[#1A1C19] rounded-3xl w-full max-w-2xl shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 sm:p-7 space-y-5 my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#5A7D57]/15 text-[#5A7D57] dark:text-[#8BA888]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                    {editingPromoId ? 'Chỉnh Sửa Ưu Đãi & Poster Post' : 'Tạo Mã Ưu Đãi Mới & Tải Ảnh Poster'}
                  </h2>
                  <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                    Tải lên hình ảnh thiết kế hoặc chọn mẫu chuyên nghiệp để bài post nổi bật
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF] p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* --- 1. IMAGE UPLOAD & POSTER SECTION --- */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                    <span>Hình Ảnh Poster / Banner Bài Post Quảng Cáo *:</span>
                  </label>
                  <span className="text-[10px] text-zinc-500">Khuyên dùng tỷ lệ 16:9 hoặc 4:3 (JPG, PNG, WEBP)</span>
                </div>

                {/* Drag and Drop Zone or Preview */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative rounded-2xl border-2 border-dashed transition-all overflow-hidden p-4 text-center ${
                    isDragOver
                      ? 'border-[#5A7D57] bg-[#5A7D57]/10'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {formData.image ? (
                    <div className="relative group">
                      <img
                        src={formData.image}
                        alt="Poster Preview"
                        className="w-full h-44 sm:h-52 object-cover rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white text-zinc-900 font-bold text-xs shadow-lg hover:bg-zinc-100 flex items-center space-x-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Đổi Ảnh Khác</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs shadow-lg hover:bg-rose-700 flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa Ảnh</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="py-6 cursor-pointer flex flex-col items-center justify-center space-y-2 hover:opacity-80"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#5A7D57]/15 text-[#5A7D57] dark:text-[#8BA888] flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-800 dark:text-zinc-200">
                          Nhấn để tải ảnh poster từ máy hoặc Kéo thả hình ảnh vào đây
                        </p>
                        <p className="text-[11px] text-zinc-500">Hỗ trợ ảnh poster thiết kế từ Canva, Photoshop...</p>
                      </div>
                    </div>
                  )}

                  {/* Direct URL Input */}
                  <div className="mt-3 flex items-center space-x-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-left">
                    <span className="text-[11px] text-zinc-500 shrink-0">Hoặc link URL:</span>
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-[11px] text-zinc-800 dark:text-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Preset Banner Gallery Selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Hoặc chọn nhanh từ mẫu Banner thiết kế Spa chuẩn xịn:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_SPA_BANNERS.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            image: preset.url,
                            highlightBadge: preset.badge,
                            category: preset.category,
                          }));
                        }}
                        className={`p-1.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                          formData.image === preset.url
                            ? 'border-[#5A7D57] bg-[#5A7D57]/15 dark:border-[#8BA888]'
                            : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 truncate">
                            {preset.name}
                          </p>
                          <p className="text-[9px] text-[#5A7D57] dark:text-[#8BA888] truncate">
                            {preset.badge}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- 2. BASIC PROMO INFORMATION --- */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Mã Voucher (Code) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: SPAMAY50"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl font-mono uppercase font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Nhãn Tag Nổi Bật (Badge)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: HOT DEAL, GIẢM 50%..."
                    value={formData.highlightBadge || ''}
                    onChange={(e) => setFormData({ ...formData, highlightBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl font-semibold border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Danh Mục Dịch Vụ
                  </label>
                  <select
                    value={formData.category || 'all'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  >
                    <option value="all">Tất cả dịch vụ</option>
                    <option value="facial">Chăm sóc da mặt (Facial)</option>
                    <option value="body">Body & Massage Thư Giãn</option>
                    <option value="combo">Combo Tiết Kiệm</option>
                    <option value="special">Đặc Quyền Hội Viên & Sinh Nhật</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tên Chương Trình Ưu Đãi / Bài Post *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Giảm 30% Liệu Trình Trẻ Hóa Da Đa Tầng Mùa Hè"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Mô Tả Chi Tiết Ưu Đãi
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả quyền lợi, điều kiện áp dụng cho khách hàng..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] leading-relaxed"
                />
              </div>

              {/* --- 3. DISCOUNT & PRICING CONFIG --- */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Hình thức giảm giá
                  </label>
                  <select
                    value={formData.discountType || 'percentage'}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  >
                    <option value="percentage">Giảm theo % (Phần trăm)</option>
                    <option value="fixed_amount">Giảm số tiền cố định (VNĐ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Mức giảm ({formData.discountType === 'percentage' ? '%' : 'VNĐ'}) *
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue || 0}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Đơn hàng tối thiểu (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={formData.minOrderValue || 0}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  />
                </div>
              </div>

              {/* Optional Package Pricing Display on Post */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Giá Gốc Chưa Giảm (Hiển thị gạch giá trên post):
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="VD: 850000"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-zinc-800 text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Giá Sau Ưu Đãi (Giá trải nghiệm nổi bật):
                  </label>
                  <input
                    type="number"
                    value={formData.promotionalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, promotionalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="VD: 499000"
                    className="w-full px-3 py-2 rounded-xl font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-zinc-800 text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none"
                  />
                </div>
              </div>

              {/* --- 4. DATE & USAGE LIMIT --- */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Ngày kết thúc (Hạn dùng)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Giới hạn số lượt dùng
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit || 100}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Featured Banner Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-featured-promo"
                  checked={Boolean(formData.featured)}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#5A7D57] focus:ring-[#5A7D57]"
                />
                <label htmlFor="chk-featured-promo" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                  👑 Ghim ưu đãi này làm <strong>Banner Lớn Nổi Bật (Hero Spotlight)</strong> trên trang khuyến mãi
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621] transition-all"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm transition-all active:scale-95 flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{editingPromoId ? 'Lưu Thay Đổi' : 'Tạo Mã & Đăng Banner'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Tag,
  Clock,
  Copy,
  Check,
  Calendar,
  ChevronRight,
  Flame,
  Percent,
  Gift,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Crown,
  Heart,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Promotion, Service, SpaProfile, Language } from '../types';

interface PromotionsLandingPageProps {
  promotions: Promotion[];
  services: Service[];
  spaProfile: SpaProfile;
  lang: Language;
  onOpenBooking: (serviceId?: string, promoCode?: string) => void;
}

export const PromotionsLandingPage: React.FC<PromotionsLandingPageProps> = ({
  promotions,
  services,
  spaProfile,
  lang,
  onOpenBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedPromoId, setExpandedPromoId] = useState<string | null>(null);

  // Calculator state
  const [calcServiceId, setCalcServiceId] = useState<string>(services[0]?.id || '');
  const [calcPromoCode, setCalcPromoCode] = useState<string>(promotions[0]?.code || '');

  // Flash Sale Countdown (2 days, 14 hours countdown simulator)
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard?.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch (e) {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  // Filter promotions
  const activePromos = promotions.filter((p) => p.status === 'active');
  const featuredPromo = activePromos.find((p) => p.featured) || activePromos[0];

  const filteredPromos = activePromos.filter((promo) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'facial' && promo.category === 'facial') ||
      (selectedCategory === 'body' && promo.category === 'body') ||
      (selectedCategory === 'combo' && promo.category === 'combo') ||
      (selectedCategory === 'special' && promo.category === 'special');

    const matchesSearch =
      promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Calculate estimated discount in simulator
  const selectedServiceForCalc = services.find((s) => s.id === calcServiceId);
  const selectedPromoForCalc = promotions.find((p) => p.code === calcPromoCode);

  let calcDiscountAmount = 0;
  let calcFinalPrice = selectedServiceForCalc?.price || 0;
  let isPromoEligible = false;

  if (selectedServiceForCalc && selectedPromoForCalc) {
    if (selectedServiceForCalc.price >= selectedPromoForCalc.minOrderValue) {
      isPromoEligible = true;
      if (selectedPromoForCalc.discountType === 'percentage') {
        const rawDiscount = (selectedServiceForCalc.price * selectedPromoForCalc.discountValue) / 100;
        calcDiscountAmount = selectedPromoForCalc.maxDiscount
          ? Math.min(rawDiscount, selectedPromoForCalc.maxDiscount)
          : rawDiscount;
      } else {
        calcDiscountAmount = Math.min(selectedPromoForCalc.discountValue, selectedServiceForCalc.price);
      }
      calcFinalPrice = Math.max(0, selectedServiceForCalc.price - calcDiscountAmount);
    }
  }

  const categoryChips = [
    { id: 'all', label: 'Tất Cả Ưu Đãi', count: activePromos.length },
    { id: 'combo', label: '⭐ Combo Tiết Kiệm', count: activePromos.filter((p) => p.category === 'combo').length },
    { id: 'facial', label: '✨ Chăm Sóc Da Mặt', count: activePromos.filter((p) => p.category === 'facial').length },
    { id: 'body', label: '💆 Massage & Triệt Lông', count: activePromos.filter((p) => p.category === 'body').length },
    { id: 'special', label: '👑 Hội Viên & Sinh Nhật', count: activePromos.filter((p) => p.category === 'special').length },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SPOTLIGHT BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 text-white dark:bg-[#141619] border border-zinc-800 shadow-2xl p-6 sm:p-10">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column Text & Countdown */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-700 text-xs font-semibold text-zinc-200">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Đại Tiệc Ưu Đãi Thẩm Mỹ Chuẩn Y Khoa • Mùa Hè 2026</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                Chăm Sóc Toàn Diện <br className="hidden sm:inline" />
                <span className="text-zinc-300">Nhận Ngay Ưu Đãi Đến 35%</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                Tận hưởng không gian thư giãn tĩnh tại, mỹ phẩm dược sinh học cao cấp và kỹ thuật trị liệu chuyên sâu từ đội ngũ chuyên gia tại {spaProfile.name || 'L’AURA Spa'}.
              </p>
            </div>

            {/* Live Flash Deal Countdown Pill Box */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-zinc-300 font-medium">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Ưu đãi áp dụng có hạn:</span>
              </div>
              <div className="flex items-center space-x-1.5 font-mono font-bold text-xs">
                <div className="px-2 py-1 bg-zinc-800 rounded-lg text-white border border-zinc-700">
                  {String(timeLeft.days).padStart(2, '0')} <span className="text-[10px] text-zinc-400 font-sans">ngày</span>
                </div>
                <span className="text-zinc-600">:</span>
                <div className="px-2 py-1 bg-zinc-800 rounded-lg text-white border border-zinc-700">
                  {String(timeLeft.hours).padStart(2, '0')} <span className="text-[10px] text-zinc-400 font-sans">giờ</span>
                </div>
                <span className="text-zinc-600">:</span>
                <div className="px-2 py-1 bg-zinc-800 rounded-lg text-white border border-zinc-700">
                  {String(timeLeft.minutes).padStart(2, '0')} <span className="text-[10px] text-zinc-400 font-sans">phút</span>
                </div>
                <span className="text-zinc-600">:</span>
                <div className="px-2 py-1 bg-zinc-800 rounded-lg text-amber-300 border border-zinc-700">
                  {String(timeLeft.seconds).padStart(2, '0')} <span className="text-[10px] text-zinc-400 font-sans">giây</span>
                </div>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onOpenBooking(undefined, featuredPromo?.code)}
                className="px-6 py-3 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-100 font-extrabold text-xs transition-all shadow-lg active:scale-95 flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4 text-zinc-950" />
                <span>Đặt Lịch Nhận Ưu Đãi Ngay</span>
              </button>
              {featuredPromo && (
                <button
                  onClick={() => handleCopyCode(featuredPromo.code)}
                  className="px-4 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs font-bold transition-all flex items-center space-x-2 active:scale-95"
                >
                  {copiedCode === featuredPromo.code ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Đã Copy: {featuredPromo.code}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-400" />
                      <span>Mã: {featuredPromo.code}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column Featured Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group">
              <img
                src={featuredPromo?.image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'}
                alt={featuredPromo?.title || 'Spa Promotion'}
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white text-zinc-950 shadow-md">
                  {featuredPromo?.highlightBadge || 'Ưu Đãi Đặc Biệt'}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 space-y-1">
                <p className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                  Mã Voucher: <strong className="text-white font-bold">{featuredPromo?.code}</strong>
                </p>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {featuredPromo?.title}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categoryChips.map((chip) => {
              const isActive = selectedCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedCategory(chip.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                      : 'bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
                  }`}
                >
                  <span>{chip.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-current'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã hoặc tên ưu đãi..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
            />
          </div>
        </div>
      </div>

      {/* 3. PROMOTIONS CARDS GRID WITH VIVID IMAGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromos.map((promo) => {
          const isExpanded = expandedPromoId === promo.id;
          const usagePercent = Math.round((promo.usedCount / promo.usageLimit) * 100);

          return (
            <div
              key={promo.id}
              className="rounded-3xl bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Image Header */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={promo.image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80'}
                  alt={promo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge Top Left */}
                {promo.highlightBadge && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-zinc-900/90 text-white dark:bg-white dark:text-zinc-950 backdrop-blur-md shadow">
                      {promo.highlightBadge}
                    </span>
                  </div>
                )}

                {/* Expiry Badge Top Right */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-black/60 text-zinc-200 backdrop-blur-md flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>HSD: {promo.endDate}</span>
                  </span>
                </div>

                {/* Title and Pricing Overlay at Bottom of Image */}
                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <div className="flex items-baseline space-x-2">
                    {promo.promotionalPrice && promo.originalPrice ? (
                      <>
                        <span className="text-base font-extrabold text-white">
                          {formatVND(promo.promotionalPrice)}
                        </span>
                        <span className="text-xs text-zinc-300 line-through">
                          {formatVND(promo.originalPrice)}
                        </span>
                      </>
                    ) : (
                      <span className="text-base font-extrabold text-white">
                        {promo.discountType === 'percentage'
                          ? `Giảm ${promo.discountValue}%`
                          : `Giảm ${formatVND(promo.discountValue)}`}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {promo.title}
                  </h3>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {promo.description}
                  </p>

                  {/* Quota Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span>Đã nhận: <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{promo.usedCount}/{promo.usageLimit}</strong> suất</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{usagePercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, usagePercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Applicable Services List Pill */}
                  {promo.applicableServices && promo.applicableServices.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[11px] space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                        Dịch vụ áp dụng:
                      </span>
                      <ul className="space-y-0.5 text-zinc-700 dark:text-zinc-300">
                        {promo.applicableServices.slice(0, 2).map((srv, idx) => (
                          <li key={idx} className="flex items-center space-x-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-zinc-900 dark:bg-white shrink-0" />
                            <span className="truncate">{srv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Expandable Terms Toggle */}
                  {promo.termsAndConditions && promo.termsAndConditions.length > 0 && (
                    <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-2">
                      <button
                        onClick={() => setExpandedPromoId(isExpanded ? null : promo.id)}
                        className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center justify-between w-full"
                      >
                        <span>Điều kiện & thể lệ chi tiết</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <ul className="mt-2 space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
                          {promo.termsAndConditions.map((term, tIdx) => (
                            <li key={tIdx} className="flex items-start space-x-1.5">
                              <span className="text-zinc-400 mt-0.5">•</span>
                              <span>{term}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons: Copy Code + Book Now */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center space-x-2">
                    {/* Copy Voucher Button */}
                    <button
                      onClick={() => handleCopyCode(promo.code)}
                      className="flex-1 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5"
                    >
                      {copiedCode === promo.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Đã Copy!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="truncate">{promo.code}</span>
                        </>
                      )}
                    </button>

                    {/* Book Now Button */}
                    <button
                      onClick={() => onOpenBooking(undefined, promo.code)}
                      className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1"
                    >
                      <span>Áp Dụng Ngay</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. INTERACTIVE VOUCHER CALCULATOR (TÍNH TIỀN KHUYẾN MÃI DỰ KIẾN) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 text-white dark:bg-[#141619] border border-zinc-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
              <Calculator className="w-4 h-4 text-white" />
              <span>Dự Toán Chi Phí Minh Bạch</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Thử Áp Mã Voucher & Xem Giá Sau Giảm Trực Tuyến
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-light">
            Không phát sinh phụ phí tại spa
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls: Select Service + Select Code */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                1. Chọn Dịch Vụ Bạn Muốn Trải Nghiệm:
              </label>
              <select
                value={calcServiceId}
                onChange={(e) => setCalcServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formatVND(s.price)} ({s.durationMinutes} phút)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                2. Chọn Mã Giảm Giá Áp Dụng:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activePromos.map((p) => {
                  const isSelected = calcPromoCode === p.code;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCalcPromoCode(p.code)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-white text-zinc-950 border-white font-bold shadow'
                          : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                      }`}
                    >
                      <div className="text-xs font-mono">{p.code}</div>
                      <div className="text-[10px] opacity-80 truncate">
                        {p.discountType === 'percentage' ? `Giảm ${p.discountValue}%` : `-${formatVND(p.discountValue)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result Calculation Box */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-zinc-800/90 border border-zinc-700 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Bảng Tóm Tắt Thanh Toán Dự Kiến
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>Giá niêm yết:</span>
                <span className="font-mono font-semibold">{formatVND(selectedServiceForCalc?.price || 0)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Số tiền giảm:</span>
                <span className="font-mono font-bold">
                  {calcDiscountAmount > 0 ? `-${formatVND(calcDiscountAmount)}` : '0 đ'}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-700 flex justify-between items-baseline">
                <span className="text-xs font-bold text-white">Tổng thanh toán dự kiến:</span>
                <span className="text-lg font-extrabold text-white font-mono">
                  {formatVND(calcFinalPrice)}
                </span>
              </div>
            </div>

            {!isPromoEligible && selectedPromoForCalc && (
              <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800 text-[11px] text-amber-200 flex items-start space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Mã <strong>{calcPromoCode}</strong> yêu cầu đơn tối thiểu {formatVND(selectedPromoForCalc.minOrderValue)}.
                </span>
              </div>
            )}

            <button
              onClick={() => onOpenBooking(calcServiceId, calcPromoCode)}
              className="w-full py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs transition-all shadow flex items-center justify-center space-x-1.5"
            >
              <Calendar className="w-4 h-4 text-zinc-950" />
              <span>Đặt Lịch Với Mức Giá Này</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. LOYALTY & VIP REWARD TIERS */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
            <Crown className="w-4 h-4 text-zinc-900 dark:text-white" />
            <span>Chính Sách Khách Hàng Thân Thiết</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">
            Tích Điểm Tự Động & Nâng Hạng Đặc Quyền
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Mỗi 10.000đ chi tiêu = 1 Điểm tích lũy. Điểm dùng để trừ trực tiếp vào hóa đơn hoặc đổi quà tặng trị liệu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              tier: 'Hội Viên Chuẩn (Standard)',
              spend: '0đ - 2.000.000đ',
              perks: ['Tích điểm 1% hóa đơn', 'Soi da 3D miễn phí', 'Trà thảo mộc tiếp đón'],
            },
            {
              tier: 'Hạng Bạc (Silver)',
              spend: 'Từ 2.000.000đ',
              perks: ['Giảm thêm 5% mọi dịch vụ', 'Quà sinh nhật 50.000đ', 'Ưu tiên xếp phòng trị liệu'],
            },
            {
              tier: 'Hạng Vàng (Gold)',
              spend: 'Từ 5.000.000đ',
              perks: ['Giảm thêm 10% dịch vụ', 'Tặng gội đầu dưỡng sinh sinh nhật', 'Phục vụ nước ép tươi'],
            },
            {
              tier: 'VIP & Diamond',
              spend: 'Từ 10.000.000đ',
              perks: ['Giảm thêm 15% trọn đời', 'Phòng VIP riêng biệt', 'Chỉ định KTV trưởng nhóm miễn phí'],
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-zinc-950 dark:text-zinc-50">
                  {item.tier}
                </span>
                <Crown className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                Chi tiêu: {item.spend}
              </div>
              <ul className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                {item.perks.map((p, pIdx) => (
                  <li key={pIdx} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-white shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 6. FOUR CORE COMMITMENTS */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Minh Bạch Tuyệt Đối',
              desc: 'Không chèo kéo mua thêm gói, không phát sinh chi phí ẩn.',
            },
            {
              title: 'Mỹ Phẩm Chuẩn Dược Khoa',
              desc: '100% nhập khẩu chính hãng có tem mác & kiểm định y tế.',
            },
            {
              title: 'Bảo Hành Liệu Trình',
              desc: 'Cam kết hiệu quả rõ rệt sau mỗi buổi chăm sóc & trị liệu.',
            },
            {
              title: 'Đổi Lịch Linh Hoạt',
              desc: 'Hỗ trợ thay đổi khung giờ hẹn nhanh chóng qua hotline/Zalo.',
            },
          ].map((c, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center space-x-2 text-zinc-950 dark:text-zinc-50 font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
                <span>{c.title}</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

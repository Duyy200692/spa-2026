import React, { useState } from 'react';
import {
  Sparkles,
  Tag,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Heart,
  Calendar,
  ChevronRight,
  BookOpen,
  Copy,
  Check,
  Star,
  Search,
  ExternalLink,
  MessageSquare,
  Building,
  UserCheck
} from 'lucide-react';
import {
  Service,
  Promotion,
  SpaProfile,
  NewsArticle,
  Language,
  Role
} from '../types';
import { PromotionsLandingPage } from './PromotionsLandingPage';

interface CustomerPortalViewProps {
  lang: Language;
  services: Service[];
  promotions: Promotion[];
  spaProfile: SpaProfile;
  newsArticles: NewsArticle[];
  onOpenBooking: (serviceId?: string, promoCode?: string) => void;
  activeCustomerSubTab?: 'intro' | 'promotions' | 'services' | 'news';
  currentRole?: Role;
  onOpenEditSpaProfile?: () => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  lang,
  services,
  promotions,
  spaProfile,
  newsArticles,
  onOpenBooking,
  activeCustomerSubTab = 'intro',
  currentRole,
  onOpenEditSpaProfile,
}) => {
  const [currentTab, setCurrentTab] = useState<'intro' | 'promotions' | 'services' | 'news'>(activeCustomerSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter services
  const categories = ['all', ...Array.from(new Set(services.map((s) => s.category)))];
  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activePromotions = promotions.filter((p) => p.status === 'active');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Hero Welcome Banner - Monochrome High-Contrast Minimalist */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 text-zinc-50 dark:bg-[#141619] border border-zinc-800 p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-medium text-zinc-200">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Cổng Trải Nghiệm Khách Hàng • L’AURA Spa Portal</span>
            </div>

            {onOpenEditSpaProfile && (currentRole === 'owner' || currentRole === 'manager') && (
              <button
                id="btn-portal-edit-spa-profile"
                onClick={onOpenEditSpaProfile}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
              >
                <Building className="w-3.5 h-3.5" />
                <span>⚙️ Chỉnh Sửa Thông Tin Spa & Logo</span>
              </button>
            )}
          </div>

          <div className="flex items-start space-x-4">
            {spaProfile.logo && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900 border border-zinc-700 overflow-hidden shrink-0 shadow-md">
                <img
                  src={spaProfile.logo}
                  alt={spaProfile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as any).style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {spaProfile.name || 'L’AURA BEAUTY & WELLNESS SPA'}
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                {spaProfile.tagline || 'Kiến tạo vẻ đẹp thuần khiết chuẩn y khoa & thư giãn thân tâm.'}
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenBooking()}
              className="px-5 py-2.5 rounded-2xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-100 active:scale-95 transition-all shadow-md flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Đặt Lịch Hẹn Ngay</span>
            </button>
            <button
              onClick={() => setCurrentTab('promotions')}
              className="px-5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs border border-zinc-700 active:scale-95 transition-all flex items-center space-x-2"
            >
              <Tag className="w-4 h-4 text-zinc-300" />
              <span>Xem Ưu Đãi Đang Chạy ({activePromotions.length})</span>
            </button>
          </div>
        </div>

        {/* Minimalist Watermark / Geometric Accent */}
        <div className="absolute -right-8 -bottom-10 opacity-5 pointer-events-none text-white">
          <Sparkles className="w-72 h-72" />
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto">
        <div className="flex items-center space-x-2">
          {[
            { id: 'intro', label: '📖 Giới Thiệu Spa', count: null },
            { id: 'promotions', label: '🎁 Khuyến Mãi & Voucher', count: activePromotions.length },
            { id: 'services', label: '💆 Menu Dịch Vụ & Bảng Giá', count: services.length },
            { id: 'news', label: '📰 Tin Tức & Cẩm Nang', count: newsArticles.length },
          ].map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-current'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: BÀI GIỚI THIỆU SPA */}
      {currentTab === 'intro' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Story & Philosophy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                Câu Chuyện Thương Hiệu
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spaProfile.story}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                Triết Lý Làm Đẹp Chuẩn Y Khoa
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {spaProfile.philosophy}
              </p>
            </div>
          </div>

          {/* Highlights 4 Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              Giá Trị Khác Biệt Tại Spa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {spaProfile.highlights.map((h, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-mono font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {h.title}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {h.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Commitments & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                <span>Cam Kết Chất Lượng Dịch Vụ</span>
              </h3>
              <ul className="space-y-2.5">
                {spaProfile.commitments.map((c, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white mt-2 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 uppercase tracking-wider font-mono">
                Thông Tin Liên Hệ
              </h3>
              <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5" />
                  <span>{spaProfile.address}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{spaProfile.phone}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
                  <span>{spaProfile.openHours}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
                  <span>{spaProfile.email}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => onOpenBooking()}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs transition-all shadow-sm flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Đặt Lịch Tư Vấn Miễn Phí</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KHUYẾN MÃI & VOUCHER (LANDING PAGE TRẢI NGHIỆM CHUYÊN NGHIỆP) */}
      {currentTab === 'promotions' && (
        <div className="animate-in fade-in duration-200">
          <PromotionsLandingPage
            promotions={promotions}
            services={services}
            spaProfile={spaProfile}
            lang={lang}
            onOpenBooking={onOpenBooking}
          />
        </div>
      )}

      {/* TAB 3: MENU DỊCH VỤ & BẢNG GIÁ */}
      {currentTab === 'services' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat === 'all' ? 'Tất Cả Danh Mục' : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm dịch vụ..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              />
            </div>
          </div>

          {/* Service Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                      {service.category}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.durationMinutes} phút</span>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-50 leading-snug">
                    {service.name}
                  </h4>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                      Giá niêm yết
                    </span>
                    <div className="text-base font-extrabold text-zinc-950 dark:text-zinc-50">
                      {formatVND(service.price)}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenBooking(service.id)}
                    className="py-2 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs transition-all shadow-sm flex items-center space-x-1"
                  >
                    <span>Đặt Lịch</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TIN TỨC & CẨM NANG */}
      {currentTab === 'news' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                Tin Tức & Cẩm Nang Chăm Sóc Da Chuẩn Y Khoa
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Kiến thức thẩm mỹ an toàn, cập nhật phác đồ mới nhất
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="p-5 rounded-3xl bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-zinc-400">{article.readTime}</span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 group-hover:underline leading-snug">
                    {article.title}
                  </h4>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{article.date}</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Đọc tiếp</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 leading-snug">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center space-x-3 text-xs text-zinc-500 dark:text-zinc-400">
                <span>{selectedArticle.author}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm italic text-zinc-700 dark:text-zinc-300 border-l-2 border-zinc-900 dark:border-white">
              {selectedArticle.summary}
            </div>

            <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line space-y-4">
              {selectedArticle.content}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Quay Lại
              </button>
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  onOpenBooking();
                }}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold shadow-md"
              >
                Đặt Lịch Trị Liệu Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

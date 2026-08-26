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
  UserCheck,
  Leaf,
  Droplets,
  RotateCcw,
  ShoppingBag,
  Volume2,
  VolumeX,
  ArrowRight,
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import {
  Service,
  Promotion,
  SpaProfile,
  NewsArticle,
  Language,
  Role
} from '../types';

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
  onOpenStaffLogin?: () => void;
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
  onOpenStaffLogin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'duration'>('featured');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under400' | '400to800' | 'above800'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(1);
  const [viewDetailService, setViewDetailService] = useState<Service | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Extract unique categories
  const rawCategories = Array.from(new Set(services.map((s) => s.category)));
  const categories = ['all', ...rawCategories];

  // Filter and sort services / products
  const filteredServices = services
    .filter((s) => {
      const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesPrice = true;
      if (priceFilter === 'under400') matchesPrice = s.price < 400000;
      else if (priceFilter === '400to800') matchesPrice = s.price >= 400000 && s.price <= 800000;
      else if (priceFilter === 'above800') matchesPrice = s.price > 800000;

      return matchesCat && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
      return 0; // featured default
    });

  const activePromotions = promotions.filter((p) => p.status === 'active');

  // Key Botanical Ingredients Spotlight data (Matching Image 1)
  const botanicalIngredients = [
    {
      name: 'Citrus Peel Oil',
      vietnameseName: 'Tinh Dầu Vỏ Cam Quýt Tự Nhiên',
      image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&q=80',
      description: 'Rich in natural compounds called terpenes that have anti-inflammatory, antimicrobial and antioxidant properties.',
      vietnameseDesc: 'Giàu hợp chất tự nhiên terpene giúp kháng viêm, diệt khuẩn mụn và chống oxy hóa mạnh mẽ cho làn da.',
    },
    {
      name: 'Argan Oil',
      vietnameseName: 'Dầu Hạt Argan Hữu Cơ',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&q=80',
      description: 'Improves skin elasticity and hydration by restoring the protective barrier function.',
      vietnameseDesc: 'Tăng cường độ đàn hồi, cấp ẩm sâu và củng cố hàng rào lipid bảo vệ da luôn mềm mịn.',
    },
    {
      name: 'Opuntia Fig Extract',
      vietnameseName: 'Chiết Xuất Xương Rồng Nopal',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&q=80',
      description: 'Proven to be effective in soothing skin irritations. It also has strong antioxidant effects on the skin.',
      vietnameseDesc: 'Làm dịu tức thì các kích ứng, giảm đỏ rát sau điều trị và ngăn ngừa lão hóa sớm.',
    },
    {
      name: 'Sweet Almond Oil',
      vietnameseName: 'Dầu Hạnh Nhân Ngọt Tinh Khiết',
      image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=300&q=80',
      description: 'Proven effective in treating inflammatory skin conditions, healing sun damage & reducing the sign of aging.',
      vietnameseDesc: 'Phục hồi màng ẩm, chữa lành tổn thương do ánh nắng và làm mờ các nếp nhăn li ti.',
    },
  ];

  // Client Skin Transformation & Routine Showcase (Matching Image 1 Reels)
  const skinShowcaseCards = [
    {
      id: 'sc-1',
      title: 'Glass Skin & Glow Revival',
      category: 'Bespoke Facial',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80',
      productName: 'Tonic & Soothing Herbal Mist',
      price: 590000,
      quote: 'Làn da căng bóng mọng nước sau 60 phút trị liệu phục hồi chuyên sâu.',
    },
    {
      id: 'sc-2',
      title: 'Clear Skin & Acne Control',
      category: 'Medical Treatment',
      image: 'https://images.unsplash.com/photo-1512290900672-1f4f5f5906a5?w=500&q=80',
      productName: 'Bio-Peel Acne Clearing Serum',
      price: 680000,
      quote: 'Giảm viêm đỏ 90% ngay trong buổi đầu tiên với phác đồ y khoa.',
    },
    {
      id: 'sc-3',
      title: 'Deep Hydration & Barrier Care',
      category: 'Organic Care',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80',
      productName: 'Hyaluronic Botanical Complex',
      price: 850000,
      quote: 'Khóa ẩm đa tầng suốt 72 giờ cho làn da nhạy cảm.',
    },
    {
      id: 'sc-4',
      title: 'Youth Renewal & Collagen Lift',
      category: 'Anti-Aging',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=80',
      productName: 'Peptide Firming Elixir',
      price: 950000,
      quote: 'Nâng cơ thon gọn viền hàm và tái sinh sợi collagen tự nhiên.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F2] dark:bg-[#121314] text-[#1F1E1D] dark:text-[#E8E6E3] font-sans antialiased transition-colors duration-300">
      
      {/* 1. TOP EDITORIAL BRAND HEADER */}
      <header className="border-b border-[#EAE4DA] dark:border-[#222428] bg-[#FAF7F2]/95 dark:bg-[#121314]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          
          {/* Mobile Hamburger Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#181716] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <a
              href={`tel:${spaProfile.phone || '0909123456'}`}
              className="p-2 rounded-xl text-[#181716] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Gọi hotline"
            >
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </a>
          </div>

          {/* Left Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs tracking-wider uppercase font-medium text-[#4A4744] dark:text-[#A8A5A0]">
            <a href="#services-catalog" className="hover:text-black dark:hover:text-white transition-colors">Dịch Vụ & Trị Liệu</a>
            <a href="#bestseller-feature" className="hover:text-black dark:hover:text-white transition-colors">Bestseller</a>
            <a href="#bath-and-body" className="hover:text-black dark:hover:text-white transition-colors">Body & Thư Giãn</a>
            <a href="#promotions-vouchers" className="hover:text-black dark:hover:text-white transition-colors">Ưu Đãi</a>
          </nav>

          {/* Center Brand Identity */}
          <div className="text-center cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="font-serif text-xl sm:text-3xl tracking-tight text-[#161514] dark:text-white block font-normal leading-none">
              {spaProfile.name || 'beauty'}
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-light text-[#736E69] dark:text-[#8E8A85] block mt-0.5">
              {spaProfile.tagline || 'Bespoke Skin & Botanical Spa'}
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Booking Button */}
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#181716] hover:bg-[#33312E] dark:bg-white dark:hover:bg-[#EAE4DA] text-white dark:text-[#181716] text-[11px] sm:text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Đặt Lịch</span>
            </button>

            {/* Quick Edit Layout & Monthly Service (For Owner/Manager when viewing landing page) */}
            {(currentRole === 'owner' || currentRole === 'manager') && onOpenEditSpaProfile && (
              <button
                id="btn-quick-edit-layout"
                onClick={onOpenEditSpaProfile}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/25 transition-all shadow-sm active:scale-95"
                title="Chỉnh sửa nhanh layout, logo, banner & dịch vụ đặc biệt trong tháng"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Chỉnh Sửa Layout</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE4DA] dark:border-[#222428] bg-[#FAF7F2] dark:bg-[#161719] px-5 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="grid grid-cols-3 gap-2 text-xs font-medium text-[#181716] dark:text-white">
              <a
                href="#services-catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-white dark:bg-[#1E2024] border border-[#EAE4DA] dark:border-[#2E3136] flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8C5E32] dark:text-[#D4A373] shrink-0" />
                <span>Bảng Giá</span>
              </a>
              <a
                href="#promotions-vouchers"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-white dark:bg-[#1E2024] border border-[#EAE4DA] dark:border-[#2E3136] flex items-center space-x-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-[#8C5E32] dark:text-[#D4A373] shrink-0" />
                <span>Ưu Đãi</span>
              </a>
              <a
                href="#bestseller-feature"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-white dark:bg-[#1E2024] border border-[#EAE4DA] dark:border-[#2E3136] flex items-center space-x-1.5"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Nổi Bật</span>
              </a>
            </div>

            {/* Direct Quick Booking & Hotline on Mobile Menu */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#181716] dark:bg-white text-white dark:text-[#181716] text-xs font-bold flex items-center justify-center space-x-2 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Đặt Lịch Hẹn Ngay</span>
              </button>

              <a
                href={`tel:${spaProfile.phone || '0909123456'}`}
                className="px-3.5 py-2.5 rounded-xl border border-[#181716] dark:border-white text-[#181716] dark:text-white text-xs font-bold flex items-center space-x-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi Spa</span>
              </a>
            </div>

            {/* Staff Entry on Mobile Menu */}
            {onOpenStaffLogin && (
              <div className="pt-2 border-t border-[#EAE4DA] dark:border-[#2E3136]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenStaffLogin();
                  }}
                  className="w-full text-center py-2 text-[11px] text-[#736E69] dark:text-[#8E8A85] hover:text-[#181716] dark:hover:text-white font-medium"
                >
                  🔐 Đăng nhập quản trị nội bộ Spa
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* 2. HERO SPLIT SECTION (Matching Image 1: "Take care of your skin. We know you are unique.") */}
      <section className="relative overflow-hidden border-b border-[#EAE4DA] dark:border-[#222428]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[460px] lg:min-h-[580px]">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 p-6 sm:p-12 lg:p-18 flex flex-col justify-center bg-[#FAF7F2] dark:bg-[#121314]">
            <div className="max-w-xl space-y-5 sm:space-y-6">
              
              <div className="space-y-2.5 sm:space-y-3">
                <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.15] text-[#181716] dark:text-white tracking-tight font-normal">
                  Take care of your skin.<br />
                  <span className="italic font-serif">We know you are unique.</span>
                </h1>
                
                <p className="text-[11px] sm:text-xs text-[#736E69] dark:text-[#9A9690] uppercase tracking-[0.2em] font-medium pt-0.5">
                  Chăm sóc làn da độc bản • Liệu pháp chuẩn y khoa
                </p>
              </div>

              <p className="text-xs sm:text-sm md:text-base text-[#57534E] dark:text-[#A8A49E] font-light leading-relaxed">
                Khám phá hệ sinh thái trị liệu da chuyên sâu kết hợp hoạt chất sinh học thiên nhiên & máy móc tân tiến chuẩn da liễu. Mỗi liệu trình được cá nhân hóa hoàn toàn theo thể trạng làn da của bạn.
              </p>

              <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="#services-catalog"
                  className="px-6 py-3 rounded-full bg-[#181716] text-white hover:bg-[#33312E] dark:bg-white dark:text-[#181716] dark:hover:bg-[#EAE4DA] text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95 text-center flex items-center justify-center space-x-2"
                >
                  <span>XEM MENU TRỊ LIỆU</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onOpenBooking()}
                  className="px-6 py-3 rounded-full bg-transparent border border-[#181716] dark:border-[#EAE4DA] text-[#181716] dark:text-[#EAE4DA] hover:bg-[#181716]/5 dark:hover:bg-white/5 text-xs uppercase tracking-widest font-semibold transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>ĐẶT HẸN TRẢI NGHIỆM</span>
                </button>
              </div>

              {/* Quick hotline & guarantee */}
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-[#736E69] dark:text-[#8E8A85]">
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#181716] dark:text-white" />
                  <span>Hotline: <a href={`tel:${spaProfile.phone || '0909123456'}`} className="text-[#181716] dark:text-white font-semibold underline">{spaProfile.phone || '0909 123 456'}</a></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Mỹ phẩm cao cấp & Vô khuẩn</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: High-End Radiant Model Photography */}
          <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[380px] lg:min-h-[580px] bg-[#EDE7DD] dark:bg-[#1A1B1D]">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&q=85"
              alt="Take care of your skin - Model"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Subtle soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 3. MINIMALIST BRAND VALUES & CERTIFICATIONS BAR (Matching Image 1: Vegan, Natural, Parabens Free, Recyclable) */}
      <section className="border-b border-[#EAE4DA] dark:border-[#222428] bg-white dark:bg-[#161719] py-8 sm:py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* 1. Vegan */}
          <div className="text-center space-y-2 px-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full bg-[#FAF7F2] dark:bg-[#202226] border border-[#EAE4DA] dark:border-[#2E3136] flex items-center justify-center text-[#181716] dark:text-white">
              <Heart className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-sm sm:text-base text-[#181716] dark:text-white font-medium">Vegan</h3>
            <p className="text-[11px] sm:text-xs text-[#736E69] dark:text-[#8E8A85] font-light leading-relaxed max-w-[200px] mx-auto">
              100% thuần chay, không thử nghiệm động vật.
            </p>
          </div>

          {/* 2. Natural */}
          <div className="text-center space-y-2 px-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full bg-[#FAF7F2] dark:bg-[#202226] border border-[#EAE4DA] dark:border-[#2E3136] flex items-center justify-center text-[#181716] dark:text-white">
              <Leaf className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-sm sm:text-base text-[#181716] dark:text-white font-medium">Natural</h3>
            <p className="text-[11px] sm:text-xs text-[#736E69] dark:text-[#8E8A85] font-light leading-relaxed max-w-[200px] mx-auto">
              Chiết xuất thảo mộc hữu cơ chọn lọc.
            </p>
          </div>

          {/* 3. Parabens Free */}
          <div className="text-center space-y-2 px-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full bg-[#FAF7F2] dark:bg-[#202226] border border-[#EAE4DA] dark:border-[#2E3136] flex items-center justify-center text-[#181716] dark:text-white">
              <Droplets className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-sm sm:text-base text-[#181716] dark:text-white font-medium">Parabens Free</h3>
            <p className="text-[11px] sm:text-xs text-[#736E69] dark:text-[#8E8A85] font-light leading-relaxed max-w-[200px] mx-auto">
              Không chứa chất độc hại và paraben.
            </p>
          </div>

          {/* 4. Recyclable */}
          <div className="text-center space-y-2 px-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full bg-[#FAF7F2] dark:bg-[#202226] border border-[#EAE4DA] dark:border-[#2E3136] flex items-center justify-center text-[#181716] dark:text-white">
              <RotateCcw className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-sm sm:text-base text-[#181716] dark:text-white font-medium">Recyclable</h3>
            <p className="text-[11px] sm:text-xs text-[#736E69] dark:text-[#8E8A85] font-light leading-relaxed max-w-[200px] mx-auto">
              Bao bì tái chế thân thiện với môi trường.
            </p>
          </div>

        </div>
      </section>

      {/* 4. DYNAMIC BESTSELLER / MONTHLY SPECIAL SERVICE HERO BANNER */}
      {spaProfile.monthlySpecial?.enabled !== false && (
        <section id="bestseller-feature" className={`border-b border-[#EAE4DA] dark:border-[#222428] relative ${
          spaProfile.monthlySpecial?.themeColor === 'rose'
            ? 'bg-[#FCEBE6] dark:bg-[#2B1714] text-[#4A1D18] dark:text-[#FAD2C8]'
            : spaProfile.monthlySpecial?.themeColor === 'amber'
            ? 'bg-[#FEF3D6] dark:bg-[#2B210D] text-[#4D3608] dark:text-[#FCE6A6]'
            : spaProfile.monthlySpecial?.themeColor === 'blue'
            ? 'bg-[#DBEAF0] dark:bg-[#182830] text-[#193645] dark:text-[#DFEEF5]'
            : spaProfile.monthlySpecial?.themeColor === 'charcoal'
            ? 'bg-[#222428] text-white'
            : 'bg-[#D4E4D9] dark:bg-[#1B2920] text-[#1C3525] dark:text-[#E0EFE6]' // default sage
        }`}>
          {/* Quick Edit Float Button for Owner/Manager on the section */}
          {(currentRole === 'owner' || currentRole === 'manager') && onOpenEditSpaProfile && (
            <button
              onClick={onOpenEditSpaProfile}
              className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-white text-zinc-900 dark:text-zinc-100 text-xs font-semibold shadow-md backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 flex items-center space-x-1.5 active:scale-95 transition-all"
              title="Chỉnh sửa nhanh dịch vụ đặc biệt trong tháng & hình ảnh"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Chỉnh Sửa Dịch Vụ Tháng</span>
            </button>
          )}

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[420px] lg:min-h-[480px]">
            
            {/* Left Column: Bestseller Copy & CTA */}
            <div className="lg:col-span-6 p-6 sm:p-12 lg:p-16 flex flex-col justify-center">
              <div className="max-w-md space-y-4 sm:space-y-6">
                
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-semibold opacity-90 block">
                    {spaProfile.monthlySpecial?.badge || 'BESTSELLER • DỊCH VỤ TIÊU BIỂU'}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl leading-tight font-normal">
                    {spaProfile.monthlySpecial?.title || 'Smoothing Face Serum'}
                  </h2>
                  <p className="text-xs sm:text-sm font-serif italic opacity-90">
                    {spaProfile.monthlySpecial?.subtitle || 'Liệu pháp trẻ hóa & làm mịn màng cấu trúc da đa tầng'}
                  </p>
                </div>

                <p className="text-xs sm:text-sm font-light leading-relaxed opacity-95">
                  {spaProfile.monthlySpecial?.description ||
                    'Được điều chế với công thức sinh học độc quyền kết hợp tinh chất thực vật ép lạnh và peptides sinh học giúp tái sinh bề mặt da căng mướt, thu nhỏ lỗ chân lông tức thì.'}
                </p>

                {/* Price Display if configured */}
                {(spaProfile.monthlySpecial?.price || 0) > 0 && (
                  <div className="flex items-baseline space-x-3 pt-1">
                    <span className="text-[11px] uppercase tracking-wider opacity-80">Giá trải nghiệm:</span>
                    <span className="font-serif text-xl sm:text-2xl font-bold">
                      {formatVND(spaProfile.monthlySpecial?.price || 0)}
                    </span>
                    {(spaProfile.monthlySpecial?.originalPrice || 0) > (spaProfile.monthlySpecial?.price || 0) && (
                      <span className="text-xs line-through opacity-60">
                        {formatVND(spaProfile.monthlySpecial?.originalPrice || 0)}
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onOpenBooking(spaProfile.monthlySpecial?.serviceId || 'srv-3')}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span>{spaProfile.monthlySpecial?.buttonText || 'ĐẶT LIỆU TRÌNH NGAY'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {(currentRole === 'owner' || currentRole === 'manager') && onOpenEditSpaProfile && (
                    <button
                      onClick={onOpenEditSpaProfile}
                      className="px-4 py-3 rounded-full bg-white/70 dark:bg-black/30 hover:bg-white text-xs font-semibold transition-all border border-black/10 dark:border-white/10"
                    >
                      Đổi Dịch Vụ Tháng Khác
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Right Column: Editorial Product Still Life Composition */}
            <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[480px] flex items-center justify-center p-6 sm:p-8 overflow-hidden">
              <img
                src={spaProfile.monthlySpecial?.image || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=85'}
                alt={spaProfile.monthlySpecial?.title || 'Monthly Special Treatment'}
                className="w-full h-full object-cover max-h-[360px] sm:max-h-[420px] rounded-2xl shadow-xl border border-white/20"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=85';
                }}
              />
            </div>

          </div>
        </section>
      )}

      {/* 6. INTERACTIVE CLIENT STORIES & SKIN GLOW SHOWCASE (Matching Image 1 Left: "Best Skincare Products") */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 border-b border-[#EAE4DA] dark:border-[#222428] bg-white dark:bg-[#161719]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-4xl text-[#181716] dark:text-white font-normal">
              Best Skincare Products & Glowing Results
            </h2>
            <p className="text-xs sm:text-sm text-[#736E69] dark:text-[#8E8A85] font-light">
              Hình ảnh thực tế từ khách hàng trải nghiệm quy trình trị liệu và chăm sóc da tại spa.
            </p>
          </div>

          {/* Gallery of Portrait Video/Photo Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {skinShowcaseCards.map((card, idx) => {
              const isSelected = activeStoryIdx === idx;
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveStoryIdx(idx)}
                  className={`relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 aspect-[3/4] group ${
                    isSelected ? 'ring-2 ring-[#181716] dark:ring-white scale-[1.01] shadow-lg' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Soft bottom vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Sound indicator badge */}
                  <div className="absolute bottom-2.5 right-2.5 p-1 rounded-full bg-black/40 text-white backdrop-blur-sm">
                    <Volume2 className="w-3 h-3" />
                  </div>

                  {/* Card Title & Category */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/85 dark:bg-black/60 backdrop-blur-sm text-[9px] sm:text-[10px] font-semibold text-[#181716] dark:text-white">
                    {card.category}
                  </div>

                  {/* Floating Product Tag Overlay on Active Card (Matching Image 1 Mockup) */}
                  {isSelected && (
                    <div className="absolute bottom-2 left-2 right-8 sm:right-10 bg-white/95 dark:bg-[#1E2024]/95 backdrop-blur-md rounded-xl p-2 border border-zinc-200 dark:border-zinc-700 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] dark:bg-[#2A2D32] shrink-0 overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1608248597359-21b7123d6a45?w=100&q=80"
                            alt="Mokosh Tonic"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[8px] uppercase tracking-wider text-[#8C5E32] dark:text-[#D4A373] block font-bold">L'AURA</span>
                          <h5 className="text-[10px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{card.productName}</h5>
                          <span className="text-[9px] font-bold text-zinc-800 dark:text-zinc-200">{formatVND(card.price)}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenBooking();
                          }}
                          className="p-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 transition-transform"
                          title="Đặt hẹn"
                        >
                          <ShoppingBag className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. CURATED PRODUCT & TREATMENT CATALOG (Matching Image 1 Right Grid & Filter Sidebar) */}
      <section id="services-catalog" className="py-16 px-4 sm:px-8 border-b border-[#EAE4DA] dark:border-[#222428] bg-[#FAF7F2] dark:bg-[#121314]">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#EAE4DA] dark:border-[#222428]">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8C5E32] dark:text-[#D4A373]">
                Curated Skincare & Bespoke Rituals
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#181716] dark:text-white font-normal mt-1">
                Bảng Dịch Vụ Trị Liệu & Mỹ Phẩm
              </h2>
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-[#736E69] dark:text-[#8E8A85]">
              <span>Hiển thị <strong>{filteredServices.length}</strong> liệu trình & sản phẩm</span>
              <span className="text-[#CCC6BE]">•</span>
              <div className="flex items-center space-x-1">
                <span>Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-0 font-semibold text-[#181716] dark:text-white underline cursor-pointer focus:ring-0 p-0 text-xs"
                >
                  <option value="featured" className="dark:bg-zinc-800">Nổi Bật Nhất</option>
                  <option value="price-asc" className="dark:bg-zinc-800">Giá: Thấp đến Cao</option>
                  <option value="price-desc" className="dark:bg-zinc-800">Giá: Cao đến Thấp</option>
                  <option value="duration" className="dark:bg-zinc-800">Thời lượng</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Bar & Category Pills */}
          <div className="space-y-4">
            {/* Category horizontal scrolling bar */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = cat === 'all' ? services.length : services.filter((s) => s.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-[#181716] text-white dark:bg-white dark:text-[#181716] shadow-sm font-semibold'
                        : 'bg-white dark:bg-[#1E2024] border border-[#EAE4DA] dark:border-[#2E3136] text-[#57534E] dark:text-[#A8A49E] hover:border-[#181716]'
                    }`}
                  >
                    <span>{cat === 'all' ? 'Tất Cả Danh Mục' : cat}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Filters: Search input & Price range selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Search box */}
              <div className="relative min-w-[240px] max-w-sm flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736E69]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm dịch vụ, tinh chất, phục hồi..."
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-white dark:bg-[#1E2024] border border-[#EAE4DA] dark:border-[#2E3136] text-xs text-[#181716] dark:text-white placeholder-[#9A9690] focus:outline-none focus:border-[#181716]"
                />
              </div>

              {/* Price Filter Chips */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[#736E69] text-[11px]">Mức giá:</span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'under400', label: '< 400k' },
                  { id: '400to800', label: '400k - 800k' },
                  { id: 'above800', label: '> 800k' },
                ].map((pf) => (
                  <button
                    key={pf.id}
                    onClick={() => setPriceFilter(pf.id as any)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                      priceFilter === pf.id
                        ? 'bg-[#EAE4DA] dark:bg-[#2E3136] text-[#181716] dark:text-white font-bold'
                        : 'text-[#736E69] hover:text-[#181716]'
                    }`}
                  >
                    {pf.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product & Service Grid (Matching Image 1 Product Cards) */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#161719] rounded-3xl border border-[#EAE4DA] dark:border-[#222428] space-y-3">
              <Sparkles className="w-8 h-8 text-[#8C5E32] mx-auto" />
              <p className="text-sm text-[#736E69]">Không tìm thấy dịch vụ hoặc mỹ phẩm phù hợp với bộ lọc.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setPriceFilter('all');
                }}
                className="text-xs text-[#181716] dark:text-white font-semibold underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => {
                return (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-[#18191C] rounded-2xl border border-[#EAE4DA] dark:border-[#26282D] overflow-hidden flex flex-col justify-between group hover:shadow-lg hover:border-[#D4C8B8] dark:hover:border-[#3E4249] transition-all duration-300"
                  >
                    <div>
                      {/* Product Image Stage */}
                      <div
                        onClick={() => setViewDetailService(service)}
                        className="relative aspect-square bg-[#FAF7F2] dark:bg-[#121314] overflow-hidden cursor-pointer"
                      >
                        <img
                          src={service.image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80'}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-sm text-[10px] font-semibold text-[#181716] dark:text-white uppercase tracking-wider">
                            {service.category}
                          </span>
                        </div>

                        {/* Duration Pill */}
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{service.durationMinutes} phút</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 space-y-2">
                        <div className="flex items-center space-x-1 text-amber-500 text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">5.0</span>
                          <span className="text-[#9A9690] text-[10px]">(98 đánh giá)</span>
                        </div>

                        <h3
                          onClick={() => setViewDetailService(service)}
                          className="font-serif text-base text-[#181716] dark:text-white font-medium line-clamp-2 leading-snug cursor-pointer hover:text-[#8C5E32] dark:hover:text-[#D4A373] transition-colors"
                        >
                          {service.name}
                        </h3>

                        <p className="text-xs text-[#736E69] dark:text-[#8E8A85] font-light line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Price & Action Footer */}
                    <div className="p-5 pt-0 flex items-center justify-between border-t border-[#F5EFEB] dark:border-[#222428] mt-2">
                      <div>
                        <span className="text-[10px] text-[#9A9690] block">Giá trọn gói</span>
                        <span className="font-serif text-base sm:text-lg font-bold text-[#181716] dark:text-white">
                          {formatVND(service.price)}
                        </span>
                      </div>

                      <button
                        onClick={() => onOpenBooking(service.id)}
                        className="px-4 py-2 rounded-full bg-[#181716] hover:bg-[#33312E] dark:bg-white dark:hover:bg-[#EAE4DA] text-white dark:text-[#181716] text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95 flex items-center space-x-1.5"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Đặt Lịch</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 8. BATH & BODY RELAXING RITUAL BANNER (Matching Image 1 Bottom Right) */}
      <section id="bath-and-body" className="border-b border-[#EAE4DA] dark:border-[#222428] bg-[#DBEAF0] dark:bg-[#182830] text-[#193645] dark:text-[#DFEEF5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[380px] lg:min-h-[440px]">
          
          {/* Left Column: Bath & Body Copy */}
          <div className="lg:col-span-6 p-6 sm:p-12 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md space-y-4 sm:space-y-6">
              
              <div className="space-y-1.5 sm:space-y-2">
                <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-semibold text-[#295973] dark:text-[#88C6E5]">
                  HOLISTIC WELLNESS • DƯỠNG SINH & THƯ GIÃN
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#102936] dark:text-white leading-tight font-normal">
                  Bath & Body
                </h2>
                <p className="text-xs sm:text-sm font-serif italic text-[#295973] dark:text-[#88C6E5]">
                  Liệu pháp thanh lọc thân tâm & làm sạch làn da cơ thể
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#274B5E] dark:text-[#B6D6E5] font-light leading-relaxed">
                Hệ liệu pháp gội đầu dưỡng sinh thảo mộc & thủy liệu pháp giúp thư giãn sâu vùng cổ vai gáy, giảm căng thẳng thần kinh và nuôi dưỡng làn da body mịn màng.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenBooking('srv-4')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#102936] text-white hover:bg-[#1E4357] dark:bg-white dark:text-[#102936] dark:hover:bg-[#EAE4DA] text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>GỘI ĐẦU DƯỠNG SINH & BODY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Relaxing Bath Sponge & Body Therapy Still Life */}
          <div className="lg:col-span-6 relative min-h-[240px] sm:min-h-[300px] lg:min-h-[440px] bg-[#C8DEE6] dark:bg-[#121E24]">
            <img
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=85"
              alt="Bath & Body Spa Treatment"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </section>

      {/* 9. PROMOTIONS & VOUCHERS SHOWCASE */}
      <section id="promotions-vouchers" className="py-12 sm:py-16 px-4 sm:px-8 border-b border-[#EAE4DA] dark:border-[#222428] bg-white dark:bg-[#161719]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8C5E32] dark:text-[#D4A373]">
              Special Offers & Exclusive Vouchers
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#181716] dark:text-white font-normal">
              Chương Trình Khuyến Mãi Đang Chạy
            </h2>
            <p className="text-xs sm:text-sm text-[#736E69] dark:text-[#8E8A85] font-light">
              Sao chép mã voucher và áp dụng ngay khi đặt lịch hoặc thanh toán tại quầy.
            </p>
          </div>

          {/* Vouchers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {activePromotions.map((promo) => {
              const isCopied = copiedCode === promo.code;
              return (
                <div
                  key={promo.id}
                  className="rounded-3xl border border-[#EAE4DA] dark:border-[#2E3136] bg-[#FAF7F2] dark:bg-[#1A1C1F] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Poster Banner Image if available */}
                  {promo.image && (
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={promo.image}
                        alt={promo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as any).src = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                      {/* Highlight Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-white text-zinc-950 text-[10px] font-extrabold shadow-sm">
                          {promo.highlightBadge || 'ƯU ĐÃI ĐẶC BIỆT'}
                        </span>
                      </div>

                      {/* Expiry Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>HSD: {promo.endDate}</span>
                        </span>
                      </div>

                      {/* Price / Discount Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-base sm:text-lg font-black tracking-tight drop-shadow">
                          {promo.promotionalPrice && promo.originalPrice ? (
                            <div className="flex items-baseline space-x-2">
                              <span>{formatVND(promo.promotionalPrice)}</span>
                              <span className="text-xs text-zinc-300 line-through opacity-80">
                                {formatVND(promo.originalPrice)}
                              </span>
                            </div>
                          ) : promo.discountType === 'percentage' ? (
                            `GIẢM ${promo.discountValue}%`
                          ) : (
                            `GIẢM ${formatVND(promo.discountValue)}`
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {!promo.image && (
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#8C5E32]/10 text-[#8C5E32] dark:text-[#D4A373] text-[10px] font-bold uppercase tracking-wider">
                            {promo.discountType === 'percentage' ? `Giảm ${promo.discountValue}%` : `Giảm ${formatVND(promo.discountValue)}`}
                          </span>
                          <span className="text-[11px] text-[#736E69] flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>HSD: {promo.endDate}</span>
                          </span>
                        </div>
                      )}

                      <h3 className="font-serif text-base sm:text-lg text-[#181716] dark:text-white font-medium line-clamp-2">
                        {promo.title}
                      </h3>

                      <p className="text-xs text-[#57534E] dark:text-[#A8A49E] font-light leading-relaxed line-clamp-2">
                        {promo.description}
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-[#EAE4DA] dark:border-[#2E3136]">
                      <div className="flex items-center space-x-2">
                        <code className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#25282E] border border-[#DDD5C7] dark:border-[#383C44] text-xs font-mono font-bold text-[#181716] dark:text-white">
                          {promo.code}
                        </code>
                        <button
                          onClick={() => handleCopy(promo.code)}
                          className="p-1.5 rounded-lg hover:bg-[#EAE4DA] dark:hover:bg-[#2E3136] text-[#736E69] hover:text-[#181716] transition-colors"
                          title="Sao chép mã"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <button
                        onClick={() => onOpenBooking(undefined, promo.code)}
                        className="px-3 py-1.5 rounded-full bg-[#181716] hover:bg-[#33312E] dark:bg-white dark:hover:bg-[#EAE4DA] text-white dark:text-[#181716] text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95 flex items-center space-x-1"
                      >
                        <span>Dùng Mã</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. LUXURY FOOTER & SPA CONTACT INFO */}
      <footer className="bg-[#181716] text-[#FAF7F2] pt-14 pb-24 lg:pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Brand Story & Philosophy */}
            <div className="md:col-span-4 space-y-4">
              <span className="font-serif text-2xl tracking-tight text-white block">
                {spaProfile.name || 'L’AURA BEAUTY & SPA'}
              </span>
              <p className="text-xs text-[#A8A49E] font-light leading-relaxed">
                {spaProfile.tagline || 'Kiến tạo vẻ đẹp thuần khiết chuẩn y khoa & thư giãn thân tâm.'}
              </p>
              <p className="text-xs text-[#8E8A85] font-light leading-relaxed">
                {spaProfile.story || 'Hệ sinh thái trị liệu da và chăm sóc sức khỏe toàn diện với quy trình vô khuẩn tuyệt đối và hoạt chất thực vật hữu cơ lành tính.'}
              </p>
            </div>

            {/* Contact & Address */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D4A373]">
                Địa Chỉ & Hotline
              </h4>
              <div className="space-y-2.5 text-xs text-[#A8A49E] font-light">
                <p className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                  <span>{spaProfile.address || '128 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#D4A373] shrink-0" />
                  <span>Hotline: <strong className="text-white font-medium">{spaProfile.phone || '0909 123 456'}</strong></span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#D4A373] shrink-0" />
                  <span>Email: {spaProfile.email || 'contact@lauraspa.vn'}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#D4A373] shrink-0" />
                  <span>Giờ mở cửa: {spaProfile.openingHours || '08:30 - 20:30 (Tất cả các ngày)'}</span>
                </p>
              </div>
            </div>

            {/* Quick Links & Staff Entry */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D4A373]">
                Dành Cho Quản Trị & Nhân Sự
              </h4>
              <p className="text-xs text-[#A8A49E] font-light leading-relaxed">
                Khu vực đăng nhập nội bộ dành cho Chủ Spa, Quản lý, Lễ tân và Kỹ thuật viên để quản lý lịch hẹn, kho mỹ phẩm, doanh thu và chấm công.
              </p>

              {onOpenStaffLogin && (
                <button
                  id="btn-footer-staff-login"
                  onClick={onOpenStaffLogin}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all flex items-center justify-center space-x-2 active:scale-95"
                >
                  <UserCheck className="w-4 h-4 text-[#D4A373]" />
                  <span>🔐 Đăng Nhập Quản Trị Spa (Mã PIN)</span>
                </button>
              )}
            </div>

          </div>

          {/* Copyright & Disclaimer */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#736E69] gap-2">
            <span>© 2026 {spaProfile.name || 'L’AURA SPA'}. All rights reserved.</span>
            <span>Bespoke Organic Skincare & Medical Wellness Aesthetics.</span>
          </div>

        </div>
      </footer>

      {/* SERVICE DETAIL POPUP MODAL */}
      {viewDetailService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#18191C] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-[#EAE4DA] dark:border-[#2E3136] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs uppercase font-bold text-[#8C5E32] dark:text-[#D4A373] tracking-wider">
                {viewDetailService.category}
              </span>
              <button
                onClick={() => setViewDetailService(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-[#121314]">
              <img
                src={viewDetailService.image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80'}
                alt={viewDetailService.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-zinc-900 dark:text-white font-medium">
                  {viewDetailService.name}
                </h3>
                <span className="font-serif text-lg font-bold text-[#181716] dark:text-white">
                  {formatVND(viewDetailService.price)}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs text-zinc-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Thời lượng: {viewDetailService.durationMinutes} phút</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>5.0 (98 đánh giá)</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-light leading-relaxed pt-2">
                {viewDetailService.description}
              </p>
            </div>

            <div className="pt-4 flex items-center gap-2 border-t border-zinc-100 dark:border-zinc-800">
              <a
                href={`tel:${spaProfile.phone || '0909123456'}`}
                className="px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center justify-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Tư vấn</span>
              </a>

              <button
                onClick={() => {
                  const srvId = viewDetailService.id;
                  setViewDetailService(null);
                  onOpenBooking(srvId);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#181716] hover:bg-[#33312E] dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-[#181716] text-xs font-bold flex items-center justify-center space-x-2 shadow-md active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Đặt Lịch Liệu Trình Này</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. MOBILE FLOATING ACTION BAR (STICKY BOTTOM DOCK) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-2.5 bg-white/95 dark:bg-[#141518]/95 backdrop-blur-lg border-t border-[#EAE4DA] dark:border-[#26282E] shadow-2xl">
        <div className="max-w-md mx-auto flex items-center space-x-2">
          <a
            href={`tel:${spaProfile.phone || '0909123456'}`}
            className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border border-[#EAE4DA] dark:border-[#2E3136] text-[#181716] dark:text-white shrink-0 active:scale-95"
            title="Gọi Hotline"
          >
            <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[9px] font-semibold mt-0.5">Hotline</span>
          </a>

          <a
            href="#promotions-vouchers"
            className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border border-[#EAE4DA] dark:border-[#2E3136] text-[#181716] dark:text-white shrink-0 active:scale-95"
            title="Xem Voucher"
          >
            <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-[9px] font-semibold mt-0.5">Voucher</span>
          </a>

          <button
            onClick={() => onOpenBooking()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#181716] dark:bg-white text-white dark:text-[#181716] font-bold text-xs flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform"
          >
            <Calendar className="w-4 h-4" />
            <span className="tracking-wide">ĐẶT LỊCH HẸN SPA</span>
          </button>
        </div>
      </div>

    </div>
  );
};

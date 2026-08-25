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
  ChevronDown
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
      <header className="border-b border-[#EAE4DA] dark:border-[#222428] bg-[#FAF7F2]/90 dark:bg-[#121314]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Left Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs tracking-wider uppercase font-medium text-[#4A4744] dark:text-[#A8A5A0]">
            <a href="#services-catalog" className="hover:text-black dark:hover:text-white transition-colors">Dịch Vụ & Trị Liệu</a>
            <a href="#bestseller-feature" className="hover:text-black dark:hover:text-white transition-colors">Bestseller</a>
            <a href="#botanical-science" className="hover:text-black dark:hover:text-white transition-colors">Thành Phần Thực Vật</a>
            <a href="#bath-and-body" className="hover:text-black dark:hover:text-white transition-colors">Body & Thư Giãn</a>
            <a href="#promotions-vouchers" className="hover:text-black dark:hover:text-white transition-colors">Ưu Đãi</a>
            <a href="#skincare-journal" className="hover:text-black dark:hover:text-white transition-colors">Cẩm Nang Da Liễu</a>
          </nav>

          {/* Center Brand Identity */}
          <div className="text-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#161514] dark:text-white block font-normal">
              {spaProfile.name || 'beauty'}
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase font-light text-[#736E69] dark:text-[#8E8A85] block -mt-1">
              {spaProfile.tagline || 'Bespoke Skin & Botanical Spa'}
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Quick Booking Button */}
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#181716] hover:bg-[#33312E] dark:bg-white dark:hover:bg-[#EAE4DA] text-white dark:text-[#181716] text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Đặt Lịch Hẹn</span>
            </button>

            {/* Edit Spa Profile (For Owner/Manager when previewing) */}
            {(currentRole === 'owner' || currentRole === 'manager') && onOpenEditSpaProfile && (
              <button
                onClick={onOpenEditSpaProfile}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-medium hover:bg-amber-500/20 transition-all"
                title="Chỉnh sửa thông tin, logo & hotline"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Sửa Info & Logo</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SPLIT SECTION (Matching Image 1: "Take care of your skin. We know you are unique.") */}
      <section className="relative overflow-hidden border-b border-[#EAE4DA] dark:border-[#222428]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 p-8 sm:p-14 lg:p-18 flex flex-col justify-center bg-[#FAF7F2] dark:bg-[#121314]">
            <div className="max-w-xl space-y-6">
              
              <div className="space-y-3">
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] leading-[1.12] text-[#181716] dark:text-white tracking-tight font-normal">
                  Take care of your skin.<br />
                  <span className="italic font-serif">We know you are unique.</span>
                </h1>
                
                <p className="text-xs sm:text-sm text-[#736E69] dark:text-[#9A9690] uppercase tracking-[0.2em] font-medium pt-1">
                  Chăm sóc làn da độc bản • Liệu pháp chuẩn y khoa
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#57534E] dark:text-[#A8A49E] font-light leading-relaxed">
                Take care of your complexion to make it healthy and radiant. In the range of facial care products & bespoke spa treatments you will find organic botanical serums, customized clinical therapies and deeply soothing rituals designed for your unique skin barrier.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href="#services-catalog"
                  className="px-6 py-3.5 rounded-full bg-[#181716] text-white hover:bg-[#33312E] dark:bg-white dark:text-[#181716] dark:hover:bg-[#EAE4DA] text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95 text-center inline-block"
                >
                  VIEW BODY & SKIN CARE
                </a>

                <button
                  onClick={() => onOpenBooking()}
                  className="px-6 py-3.5 rounded-full bg-transparent border border-[#181716] dark:border-[#EAE4DA] text-[#181716] dark:text-[#EAE4DA] hover:bg-[#181716]/5 dark:hover:bg-white/5 text-xs uppercase tracking-widest font-semibold transition-all active:scale-95"
                >
                  ĐẶT LỊCH HẸN TRẢI NGHIỆM
                </button>
              </div>

              {/* Quick hotline & guarantee */}
              <div className="pt-4 flex items-center space-x-6 text-xs text-[#736E69] dark:text-[#8E8A85]">
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#181716] dark:text-white" />
                  <span>Hotline: <strong className="text-[#181716] dark:text-white font-medium">{spaProfile.phone || '0909 123 456'}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Mỹ phẩm chính hãng & Vô khuẩn y tế</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: High-End Radiant Model Photography */}
          <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-[580px] bg-[#EDE7DD] dark:bg-[#1A1B1D]">
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
      <section className="border-b border-[#EAE4DA] dark:border-[#222428] bg-white dark:bg-[#161719] py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* 1. Vegan */}
          <div className="text-center space-y-2.5 px-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF7F2] dark:bg-[#202226] border border-[#EAE4DA] dark:border-[#2E3136] flex items-center justify-center text-[#181716] dark:text-white">
              <Heart className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-base text-[#181716] dark:text-white font-medium">Vegan</h3>
            <p className="text-xs text-[#736E69] dark:text-[#8E8A85] font-light leading-relaxed max-w-[200px] mx-auto">
              Our entire collection is vegan and cruelty free. 100% không thử nghiệm động vật.
            </p>
          </div>

          {/* 2. Natural */}
          <div className="text-center space-y-2.5 px-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF7F2] dark:bg-[#202226] border border-[#EAE4DA] dark:border-[#2E3136] flex items-center justify-center text-[#181716] dark:text-white">
              <Leaf className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-base text-[#181716] dark:text-white font-medium">Natural</h3>
            <p className="text-xs text-[#736E69] dark:text-[#8E8A85] font-light leading-relaxed max-w-[200px] mx-auto">
              We only use the finest natural ingredients & organic botanical extracts.
            </p>
          </div>

          {/* 3. Parabens Free */}
          <div className="text-center space-y-2.5 px-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF7F2] dark:bg-[#202226] border border-[#EAE4DA] dark:border-[#2E3136] flex items-center justify-center text-[#181716] dark:text-white">
              <Droplets className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-base text-[#181716] dark:text-white font-medium">Parabens Free</h3>
            <p className="text-xs text-[#736E69] dark:text-[#8E8A85] font-light leading-relaxed max-w-[200px] mx-auto">
              Our products do not contain harmful substances, harsh chemicals or sulfates.
            </p>
          </div>

          {/* 4. Recyclable */}
          <div className="text-center space-y-2.5 px-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF7F2] dark:bg-[#202226] border border-[#EAE4DA] dark:border-[#2E3136] flex items-center justify-center text-[#181716] dark:text-white">
              <RotateCcw className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-base text-[#181716] dark:text-white font-medium">Recyclable</h3>
            <p className="text-xs text-[#736E69] dark:text-[#8E8A85] font-light leading-relaxed max-w-[200px] mx-auto">
              All packaging is recyclable, sustainable and eco-conscious.
            </p>
          </div>

        </div>
      </section>

      {/* 4. BOTANICAL SCIENCE & ACTIVE INGREDIENTS SPOTLIGHT (Matching Image 1 Top Right) */}
      <section id="botanical-science" className="py-16 px-4 sm:px-8 border-b border-[#EAE4DA] dark:border-[#222428] bg-[#FAF7F2] dark:bg-[#121314]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8C5E32] dark:text-[#D4A373]">
              Active Botanical Science • Khoa Học Hoạt Chất Thực Vật
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#181716] dark:text-white font-normal">
              Potent Natural Actives for Radiant Skin
            </h2>
            <p className="text-xs sm:text-sm text-[#736E69] dark:text-[#8E8A85] font-light">
              Mỗi liệu trình và sản phẩm đều được chiết xuất từ các thành phần thảo mộc hữu cơ chọn lọc có chứng minh lâm sàng.
            </p>
          </div>

          {/* 4 Circular Ingredient Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {botanicalIngredients.map((item, idx) => (
              <div key={idx} className="text-center space-y-3.5 group">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#E0D7C9] dark:border-[#2E3136] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-base text-[#181716] dark:text-white font-medium">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#8C5E32] dark:text-[#D4A373] font-medium">
                    {item.vietnameseName}
                  </p>
                </div>
                <p className="text-xs text-[#57534E] dark:text-[#A8A49E] font-light leading-relaxed max-w-[240px] mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. BESTSELLER SAGE GREEN SPLIT HERO BANNER (Matching Image 1 Center: "Smoothing Face Serum") */}
      <section id="bestseller-feature" className="border-b border-[#EAE4DA] dark:border-[#222428] bg-[#D4E4D9] dark:bg-[#1B2920] text-[#1C3525] dark:text-[#E0EFE6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          
          {/* Left Column: Bestseller Copy & CTA */}
          <div className="lg:col-span-6 p-8 sm:p-14 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md space-y-6">
              
              <div className="space-y-2">
                <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#2F533C] dark:text-[#A3CFB4]">
                  BESTSELLER • SẢN PHẨM & DỊCH VỤ TIÊU BIỂU
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl text-[#14261B] dark:text-white leading-tight font-normal">
                  Smoothing<br />Face Serum
                </h2>
                <p className="text-sm font-serif italic text-[#2F533C] dark:text-[#A3CFB4]">
                  Liệu pháp trẻ hóa & làm mịn màng cấu trúc da đa tầng
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#2D4536] dark:text-[#BFD6C8] font-light leading-relaxed">
                Discover the best clinical formulations and bespoke facial rituals from our botanical laboratory. Formulated with pure cold-pressed botanicals and biomimetic peptides for instant radiance.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenBooking('srv-3')}
                  className="px-7 py-3.5 rounded-full bg-[#14261B] text-white hover:bg-[#203D2B] dark:bg-white dark:text-[#14261B] dark:hover:bg-[#EAE4DA] text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95 inline-flex items-center space-x-2"
                >
                  <span>SHOP NOW / ĐẶT TRỊ LIỆU</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Editorial Product Still Life Composition */}
          <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-[480px] bg-[#C5D9CB] dark:bg-[#14211A] flex items-center justify-center p-8 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=85"
              alt="Smoothing Face Serum - Botanical Still Life"
              className="w-full h-full object-cover max-h-[420px] rounded-2xl shadow-xl border border-white/20"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </section>

      {/* 6. INTERACTIVE CLIENT STORIES & SKIN GLOW SHOWCASE (Matching Image 1 Left: "Best Skincare Products") */}
      <section className="py-16 px-4 sm:px-8 border-b border-[#EAE4DA] dark:border-[#222428] bg-white dark:bg-[#161719]">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-4xl text-[#181716] dark:text-white font-normal">
              Best Skincare Products & Glowing Results
            </h2>
            <p className="text-xs sm:text-sm text-[#736E69] dark:text-[#8E8A85] font-light">
              Hình ảnh thực tế từ khách hàng trải nghiệm quy trình trị liệu và chăm sóc da tại spa.
            </p>
          </div>

          {/* Horizontal Gallery of Portrait Video/Photo Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {skinShowcaseCards.map((card, idx) => {
              const isSelected = activeStoryIdx === idx;
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveStoryIdx(idx)}
                  className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 aspect-[3/4] group ${
                    isSelected ? 'ring-2 ring-[#181716] dark:ring-white scale-[1.02] shadow-xl' : 'opacity-85 hover:opacity-100'
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
                  <div className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Card Title & Category */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-[#181716] dark:text-white">
                    {card.category}
                  </div>

                  {/* Floating Product Tag Overlay on Active Card (Matching Image 1 Mockup) */}
                  {isSelected && (
                    <div className="absolute bottom-3 left-3 right-10 bg-white/95 dark:bg-[#1E2024]/95 backdrop-blur-md rounded-2xl p-2.5 border border-zinc-200 dark:border-zinc-700 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] dark:bg-[#2A2D32] shrink-0 overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1608248597359-21b7123d6a45?w=100&q=80"
                            alt="Mokosh Tonic"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] uppercase tracking-wider text-[#8C5E32] dark:text-[#D4A373] block font-bold">L'AURA SKINCARE</span>
                          <h5 className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{card.productName}</h5>
                          <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">{formatVND(card.price)}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenBooking();
                          }}
                          className="p-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 transition-transform"
                          title="Đặt mua hoặc hẹn liệu trình"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
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
                      <div className="relative aspect-square bg-[#FAF7F2] dark:bg-[#121314] overflow-hidden">
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
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center space-x-1 text-amber-500 text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">5.0</span>
                          <span className="text-[#9A9690] text-[10px]">(98 đánh giá)</span>
                        </div>

                        <h3 className="font-serif text-base text-[#181716] dark:text-white font-medium line-clamp-2 leading-snug">
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
          
          {/* Left Column: Bath & Body Copy */}
          <div className="lg:col-span-6 p-8 sm:p-14 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md space-y-6">
              
              <div className="space-y-2">
                <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#295973] dark:text-[#88C6E5]">
                  HOLISTIC WELLNESS • DƯỠNG SINH & THƯ GIÃN
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl text-[#102936] dark:text-white leading-tight font-normal">
                  Bath & Body
                </h2>
                <p className="text-sm font-serif italic text-[#295973] dark:text-[#88C6E5]">
                  Liệu pháp thanh lọc thân tâm & làm sạch làn da cơ thể
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#274B5E] dark:text-[#B6D6E5] font-light leading-relaxed">
                Our bespoke spa cosmetics and hydrotherapy allow you to take care of your skin and cleanse it, as well as provide deep relaxation and a pleasant sensual experience.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenBooking('srv-4')}
                  className="px-7 py-3.5 rounded-full bg-[#102936] text-white hover:bg-[#1E4357] dark:bg-white dark:text-[#102936] dark:hover:bg-[#EAE4DA] text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95 inline-flex items-center space-x-2"
                >
                  <span>KHÁM PHÁ BODY & GỘI ĐẦU DƯỠNG SINH</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Relaxing Bath Sponge & Body Therapy Still Life */}
          <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[440px] bg-[#C8DEE6] dark:bg-[#121E24]">
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
      <section id="promotions-vouchers" className="py-16 px-4 sm:px-8 border-b border-[#EAE4DA] dark:border-[#222428] bg-white dark:bg-[#161719]">
        <div className="max-w-7xl mx-auto space-y-10">
          
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activePromotions.map((promo) => {
              const isCopied = copiedCode === promo.code;
              return (
                <div
                  key={promo.id}
                  className="rounded-2xl border border-[#EAE4DA] dark:border-[#2E3136] bg-[#FAF7F2] dark:bg-[#1A1C1F] p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#8C5E32]/10 text-[#8C5E32] dark:text-[#D4A373] text-[10px] font-bold uppercase tracking-wider">
                        {promo.discountType === 'percentage' ? `Giảm ${promo.discountValue}%` : `Giảm ${formatVND(promo.discountValue)}`}
                      </span>
                      <span className="text-[11px] text-[#736E69] flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>HSD: {promo.endDate}</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-[#181716] dark:text-white font-medium">
                      {promo.title}
                    </h3>

                    <p className="text-xs text-[#57534E] dark:text-[#A8A49E] font-light leading-relaxed">
                      {promo.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#EAE4DA] dark:border-[#2E3136]">
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
                      className="text-xs font-semibold text-[#181716] dark:text-white underline hover:opacity-80"
                    >
                      Dùng Mã Ngay →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. SKINCARE JOURNAL & DERMATOLOGY GUIDES */}
      <section id="skincare-journal" className="py-16 px-4 sm:px-8 border-b border-[#EAE4DA] dark:border-[#222428] bg-[#FAF7F2] dark:bg-[#121314]">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#EAE4DA] dark:border-[#222428]">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8C5E32] dark:text-[#D4A373]">
                Dermatology & Clinical Skincare Journal
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#181716] dark:text-white font-normal mt-1">
                Cẩm Nang Chăm Sóc Da Chuẩn Y Khoa
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsArticles.slice(0, 3).map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-white dark:bg-[#18191C] rounded-2xl border border-[#EAE4DA] dark:border-[#26282D] overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] bg-[#FAF7F2] dark:bg-[#121314] overflow-hidden">
                    <img
                      src={article.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] text-[#736E69] uppercase font-semibold tracking-wider">
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                    <h3 className="font-serif text-base text-[#181716] dark:text-white font-medium group-hover:underline line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#57534E] dark:text-[#A8A49E] font-light line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 text-xs font-semibold text-[#8C5E32] dark:text-[#D4A373] flex items-center space-x-1">
                  <span>Đọc bài viết</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. LUXURY FOOTER & SPA CONTACT INFO */}
      <footer className="bg-[#181716] text-[#FAF7F2] pt-16 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
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

      {/* ARTICLE MODAL POPUP */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#18191C] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-4 shadow-2xl border border-[#EAE4DA] dark:border-[#2E3136]">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs uppercase font-bold text-[#8C5E32] tracking-wider">{selectedArticle.category}</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-zinc-400 hover:text-zinc-800 dark:hover:text-white text-xs font-bold px-2 py-1"
              >
                Đóng ✕
              </button>
            </div>

            {selectedArticle.image && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h2 className="font-serif text-2xl text-zinc-900 dark:text-white font-medium">
              {selectedArticle.title}
            </h2>

            <div className="text-xs text-zinc-500">
              Tác giả: <strong className="text-zinc-700 dark:text-zinc-300">{selectedArticle.author}</strong> • Ngày đăng: {selectedArticle.date}
            </div>

            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-light">
              {selectedArticle.content}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  onOpenBooking();
                }}
                className="px-5 py-2.5 rounded-full bg-[#181716] text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold tracking-wide"
              >
                Đặt Lịch Khám & Tư Vấn Da
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

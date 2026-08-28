import React, { useState, useMemo } from 'react';
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
import { B2BPitchDeckModal, B2BPartnerCategory } from './B2BPitchDeckModal';
import { getStoredB2BConfig } from '../data/b2bConfigData';

interface CustomerPortalViewProps {
  lang: Language;
  onLangChange?: (lang: Language) => void;
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
  onLangChange,
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
  const [showPortalLangMenu, setShowPortalLangMenu] = useState<boolean>(false);

  // B2B Partnership Modal State
  const [showB2BModal, setShowB2BModal] = useState<boolean>(false);
  const [b2bPartnerType, setB2BPartnerType] = useState<B2BPartnerCategory>('hotel');
  const [b2bName, setB2BName] = useState<string>('');
  const [b2bPhone, setB2BPhone] = useState<string>('');
  const [b2bNote, setB2BNote] = useState<string>('');
  const [b2bSuccess, setB2BSuccess] = useState<boolean>(false);

  // B2B Pitch Deck Slide Viewer Modal State
  const [showPitchDeckModal, setShowPitchDeckModal] = useState<boolean>(false);
  const [pitchDeckCategory, setPitchDeckCategory] = useState<B2BPartnerCategory>('hotel');

  // Dynamic B2B Content configuration
  const b2bConfig = useMemo(() => getStoredB2BConfig(), [showPitchDeckModal, showB2BModal]);

  const portalTexts = {
    vi: {
      servicesTab: 'Dịch Vụ & Trị Liệu',
      bestsellerTab: 'Bestseller',
      bodyTab: 'Body & Thư Giãn',
      promotionsTab: 'Ưu Đãi',
      bookNow: 'Đặt Lịch',
      curated: 'Curated Skincare & Bespoke Rituals',
      catalogTitle: 'Bảng Dịch Vụ Trị Liệu & Mỹ Phẩm',
      showing: 'Hiển thị',
      treatmentsAndProducts: 'liệu trình & sản phẩm',
      sortBy: 'Sắp xếp:',
      featured: 'Nổi Bật Nhất',
      priceLowHigh: 'Giá: Thấp đến Cao',
      priceHighLow: 'Giá: Cao đến Thấp',
      duration: 'Thời lượng',
      allCats: 'Tất cả',
      priceFilter: 'Lọc mức giá',
      allPrices: 'Mọi mức giá',
      under400: 'Dưới 400.000 đ',
      between400_800: '400k - 800.000 đ',
      above800: 'Trên 800.000 đ',
      viewDetail: 'Xem Chi Tiết Liệu Trình',
      bookWithCode: 'Đặt Lịch & Áp Dụng Mã',
      copied: 'Đã sao chép!',
      copyCode: 'Sao chép mã',
      minOrder: 'Đơn tối thiểu:',
      validTo: 'Hạn sử dụng:',
      costEstimator: 'Dự Toán Chi Phí Minh Bạch',
      tryVouchers: 'Thử Áp Mã Voucher & Xem Giá Sau Giảm Trực Tuyến',
      noExtraFee: 'Không phát sinh phụ phí tại spa',
      step1: '1. Chọn Dịch Vụ Bạn Muốn Trải Nghiệm:',
      step2: '2. Chọn Mã Giảm Giá Áp Dụng:',
      paymentSummary: 'Bảng Tóm Tắt Thanh Toán Dự Kiến',
      listPrice: 'Giá niêm yết:',
      discountAmount: 'Số tiền giảm:',
      finalTotal: 'Tổng thanh toán dự kiến:',
      bookThisPrice: 'Đặt Lịch Với Mức Giá Này',
      veganTitle: 'Vegan',
      veganDesc: '100% thuần chay, không thử nghiệm động vật.',
      naturalTitle: 'Natural',
      naturalDesc: 'Chiết xuất thảo mộc hữu cơ chọn lọc.',
      parabenTitle: 'Parabens Free',
      parabenDesc: 'Không chứa chất độc hại và paraben.',
      recycleTitle: 'Recyclable',
      recycleDesc: 'Bao bì tái chế thân thiện với môi trường.',
    },
    en: {
      servicesTab: 'Services & Rituals',
      bestsellerTab: 'Bestsellers',
      bodyTab: 'Body & Relaxation',
      promotionsTab: 'Promotions',
      bookNow: 'Book Now',
      curated: 'Curated Skincare & Bespoke Rituals',
      catalogTitle: 'Curated Skincare & Treatment Menu',
      showing: 'Showing',
      treatmentsAndProducts: 'treatments & products',
      sortBy: 'Sort by:',
      featured: 'Featured',
      priceLowHigh: 'Price: Low to High',
      priceHighLow: 'Price: High to Low',
      duration: 'Duration',
      allCats: 'All',
      priceFilter: 'Price Filter',
      allPrices: 'All Prices',
      under400: 'Under 400k VND',
      between400_800: '400k - 800k VND',
      above800: 'Above 800k VND',
      viewDetail: 'View Treatment Details',
      bookWithCode: 'Book & Apply Code',
      copied: 'Copied!',
      copyCode: 'Copy code',
      minOrder: 'Min order:',
      validTo: 'Valid to:',
      costEstimator: 'Transparent Cost Estimator',
      tryVouchers: 'Test Voucher & View Live Discounted Price',
      noExtraFee: 'No extra fees at spa',
      step1: '1. Select Service You Want to Experience:',
      step2: '2. Select Applicable Promo Code:',
      paymentSummary: 'Estimated Payment Summary',
      listPrice: 'List Price:',
      discountAmount: 'Discount:',
      finalTotal: 'Estimated Total:',
      bookThisPrice: 'Book With This Price',
      veganTitle: 'Vegan',
      veganDesc: '100% vegan, cruelty-free ingredients.',
      naturalTitle: 'Natural',
      naturalDesc: 'Selected organic herbal extracts.',
      parabenTitle: 'Parabens Free',
      parabenDesc: 'Free from harmful chemicals and parabens.',
      recycleTitle: 'Recyclable',
      recycleDesc: 'Eco-friendly recyclable packaging.',
    },
    ko: {
      servicesTab: '서비스 및 테라피',
      bestsellerTab: '베스트셀러',
      bodyTab: '바디 & 릴랙세이션',
      promotionsTab: '프로모션',
      bookNow: '예약하기',
      curated: '큐레이티드 스킨케어 & 맞춤형 테라피',
      catalogTitle: '스킨케어 및 시술 메뉴판',
      showing: '표시 중',
      treatmentsAndProducts: '개 시술 및 상품',
      sortBy: '정렬:',
      featured: '추천순',
      priceLowHigh: '가격: 낮은순',
      priceHighLow: '가격: 높은순',
      duration: '소요 시간',
      allCats: '전체',
      priceFilter: '가격 필터',
      allPrices: '모든 가격',
      under400: '40만 VND 미만',
      between400_800: '40만~80만 VND',
      above800: '80만 VND 이상',
      viewDetail: '시술 상세 보기',
      bookWithCode: '예약 및 코드 적용',
      copied: '복사됨!',
      copyCode: '코드 복사',
      minOrder: '최소 주문:',
      validTo: '유효기간:',
      costEstimator: '투명한 비용 견적기',
      tryVouchers: '바우처 적용 및 실시간 할인가 확인',
      noExtraFee: '스파 내 추가 비용 없음',
      step1: '1. 경험하고 싶으신 서비스를 선택하세요:',
      step2: '2. 적용할 프로모션 코드를 선택하세요:',
      paymentSummary: '예상 결제 요약',
      listPrice: '정가:',
      discountAmount: '할인 금액:',
      finalTotal: '예상 총 결제 금액:',
      bookThisPrice: '이 가격으로 예약하기',
      veganTitle: 'Vegan',
      veganDesc: '100% 비건, 동물 실험을 하지 않습니다.',
      naturalTitle: 'Natural',
      naturalDesc: '선별된 유기농 허브 추출물.',
      parabenTitle: 'Parabens Free',
      parabenDesc: '유해 화학물질 및 파라벤 불검출.',
      recycleTitle: 'Recyclable',
      recycleDesc: '친환경 재활용 가능 패키지.',
    },
    zh: {
      servicesTab: '项目与水疗',
      bestsellerTab: '畅销热卖',
      bodyTab: '身体护理',
      promotionsTab: '优惠专区',
      bookNow: '立即预约',
      curated: '精选护肤与定制水疗',
      catalogTitle: '护肤与水疗项目菜单',
      showing: '显示',
      treatmentsAndProducts: '个项目与产品',
      sortBy: '排序:',
      featured: '精选推荐',
      priceLowHigh: '价格：从低到高',
      priceHighLow: '价格：从高到低',
      duration: '时长',
      allCats: '全部',
      priceFilter: '价格筛选',
      allPrices: '全部价格',
      under400: '40万VND以下',
      between400_800: '40万-80万VND',
      above800: '80万VND以上',
      viewDetail: '查看疗程详情',
      bookWithCode: '预约并使用优惠码',
      copied: '已复制!',
      copyCode: '复制优惠码',
      minOrder: '最低消费:',
      validTo: '有效期至:',
      costEstimator: '透明费用测算',
      tryVouchers: '测试优惠券并查看实时折后价',
      noExtraFee: '店内无任何隐形消费',
      step1: '1. 选择您想体验的服务项目:',
      step2: '2. 选择适用的优惠码:',
      paymentSummary: '预计支付摘要',
      listPrice: '标牌价:',
      discountAmount: '优惠金额:',
      finalTotal: '预计实付总额:',
      bookThisPrice: '以此价格预约',
      veganTitle: 'Vegan',
      veganDesc: '100%纯素，零动物实验。',
      naturalTitle: 'Natural',
      naturalDesc: '甄选有机草本植物提取物。',
      parabenTitle: 'Parabens Free',
      parabenDesc: '不含防腐剂及有害化学成分。',
      recycleTitle: 'Recyclable',
      recycleDesc: '环保可回收包装设计。',
    }
  };
  const pt = portalTexts[lang] || portalTexts.vi;

  const translateService = (service: Service): Service => {
    if (lang === 'vi') return service;
    
    // Using keyword matching to handle dynamically added services
    const translationsMap: Array<{ keywords: string[]; name: Record<string, string>; desc: Record<string, string>; cat: Record<string, string> }> = [
      {
        keywords: ['trị mụn', 'acne', 'nặn mụn'],
        name: {
          en: 'Medical-Grade Advanced Acne Treatment',
          ko: '의학 메디컬 전문 여드름 케어',
          zh: '医学级深层祛痘调理'
        },
        desc: {
          en: 'Deep extraction, sterilizing blue light therapy, and herbal anti-inflammatory mask to heal acne and prevent scarring.',
          ko: '심층 압출, 블루라이트 살균 테라피 및 천연 한방 항염 마스크로 여드름 치료 및 흉터 예방.',
          zh: '深层清洁粉刺、蓝光杀菌消炎及草本抗炎面膜，有效祛痘防印。'
        },
        cat: { en: 'Acne Treatment', ko: '여드름 케어', zh: '祛痘护理' }
      },
      {
        keywords: ['cấy tảo', 'tảo xoắn', 'spirulina'],
        name: {
          en: 'Fresh Spirulina & Collagen Regeneration',
          ko: '콜라겐 재생 스피룰리나 테라피',
          zh: '胶原蛋白鲜藻再生疗程'
        },
        desc: {
          en: 'Infusing pure organic spirulina and marine collagen to deeply nourish, brighten skin, and restore youthful firmness.',
          ko: '순수 유기농 스피룰리나와 해양 콜라겐을 침투시켜 피부 영양 공급, 미백 및 탄력 회복.',
          zh: '导入纯天然有机螺旋藻与海洋胶原蛋白，深层滋养、美白焕肤并恢复年轻紧致。'
        },
        cat: { en: 'Facial Skincare', ko: '스킨케어', zh: '面部护理' }
      },
      {
        keywords: ['massage', 'đá nóng', 'body'],
        name: {
          en: 'Hot Stone Full Body Aromatherapy Massage',
          ko: '핫스톤 전신 바디 아로마 마사지',
          zh: '热石全身精油舒压按摩'
        },
        desc: {
          en: 'Relaxing Swedish massage combined with warmed basalt stones to relieve muscle tension and promote deep relaxation.',
          ko: '따뜻한 현무암 스톤과 스웨디시 마사지를 결합하여 근육 긴장 완화 및 심신의 안정 도모.',
          zh: '结合温热玄武岩与经典瑞典按摩手法，有效舒缓肌肉紧张，促进深度放松。'
        },
        cat: { en: 'Body Therapy', ko: '바디 테라피', zh: '身体舒压' }
      },
      {
        keywords: ['hút chì', 'thải độc', 'vitamin c'],
        name: {
          en: 'Heavy Metal Detox & Vitamin C Infusion',
          ko: '중금속 배출 및 비타민C 이온토포레시스',
          zh: '排铅排毒与维C超导美白'
        },
        desc: {
          en: 'Ultrasonic detoxification to remove trapped toxins and heavy metals, followed by Vitamin C iontophoresis for radiant glow.',
          ko: '초음파 디톡스로 노폐물 및 중금속 배출, 비타민C 이온 도입으로 맑고 환한 피부 완성.',
          zh: '超声波排毒清除残留重金属与毒素，配合维C超导导入，焕发明亮光彩。'
        },
        cat: { en: 'Facial Skincare', ko: '스킨케어', zh: '面部护理' }
      },
      {
        keywords: ['gội đầu', 'dưỡng sinh'],
        name: {
          en: 'Herbal Scalp Wellness & Shampoo Therapy',
          ko: '한방 허브 두피 릴랙싱 샴푸 테라피',
          zh: '中草药养生头皮舒缓洗护'
        },
        desc: {
          en: 'Traditional herbal shampoo, neck-shoulder-head massage, and acupressure to relieve stress and nourish hair roots.',
          ko: '전통 한방 샴푸, 목·어깨·두피 마사지 및 지압으로 스트레스 해소 및 모근 영양 공급.',
          zh: '采用传统草本本草洗发，配合颈肩头部穴位按摩，彻底舒缓压力并滋养发根。'
        },
        cat: { en: 'Body Therapy', ko: '바디 테라피', zh: '身体舒压' }
      },
      {
        keywords: ['triệt lông', 'diode', 'laser'],
        name: {
          en: 'Diode Laser Ice Plus Hair Removal',
          ko: '다이오드 레이저 아이스 플러스 제모',
          zh: '冰点无痛半导体激光脱毛'
        },
        desc: {
          en: 'Painless and effective hair removal using advanced Diode Laser Ice Plus technology.',
          ko: '최첨단 다이오드 레이저 아이스 플러스 기술을 활용한 무통 및 효과적인 제모.',
          zh: '采用先进的冰点半导体激光技术，无痛高效脱毛。'
        },
        cat: { en: 'Hair Removal', ko: '제모', zh: '脱毛' }
      }
    ];

    const lowerName = service.name.toLowerCase();
    const matched = translationsMap.find(t => t.keywords.some(k => lowerName.includes(k)));

    if (matched) {
      return {
        ...service,
        name: matched.name[lang] || service.name,
        description: matched.desc[lang] || service.description,
        category: matched.cat[lang] || service.category,
      };
    }
    return service;
  };

  const localizedMonthlySpecial = useMemo(() => {
    if (!spaProfile.monthlySpecial) return null;
    if (lang === 'vi') return spaProfile.monthlySpecial;
    if (lang === 'en') {
      return {
        ...spaProfile.monthlySpecial,
        badge: 'SPECIAL TREATMENT • BESTSELLER',
        title: 'Smoothing Face Serum & Multi-Layer Regeneration',
        subtitle: 'Rejuvenation, pore refining & multi-layer skin structure smoothing',
        description: 'Formulated with an exclusive biological formula combining cold-pressed plant extracts and bio-peptides to regenerate a dewy smooth skin surface and reinforce moisture barriers.',
        buttonText: 'BOOK SPECIAL TREATMENT',
      };
    }
    if (lang === 'ko') {
      return {
        ...spaProfile.monthlySpecial,
        badge: '스페셜 시술 • 베스트셀러',
        title: '스무딩 페이스 세럼 & 멀티 레이어 리제너레이션',
        subtitle: '안티에이징, 모공 수축 및 다층 피부 구조 탄력 개선',
        description: '독점적인 바이오 생물학적 포뮬러와 냉압착 식물성 추출물, 바이오 펩타이드를 결합하여 매끄럽고 촉촉한 피부 표면을 되찾아 주고 수분 장벽을 강화합니다.',
        buttonText: '스페셜 시술 예약하기',
      };
    }
    if (lang === 'zh') {
      return {
        ...spaProfile.monthlySpecial,
        badge: '特色疗程 • 畅销热卖',
        title: '平滑面容精华与多层再生疗程',
        subtitle: '紧致抗衰老、收缩毛孔与多层皮肤结构重塑',
        description: '采用独家生物配方，结合冷压植物精萃与生物多肽，帮助重现水润平滑肌肤，修复保湿屏障并自然提亮。',
        buttonText: '立即预约特色疗程',
      };
    }
    return spaProfile.monthlySpecial;
  }, [spaProfile.monthlySpecial, lang]);

  const translateCategoryName = (cat: string) => {
    if (lang === 'vi') return cat;
    const catMap: Record<string, Record<string, string>> = {
      'Trị Mụn': { en: 'Acne Treatment', ko: '여드름 케어', zh: '祛痘护理' },
      'Chăm Sóc Da': { en: 'Facial Skincare', ko: '스킨케어', zh: '面部护理' },
      'Body & Thư Giãn': { en: 'Body Therapy', ko: '바디 테라피', zh: '身体舒压' },
      'Mỹ Phẩm': { en: 'Cosmetics', ko: '화장품', zh: '美妆产品' },
    };
    return catMap[cat]?.[lang] || cat;
  };

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

  // Filter and sort services / products with localization
  const translatedServices = services.map((s) => translateService(s));
  const filteredServices = translatedServices
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
    <div className="w-full bg-white text-[#1F1E1D] font-sans antialiased transition-colors duration-300">
      
      {/* 1. TOP EDITORIAL BRAND HEADER */}
      <header className="border-b border-[#EAE4DA] bg-white/95 sticky top-0 z-40 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          
          {/* Mobile Hamburger Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#181716] hover:bg-black/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <a
              href={`tel:${spaProfile.phone || '0909123456'}`}
              className="p-2 rounded-xl text-[#181716] hover:bg-black/5 transition-colors"
              title="Gọi hotline"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
            </a>
          </div>

          {/* Left Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs tracking-wider uppercase font-medium text-[#4A4744]">
            <a href="#services-catalog" className="hover:text-black transition-colors">{pt.servicesTab}</a>
            <a href="#bestseller-feature" className="hover:text-black transition-colors">{pt.bestsellerTab}</a>
            <a href="#bath-and-body" className="hover:text-black transition-colors">{pt.bodyTab}</a>
            <a href="#b2b-partnerships" className="hover:text-emerald-800 text-amber-900 font-bold transition-colors">Giới Thiệu & Hợp Tác B2B</a>
            <a href="#promotions-vouchers" className="hover:text-black transition-colors">{pt.promotionsTab}</a>
          </nav>

          {/* Center Brand Identity */}
          <div className="text-center cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-xl sm:text-3xl tracking-tight text-[#161514] block font-bold leading-none">
              {spaProfile.name || 'beauty'}
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-light text-[#736E69] block mt-0.5">
              {spaProfile.tagline || 'Bespoke Skin & Botanical Spa'}
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Portal Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPortalLangMenu(!showPortalLangMenu)}
                className="p-1.5 sm:p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-1 text-xs font-semibold border border-zinc-200 dark:border-zinc-700/80 shadow-sm shrink-0"
                title="Đổi ngôn ngữ / Language"
              >
                <span className="text-sm">🌐</span>
                <span className="uppercase text-[10px] sm:text-[11px] font-bold">{lang}</span>
              </button>

              {showPortalLangMenu && (
                <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full mt-2 w-48 bg-white dark:bg-[#18181B] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 mb-1">
                    Chọn Ngôn Ngữ / Language
                  </div>
                  {[
                    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
                    { code: 'en', label: 'English', flag: '🇬🇧' },
                    { code: 'ko', label: '한국어', flag: '🇰🇷' },
                    { code: 'zh', label: '中文', flag: '🇨🇳' },
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setShowPortalLangMenu(false);
                        if (onLangChange) onLangChange(item.code as Language);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all ${
                        lang === item.code
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </span>
                      {lang === item.code && <Check className="w-3.5 h-3.5 text-current" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Booking Button */}
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#181716] hover:bg-[#33312E] dark:bg-white dark:hover:bg-[#EAE4DA] text-white dark:text-[#181716] text-[11px] sm:text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{pt.bookNow}</span>
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

      {/* 2. HERO SPLIT SECTION (Bright White Clean Luxury Layout) */}
      <section className="relative overflow-hidden border-b border-[#EAE4DA] bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[460px] lg:min-h-[580px]">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 p-6 sm:p-12 lg:p-18 flex flex-col justify-center bg-white">
            <div className="max-w-xl space-y-5 sm:space-y-6">
              
              <div className="space-y-2.5 sm:space-y-3">
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.15] text-[#181716] tracking-tight font-bold">
                  Take care of your skin.<br />
                  <span className="italic text-[#4A4744] font-medium">We know you are unique.</span>
                </h1>
                
                <p className="text-[11px] sm:text-xs text-[#736E69] uppercase tracking-[0.2em] font-medium pt-0.5">
                  Chăm sóc làn da độc bản • Liệu pháp chuẩn y khoa
                </p>
              </div>

              <p className="text-xs sm:text-sm md:text-base text-[#57534E] font-light leading-relaxed">
                Khám phá hệ sinh thái trị liệu da chuyên sâu kết hợp hoạt chất sinh học thiên nhiên &amp; máy móc tân tiến chuẩn da liễu. Mỗi liệu trình được cá nhân hóa hoàn toàn theo thể trạng làn da của bạn.
              </p>

              <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="#services-catalog"
                  className="px-6 py-3 rounded-full bg-[#181716] text-white hover:bg-[#33312E] text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95 text-center flex items-center justify-center space-x-2"
                >
                  <span>XEM MENU TRỊ LIỆU</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onOpenBooking()}
                  className="px-6 py-3 rounded-full bg-transparent border border-[#181716] text-[#181716] hover:bg-[#181716]/5 text-xs uppercase tracking-widest font-semibold transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>ĐẶT HẸN TRẢI NGHIỆM</span>
                </button>
              </div>

              {/* Quick hotline & guarantee */}
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-[#736E69]">
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#181716]" />
                  <span>Hotline: <a href={`tel:${spaProfile.phone || '0909123456'}`} className="text-[#181716] font-semibold underline">{spaProfile.phone || '0909 123 456'}</a></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Mỹ phẩm cao cấp &amp; Vô khuẩn</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: High-End Radiant Model Photography */}
          <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[380px] lg:min-h-[580px] bg-[#FAF7F2]">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&q=85"
              alt="Take care of your skin - Model"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Subtle soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 3. MINIMALIST BRAND VALUES & CERTIFICATIONS BAR (Vegan, Natural, Parabens Free, Recyclable) */}
      <section className="border-b border-[#EAE4DA] bg-[#FAFAFA] py-8 sm:py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* 1. Vegan */}
          <div className="text-center space-y-2 px-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full bg-white border border-[#EAE4DA] flex items-center justify-center text-[#181716] shadow-sm">
              <Heart className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="text-sm sm:text-base text-[#181716] font-semibold">{pt.veganTitle}</h3>
            <p className="text-[11px] sm:text-xs text-[#736E69] font-light leading-relaxed max-w-[200px] mx-auto">
              {pt.veganDesc}
            </p>
          </div>

          {/* 2. Natural */}
          <div className="text-center space-y-2 px-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full bg-white border border-[#EAE4DA] flex items-center justify-center text-[#181716] shadow-sm">
              <Leaf className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="text-sm sm:text-base text-[#181716] font-semibold">{pt.naturalTitle}</h3>
            <p className="text-[11px] sm:text-xs text-[#736E69] font-light leading-relaxed max-w-[200px] mx-auto">
              {pt.naturalDesc}
            </p>
          </div>

          {/* 3. Parabens Free */}
          <div className="text-center space-y-2 px-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full bg-white border border-[#EAE4DA] flex items-center justify-center text-[#181716] shadow-sm">
              <Droplets className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="text-sm sm:text-base text-[#181716] font-semibold">{pt.parabenTitle}</h3>
            <p className="text-[11px] sm:text-xs text-[#736E69] font-light leading-relaxed max-w-[200px] mx-auto">
              {pt.parabenDesc}
            </p>
          </div>

          {/* 4. Recyclable */}
          <div className="text-center space-y-2 px-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full bg-white border border-[#EAE4DA] flex items-center justify-center text-[#181716] shadow-sm">
              <RotateCcw className="w-4 h-4 stroke-[1.5]" />
            </div>
            <h3 className="text-sm sm:text-base text-[#181716] font-semibold">{pt.recycleTitle}</h3>
            <p className="text-[11px] sm:text-xs text-[#736E69] font-light leading-relaxed max-w-[200px] mx-auto">
              {pt.recycleDesc}
            </p>
          </div>

        </div>
      </section>

      {/* 4. DYNAMIC BESTSELLER / MONTHLY SPECIAL SERVICE HERO BANNER */}
      {localizedMonthlySpecial?.enabled !== false && (
        <section id="bestseller-feature" className={`border-b border-[#EAE4DA] relative ${
          localizedMonthlySpecial?.themeColor === 'rose'
            ? 'bg-[#FDF4F0] text-[#4A1D18]'
            : localizedMonthlySpecial?.themeColor === 'amber'
            ? 'bg-[#FEF8EB] text-[#4D3608]'
            : localizedMonthlySpecial?.themeColor === 'blue'
            ? 'bg-[#F0F6F9] text-[#193645]'
            : localizedMonthlySpecial?.themeColor === 'charcoal'
            ? 'bg-[#F4F4F6] text-[#181716]'
            : 'bg-[#EAF2EC] text-[#1C3525]' // default sage light
        }`}>
          {/* Quick Edit Float Button for Owner/Manager on the section */}
          {(currentRole === 'owner' || currentRole === 'manager') && onOpenEditSpaProfile && (
            <button
              onClick={onOpenEditSpaProfile}
              className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-zinc-900 text-xs font-semibold shadow-xs backdrop-blur-sm border border-zinc-200 flex items-center space-x-1.5 active:scale-95 transition-all"
              title="Chỉnh sửa nhanh dịch vụ đặc biệt trong tháng & hình ảnh"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>Chỉnh Sửa Dịch Vụ Tháng</span>
            </button>
          )}

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[420px] lg:min-h-[480px]">
            
            {/* Left Column: Bestseller Copy & CTA */}
            <div className="lg:col-span-6 p-6 sm:p-12 lg:p-16 flex flex-col justify-center">
              <div className="max-w-md space-y-4 sm:space-y-6">
                
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-semibold opacity-90 block">
                    {localizedMonthlySpecial?.badge || 'BESTSELLER • DỊCH VỤ TIÊU BIỂU'}
                  </span>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl leading-tight font-bold">
                    {localizedMonthlySpecial?.title || 'Smoothing Face Serum'}
                  </h2>
                  <p className="text-xs sm:text-sm italic opacity-90 font-medium">
                    {localizedMonthlySpecial?.subtitle || 'Liệu pháp trẻ hóa & làm mịn màng cấu trúc da đa tầng'}
                  </p>
                </div>

                <p className="text-xs sm:text-sm font-light leading-relaxed opacity-95">
                  {localizedMonthlySpecial?.description ||
                    'Được điều chế với công thức sinh học độc quyền kết hợp tinh chất thực vật ép lạnh và peptides sinh học giúp tái sinh bề mặt da căng mướt, thu nhỏ lỗ chân lông tức thì.'}
                </p>

                {/* Price Display if configured */}
                {(localizedMonthlySpecial?.price || 0) > 0 && (
                  <div className="flex items-baseline space-x-3 pt-1">
                    <span className="text-[11px] uppercase tracking-wider opacity-80">Giá trải nghiệm:</span>
                    <span className="text-xl sm:text-2xl font-bold">
                      {formatVND(localizedMonthlySpecial?.price || 0)}
                    </span>
                    {(localizedMonthlySpecial?.originalPrice || 0) > (localizedMonthlySpecial?.price || 0) && (
                      <span className="text-xs line-through opacity-60">
                        {formatVND(localizedMonthlySpecial?.originalPrice || 0)}
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onOpenBooking(localizedMonthlySpecial?.serviceId || 'srv-3')}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-xs active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span>{localizedMonthlySpecial?.buttonText || 'ĐẶT LIỆU TRÌNH NGAY'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {(currentRole === 'owner' || currentRole === 'manager') && onOpenEditSpaProfile && (
                    <button
                      onClick={onOpenEditSpaProfile}
                      className="px-4 py-3 rounded-full bg-white/80 hover:bg-white text-xs font-semibold transition-all border border-black/10"
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
                src={localizedMonthlySpecial?.image || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=85'}
                alt={localizedMonthlySpecial?.title || 'Monthly Special Treatment'}
                className="w-full h-full object-cover max-h-[360px] sm:max-h-[420px] rounded-2xl shadow-md border border-white/40"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=85';
                }}
              />
            </div>

          </div>
        </section>
      )}



      {/* 7. CURATED PRODUCT & TREATMENT CATALOG (Matching Image 1 Right Grid & Filter Sidebar) */}
      <section id="services-catalog" className="py-16 px-4 sm:px-8 border-b border-[#EAE4DA] bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#EAE4DA]">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8C5E32]">
                Curated Skincare & Bespoke Rituals
              </span>
              <h2 className="text-2xl sm:text-4xl text-[#181716] font-bold mt-1">
                Bảng Dịch Vụ Trị Liệu & Mỹ Phẩm
              </h2>
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-[#736E69]">
              <span>Hiển thị <strong>{filteredServices.length}</strong> liệu trình & sản phẩm</span>
              <span className="text-[#CCC6BE]">•</span>
              <div className="flex items-center space-x-1">
                <span>Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-0 font-semibold text-[#181716] underline cursor-pointer focus:ring-0 p-0 text-xs"
                >
                  <option value="featured">Nổi Bật Nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="duration">Thời lượng</option>
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
                        ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                        : 'bg-white border border-[#EAE4DA] text-[#57534E] hover:border-emerald-700 hover:text-emerald-800 font-medium'
                    }`}
                  >
                    <span>{cat === 'all' ? pt.allCatsOption : translateCategoryName(cat as string)}</span>
                    <span className="text-[10px] opacity-80">({count})</span>
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
                  placeholder={pt.searchPlaceholder}
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-[#EAE4DA] text-xs text-[#181716] placeholder-[#9A9690] focus:outline-none focus:border-emerald-700 shadow-xs"
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
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'bg-white border border-[#EAE4DA] text-[#736E69] hover:text-[#181716]'
                    }`}
                  >
                    {pf.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product & Service Grid (Clean Text & Details without images) */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE4DA] space-y-3">
              <Sparkles className="w-8 h-8 text-[#8C5E32] mx-auto" />
              <p className="text-sm text-[#736E69]">Không tìm thấy dịch vụ hoặc mỹ phẩm phù hợp với bộ lọc.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setPriceFilter('all');
                }}
                className="text-xs text-[#181716] font-semibold underline"
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
                    className="bg-white rounded-2xl border border-[#EAE4DA] p-5 flex flex-col justify-between group hover:shadow-md hover:border-emerald-300 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      {/* Top Badges & Duration */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-800 uppercase tracking-wider border border-emerald-100">
                          {service.category}
                        </span>
                        <div className="flex items-center space-x-1 text-[#736E69] text-[11px] font-medium">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{service.durationMinutes} phút</span>
                        </div>
                      </div>

                      {/* Title & Rating */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-amber-500 text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-semibold text-zinc-900">5.0</span>
                          <span className="text-[#9A9690] text-[10px]">(98 đánh giá)</span>
                        </div>

                        <h3
                          onClick={() => setViewDetailService(service)}
                          className="text-lg text-[#181716] font-bold line-clamp-2 leading-snug cursor-pointer hover:text-emerald-800 transition-colors"
                        >
                          {service.name}
                        </h3>
                      </div>

                      <p className="text-xs text-[#736E69] font-normal line-clamp-3 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom Price & Action Footer */}
                    <div className="pt-4 mt-4 flex items-center justify-between border-t border-[#F5EFEB]">
                      <div>
                        <span className="text-[10px] text-[#9A9690] block font-medium">Giá trọn gói</span>
                        <span className="text-base sm:text-lg font-bold text-emerald-900">
                          {formatVND(service.price)}
                        </span>
                      </div>

                      <button
                        onClick={() => onOpenBooking(service.id)}
                        className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold tracking-wide transition-all shadow-xs active:scale-95 flex items-center space-x-1.5"
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

      {/* 8. BATH & BODY RELAXING RITUAL BANNER */}
      <section id="bath-and-body" className="border-b border-[#EAE4DA] bg-[#F4F9FC] text-[#193645]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[380px] lg:min-h-[440px]">
          
          {/* Left Column: Bath & Body Copy */}
          <div className="lg:col-span-6 p-6 sm:p-12 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md space-y-4 sm:space-y-6">
              
              <div className="space-y-1.5 sm:space-y-2">
                <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-semibold text-[#295973]">
                  HOLISTIC WELLNESS • DƯỠNG SINH & THƯ GIÃN
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl text-[#102936] leading-tight font-bold">
                  Bath & Body
                </h2>
                <p className="text-xs sm:text-sm italic text-[#295973] font-medium">
                  Liệu pháp thanh lọc thân tâm & làm sạch làn da cơ thể
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#274B5E] font-light leading-relaxed">
                Hệ liệu pháp gội đầu dưỡng sinh thảo mộc & thủy liệu pháp giúp thư giãn sâu vùng cổ vai gáy, giảm căng thẳng thần kinh và nuôi dưỡng làn da body mịn màng.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenBooking('srv-4')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#102936] text-white hover:bg-[#1E4357] text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>GỘI ĐẦU DƯỠNG SINH & BODY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Relaxing Bath Sponge & Body Therapy Still Life */}
          <div className="lg:col-span-6 relative min-h-[240px] sm:min-h-[300px] lg:min-h-[440px] bg-[#E5F2F7]">
            <img
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=85"
              alt="Bath & Body Spa Treatment"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </section>

      {/* NEW B2B PARTNERSHIPS & WHOLESALE SERVICES SECTION */}
      <section id="b2b-partnerships" className="py-12 sm:py-16 border-t border-[#EAE4DA] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#EAE4DA]">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8C5E32] block mb-1">
                B2B PARTNERSHIPS & NETWORK
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#181716]">
                {b2bConfig.sectionTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#736E69] font-normal mt-1">
                {b2bConfig.sectionSubtitle}
              </p>
            </div>

            <button
              onClick={() => {
                setB2BPartnerType('hotel');
                setShowB2BModal(true);
              }}
              className="px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center space-x-2 shrink-0 self-start md:self-auto"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Đăng Ký Hợp Tác B2B</span>
            </button>
          </div>

          {/* 3 Core B2B Cards inspired by user's reference layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Hotel & Short-stay */}
            <div className="bg-white rounded-3xl border border-[#EAE4DA] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="p-6 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white space-y-3 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-amber-300 block">
                    {b2bConfig.cards.hotel.badge}
                  </span>
                  <h3 className="text-xl font-bold leading-snug">
                    {b2bConfig.cards.hotel.title}
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {b2bConfig.cards.hotel.description}
                  </p>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-900 font-medium space-y-1">
                    <span className="font-bold block">{b2bConfig.cards.hotel.benefitTitle}</span>
                    <p>{b2bConfig.cards.hotel.benefitText}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => {
                    setPitchDeckCategory('hotel');
                    setShowPitchDeckModal(true);
                  }}
                  className="w-full py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>{b2bConfig.cards.hotel.primaryButtonLabel}</span>
                </button>

                <button
                  onClick={() => {
                    setB2BPartnerType('hotel');
                    setShowB2BModal(true);
                  }}
                  className="w-full py-2 rounded-full border border-emerald-800 text-emerald-800 hover:bg-emerald-50 text-[11px] font-bold transition-all text-center"
                >
                  {b2bConfig.cards.hotel.secondaryButtonLabel}
                </button>
              </div>
            </div>

            {/* Card 2: Sports & Pickleball/Golf B2B Brand Activation */}
            <div className="bg-white rounded-3xl border border-[#EAE4DA] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="p-6 bg-gradient-to-br from-amber-900 to-amber-950 text-[#FAF8F5] space-y-3 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-amber-300 block">
                    {b2bConfig.cards.sports.badge}
                  </span>
                  <h3 className="text-xl font-bold leading-snug">
                    {b2bConfig.cards.sports.title}
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {b2bConfig.cards.sports.description}
                  </p>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 font-medium space-y-1">
                    <span className="font-bold block">{b2bConfig.cards.sports.benefitTitle}</span>
                    <p>{b2bConfig.cards.sports.benefitText}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => {
                    setPitchDeckCategory('sports');
                    setShowPitchDeckModal(true);
                  }}
                  className="w-full py-2.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>{b2bConfig.cards.sports.primaryButtonLabel}</span>
                </button>

                <button
                  onClick={() => {
                    setB2BPartnerType('sports');
                    setShowB2BModal(true);
                  }}
                  className="w-full py-2 rounded-full border border-amber-800 text-amber-900 hover:bg-amber-50 text-[11px] font-bold transition-all text-center"
                >
                  {b2bConfig.cards.sports.secondaryButtonLabel}
                </button>
              </div>
            </div>

            {/* Card 3: B2B Staff & SOP Transfer */}
            <div className="bg-white rounded-3xl border border-[#EAE4DA] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white space-y-3 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-amber-300 block">
                    {b2bConfig.cards.spa_outsourcing.badge}
                  </span>
                  <h3 className="text-xl font-bold leading-snug">
                    {b2bConfig.cards.spa_outsourcing.title}
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {b2bConfig.cards.spa_outsourcing.description}
                  </p>

                  <div className="p-3 rounded-xl bg-zinc-100 border border-zinc-200 text-[11px] text-zinc-900 font-medium space-y-1">
                    <span className="font-bold block">{b2bConfig.cards.spa_outsourcing.benefitTitle}</span>
                    <p>{b2bConfig.cards.spa_outsourcing.benefitText}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => {
                    setPitchDeckCategory('spa_outsourcing');
                    setShowPitchDeckModal(true);
                  }}
                  className="w-full py-2.5 rounded-full bg-zinc-900 hover:bg-black text-amber-300 text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>{b2bConfig.cards.spa_outsourcing.primaryButtonLabel}</span>
                </button>

                <button
                  onClick={() => {
                    setB2BPartnerType('spa_outsourcing');
                    setShowB2BModal(true);
                  }}
                  className="w-full py-2 rounded-full border border-zinc-900 text-zinc-900 hover:bg-zinc-100 text-[11px] font-bold transition-all text-center"
                >
                  {b2bConfig.cards.spa_outsourcing.secondaryButtonLabel}
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. PROMOTIONS & VOUCHERS SHOWCASE */}
      <section id="promotions-vouchers" className="py-12 sm:py-16 px-4 sm:px-8 border-b border-[#EAE4DA] bg-white">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8C5E32]">
              Special Offers & Exclusive Vouchers
            </span>
            <h2 className="text-2xl sm:text-4xl text-[#181716] font-bold">
              Chương Trình Khuyến Mãi Đang Chạy
            </h2>
            <p className="text-xs sm:text-sm text-[#736E69] font-light">
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
                  className="rounded-3xl border border-[#EAE4DA] bg-[#FAF7F2] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Poster Banner Image if available */}
                  {promo.image && (
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-zinc-100">
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
                          <span className="px-2.5 py-0.5 rounded-full bg-[#8C5E32]/10 text-[#8C5E32] text-[10px] font-bold uppercase tracking-wider">
                            {promo.discountType === 'percentage' ? `Giảm ${promo.discountValue}%` : `Giảm ${formatVND(promo.discountValue)}`}
                          </span>
                          <span className="text-[11px] text-[#736E69] flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>HSD: {promo.endDate}</span>
                          </span>
                        </div>
                      )}

                      <h3 className="text-base sm:text-lg text-[#181716] font-semibold line-clamp-2">
                        {promo.title}
                      </h3>

                      <p className="text-xs text-[#57534E] font-light leading-relaxed line-clamp-2">
                        {promo.description}
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-[#EAE4DA]">
                      <div className="flex items-center space-x-2">
                        <code className="px-2.5 py-1 rounded-lg bg-white border border-[#DDD5C7] text-xs font-mono font-bold text-[#181716]">
                          {promo.code}
                        </code>
                        <button
                          onClick={() => handleCopy(promo.code)}
                          className="p-1.5 rounded-lg hover:bg-[#EAE4DA] text-[#736E69] hover:text-[#181716] transition-colors"
                          title="Sao chép mã"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <button
                        onClick={() => onOpenBooking(undefined, promo.code)}
                        className="px-3 py-1.5 rounded-full bg-[#181716] hover:bg-[#33312E] text-white text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95 flex items-center space-x-1"
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

      {/* 10. LUXURY LIGHT FOOTER & SPA CONTACT INFO */}
      <footer className="bg-[#FAF7F2] text-[#181716] border-t border-[#EAE4DA] pt-14 pb-24 lg:pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Brand Story & Philosophy */}
            <div className="md:col-span-4 space-y-4">
              <span className="text-2xl tracking-tight text-[#181716] block font-bold">
                {spaProfile.name || 'L’AURA BEAUTY & SPA'}
              </span>
              <p className="text-xs text-[#57534E] font-light leading-relaxed">
                {spaProfile.tagline || 'Kiến tạo vẻ đẹp thuần khiết chuẩn y khoa & thư giãn thân tâm.'}
              </p>
              <p className="text-xs text-[#736E69] font-light leading-relaxed">
                {spaProfile.story || 'Hệ sinh thái trị liệu da và chăm sóc sức khỏe toàn diện với quy trình vô khuẩn tuyệt đối và hoạt chất thực vật hữu cơ lành tính.'}
              </p>
            </div>

            {/* Contact & Address */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#8C5E32]">
                Địa Chỉ &amp; Hotline
              </h4>
              <div className="space-y-2.5 text-xs text-[#57534E] font-light">
                <p className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-[#8C5E32] shrink-0 mt-0.5" />
                  <span>{spaProfile.address || '128 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#8C5E32] shrink-0" />
                  <span>Hotline: <strong className="text-[#181716] font-medium">{spaProfile.phone || '0909 123 456'}</strong></span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#8C5E32] shrink-0" />
                  <span>Email: {spaProfile.email || 'contact@lauraspa.vn'}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#8C5E32] shrink-0" />
                  <span>Giờ mở cửa: {spaProfile.openingHours || '08:30 - 20:30 (Tất cả các ngày)'}</span>
                </p>
              </div>
            </div>

            {/* Quick Links & Staff Entry */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#8C5E32]">
                Dành Cho Quản Trị &amp; Nhân Sự
              </h4>
              <p className="text-xs text-[#57534E] font-light leading-relaxed">
                Khu vực đăng nhập nội bộ dành cho Chủ Spa, Quản lý, Lễ tân và Kỹ thuật viên để quản lý lịch hẹn, kho mỹ phẩm, doanh thu và chấm công.
              </p>

              {onOpenStaffLogin && (
                <button
                  id="btn-footer-staff-login"
                  onClick={onOpenStaffLogin}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-50 text-[#181716] border border-[#EAE4DA] shadow-sm text-xs font-semibold transition-all flex items-center justify-center space-x-2 active:scale-95"
                >
                  <UserCheck className="w-4 h-4 text-[#8C5E32]" />
                  <span>🔐 Đăng Nhập Quản Trị Spa (Mã PIN)</span>
                </button>
              )}
            </div>

          </div>

          {/* Copyright & Disclaimer */}
          <div className="border-t border-[#EAE4DA] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#736E69] gap-2">
            <span>© 2026 {spaProfile.name || 'L’AURA SPA'}. All rights reserved.</span>
            <span>Bespoke Organic Skincare &amp; Medical Wellness Aesthetics.</span>
          </div>

        </div>
      </footer>

      {/* SERVICE DETAIL POPUP MODAL */}
      {viewDetailService && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-[#EAE4DA] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-xs uppercase font-bold text-[#8C5E32] tracking-wider">
                {viewDetailService.category}
              </span>
              <button
                onClick={() => setViewDetailService(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-[#FAF7F2]">
              <img
                src={viewDetailService.image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80'}
                alt={viewDetailService.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl text-zinc-900 font-bold">
                  {viewDetailService.name}
                </h3>
                <span className="text-lg font-bold text-emerald-900">
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

              <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed pt-2">
                {viewDetailService.description}
              </p>
            </div>

            <div className="pt-4 flex items-center gap-2 border-t border-zinc-100">
              <a
                href={`tel:${spaProfile.phone || '0909123456'}`}
                className="px-4 py-3 rounded-2xl border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center space-x-1.5 hover:bg-zinc-50"
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
                className="flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xs active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Đặt Lịch Liệu Trình Này</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B2B PARTNERSHIP REGISTRATION MODAL */}
      {showB2BModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-[#EAE4DA] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C5E32] tracking-wider block">
                  B2B NETWORK PARTNERSHIP
                </span>
                <h3 className="text-lg font-bold text-zinc-900">
                  Đăng Ký Hợp Tác & Nhận Proposal B2B
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowB2BModal(false);
                  setB2BSuccess(false);
                }}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {b2bSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-emerald-700" />
                </div>
                <h4 className="text-base font-bold text-zinc-900">Đã Gửi Yêu Cầu Hợp Tác Thành Công!</h4>
                <p className="text-xs text-zinc-600 max-w-xs mx-auto leading-relaxed">
                  Đội ngũ B2B của chúng tôi sẽ liên hệ lại với Quý đối tác qua SĐT <strong>{b2bPhone}</strong> trong vòng 24 giờ làm việc.
                </p>
                <button
                  onClick={() => {
                    setShowB2BModal(false);
                    setB2BSuccess(false);
                  }}
                  className="px-6 py-2.5 rounded-full bg-emerald-800 text-white text-xs font-bold"
                >
                  Đóng Cửa Sổ
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!b2bName || !b2bPhone) return;
                  setB2BSuccess(true);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Mô hình hợp tác mong muốn:</label>
                  <select
                    value={b2bPartnerType}
                    onChange={(e) => setB2BPartnerType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 font-medium text-zinc-900 focus:outline-none focus:border-emerald-700"
                  >
                    <option value="hotel">🏨 Khách Sạn / Resort / Lưu Trú Short-stay</option>
                    <option value="sports">🎾 CLB Thể Thao (Pickleball, Golf, Tennis, Gym)</option>
                    <option value="spa_outsourcing">💆‍♀️ Spa Đối Tác (Cung ứng KTV & Chuyển giao SOP)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Tên Đơn vị / Đại diện đối tác (*):</label>
                  <input
                    type="text"
                    required
                    value={b2bName}
                    onChange={(e) => setB2BName(e.target.value)}
                    placeholder="Ví dụ: Khách Sạn L'Aura / Anh Nam"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white font-medium text-zinc-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Số điện thoại / Zalo liên hệ (*):</label>
                  <input
                    type="tel"
                    required
                    value={b2bPhone}
                    onChange={(e) => setB2BPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white font-medium text-zinc-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Ghi chú nhu cầu thêm (Nếu có):</label>
                  <textarea
                    rows={2}
                    value={b2bNote}
                    onChange={(e) => setB2BNote(e.target.value)}
                    placeholder="Số lượng phòng / Tệp hội viên / Yêu cầu KTV..."
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white font-medium text-zinc-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  Gửi Yêu Cầu Hợp Tác B2B
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* B2B PITCH DECK SLIDE READER MODAL */}
      <B2BPitchDeckModal
        isOpen={showPitchDeckModal}
        onClose={() => setShowPitchDeckModal(false)}
        initialType={pitchDeckCategory}
        onRegisterPartner={(category) => {
          setShowPitchDeckModal(false);
          setB2BPartnerType(category);
          setShowB2BModal(true);
        }}
      />

      {/* 11. MOBILE FLOATING ACTION BAR (STICKY BOTTOM DOCK) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-2.5 bg-white/95 backdrop-blur-lg border-t border-[#EAE4DA] shadow-xl">
        <div className="max-w-md mx-auto flex items-center space-x-2">
          <a
            href={`tel:${spaProfile.phone || '0909123456'}`}
            className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border border-[#EAE4DA] text-[#181716] shrink-0 active:scale-95 bg-white"
            title="Gọi Hotline"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span className="text-[9px] font-semibold mt-0.5">Hotline</span>
          </a>

          <a
            href="#promotions-vouchers"
            className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border border-[#EAE4DA] text-[#181716] shrink-0 active:scale-95 bg-white"
            title="Xem Voucher"
          >
            <Tag className="w-4 h-4 text-amber-600" />
            <span className="text-[9px] font-semibold mt-0.5">Voucher</span>
          </a>

          <button
            onClick={() => onOpenBooking()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs active:scale-95 transition-transform"
          >
            <Calendar className="w-4 h-4" />
            <span className="tracking-wide">ĐẶT LỊCH HẸN SPA</span>
          </button>
        </div>
      </div>

    </div>
  );
};

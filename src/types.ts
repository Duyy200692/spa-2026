export type Role = 'owner' | 'manager' | 'technician' | 'receptionist' | 'customer';
export type UserRole = Role;

export type TabType =
  | 'dashboard'
  | 'appointments'
  | 'customers'
  | 'cost_calculation'
  | 'inventory'
  | 'staff'
  | 'timekeeping'
  | 'promotions'
  | 'reports'
  | 'customer_portal'
  | 'customer_intro'
  | 'customer_promotions'
  | 'customer_services'
  | 'customer_news';

export type Language = 'vi' | 'en';

export type Theme = 'light' | 'dark';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  gender: 'female' | 'male' | 'other';
  birthDate: string; // YYYY-MM-DD
  age?: number; // Tuổi cụ thể
  joinDate: string;
  tier: 'Standard' | 'Silver' | 'Gold' | 'VIP' | 'Diamond';
  totalSpent: number;
  loyaltyPoints: number;
  skinType: string;
  allergies?: string;
  notes?: string;
  isSample?: boolean;
  treatmentHistory: TreatmentSession[];
}

export interface TreatmentSession {
  id: string;
  date: string;
  serviceId: string;
  serviceCode?: string;
  serviceName: string;
  technicianName: string;
  notes: string;
  skinCondition: string;
  photos?: string[];
  cost: number;
}

export interface ServiceCostItem {
  inventoryItemId: string;
  name: string;
  unit: string;
  quantityUsed: number;
  costPerUnit: number;
  totalCost: number;
}

export interface Service {
  id: string;
  code?: string; // Mã ký hiệu dịch vụ rút gọn (VD: TM-01, MS-02, GD-03)
  shortName?: string; // Tên ngắn gọn dùng trong bảng & di động
  name: string; // Tên đầy đủ chi tiết
  category: string;
  durationMinutes: number;
  price: number;
  description: string;
  image?: string;
  // Cost breakdown
  costItems: ServiceCostItem[];
  technicianCommission: number; // e.g. 50000 VND
  otherOverheads: number; // e.g. electricity, bed sheets, laundry: 20000 VND
  totalCalculatedCost: number; // sum of costItems + commission + overheads
  grossProfit: number; // price - totalCalculatedCost
  profitMarginPercent: number; // (grossProfit / price) * 100
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  packageType: string; // e.g. "Hộp 200 miếng" or "Chai 500ml"
  packageUnit?: string; // e.g. "Hộp", "Chai", "Can", "Gói", "Tuýp", "Hũ"
  subUnitsPerPackage: number; // e.g. 200 (miếng) or 500 (ml)
  subUnitName: string; // e.g. "miếng", "ml", "ống", "gram", "viên"
  packagePurchasePrice: number; // e.g. 50,000 VND
  costPerSubUnit: number; // e.g. 250 VND per subUnit
  stockPackages: number; // e.g. 15 boxes
  stockSubUnits: number; // e.g. 3000 subUnits
  minThresholdSubUnits: number; // low stock alert
  expiryDate: string;
  supplier: string;
  lastRestocked: string;
}

export type AppointmentStatus = 'confirmed' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  serviceId: string;
  serviceCode?: string;
  serviceShortName?: string;
  serviceName: string;
  servicePrice: number;
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  roomBed: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
  status: AppointmentStatus;
  notes?: string;
  paid: boolean;
  paymentMethod?: PaymentMethodType;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  role: Role;
  positionTitle: string;
  specialty: string[];
  baseSalary: number;
  commissionRate: number; // in % or fixed per service
  rating: number;
  status: 'active' | 'leave' | 'inactive' | 'resigned';
  startDate: string; // YYYY-MM-DD (Ngày bắt đầu làm việc)
  endDate?: string; // YYYY-MM-DD (Ngày nghỉ việc nếu đã thôi việc)
  resignationReason?: string; // Lý do thôi việc / lưu trữ
  seniorityBonusAmount?: number; // Thưởng thâm niên cống hiến (VNĐ)
  notes?: string;
  completedServicesCount: number;
  monthlyCommission: number;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  shift: 'morning' | 'afternoon' | 'full_day';
  clockInTime: string; // HH:mm
  clockOutTime?: string; // HH:mm
  status: 'on_time' | 'late' | 'early_leave' | 'absent';
  workingHours: number;
  notes?: string;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount' | 'gift';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'expired' | 'scheduled';
  targetTier?: string; // 'All' | 'VIP' | 'Gold' etc.
  bannerColor?: string;
  image?: string;
  highlightBadge?: string;
  category?: 'all' | 'facial' | 'body' | 'combo' | 'special';
  originalPrice?: number;
  promotionalPrice?: number;
  applicableServices?: string[];
  termsAndConditions?: string[];
  featured?: boolean;
}

export type PaymentMethodType = 'cash' | 'card' | 'vietqr' | 'momo' | 'vnpay' | 'zalopay' | 'apple_pay';

export interface Invoice {
  id: string;
  code: string;
  appointmentId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  staffId: string;
  staffName: string;
  date: string; // ISO or YYYY-MM-DD HH:mm
  items: {
    serviceId: string;
    serviceCode?: string;
    serviceShortName?: string;
    serviceName: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  discountAmount: number;
  voucherCode?: string;
  taxAmount: number;
  tipAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  status: 'paid' | 'pending' | 'refunded';
  notes?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'promo' | 'booking' | 'inventory' | 'attendance';
  read: boolean;
  targetAudience?: string;
}

export interface RolePasswords {
  ownerPin: string;
  managerPin: string;
  staffPin: string;
}

export interface SpaProfile {
  id: string;
  name: string;
  tagline: string;
  logo?: string;
  bannerImage?: string;
  story: string;
  philosophy: string;
  address: string;
  phone: string;
  email: string;
  openHours: string;
  socialFacebook?: string;
  socialZalo?: string;
  highlights: {
    title: string;
    description: string;
  }[];
  commitments: string[];
  // Special monthly services & layout config
  monthlySpecial?: {
    enabled: boolean;
    badge: string; // e.g. "DỊCH VỤ ĐẶC BIỆT THÁNG 8"
    title: string; // e.g. "Smoothing Face Serum & Tái Sinh Đa Tầng"
    subtitle: string; // e.g. "Liệu pháp trẻ hóa & làm mịn màng cấu trúc da đa tầng"
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    themeColor: 'sage' | 'rose' | 'amber' | 'blue' | 'charcoal';
    buttonText: string;
    serviceId?: string;
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Cẩm nang làm đẹp' | 'Thông báo' | 'Sự kiện' | 'Khuyến mãi' | 'Công nghệ mới';
  date: string;
  author: string;
  summary: string;
  content: string;
  image?: string;
  readTime: string;
  featured?: boolean;
}


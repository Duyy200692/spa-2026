import {
  Customer,
  Service,
  InventoryItem,
  Appointment,
  Staff,
  AttendanceRecord,
  Promotion,
  Invoice,
  AppNotification,
  SpaProfile
} from './types';

// Dữ liệu kho mỹ phẩm ban đầu (Trống - sẵn sàng tạo mới hoặc nạp từ mẫu)
export const initialInventory: InventoryItem[] = [];

// Dữ liệu bài dịch vụ ban đầu (Trống - sẵn sàng để bạn tự tạo bài dịch vụ của riêng mình)
export const initialServices: Service[] = [];

// Dữ liệu khách hàng ban đầu (Trống)
export const initialCustomers: Customer[] = [];

// Danh sách nhân sự & Kỹ thuật viên (Tài khoản Chủ Spa / Điều Hành)
export const initialStaff: Staff[] = [
  {
    id: 'st-owner',
    name: 'Chủ Spa / Quản Lý',
    phone: '0908 688 888',
    email: 'quanly.spa@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    role: 'owner',
    positionTitle: 'Tổng Quản Lý & Điều Hành',
    specialty: ['Quản lý vận hành', 'Tư vấn phác đồ điều trị'],
    baseSalary: 15000000,
    commissionRate: 10,
    rating: 5.0,
    status: 'active',
    startDate: '2026-01-01',
    seniorityBonusAmount: 0,
    notes: 'Tài khoản quản trị điều hành spa.',
    completedServicesCount: 0,
    monthlyCommission: 0,
  }
];

// Dữ liệu lịch hẹn ban đầu (Trống)
export const initialAppointments: Appointment[] = [];

// Dữ liệu chương trình khuyến mãi & Voucher (Trống)
export const initialPromotions: Promotion[] = [];

// Nhật ký chấm công nhân sự (Trống)
export const initialAttendance: AttendanceRecord[] = [];

// Lịch sử hóa đơn & doanh thu (Trống)
export const initialInvoices: Invoice[] = [];

// Thông báo hệ thống (Trống)
export const initialNotifications: AppNotification[] = [];

// Mật khẩu phân quyền truy cập các vai trò
export const initialRolePasswords: { ownerPin: string; managerPin: string; staffPin: string } = {
  ownerPin: '123456',
  managerPin: '888888',
  staffPin: '666666',
};

// Thông tin hồ sơ thương hiệu Spa
export const initialSpaProfile: SpaProfile = {
  id: 'spa-main-profile',
  name: 'L’AURA BEAUTY & WELLNESS SPA',
  tagline: 'Kiến Tạo Vẻ Đẹp Thuần Khiết Chuẩn Y Khoa & Thư Giãn Tinh Thần',
  logo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&auto=format&fit=crop&q=80',
  bannerImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
  story: 'Không gian trị liệu chuẩn y khoa kết hợp nghệ thuật thư giãn Đông - Tây. Cam kết sử dụng 100% mỹ phẩm dược sinh học cao cấp, công nghệ thẩm mỹ chính hãng và đội ngũ kỹ thuật viên được đào tạo chuyên sâu.',
  philosophy: 'Vẻ đẹp bền vững khởi nguồn từ sự tôn trọng cấu trúc da nguyên bản và sự cân bằng giữa thân - tâm - trí.',
  address: '128 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  phone: '0908 688 888 / 028 3822 9999',
  email: 'contact@lauraspa.com.vn',
  openHours: '08:30 - 20:30 (Tất cả các ngày trong tuần)',
  socialFacebook: 'facebook.com/lauraspa.vietnam',
  socialZalo: '0908688888',
  highlights: [
    {
      title: '100% Mỹ Phẩm Chuẩn Dược Khoa',
      description: 'Nhập khẩu chính hãng từ Thụy Sĩ, Pháp, Đức và Hàn Quốc có chứng nhận an toàn y khoa.'
    },
    {
      title: 'Phòng Trị Liệu Vô Trùng Riêng Biệt',
      description: 'Không gian riêng tư, thơm hương tinh dầu thiên nhiên cùng âm nhạc tần số chữa lành.'
    },
    {
      title: 'Đội Ngũ Kỹ Thuật Viên 5+ Năm Kinh Nghiệm',
      description: 'Được cấp chứng chỉ hành nghề y tế, tay nghề mát-xa và bấm huyệt chuyên sâu.'
    },
    {
      title: 'Soi Da & Lên Phác Đồ Trị Liệu Miễn Phí',
      description: 'Phân tích đa tầng cấu trúc da trước mọi liệu trình điều trị.'
    }
  ],
  commitments: [
    'Minh bạch tuyệt đối chi phí, không phụ phí phát sinh.',
    'Dụng cụ sử dụng 1 lần hoặc tiệt trùng bằng nồi hấp chuẩn bệnh viện.',
    'Cam kết hiệu quả thấy rõ ngay sau buổi trị liệu đầu tiên.',
    'Bảo hành liệu trình và hỗ trợ tư vấn chăm sóc tại nhà 24/7.'
  ]
};

// Cẩm nang kiến thức làm đẹp
export const initialNewsArticles: {
  id: string;
  title: string;
  category: 'Cẩm nang làm đẹp' | 'Thông báo' | 'Sự kiện' | 'Khuyến mãi' | 'Công nghệ mới';
  date: string;
  author: string;
  summary: string;
  content: string;
  readTime: string;
  featured?: boolean;
}[] = [
  {
    id: 'news-1',
    title: 'Bí Quyết Phục Hồi Làn Da Tổn Thương & Nhạy Cảm Sau Peel Chuẩn Y Khoa',
    category: 'Cẩm nang làm đẹp',
    date: '2026-08-20',
    author: 'Cố vấn da liễu Spa',
    summary: 'Hướng dẫn các bước chăm sóc, cấp ẩm phục hồi và chống nắng đúng cách sau khi thực hiện peel hoặc laser trị liệu.',
    content: 'Sau khi can thiệp các liệu trình như peel da sinh học, laser hay lăn kim, hàng rào bảo vệ da tạm thời bị suy yếu. Trong 72 giờ đầu tiên, ưu tiên xịt khoáng, serum chứa Hyaluronic Acid thuần khiết, Ceramide và kem chống nắng vật lý SPF 50+...',
    readTime: '4 phút đọc',
    featured: true,
  }
];

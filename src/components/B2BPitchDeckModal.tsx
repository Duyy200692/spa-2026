import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Building,
  Award,
  Users,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Zap,
  Sparkles,
  MapPin,
  ArrowRight,
  PieChart,
  Target,
  FileText,
  Clock,
  Briefcase
} from 'lucide-react';

export type B2BPartnerCategory = 'hotel' | 'sports' | 'spa_outsourcing';

interface B2BPitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: B2BPartnerCategory;
  onRegisterPartner: (type: B2BPartnerCategory) => void;
}

interface SlideData {
  id: number;
  badge: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export const B2BPitchDeckModal: React.FC<B2BPitchDeckModalProps> = ({
  isOpen,
  onClose,
  initialType = 'hotel',
  onRegisterPartner
}) => {
  const [activeCategory, setActiveCategory] = useState<B2BPartnerCategory>(initialType);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    setActiveCategory(initialType);
    setCurrentSlideIndex(0);
  }, [initialType, isOpen]);

  // Auto-play slideshow timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slidesData[activeCategory].length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeCategory]);

  if (!isOpen) return null;

  // --- SLIDE DECKS DEFINITION ---
  const slidesData: Record<B2BPartnerCategory, SlideData[]> = {
    // -------------------------------------------------------------
    // CATEGORY 1: HOTEL & SHORT-STAY (LƯU TRÚ)
    // -------------------------------------------------------------
    hotel: [
      {
        id: 1,
        badge: 'ĐỀ ÁN HỢP TÁC • DỊCH VỤ LƯU TRÚ',
        title: 'Đột phá Doanh Thu Phụ Trợ (Ancillary Revenue) Cho Khách Sạn & Homestay',
        subtitle: 'Mang trải nghiệm Spa chuẩn 5 sao tận phòng du khách mà không tốn 1 VNĐ vốn đầu tư hay chi phí nhân sự.',
        content: (
          <div className="space-y-6">
            <div className="p-6 bg-emerald-950 text-white rounded-3xl space-y-4 border border-emerald-800 shadow-lg">
              <span className="text-[10px] tracking-widest font-bold uppercase text-amber-300 bg-emerald-900/80 px-3 py-1 rounded-full inline-block">
                Mô Hình In-Room Spa Rituals 2026
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold leading-snug">
                "Khách sạn của bạn không cần diện tích mặt bằng Spa — Chúng tôi đóng gói & vận hành trọn gói."
              </h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Du khách sau chuyến bay dài hoặc di chuyển liên tục luôn có nhu cầu thả lỏng cơ thể. Thay vì để họ tìm kiếm các cơ sở bên ngoài, QR Menu tại phòng giúp họ đặt lịch Spa phục vụ trực tiếp tại phòng nghỉ chỉ sau 30 phút.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-2xl font-black text-amber-900 block">+25%</span>
                <span className="text-[11px] text-amber-800 font-bold">Lợi Nhuận / Phòng</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-2xl font-black text-emerald-900 block">0 VNĐ</span>
                <span className="text-[11px] text-emerald-800 font-bold">Chi Phí ĐT Cố Định</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200 text-center">
                <span className="text-2xl font-black text-zinc-900 block">100%</span>
                <span className="text-[11px] text-zinc-700 font-bold">QR Đặt Lịch Tự Động</span>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-2xl font-black text-blue-900 block">25 - 35%</span>
                <span className="text-[11px] text-blue-800 font-bold">Chiết Khấu Đơn Hàng</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 2,
        badge: 'THỊ TRƯỜNG • HÀNH VI DU KHÁCH',
        title: 'Nhu Cầu Thư Giãn Tận Phòng Tăng Trưởng 48% Năm 2026',
        subtitle: 'Dữ liệu hành vi nghỉ dưỡng của khách du lịch trong & ngoài nước.',
        content: (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  82%
                </div>
                <h5 className="font-bold text-sm text-zinc-900">Mệt Mỏi Sau Di Chuyển</h5>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Khách du lịch đường dài thường bị đau mỏi cổ vai gáy, lệch múi giờ và khô da do điều hòa máy bay.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  91%
                </div>
                <h5 className="font-bold text-sm text-zinc-900">Ưa Thích Thư Giãn Riêng Tư</h5>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Khách quốc tế & gia đình thích không gian bảo mật tại phòng hơn là di chuyển ra cơ sở Spa xa lạ.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                  4.9★
                </div>
                <h5 className="font-bold text-sm text-zinc-900">Tăng Điểm Review OTA</h5>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Khách sạn có dịch vụ Spa tận phòng luôn được đánh giá xuất sắc trên Agoda, Booking & Airbnb.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 text-zinc-100 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Cơ hội đối tác</span>
                <p className="text-xs font-semibold">Biến mỗi phòng lưu trú thành một phòng Spa cao cấp tiêu chuẩn y khoa.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-400 shrink-0" />
            </div>
          </div>
        )
      },
      {
        id: 3,
        badge: 'VẬN HÀNH • QUY TRÌNH 4 BƯỚC',
        title: 'Quy Trình Triển Khai Không Tốn Chi Phí Cho Khách Sạn',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">1</span>
                <h5 className="font-bold text-sm text-emerald-950">Đặt Standee / QR Menu Tại Phòng</h5>
                <p className="text-xs text-emerald-800">Cung cấp bộ QR Code thiết kế cao cấp đồng thương hiệu đặt sẵn tại bàn trang điểm / đầu giường.</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold">2</span>
                <h5 className="font-bold text-sm text-amber-950">Khách Quét QR & Chọn Gói Trị Liệu</h5>
                <p className="text-xs text-amber-800">Hệ thống đặt lịch tự động chọn khung giờ, thanh toán trực tuyến hoặc tính vào hóa đơn phòng.</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center text-xs font-bold">3</span>
                <h5 className="font-bold text-sm text-blue-950">KTV Spa Tới Phục Vụ Đúng Giờ</h5>
                <p className="text-xs text-blue-800">Đội ngũ KTV đeo thẻ tên, trang phục chuẩn y khoa mang bộ Kit vô trùng 100% đến phục vụ.</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-purple-800 text-white flex items-center justify-center text-xs font-bold">4</span>
                <h5 className="font-bold text-sm text-purple-950">Đối Tác Nhận Hoa Hồng Tự Động</h5>
                <p className="text-xs text-purple-800">Hệ thống ghi nhận đơn và đối soát hoa hồng 25-35% chuyển khoản định kỳ mỗi tuần.</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 4,
        badge: 'MENU DỊCH VỤ • ĐÓNG GÓI SẴN',
        title: 'Gói Bài Liệu Trình Thiết Kế Riêng Cho Khách Du Lịch',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900">Jet-Lag Relief Massage</span>
                  <span className="text-xs font-bold text-emerald-800">60-90 Phút</span>
                </div>
                <p className="text-xs text-zinc-600">Trị liệu ấn huyệt cổ vai gáy & lòng bàn chân kết hợp tinh dầu thảo mộc giúp sâu giấc.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900">After-Sun Skin Hydration</span>
                  <span className="text-xs font-bold text-emerald-800">45 Phút</span>
                </div>
                <p className="text-xs text-zinc-600">Cấp nước nhả nắng cấp tốc bằng nha đam đông khô & điện di HA tinh khiết.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900">Couples Luxury In-Room Combo</span>
                  <span className="text-xs font-bold text-emerald-800">120 Phút</span>
                </div>
                <p className="text-xs text-zinc-600">Gói chăm sóc mặt & toàn thân đôi dành cho cặp đôi du lịch trăng mật hoặc nghỉ dưỡng.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900">Foot Reflexology & Herbal Soak</span>
                  <span className="text-xs font-bold text-emerald-800">45 Phút</span>
                </div>
                <p className="text-xs text-zinc-600">Ngâm chân thảo dược núi cao & massage giải mỏi chân sau ngày tham quan đi bộ dài.</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 5,
        badge: 'CHÍNH SÁCH • CAM KẾT CHẤT LƯỢNG',
        title: 'Tiêu Chuẩn Bảo Mật & An Toàn Tuyệt Đối Cho Khách Sạn',
        content: (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-emerald-900 text-white space-y-3">
              <h5 className="font-bold text-base text-amber-300">Cam Kết 5 Chuẩn Vàng Vận Hành B2B:</h5>
              <ul className="text-xs space-y-2 text-emerald-100">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>KTV được xác minh nhân thân, lý lịch tư pháp trong sạch 100%.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Mặt hàng dụng cụ & ga trải gối đóng túi vô trùng dùng 1 lần.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Tuân thủ nghiêm ngặt quy tắc bảo mật riêng tư của khách hàng nghỉ dưỡng.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Bảo hiểm trách nhiệm vận hành lên tới 500.000.000 VNĐ.</span>
                </li>
              </ul>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => onRegisterPartner('hotel')}
                className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold text-sm shadow-lg transition-all"
              >
                Ký Kết Hợp Tác Dịch Vụ Lưu Trú Ngay →
              </button>
            </div>
          </div>
        )
      }
    ],

    // -------------------------------------------------------------
    // CATEGORY 2: SPORTS RECOVERY & BRAND ACTIVATION (THỂ THAO - PICKLEBALL, GOLF, TENNIS)
    // -------------------------------------------------------------
    sports: [
      {
        id: 1,
        badge: 'ĐỊNH VỊ CHIẾN LƯỢC • B2B BRAND ACTIVATION',
        title: 'Khách Hàng Cao Cấp Của Bạn Đang Ở Trên Sân Thể Thao!',
        subtitle: 'Giải pháp Tổ Chức Giải Đấu Trọn Gói & Dựng VIP Sports Lounge cho Thương hiệu, Ngân hàng, Enterprise & Spa.',
        content: (
          <div className="space-y-6">
            {/* High Impact Red/Gold Banner matched with screenshot layout */}
            <div className="p-6 bg-gradient-to-r from-red-950 via-amber-950 to-zinc-950 text-white rounded-3xl space-y-3 border border-amber-700/60 shadow-xl relative overflow-hidden">
              <span className="text-[10px] tracking-widest font-bold uppercase text-amber-300 bg-amber-900/60 px-3 py-1 rounded-full inline-block border border-amber-600/40">
                CHUYỂN ĐỔI KHÁCH HÀNG VIP (HNWI)
              </span>
              <h4 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                Không ai đổi thương hiệu chỉ vì một bài quảng cáo số đơn thuần.
              </h4>
              <p className="text-xs text-amber-100/90 leading-relaxed max-w-2xl">
                Khách hàng VIP chuyển đổi khi thương hiệu của bạn xuất hiện trực tiếp tại nơi họ gắn bó mỗi tuần — trên sân Pickleball, Golf & Tennis. Chúng tôi cung cấp giải pháp <strong>Tổ chức Giải đấu Branded Cup trọn gói</strong> kết hợp <strong>VIP Recovery Lounge</strong> giúp bạn thu hút & giữ chân tệp khách hàng trả giá cao.
              </p>
            </div>

            {/* High Impact Stat Callouts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-red-600 block">396,6 Tỷ Đ</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Doanh thu thiết bị thể thao</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-amber-600 block">1,4 Triệu</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Người chơi Pickleball/Golf</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">85% HNWI</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Là chủ DN & Quản lý cao cấp</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-blue-600 block">5x LTV</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Giá trị trọn đời khách VIP</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 2,
        badge: 'CHÂN DUNG KHÁCH HÀNG • HIGH-VALUE CUSTOMERS',
        title: '3 Điều Đúng Với Tệp Khách Hàng Thể Thao Cao Cấp Tại Sân Tập',
        subtitle: 'Dữ liệu hành vi của nhóm người chơi Pickleball, Golf & Tennis có chi tiêu cao.',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">01 • ĐÃ QUEN CHỈ TIÊU CAO</span>
                <h5 className="font-extrabold text-base text-amber-950">Đầu Tư Lớn Cho Bản Thân</h5>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  Họ sở hữu cây vợt 5 - 15 triệu, trang phục có gu, sẵn sàng chi trả cho sức khỏe, sự thư giãn & trải nghiệm đẳng cấp.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">02 • TẦN SUẤT ĐỊNH KỲ</span>
                <h5 className="font-extrabold text-base text-amber-950">Chi Tiêu Thường Xuyên</h5>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  Có mặt 2-4 buổi mỗi tuần trên sân. Tiền thuê sân, HLV & gói chăm sóc da/cơ là khoản ngân sách cố định hàng tháng.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">03 • CHÚ TRỌNG HÌNH ẢNH</span>
                <h5 className="font-extrabold text-base text-amber-950">Giữ Làn Da & Vóc Dáng</h5>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  Tránh sạm nắng, phục hồi cơ tức thì sau trận đấu để giữ diện mạo tự tin khi gặp đối tác & xuất hiện trên mạng xã hội.
                </p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 3,
        badge: 'GIẢI PHÁP TRIỂN KHAI • 3-IN-1 ACTIVATION',
        title: 'Hệ Sinh Thái Activation Giải Đấu Mang Tên Thương Hiệu Của Bạn',
        subtitle: 'Trọn gói từ khâu tổ chức giải đến không gian trải nghiệm chăm sóc VIP tại sân.',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-xs">
                <span className="w-7 h-7 rounded-full bg-amber-800 text-amber-200 flex items-center justify-center text-xs font-bold">1</span>
                <h5 className="font-bold text-sm text-zinc-900">Tổ Chức Branded Cup Trọn Gói</h5>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Thiết kế concept giải đấu mang tên thương hiệu (Ngân hàng, Spa, Enterprise), cổng đăng ký VĐV, trọng tài, bốc thăm & media đưa tin.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-xs">
                <span className="w-7 h-7 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center text-xs font-bold">2</span>
                <h5 className="font-bold text-sm text-zinc-900">Dựng VIP Recovery Spa Lounge</h5>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Quầy chăm sóc trực tiếp tại sân: Trị liệu căng cơ tay/khớp gối cho VĐV, điện di HA nhả nắng tức thì & bấm huyệt thư giãn.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-2 shadow-xs">
                <span className="w-7 h-7 rounded-full bg-blue-800 text-blue-200 flex items-center justify-center text-xs font-bold">3</span>
                <h5 className="font-bold text-sm text-zinc-900">Thu Thập Data & Chuyển Đổi VIP</h5>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Tặng Thẻ Đặc Quyền Spa/Service VIP đồng thương hiệu, thu thập thông tin khách hàng tiềm năng tự nhiên 100%.
                </p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 4,
        badge: 'MÔ HÌNH HỢP TÁC • GÓI DỰ TOÁN B2B',
        title: 'Các Gói Hợp Tác Tổ Chức Giải Đấu & Brand Activation',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-3 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">GÓI SILVER ACTIVATION</span>
                <h5 className="font-extrabold text-base text-zinc-900">Tài Trợ Booth Phục Hồi</h5>
                <p className="text-xs text-zinc-600">Đặt quầy Recovery Booth tại các giải đấu có sẵn của CLB đối tác. Phục hồi căng cơ & phát voucher cho 100-200 VĐV.</p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-950 text-white space-y-3 shadow-md border border-amber-600 relative">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-950 bg-amber-400 px-2.5 py-1 rounded-full font-bold">GÓI GOLD BRANDED CUP ★</span>
                <h5 className="font-extrabold text-base text-amber-300">Giải Đấu Branded Trọn Gói</h5>
                <p className="text-xs text-amber-100/90">Tổ chức giải đấu mang tên thương hiệu đối tác (32-64 VĐV), truyền thông báo chí & trọn gói VIP Recovery Lounge.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-3 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2.5 py-1 rounded-full">GÓI DIAMOND ENTERPRISE</span>
                <h5 className="font-extrabold text-base text-zinc-900">Chuỗi Giải Đấu Liên Tỉnh</h5>
                <p className="text-xs text-zinc-600">Đồng hành tổ chức chuỗi giải đấu cho Tập đoàn / Ngân hàng trên toàn quốc, phát hành Thẻ VIP Member dùng trọn đời.</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => onRegisterPartner('sports')}
                className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold text-sm shadow-lg transition-all"
              >
                Nhận Proposal Tổ Chức Giải & Activation →
              </button>
            </div>
          </div>
        )
      }
    ],

    // -------------------------------------------------------------
    // CATEGORY 3: SPA OUTSOURCING & SOP TRANSFER (B2B SPA ĐỐI TÁC)
    // -------------------------------------------------------------
    spa_outsourcing: [
      {
        id: 1,
        badge: 'B2B SPA SOLUTIONS • CHUYỂN GIAO SỔ TAY SOP',
        title: 'Giải Pháp Chuyển Giao SOP & Cung Ứng Nhân Sự Dự Phòng',
        subtitle: 'Giải quyết bài toán quá tải KTV ngày lễ/cuối tuần & bổ sung bài liệu trình mới cho Spa đối tác.',
        content: (
          <div className="space-y-6">
            <div className="p-6 bg-zinc-900 text-white rounded-3xl space-y-4 border border-zinc-700 shadow-xl">
              <span className="text-[10px] tracking-widest font-bold uppercase text-amber-300 bg-zinc-800 px-3 py-1 rounded-full inline-block">
                Spa-as-a-Service (B2B Outsourcing)
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold leading-snug">
                "Spa của bạn quá tải KTV vào cuối tuần nhưng vắng khách vào ngày thường?"
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Việc duy trì quỹ lương KTV cố định quá lớn gây lãng phí chi phí vận hành. Chúng tôi cung cấp giải pháp điều động KTV chuẩn tay nghề theo ca dự phòng & chuyển giao trọn gói quy trình bài liệu trình hot trend.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200 text-center space-y-1">
                <span className="text-2xl font-black text-zinc-900 block">-40%</span>
                <span className="text-[11px] text-zinc-700 font-bold">Chi Phí Cố Định Nhân Sự</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <span className="text-2xl font-black text-emerald-900 block">100%</span>
                <span className="text-[11px] text-emerald-800 font-bold">KTV Đạt Chuẩn Y Khoa</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                <span className="text-2xl font-black text-amber-900 block">SOP 24H</span>
                <span className="text-[11px] text-amber-800 font-bold">Chuyển Giao Quy Trình Nhanh</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 2,
        badge: 'SO SÁNH MÔ HÌNH • TỐI ƯU CHI PHÍ',
        title: 'Bảng So Sánh Chi Phí Vận Hành KTV Tự Tuyển vs Thuê Ngoài B2B',
        content: (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-white">
                  <tr>
                    <th className="p-3">Tiêu chí so sánh</th>
                    <th className="p-3 text-red-300">Tự Tuyển & Đào Tạo KTV</th>
                    <th className="p-3 text-emerald-300 font-bold">Hợp Tác B2B Spa Master</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  <tr>
                    <td className="p-3 font-bold">Chi phí lương cố định</td>
                    <td className="p-3 text-zinc-600">8 - 15 triệu/tháng (Kể cả ngày vắng)</td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/50">0 VNĐ cố định (Trả theo ca thực tế)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">Rủi ro KTV nhảy việc</td>
                    <td className="p-3 text-zinc-600">Rất cao (Tốn công đào tạo lại)</td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/50">0% rủi ro (Luôn sẵn KTV dự phòng)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">Cập nhật bài mới</td>
                    <td className="p-3 text-zinc-600">Tốn thêm chi phí học chuyển giao</td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/50">Miễn phí bộ SOP & Công thức mới</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">Chuẩn hóa chất lượng</td>
                    <td className="p-3 text-zinc-600">Không đồng đều giữa các KTV</td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/50">Chuẩn 100% y khoa & Thái độ 5 sao</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      },
      {
        id: 3,
        badge: 'HỢP TÁC CHUYỂN GIAO • BÁN SỈ LIỆU TRÌNH',
        title: 'Bán Sỉ Bài Liệu Trình & Hồ Sơ Năng Lực Cung Ứng KTV',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-2">
                <h5 className="font-bold text-sm text-zinc-900">1. Đóng Gói Bộ Bài Trị Liệu HOT Trend</h5>
                <p className="text-xs text-zinc-600">Chuyển giao công thức tinh dầu organic, tài liệu đào tạo step-by-step & clip hướng dẫn chuẩn xác cho nhân sự của bạn.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-2">
                <h5 className="font-bold text-sm text-zinc-900">2. Cung Ứng KTV Dự Phòng Theo Giờ</h5>
                <p className="text-xs text-zinc-600">Điều động KTV tay nghề cao tới hỗ trợ Spa đối tác trong các khung giờ peak hour hoặc sự kiện đông khách.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-2">
                <h5 className="font-bold text-sm text-zinc-900">3. Cấp Chứng Chỉ SOP & Kiểm Định</h5>
                <p className="text-xs text-zinc-600">Cấp chứng nhận tay nghề đạt chuẩn cho nhân viên Spa sau khi hoàn thành khóa đào tạo chuyển giao.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-2">
                <h5 className="font-bold text-sm text-zinc-900">4. Hỗ Trợ Đơn Hàng Từ Hệ Thống</h5>
                <p className="text-xs text-zinc-600">Kết nối điều phối lượt khách từ kênh tổng của Spa Master sang cơ sở đối tác lân cận.</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => onRegisterPartner('spa_outsourcing')}
                className="px-8 py-3.5 rounded-full bg-zinc-900 hover:bg-black text-amber-300 font-extrabold text-sm shadow-lg transition-all"
              >
                Nhận Hồ Sơ Năng Lực & Bảng Giá Sỉ →
              </button>
            </div>
          </div>
        )
      }
    ]
  };

  const currentSlides = slidesData[activeCategory];
  const activeSlide = currentSlides[currentSlideIndex] || currentSlides[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-[#EAE4DA] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* --- HEADER BAR (CONTROLS & SLIDE COUNTER) --- */}
        <div className="px-4 py-3 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800 shrink-0">
          {/* Slide Deck Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => {
                setActiveCategory('hotel');
                setCurrentSlideIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center space-x-1 shrink-0 ${
                activeCategory === 'hotel'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Hợp Tác Lưu Trú</span>
            </button>

            <button
              onClick={() => {
                setActiveCategory('sports');
                setCurrentSlideIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center space-x-1 shrink-0 ${
                activeCategory === 'sports'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Thương Hiệu Thể Thao</span>
            </button>

            <button
              onClick={() => {
                setActiveCategory('spa_outsourcing');
                setCurrentSlideIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center space-x-1 shrink-0 ${
                activeCategory === 'spa_outsourcing'
                  ? 'bg-zinc-100 text-zinc-900 shadow-xs'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Chuyển Giao & KTV Spa</span>
            </button>
          </div>

          {/* Controls & Close */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[11px] font-bold text-amber-400 bg-zinc-800 px-2.5 py-1 rounded-full hidden sm:inline-block">
              Slide {currentSlideIndex + 1} / {currentSlides.length}
            </span>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Tạm dừng" : "Tự động trình chiếu"}
              className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- MAIN SLIDE STAGE --- */}
        <div className="p-5 sm:p-8 flex-1 overflow-y-auto space-y-6 bg-[#FAF8F5]">
          
          {/* Slide Header */}
          <div className="space-y-2 border-b border-[#EAE4DA] pb-4">
            <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-[#8C5E32] block">
              {activeSlide.badge}
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-[#181716] leading-snug">
              {activeSlide.title}
            </h3>
            {activeSlide.subtitle && (
              <p className="text-xs sm:text-sm text-[#736E69] font-medium">
                {activeSlide.subtitle}
              </p>
            )}
          </div>

          {/* Dynamic Slide Body */}
          <div className="animate-in fade-in duration-300">
            {activeSlide.content}
          </div>

        </div>

        {/* --- FOOTER DECK CONTROLS & CALL TO ACTION --- */}
        <div className="px-5 py-3.5 bg-white border-t border-[#EAE4DA] flex items-center justify-between shrink-0">
          {/* Navigation Arrows */}
          <div className="flex items-center space-x-2">
            <button
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trang Trước</span>
            </button>

            <button
              disabled={currentSlideIndex === currentSlides.length - 1}
              onClick={() => setCurrentSlideIndex((prev) => Math.min(currentSlides.length - 1, prev + 1))}
              className="px-3 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center space-x-1"
            >
              <span className="hidden sm:inline">Trang Tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Progress Dots */}
          <div className="hidden md:flex items-center space-x-1.5">
            {currentSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex ? 'w-6 bg-amber-800' : 'w-2 bg-zinc-300'
                }`}
              />
            ))}
          </div>

          {/* Direct CTA button */}
          <button
            onClick={() => onRegisterPartner(activeCategory)}
            className="px-5 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Đăng Ký Đề Án Hợp Tác</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export interface B2BCardConfig {
  id: 'hotel' | 'sports' | 'spa_outsourcing';
  badge: string;
  title: string;
  description: string;
  benefitTitle: string;
  benefitText: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  commissionRate?: string;
}

export interface B2BSlideSimple {
  id: number;
  badge: string;
  title: string;
  subtitle?: string;
  bannerBadge?: string;
  bannerHeading?: string;
  bannerDescription?: string;
  stat1Num?: string;
  stat1Label?: string;
  stat2Num?: string;
  stat2Label?: string;
  stat3Num?: string;
  stat3Label?: string;
  stat4Num?: string;
  stat4Label?: string;
  features?: { title: string; desc: string; highlight?: string }[];
  services?: { name: string; subtitle?: string; desc: string; durationOrBadge?: string }[];
  packages?: { title: string; subtitle?: string; desc: string; highlightBadge?: string }[];
  ctaLabel?: string;
}

export interface B2BFullConfig {
  id: string; // 'b2b_config' for Firestore
  sectionTitle: string;
  sectionSubtitle: string;
  cards: {
    hotel: B2BCardConfig;
    sports: B2BCardConfig;
    spa_outsourcing: B2BCardConfig;
  };
  slides: {
    hotel: B2BSlideSimple[];
    sports: B2BSlideSimple[];
    spa_outsourcing: B2BSlideSimple[];
  };
  updatedAt?: string;
}

export const defaultB2BConfig: B2BFullConfig = {
  id: 'b2b_config',
  sectionTitle: 'Giới Thiệu & Hợp Tác Doanh Nghiệp',
  sectionSubtitle: 'Giải pháp đóng gói bài liệu trình Spa, phục hồi thể thao & điều động nhân sự chuyển giao cho các đối tác',
  cards: {
    hotel: {
      id: 'hotel',
      badge: 'DỊCH VỤ LƯU TRÚ & HOTEL',
      title: 'In–Room Spa Rituals Cho Khách Du Lịch',
      description: 'Kết hợp với Khách sạn, Homestay, Resort mang đến trải nghiệm Spa thư giãn tận phòng cho du khách. Đóng gói bài trị liệu chuẩn 5 sao, cung cấp QR menu đặt lịch trực tiếp & chia sẻ hoa hồng tự động.',
      benefitTitle: '✓ Quyền lợi đối tác:',
      benefitText: 'Tăng 15 - 25% doanh thu phụ trợ / phòng mà không tốn chi phí vận hành hay tuyển dụng nhân sự.',
      primaryButtonLabel: 'Xem Slide Đề Án & Phân Tích →',
      secondaryButtonLabel: 'Đăng Ký Hợp Tác Lưu Trú',
      commissionRate: '15% - 25%'
    },
    sports: {
      id: 'sports',
      badge: 'SPORTS BEAUTY & SKIN RECOVERY',
      title: 'Chăm Sóc Da & Phục Hồi Thể Lực Cho CLB Thể Thao',
      description: 'Hợp tác với các CLB Pickleball, Golf, Tennis, Pilates & Gym cao cấp. Cung cấp gói dịch vụ Nhả Nắng Cấp Tốc (After-Sun Cryo), Giãn Cơ Thể Thao (Deep-Tissue) & Pop-up Skin Lounge tại sân giúp tiếp cận tệp khách hàng VIP.',
      benefitTitle: '✓ Quyền lợi Chủ Sân & CLB:',
      benefitText: 'Nhận 20 - 30% hoa hồng trên mỗi lượt khách, đồng thương hiệu Thẻ Đặc Quyền Spa và nâng cấp tiện ích chăm sóc sắc đẹp cho Hội viên VIP.',
      primaryButtonLabel: 'Xem Slide Đề Án & Gói Hợp Tác →',
      secondaryButtonLabel: 'Đăng Ký Hợp Tác CLB Thể Thao',
      commissionRate: '20% - 30% Hoa Hồng'
    },
    spa_outsourcing: {
      id: 'spa_outsourcing',
      badge: 'B2B SPA OUTSOURCING',
      title: 'Chuyển Giao SOP & Cung Ứng Nhân Sự',
      description: 'Bán sỉ quy trình bài liệu trình đóng gói sẵn & chuyển giao KTV bài bản cho các Spa đối tác khi thiếu người vào giờ cao điểm hoặc muốn mở rộng thêm menu dịch vụ chuyên sâu.',
      benefitTitle: '✓ Giải pháp mở rộng:',
      benefitText: 'Tối ưu hóa nguồn lực nhân sự dư thừa, gia tăng dòng tiền từ mảng đào tạo & nhượng quyền SOP.',
      primaryButtonLabel: 'Xem Slide Đề Án & Phân Tích →',
      secondaryButtonLabel: 'Nhận Hồ Sơ Năng Lực',
      commissionRate: 'Giá Sỉ / B2B'
    }
  },
  slides: {
    hotel: [
      {
        id: 1,
        badge: 'ĐỀ ÁN HỢP TÁC • DỊCH VỤ LƯU TRÚ',
        title: 'Đột phá Doanh Thu Phụ Trợ (Ancillary Revenue) Cho Khách Sạn & Homestay',
        subtitle: 'Mang trải nghiệm Spa chuẩn 5 sao tận phòng du khách mà không tốn 1 VNĐ vốn đầu tư hay chi phí nhân sự.',
        bannerBadge: 'Mô Hình In-Room Spa Rituals 2026',
        bannerHeading: '"Khách sạn của bạn không cần diện tích mặt bằng Spa — Chúng tôi đóng gói & vận hành trọn gói."',
        bannerDescription: 'Du khách sau chuyến bay dài hoặc di chuyển liên tục luôn có nhu cầu thả lỏng cơ thể. Thay vì để họ tìm kiếm các cơ sở bên ngoài, QR Menu tại phòng giúp họ đặt lịch Spa phục vụ trực tiếp tại phòng nghỉ chỉ sau 30 phút.',
        stat1Num: '+25%',
        stat1Label: 'Lợi Nhuận / Phòng',
        stat2Num: '0 VNĐ',
        stat2Label: 'Chi Phí ĐT Cố Định',
        stat3Num: '100%',
        stat3Label: 'QR Đặt Lịch Tự Động',
        stat4Num: '25 - 35%',
        stat4Label: 'Chiết Khấu Đơn Hàng'
      },
      {
        id: 2,
        badge: 'THỊ TRƯỜNG • HÀNH VI DU KHÁCH',
        title: 'Nhu Cầu Thư Giãn Tận Phòng Tăng Trưởng 48% Năm 2026',
        subtitle: 'Dữ liệu hành vi nghỉ dưỡng của khách du lịch trong & ngoài nước.',
        features: [
          { title: 'Mệt Mỏi Sau Di Chuyển', desc: 'Khách du lịch đường dài thường bị đau mỏi cổ vai gáy, lệch múi giờ và khô da do điều hòa máy bay.', highlight: '82%' },
          { title: 'Ưa Thích Thư Giãn Riêng Tư', desc: 'Khách quốc tế & gia đình thích không gian bảo mật tại phòng hơn là di chuyển ra cơ sở Spa xa lạ.', highlight: '91%' },
          { title: 'Tăng Điểm Review OTA', desc: 'Khách sạn có dịch vụ Spa tận phòng luôn được đánh giá xuất sắc trên Agoda, Booking & Airbnb.', highlight: '4.9★' }
        ]
      },
      {
        id: 3,
        badge: 'VẬN HÀNH • QUY TRÌNH 4 BƯỚC',
        title: 'Quy Trình Triển Khai Không Tốn Chi Phí Cho Khách Sạn',
        features: [
          { title: '1. Đặt Standee / QR Menu Tại Phòng', desc: 'Cung cấp bộ QR Code thiết kế cao cấp đồng thương hiệu đặt sẵn tại bàn trang điểm / đầu giường.' },
          { title: '2. Khách Quét QR & Chọn Gói Trị Liệu', desc: 'Hệ thống đặt lịch tự động chọn khung giờ, thanh toán trực tuyến hoặc tính vào hóa đơn phòng.' },
          { title: '3. KTV Spa Tới Phục Vụ Đúng Giờ', desc: 'Đội ngũ KTV đeo thẻ tên, trang phục chuẩn y khoa mang bộ Kit vô trùng 100% đến phục vụ.' },
          { title: '4. Đối Tác Nhận Hoa Hồng Tự Động', desc: 'Hệ thống ghi nhận đơn và đối soát hoa hồng 25-35% chuyển khoản định kỳ mỗi tuần.' }
        ]
      },
      {
        id: 4,
        badge: 'MENU DỊCH VỤ • ĐÓNG GÓI SẴN',
        title: 'Gói Bài Liệu Trình Thiết Kế Riêng Cho Khách Du Lịch',
        services: [
          { name: 'Jet-Lag Relief Massage', durationOrBadge: '60-90 Phút', desc: 'Trị liệu ấn huyệt cổ vai gáy & lòng bàn chân kết hợp tinh dầu thảo mộc giúp sâu giấc.' },
          { name: 'After-Sun Skin Hydration', durationOrBadge: '45 Phút', desc: 'Cấp nước nhả nắng cấp tốc bằng nha đam đông khô & điện di HA tinh khiết.' },
          { name: 'Couples Luxury In-Room Combo', durationOrBadge: '120 Phút', desc: 'Gói chăm sóc mặt & toàn thân đôi dành cho cặp đôi du lịch trăng mật hoặc nghỉ dưỡng.' },
          { name: 'Foot Reflexology & Herbal Soak', durationOrBadge: '45 Phút', desc: 'Ngâm chân thảo dược núi cao & massage giải mỏi chân sau ngày tham quan đi bộ dài.' }
        ]
      },
      {
        id: 5,
        badge: 'CHÍNH SÁCH • CAM KẾT CHẤT LƯỢNG',
        title: 'Tiêu Chuẩn Bảo Mật & An Toàn Tuyệt Đối Cho Khách Sạn',
        ctaLabel: 'Ký Kết Hợp Tác Dịch Vụ Lưu Trú Ngay →'
      }
    ],
    sports: [
      {
        id: 1,
        badge: 'ĐỐI TÁC SẮC ĐẸP • SPORTS BEAUTY & RECOVERY',
        title: 'Tệp Khách Hàng Thể Thao Đang Cần Giải Pháp Cứu Hộ Làn Da & Cơ Bắp!',
        subtitle: 'Cơ hội vàng cho Spa liên kết với các CLB Pickleball, Sân Golf, Tennis & Pilates cao cấp.',
        bannerBadge: 'CƠ HỘI BÙNG NỔ THỂ THAO & LÀM ĐẸP',
        bannerHeading: '"Khách chơi thể thao sẵn sàng chi trả lớn — nhưng họ sợ sạm da & đau mỏi cơ sau tập."',
        bannerDescription: 'Người chơi ngoài trời đối mặt với tia UV gay gắt gây sạm nám, cháy nắng và căng cơ vai gáy, khuỷu tay. Spa của bạn đóng vai trò là Đối tác Chăm sóc Sắc đẹp & Phục hồi độc quyền cho Hội viên CLB thể thao.',
        stat1Num: '+689%',
        stat1Label: 'Nhu cầu Nhả nắng & Giãn cơ',
        stat2Num: '1,4 Triệu',
        stat2Label: 'Người chơi Pickleball & Golf',
        stat3Num: '85% HNWI',
        stat3Label: 'Thu nhập cao & Sẵn sàng chi',
        stat4Num: '20 - 30%',
        stat4Label: 'Hoa hồng chia sẻ cho Chủ Sân'
      },
      {
        id: 2,
        badge: 'NỖI ĐAU KHÁCH HÀNG • PAIN POINTS & INSIGHTS',
        title: '3 Nhu Cầu Làm Đẹp & Phục Hồi Cấp Thiết Của Người Chơi Thể Thao',
        subtitle: 'Hiểu rõ tâm lý để đóng gói đúng bài liệu trình mà khách hàng tìm kiếm mỗi tuần.',
        features: [
          { title: '01 • CHÁY NẮNG & SẠM NÁM TIA UV', desc: 'Sau 2 tiếng chơi ngoài trời, da bị đỏ rát, mất nước nghiêm trọng và tăng sắc tố Melanin. Cần điện di lạnh làm dịu và phục hồi tức thì.' },
          { title: '02 • CĂNG CƠ & ĐAU KHỚP TAY/GỐI', desc: 'Vận động cường độ cao gây căng cơ vai gáy, khuỷu tay vợt Pickleball/Tennis, đau mỏi thắt lưng sau các cú Swing Golf.' },
          { title: '03 • GIỮ GÌN DIỆN MẠO TỰ TIN', desc: 'Khách thể thao cao cấp là chủ DN, quản lý... luôn muốn làn da căng bóng, khỏe khoắn khi gặp gỡ đối tác và xuất hiện trên MXH.' }
        ]
      },
      {
        id: 3,
        badge: 'MENU DỊCH VỤ • SPECIALIZED SPORTS MENU',
        title: 'Hệ Sinh Thái Gói Liệu Trình Chuyên Biệt Cho VĐV & Người Tập',
        subtitle: 'Đóng gói bài bản, hiệu quả thấy ngay sau 45-60 phút trải nghiệm.',
        services: [
          { name: 'After-Sun Cryo Calming (Nhả Nắng Cấp Tốc)', durationOrBadge: '45 Phút', desc: 'Điện di lạnh tế bào gốc Aloe & Hyaluronic Acid, hạ nhiệt tầng sâu, ức chế sạm nám và làm dịu cháy nắng chỉ sau 1 buổi.' },
          { name: 'Deep-Tissue Sports Muscle Recovery (Giãn Cơ Chuyên Sâu)', durationOrBadge: '60-75 Phút', desc: 'Kỹ thuật ấn huyệt & tinh dầu thảo mộc giải phóng axit lactic cho cơ bắp, giải tỏa căng cứng khuỷu tay & khớp gối.' },
          { name: 'Golf & Tennis Post-Game Detox (Thải Độc Toàn Thân)', durationOrBadge: '90 Phút', desc: 'Xông đá muối khoáng, ngâm chân thảo dược & massage bấm huyệt giải tỏa stress, hồi phục 100% thể lực.' },
          { name: 'Active Glow Sun-Defense Ritual (Bảo Vệ & Căng Bóng)', durationOrBadge: '60 Phút', desc: 'Liệu trình cấp ẩm đa tầng và tăng cường hàng rào bảo vệ da trước các trận đấu ngoài trời.' }
        ]
      },
      {
        id: 4,
        badge: 'MÔ HÌNH HỢP TÁC • 3 HƯỚNG TRIỂN KHAI THỰC CHIẾN',
        title: '3 Mô Hình Hợp Tác Giữa Spa & Các Sân Thể Thao / Phòng Tập',
        packages: [
          { title: 'OPTION 1: LIÊN KẾT ĐỒNG THƯƠNG HIỆU', subtitle: 'Thẻ Đặc Quyền & Voucher', desc: 'Đặt Standee / Gift Card tại quầy lễ tân CLB. Hội viên nhận ưu đãi 20%, Chủ sân nhận 25% hoa hồng trên mỗi lượt khách.', highlightBadge: 'PHỔ BIẾN NHẤT' },
          { title: 'OPTION 2: POP-UP SKIN LOUNGE', subtitle: 'Góc Trải Nghiệm Tại Sân', desc: 'Dựng booth trải nghiệm tại Clubhouse cuối tuần: Soi da, bôi kem chống nắng bảo vệ & massage nhanh 10 phút để thu hút khách về Spa.' },
          { title: 'OPTION 3: TÀI TRỢ SẮC ĐẸP GIẢI ĐẤU', subtitle: 'Nhà Tài Trợ Sắc Đẹp Độc Quyền', desc: 'Tài trợ voucher liệu trình cao cấp cho các giải đấu của CLB đối tác, tăng nhận diện thương hiệu với toàn bộ người tham gia.' }
        ],
        ctaLabel: 'Đăng Ký Nhận Proposal Hợp Tác CLB Thể Thao →'
      }
    ],
    spa_outsourcing: [
      {
        id: 1,
        badge: 'B2B SPA SOLUTIONS • CHUYỂN GIAO SỔ TAY SOP',
        title: 'Giải Pháp Chuyển Giao SOP & Cung Ứng Nhân Sự Dự Phòng',
        subtitle: 'Giải quyết bài toán quá tải KTV ngày lễ/cuối tuần & bổ sung bài liệu trình mới cho Spa đối tác.',
        bannerBadge: 'Spa-as-a-Service (B2B Outsourcing)',
        bannerHeading: '"Spa của bạn quá tải KTV vào cuối tuần nhưng vắng khách vào ngày thường?"',
        bannerDescription: 'Việc duy trì quỹ lương KTV cố định quá lớn gây lãng phí chi phí vận hành. Chúng tôi cung cấp giải pháp điều động KTV chuẩn tay nghề theo ca dự phòng & chuyển giao trọn gói quy trình bài liệu trình hot trend.',
        stat1Num: '-40%',
        stat1Label: 'Chi Phí Cố Định Nhân Sự',
        stat2Num: '100%',
        stat2Label: 'KTV Đạt Chuẩn Y Khoa',
        stat3Num: 'SOP 24H',
        stat3Label: 'Chuyển Giao Quy Trình Nhanh'
      },
      {
        id: 2,
        badge: 'SO SÁNH MÔ HÌNH • TỐI ƯU CHI PHÍ',
        title: 'Bảng So Sánh Chi Phí Vận Hành KTV Tự Tuyển vs Thuê Ngoài B2B',
        subtitle: 'Tối ưu hóa lợi nhuận cho chủ cơ sở Spa.'
      },
      {
        id: 3,
        badge: 'HỢP TÁC CHUYỂN GIAO • BÁN SỈ LIỆU TRÌNH',
        title: 'Bán Sỉ Bài Liệu Trình & Hồ Sơ Năng Lực Cung Ứng KTV',
        features: [
          { title: '1. Đóng Gói Bộ Bài Trị Liệu HOT Trend', desc: 'Chuyển giao công thức tinh dầu organic, tài liệu đào tạo step-by-step & clip hướng dẫn chuẩn xác cho nhân sự của bạn.' },
          { title: '2. Cung Ứng KTV Dự Phòng Theo Giờ', desc: 'Điều động KTV tay nghề cao tới hỗ trợ Spa đối tác trong các khung giờ peak hour hoặc sự kiện đông khách.' },
          { title: '3. Cấp Chứng Chỉ SOP & Kiểm Định', desc: 'Cấp chứng nhận tay nghề đạt chuẩn cho nhân viên Spa sau khi hoàn thành khóa đào tạo chuyển giao.' },
          { title: '4. Hỗ Trợ Đơn Hàng Từ Hệ Thống', desc: 'Kết nối điều phối lượt khách từ kênh tổng của Spa Master sang cơ sở đối tác lân cận.' }
        ],
        ctaLabel: 'Nhận Hồ Sơ Năng Lực & Bảng Giá Sỉ →'
      }
    ]
  }
};

const B2B_STORAGE_KEY = 'spa_b2b_config';

export function getStoredB2BConfig(): B2BFullConfig {
  if (typeof window === 'undefined') return defaultB2BConfig;
  try {
    const raw = localStorage.getItem(B2B_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      
      // If legacy event organizer title is present in localStorage, upgrade to new spa beauty recovery strategy
      const sportsCard = (parsed.cards?.sports?.title && parsed.cards.sports.title.includes('Giải Đấu'))
        ? defaultB2BConfig.cards.sports
        : (parsed.cards?.sports || defaultB2BConfig.cards.sports);

      const sportsSlides = (parsed.slides?.sports?.[0]?.title && parsed.slides.sports[0].title.includes('Sân Thể Thao!'))
        ? defaultB2BConfig.slides.sports
        : (parsed.slides?.sports || defaultB2BConfig.slides.sports);

      return {
        ...defaultB2BConfig,
        ...parsed,
        cards: {
          ...defaultB2BConfig.cards,
          ...parsed.cards,
          sports: sportsCard
        },
        slides: {
          ...defaultB2BConfig.slides,
          ...parsed.slides,
          sports: sportsSlides
        }
      };
    }
  } catch (e) {
    console.warn('Failed to parse stored B2B config:', e);
  }
  return defaultB2BConfig;
}

export function saveStoredB2BConfig(config: B2BFullConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(B2B_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving B2B config:', e);
  }
}

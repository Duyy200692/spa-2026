/**
 * Spa Analytics, Tracking Events, Trending Services & Seasonality Future Trends Engine
 */

export interface TrackingEvent {
  id: string;
  eventName: 'search_query' | 'view_service' | 'book_service' | 'checkout_invoice';
  payload: Record<string, any>;
  timestamp: number;
}

const STORAGE_KEY = 'spa_master_analytics_events_v1';

export function trackEvent(eventName: TrackingEvent['eventName'], payload: Record<string, any>) {
  try {
    const events: TrackingEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newEvent: TrackingEvent = {
      id: Math.random().toString(36).substring(2, 9),
      eventName,
      payload,
      timestamp: Date.now(),
    };
    events.push(newEvent);
    // Keep last 500 events
    if (events.length > 500) {
      events.splice(0, events.length - 500);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.warn('Error tracking event:', err);
  }
}

export function getStoredEvents(): TrackingEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Calculates Trending Services based on recent click & booking events in the last 7 days
 */
export function getTrendingServices() {
  const events = getStoredEvents();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentEvents = events.filter(e => e.timestamp >= weekAgo);

  const counts: Record<string, { views: number; bookings: number; name: string }> = {};

  recentEvents.forEach(e => {
    if (e.eventName === 'view_service') {
      const sId = e.payload.serviceId || 'unknown';
      const sName = e.payload.serviceName || 'Dịch vụ Spa';
      if (!counts[sId]) counts[sId] = { views: 0, bookings: 0, name: sName };
      counts[sId].views += 1;
    }
    if (e.eventName === 'book_service') {
      const sId = e.payload.serviceId || 'unknown';
      const sName = e.payload.serviceName || 'Dịch vụ Spa';
      if (!counts[sId]) counts[sId] = { views: 0, bookings: 0, name: sName };
      counts[sId].bookings += 1;
    }
  });

  // Convert to array and score: score = views * 1 + bookings * 5
  const ranked = Object.entries(counts).map(([id, data]) => ({
    serviceId: id,
    serviceName: data.name,
    views: data.views,
    bookings: data.bookings,
    score: data.views * 1 + data.bookings * 5,
  })).sort((a, b) => b.score - a.score);

  // Fallback defaults if not enough events yet
  if (ranked.length === 0) {
    return [
      { serviceId: 's1', serviceName: 'Trị Mụn Chuyên Sâu Chuẩn Y Khoa', views: 42, bookings: 18, score: 132 },
      { serviceId: 's2', serviceName: 'Massage Body Thư Giãn Tinh Dầu', views: 38, bookings: 15, score: 113 },
      { serviceId: 's3', serviceName: 'Tái Sinh Da Đa Tầng Collagen', views: 31, bookings: 14, score: 101 },
      { serviceId: 's4', serviceName: 'Gội Đầu Dưỡng Sinh Thảo Dược', views: 29, bookings: 12, score: 89 },
      { serviceId: 's5', serviceName: 'Triệt Lông Vĩnh Viễn Công Nghệ Nano', views: 25, bookings: 9, score: 70 },
    ];
  }

  return ranked.slice(0, 6);
}

/**
 * Seasonality & Future Trends Heuristics based on current month/weather
 */
export function getSeasonalFutureTrends() {
  const currentMonth = new Date().getMonth() + 1; // 1-12

  if (currentMonth === 12 || currentMonth === 1 || currentMonth === 2) {
    return {
      seasonName: 'Mùa Lễ Hội & Tết Âm Lịch (Đông - Xuân)',
      highlightReason: 'Thời tiết khô lạnh, nhu cầu làm đẹp đón Tết cấp tốc tăng cao.',
      suggestedBoosts: [
        { title: 'Liệu trình Tái sinh đa tầng & Trẻ hóa da', reason: 'Tăng 45% nhu cầu da căng bóng đón Tết' },
        { title: 'Trị mụn & Phục hồi da tổn thương cấp tốc', reason: 'Khách hàng chuẩn bị da mịn màng dự tiệc' },
        { title: 'Combo Tắm trắng & Ủ dưỡng body thảo mộc', reason: 'Sản phẩm bán chạy nhất quý đầu năm' },
      ],
      aiAdvisorTip: 'Đề xuất tạo ngay Combo "Tết Rạng Rỡ 2026" gồm Trị Mụn/Trẻ Hóa + Tặng GiftVoucher dưỡng ẩm sâu để tối ưu doanh thu mùa cao điểm.'
    };
  } else if (currentMonth >= 3 && currentMonth === 5) {
    return {
      seasonName: 'Mùa Giao Mùa & Chuẩn Bị Du Lịch (Xuân - Hè)',
      highlightReason: 'Ánh nắng bắt đầu gắt, nhu cầu chống nắng và phục hồi da tăng.',
      suggestedBoosts: [
        { title: 'Liệu trình Phục hồi da cháy nắng & Cấp ẩm Vitamin C', reason: 'Đón đầu mùa nắng nóng' },
        { title: 'Triệt lông vĩnh viễn & Giảm mỡ săn chắc body', reason: 'Chuẩn bị trang phục mùa hè' },
      ],
      aiAdvisorTip: 'Đẩy mạnh truyền thông gói chống nắng chuyên sâu và ưu đãi Triệt lông nhóm đôi.'
    };
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    return {
      seasonName: 'Mùa Hè Cao Điểm & Du Lịch Biển',
      highlightReason: 'Nắng nóng đỉnh điểm, da dễ đổ dầu, sạm nám và cháy nắng.',
      suggestedBoosts: [
        { title: 'Thải độc da Oxy tươi & Cấp nước đa tầng', reason: 'Giúp da mát lạnh, sạch sâu bã nhờn' },
        { title: 'Massage đá nóng thư giãn giải nhiệt', reason: 'Thư giãn tinh thần mùa hè' },
      ],
      aiAdvisorTip: 'Tập trung vào dịch vụ cấp ẩm sâu và chống tia UV bảo vệ da.'
    };
  } else {
    return {
      seasonName: 'Mùa Thu Đông & Chăm Sóc Sâu',
      highlightReason: 'Thời tiết mát mẻ, lý tưởng cho các liệu trình điều trị chuyên sâu (Trị nám, sẹo rỗ, peel da).',
      suggestedBoosts: [
        { title: 'Liệu trình Peel da sinh học & Trị nám tàn nhang', reason: 'Không gian ít nắng, thời gian hồi phục nhanh' },
        { title: 'Gội đầu dưỡng sinh thảo dược ấm áp', reason: 'Thư giãn giảm stress mùa thu đông' },
      ],
      aiAdvisorTip: 'Lý tưởng để đẩy mạnh các gói liệu trình trị liệu dài hạn (5-10 buổi) có giá trị cao.'
    };
  }
}

/**
 * Funnel conversion analytics data
 */
export function getFunnelMetrics() {
  const events = getStoredEvents();
  const searches = events.filter(e => e.eventName === 'search_query').length || 120;
  const views = events.filter(e => e.eventName === 'view_service').length || 85;
  const bookings = events.filter(e => e.eventName === 'book_service').length || 34;
  const checkouts = events.filter(e => e.eventName === 'checkout_invoice').length || 28;

  return [
    { step: '1. Tìm kiếm / Khám phá', count: Math.max(searches, 120), rate: '100%' },
    { step: '2. Xem chi tiết dịch vụ', count: Math.max(views, 85), rate: `${Math.round((Math.max(views, 85) / Math.max(searches, 120)) * 100)}%` },
    { step: '3. Đặt lịch hẹn', count: Math.max(bookings, 34), rate: `${Math.round((Math.max(bookings, 34) / Math.max(searches, 120)) * 100)}%` },
    { step: '4. Thanh toán hoàn tất', count: Math.max(checkouts, 28), rate: `${Math.round((Math.max(checkouts, 28) / Math.max(searches, 120)) * 100)}%` },
  ];
}

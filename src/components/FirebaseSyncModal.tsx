import React, { useState } from 'react';
import {
  Database,
  Cloud,
  CloudCheck,
  RefreshCw,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Server,
  Layers,
  Users,
  Calendar,
  DollarSign,
  Package,
  Clock,
  ShieldCheck,
  Zap,
  Building,
  BookOpen,
  Bell,
  Lock,
  ExternalLink,
  ChevronRight,
  FolderKanban
} from 'lucide-react';
import {
  FIREBASE_PROJECT_ID,
  seedCleanDataToFirebase,
  clearAllCollectionsFromFirebase,
  syncDocToFirestore,
  COLLECTIONS
} from '../firebase';
import {
  Customer,
  Staff,
  Service,
  Appointment,
  InventoryItem,
  AttendanceRecord,
  Promotion,
  Invoice,
  Language,
  SpaProfile,
  NewsArticle
} from '../types';
import { translations } from '../i18n';

interface FirebaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  customers: Customer[];
  staff: Staff[];
  services: Service[];
  appointments: Appointment[];
  inventory: InventoryItem[];
  attendance: AttendanceRecord[];
  promotions: Promotion[];
  invoices: Invoice[];
  spaProfile?: SpaProfile;
  newsArticles?: NewsArticle[];
  isCloudConnected: boolean;
  isSyncing: boolean;
  lastSyncedTime: Date | null;
  onRefreshData?: () => void;
}

export const FirebaseSyncModal: React.FC<FirebaseSyncModalProps> = ({
  isOpen,
  onClose,
  lang,
  customers,
  staff,
  services,
  appointments,
  inventory,
  attendance,
  promotions,
  invoices,
  spaProfile,
  newsArticles = [],
  isCloudConnected,
  isSyncing,
  lastSyncedTime,
  onRefreshData,
}) => {
  const t = translations[lang];
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'collections' | 'instructions'>('overview');

  if (!isOpen) return null;

  const handleSeedCleanData = async () => {
    try {
      setLoadingAction('seed');
      setErrorMessage(null);
      setStatusMessage('Đang khởi tạo nạp dữ liệu sạch 12 danh mục lên Firestore...');
      await seedCleanDataToFirebase(msg => setStatusMessage(msg));
      setStatusMessage('Đã nạp toàn bộ 12 danh mục dữ liệu lên Firebase thành công!');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Lỗi khi nạp dữ liệu: ${err.message || err}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleClearAllData = async () => {
    if (!window.confirm('CẢNH BÁO: Thao tác này sẽ xóa toàn bộ 12 bảng dữ liệu hiện có trên Firebase Firestore để bạn bắt đầu sạch 100% từ đầu. Bạn có chắc chắn muốn tiếp tục?')) {
      return;
    }
    try {
      setLoadingAction('clear');
      setErrorMessage(null);
      setStatusMessage('Đang dọn dẹp sạch toàn bộ dữ liệu trên Firestore...');
      await clearAllCollectionsFromFirebase(msg => setStatusMessage(msg));
      setStatusMessage('Đã dọn dẹp dữ liệu sạch 100%. Cơ sở dữ liệu sẵn sàng!');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Lỗi khi dọn dẹp dữ liệu: ${err.message || err}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSyncCurrentState = async () => {
    try {
      setLoadingAction('sync_all');
      setErrorMessage(null);
      setStatusMessage('Đang tải toàn bộ dữ liệu hiện tại lên Cloud Firestore...');
      
      const promises: Promise<any>[] = [];
      customers.forEach(c => promises.push(syncDocToFirestore(COLLECTIONS.CUSTOMERS, c)));
      staff.forEach(s => promises.push(syncDocToFirestore(COLLECTIONS.STAFF, s)));
      services.forEach(srv => promises.push(syncDocToFirestore(COLLECTIONS.SERVICES, srv)));
      appointments.forEach(a => promises.push(syncDocToFirestore(COLLECTIONS.APPOINTMENTS, a)));
      inventory.forEach(i => promises.push(syncDocToFirestore(COLLECTIONS.INVENTORY, i)));
      attendance.forEach(att => promises.push(syncDocToFirestore(COLLECTIONS.ATTENDANCE, att)));
      promotions.forEach(p => promises.push(syncDocToFirestore(COLLECTIONS.PROMOTIONS, p)));
      invoices.forEach(inv => promises.push(syncDocToFirestore(COLLECTIONS.INVOICES, inv)));
      if (spaProfile) promises.push(syncDocToFirestore(COLLECTIONS.SPA_PROFILE, spaProfile));
      newsArticles.forEach(art => promises.push(syncDocToFirestore(COLLECTIONS.NEWS, art)));

      await Promise.all(promises);
      setStatusMessage('Toàn bộ 12 danh mục dữ liệu đã được đồng bộ lên Firebase!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Lỗi đồng bộ: ${err.message || err}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const collectionList = [
    {
      key: COLLECTIONS.CUSTOMERS,
      name: 'Khách Hàng (Customers)',
      path: '/customers',
      count: customers.length,
      desc: 'Hồ sơ khách, số điện thoại, hạng thành viên, lịch sử soi da & phác đồ điều trị',
      icon: Users,
    },
    {
      key: COLLECTIONS.SERVICES,
      name: 'Dịch Vụ & Costing (Services)',
      path: '/services',
      count: services.length,
      desc: 'Bảng menu dịch vụ, thời lượng, giá niêm yết, định mức mỹ phẩm & hoa hồng thợ',
      icon: Sparkles,
    },
    {
      key: COLLECTIONS.APPOINTMENTS,
      name: 'Lịch Hẹn (Appointments)',
      path: '/appointments',
      count: appointments.length,
      desc: 'Lịch khách đặt, phân công kỹ thuật viên, giường phòng & trạng thái ca',
      icon: Calendar,
    },
    {
      key: COLLECTIONS.STAFF,
      name: 'Nhân Sự & KTV (Staff)',
      path: '/staff',
      count: staff.length,
      desc: 'Kỹ thuật viên, tay nghề, thâm niên, phân quyền chức vụ & ca trực',
      icon: Layers,
    },
    {
      key: COLLECTIONS.INVENTORY,
      name: 'Kho Mỹ Phẩm (Inventory)',
      path: '/inventory',
      count: inventory.length,
      desc: 'Tồn kho mỹ phẩm, vật tư tiêu hao, đơn vị quy đổi ml/giọt & cảnh báo tồn tối thiểu',
      icon: Package,
    },
    {
      key: COLLECTIONS.INVOICES,
      name: 'Hóa Đơn & Doanh Thu (Invoices)',
      path: '/invoices',
      count: invoices.length,
      desc: 'Doanh thu, phiếu thu thanh toán VietQR / Thẻ / MoMo, tiền tip & voucher',
      icon: DollarSign,
    },
    {
      key: COLLECTIONS.PROMOTIONS,
      name: 'Khuyến Mãi & Voucher (Promotions)',
      path: '/promotions',
      count: promotions.length,
      desc: 'Chiến dịch giảm giá, mã voucher, banner hình ảnh & điều kiện áp dụng',
      icon: Zap,
    },
    {
      key: COLLECTIONS.ATTENDANCE,
      name: 'Nhật Ký Chấm Công (Attendance)',
      path: '/attendance',
      count: attendance.length,
      desc: 'Chấm công vân tay theo ca làm sáng/chiều, giờ vào ca & tính lương',
      icon: Clock,
    },
    {
      key: COLLECTIONS.SPA_PROFILE,
      name: 'Thông Tin & Logo Spa (Spa Profile)',
      path: '/spa_profile',
      count: spaProfile ? 1 : 0,
      desc: 'Tên thương hiệu, logo, slogan, địa chỉ cơ sở, hotline, story & triết lý',
      icon: Building,
    },
    {
      key: COLLECTIONS.NEWS,
      name: 'Tin Tức & Cẩm Nang (News)',
      path: '/news',
      count: newsArticles.length || 4,
      desc: 'Bài viết kiến thức chăm sóc da chuẩn y khoa, thông báo & cẩm nang làm đẹp',
      icon: BookOpen,
    },
    {
      key: COLLECTIONS.NOTIFICATIONS,
      name: 'Thông Báo Hệ Thống (Notifications)',
      path: '/notifications',
      count: 3,
      desc: 'Cảnh báo sắp hết hàng tồn kho, nhắc lịch hẹn VIP & chiến dịch ưu đãi',
      icon: Bell,
    },
    {
      key: COLLECTIONS.SYSTEM,
      name: 'Cấu Hình & Mã PIN (System Settings)',
      path: '/system_settings',
      count: 1,
      desc: 'Mã PIN bảo mật phân quyền Chủ Spa, Quản Lý, Lễ Tân & Kỹ Thuật Viên',
      icon: Lock,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50">
                  Trung Tâm Dữ Liệu & Danh Mục Firebase Firestore
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  Auto Sync Live
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Mã dự án: <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{FIREBASE_PROJECT_ID}</span> • 12 Danh mục dữ liệu lưu trữ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-5 pt-3 space-x-2 bg-zinc-50/30 dark:bg-zinc-900/20">
          {[
            { id: 'overview', label: '⚡ Thao Tác & Đồng Bộ' },
            { id: 'collections', label: `📂 12 Danh Mục Firestore (${collectionList.length})` },
            { id: 'instructions', label: '🔍 Hướng Dẫn Xem Trên Firebase Console' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-t-xl text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-zinc-900 text-zinc-950 dark:border-white dark:text-white bg-white dark:bg-[#141619]'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {/* Status Message */}
          {statusMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW & ACTIONS */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Realtime Auto Sync Banner */}
              <div className="p-4 rounded-2xl bg-zinc-950 text-zinc-50 dark:bg-[#1C1F24] border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Hệ Thống Tự Động Đồng Bộ (Auto-Sync Realtime Firestore)</span>
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {lastSyncedTime ? `Vừa đồng bộ: ${lastSyncedTime.toLocaleTimeString('vi-VN')}` : 'Đang kết nối Firestore...'}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-light">
                  Mọi thao tác thêm/sửa khách hàng, cập nhật thông tin spa, đặt lịch, tạo hóa đơn, chấm công đều <strong>tự động ghi nhận tức thì</strong> vào các danh mục tương ứng trên Firebase.
                </p>
              </div>

              {/* Action Buttons Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                  Công Cụ Khởi Tạo & Đồng Bộ 12 Danh Mục Lên Firestore
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Seed Clean Data Button */}
                  <button
                    id="btn-seed-clean-data"
                    onClick={handleSeedCleanData}
                    disabled={loadingAction !== null}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-all group disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-950 dark:text-zinc-100">
                      {loadingAction === 'seed' ? 'Đang nạp...' : '🌱 Khởi Tạo 12 Danh Mục Sạch'}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Nạp đầy đủ 12 danh mục mẫu chuẩn spa (Khách hàng, Dịch vụ, Nhân sự, Lịch hẹn, Kho, Profile Spa, Tin tức...).
                    </p>
                  </button>

                  {/* Sync All Button */}
                  <button
                    id="btn-sync-all-firebase"
                    onClick={handleSyncCurrentState}
                    disabled={loadingAction !== null}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-all group disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                      <RefreshCw className={`w-4 h-4 ${loadingAction === 'sync_all' ? 'animate-spin' : ''}`} />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-950 dark:text-zinc-100">
                      {loadingAction === 'sync_all' ? 'Đang đẩy...' : '⚡ Đẩy Dữ Liệu Lên Cloud'}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Đẩy toàn bộ các dữ liệu hiện có trên màn hình lên các collection trên Cloud Firestore ngay.
                    </p>
                  </button>

                  {/* Clear All Button */}
                  <button
                    id="btn-clear-firebase-data"
                    onClick={handleClearAllData}
                    disabled={loadingAction !== null}
                    className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 hover:bg-rose-100/60 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-left transition-all group disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                      {loadingAction === 'clear' ? 'Đang xóa...' : '🧹 Xóa Sạch & Tạo Bảng Trắng'}
                    </h4>
                    <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-1 leading-relaxed">
                      Dọn dẹp sạch toàn bộ các bảng trên Firestore để tự nhập liệu từ đầu theo thực tế.
                    </p>
                  </button>
                </div>
              </div>

              {/* Quick Summary Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                    Tổng Quan 12 Danh Mục Đang Lưu Trữ
                  </h3>
                  <button
                    onClick={() => setActiveTab('collections')}
                    className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center space-x-1"
                  >
                    <span>Xem chi tiết từng danh mục</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {collectionList.slice(0, 8).map((col) => {
                    const Icon = col.icon;
                    return (
                      <div
                        key={col.key}
                        className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                      >
                        <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                          <span className="truncate">{col.name.split('(')[0]}</span>
                          <Icon className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                        </div>
                        <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                          {col.count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 12 COLLECTIONS DETAILED LIST */}
          {activeTab === 'collections' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
                Toàn bộ dữ liệu của bạn được phân chia thành <strong>12 Collections độc lập</strong> trên Firestore. Mỗi bảng có cấu trúc schema rõ ràng, hỗ trợ truy vấn realtime và phân quyền bảo mật:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {collectionList.map((col) => {
                  const Icon = col.icon;
                  return (
                    <div
                      key={col.key}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-1.5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                              {col.name}
                            </h4>
                            <span className="font-mono text-[10px] text-zinc-400">
                              {col.path}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                          {col.count} tài liệu
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                        {col.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: INSTRUCTIONS FOR VIEWING IN FIREBASE CONSOLE */}
          {activeTab === 'instructions' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h4 className="font-bold text-zinc-950 dark:text-zinc-50 text-sm flex items-center space-x-2">
                  <Database className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span>Cách Xem Dữ Liệu Trong Firebase Console:</span>
                </h4>

                <div className="space-y-2.5 text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Truy cập <strong>Firebase Console</strong> (console.firebase.google.com) và mở dự án <strong>{FIREBASE_PROJECT_ID}</strong>.
                    </span>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Vào mục <strong>Build</strong> → chọn <strong>Firestore Database</strong> ở menu bên trái.
                    </span>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Ở thanh tiêu đề Firestore Database, nếu bạn thấy đang ở <code>(default)</code> mà chưa có dữ liệu, hãy <strong>bấm vào menu dropdown Database</strong> và chọn Database ID: <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded font-bold text-zinc-900 dark:text-zinc-100">ai-studio-spamasterhthngqu-ed792d51-a46c-4eb0-b9b6-eb636c943fec</code> hoặc bấm nút <strong>"Khởi Tạo 12 Danh Mục Sạch"</strong> ở trên để nạp ngay!
                    </span>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <span>
                      Khi mở ra, bạn sẽ thấy danh sách 12 Collections gồm: <code>customers</code>, <code>services</code>, <code>staff</code>, <code>appointments</code>, <code>inventory</code>, <code>invoices</code>, <code>promotions</code>, <code>attendance</code>, <code>spa_profile</code>, <code>news</code>, <code>notifications</code>, <code>system_settings</code>.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center space-x-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
            <Server className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Cloud Firestore • 12 Collections Connected</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};

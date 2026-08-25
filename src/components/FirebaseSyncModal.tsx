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
  Zap
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
  Language
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
  isCloudConnected,
  isSyncing,
  lastSyncedTime,
  onRefreshData,
}) => {
  const t = translations[lang];
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSeedCleanData = async () => {
    try {
      setLoadingAction('seed');
      setErrorMessage(null);
      setStatusMessage('Đang khởi tạo nạp dữ liệu sạch lên Firestore...');
      await seedCleanDataToFirebase(msg => setStatusMessage(msg));
      setStatusMessage('Đã nạp toàn bộ dữ liệu sạch lên Firebase thành công!');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Lỗi khi nạp dữ liệu sạch: ${err.message || err}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleClearAllData = async () => {
    if (!window.confirm('CẢNH BÁO: Thao tác này sẽ xóa toàn bộ dữ liệu hiện có trên Firebase Firestore để bạn bắt đầu sạch 100% từ đầu. Bạn có chắc chắn muốn tiếp tục?')) {
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

      await Promise.all(promises);
      setStatusMessage('Toàn bộ dữ liệu hiện tại đã được đồng bộ lên Firebase!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Lỗi đồng bộ: ${err.message || err}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1A1C19] border border-[#E2E6DF] dark:border-[#2D312C] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E2E6DF] dark:border-[#2D312C]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <span>Trung Tâm Đồng Bộ Firebase Firestore</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  Đang hoạt động
                </span>
              </h2>
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                Mã dự án: <span className="font-mono font-bold text-[#5A7D57] dark:text-[#8BA888]">{FIREBASE_PROJECT_ID} (spa2026-68441)</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#F0F3EF] dark:hover:bg-[#222621] text-[#5E665B] dark:text-[#9BA198] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realtime Status Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#5A7D57]/10 to-teal-500/10 border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Chế độ Tự Động Lưu (Auto-Save Realtime Firestore)</span>
            </span>
            <span className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
              {lastSyncedTime ? `Vừa đồng bộ: ${lastSyncedTime.toLocaleTimeString('vi-VN')}` : 'Đang lắng nghe thay đổi...'}
            </span>
          </div>
          <p className="text-xs text-[#2C492A] dark:text-[#A3C2A0]">
            Mọi thao tác thêm khách hàng, đặt lịch, bán liệu trình, chấm công, sửa hồ sơ đều được <strong>tự động ghi nhận tức thì</strong> vào cơ sở dữ liệu đám mây Firebase.
          </p>
        </div>

        {/* Status / Alert Messages */}
        {statusMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Collection Statistics Grid */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#5E665B] dark:text-[#9BA198] uppercase tracking-wider">
            Thống Kê Dữ Liệu Đang Quản Trị
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C]">
              <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                <span>Khách Hàng</span>
                <Users className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
              </div>
              <div className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] mt-1">{customers.length}</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C]">
              <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                <span>Lịch Hẹn</span>
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] mt-1">{appointments.length}</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C]">
              <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                <span>Nhân Sự</span>
                <Layers className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <div className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] mt-1">{staff.length}</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C]">
              <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                <span>Hóa Đơn</span>
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] mt-1">{invoices.length}</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C]">
              <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                <span>Dịch Vụ</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] mt-1">{services.length}</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C]">
              <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                <span>Kho Vật Tư</span>
                <Package className="w-3.5 h-3.5 text-teal-500" />
              </div>
              <div className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] mt-1">{inventory.length}</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C]">
              <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                <span>Chấm Công</span>
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] mt-1">{attendance.length}</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C]">
              <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                <span>Khuyến Mãi</span>
                <Zap className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] mt-1">{promotions.length}</div>
            </div>
          </div>
        </div>

        {/* Action Controls for "Dữ Liệu Sạch" */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-[#5E665B] dark:text-[#9BA198] uppercase tracking-wider">
            Công Cụ Quản Lý Dữ Liệu Sạch (Clean Data Operations)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Seed Clean Data Button */}
            <button
              id="btn-seed-clean-data"
              onClick={handleSeedCleanData}
              disabled={loadingAction !== null}
              className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 hover:bg-emerald-100/60 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-left transition-all group disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                {loadingAction === 'seed' ? 'Đang nạp...' : '🌱 Nạp Dữ Liệu Chuẩn Sạch'}
              </h4>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 leading-relaxed">
                Nạp bộ dữ liệu mẫu chuẩn spa (đầy đủ khách hàng, dịch vụ, thâm niên nhân sự, lịch hẹn).
              </p>
            </button>

            {/* Sync All Button */}
            <button
              id="btn-sync-all-firebase"
              onClick={handleSyncCurrentState}
              disabled={loadingAction !== null}
              className="p-4 rounded-2xl border border-[#5A7D57]/40 dark:border-[#8BA888]/40 bg-[#8BA888]/10 hover:bg-[#8BA888]/20 text-left transition-all group disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-xl bg-[#5A7D57] dark:bg-[#8BA888] text-white dark:text-[#121412] flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <RefreshCw className={`w-4 h-4 ${loadingAction === 'sync_all' ? 'animate-spin' : ''}`} />
              </div>
              <h4 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                {loadingAction === 'sync_all' ? 'Đang đồng bộ...' : '⚡ Đồng Bộ Lên Cloud'}
              </h4>
              <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198] mt-1 leading-relaxed">
                Đẩy toàn bộ các dữ liệu đang có trên giao diện lên Firestore đám mây ngay lập tức.
              </p>
            </button>

            {/* Clear All / Blank Slate Button */}
            <button
              id="btn-clear-firebase-data"
              onClick={handleClearAllData}
              disabled={loadingAction !== null}
              className="p-4 rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50/50 hover:bg-rose-100/60 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-left transition-all group disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <Trash2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                {loadingAction === 'clear' ? 'Đang dọn dẹp...' : '🧹 Xóa Sạch & Tạo Bảng Trắng'}
              </h4>
              <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-1 leading-relaxed">
                Dọn dẹp sạch toàn bộ các bảng trên Firebase để bạn tự nhập liệu thực tế từ đầu.
              </p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E2E6DF] dark:border-[#2D312C] flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
          <span className="flex items-center space-x-1">
            <Server className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>Google Cloud Run & Firebase Firestore Realtime</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E2E6DF] dark:hover:bg-[#2A2F29] transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};

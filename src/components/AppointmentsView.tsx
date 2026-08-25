import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Play,
  Receipt,
  XCircle,
  FileSpreadsheet,
  CalendarCheck,
  Edit2,
  X,
  Save,
  Trash2
} from 'lucide-react';
import { Appointment, Customer, Service, Staff, Language, Role } from '../types';
import { translations, formatCurrency } from '../i18n';
import { exportToCSV } from '../utils/exportUtils';

interface AppointmentsViewProps {
  appointments: Appointment[];
  customers: Customer[];
  services: Service[];
  staff: Staff[];
  lang: Language;
  currentRole?: Role;
  onCheckIn?: (id: string) => void;
  onStartService?: (id: string) => void;
  onCheckout?: (appointment: Appointment) => void;
  onOpenCheckout?: (appointment: Appointment) => void;
  onCancel?: (id: string) => void;
  onOpenBookingModal?: () => void;
  onOpenQuickBooking?: () => void;
  onUpdateStatus?: (id: string, status: Appointment['status']) => void;
  onUpdateAppointment?: (appointment: Appointment) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  customers,
  services,
  staff,
  lang,
  currentRole,
  onCheckIn,
  onStartService,
  onCheckout,
  onOpenCheckout,
  onCancel,
  onOpenBookingModal,
  onOpenQuickBooking,
  onUpdateStatus,
  onUpdateAppointment,
}) => {
  const t = translations[lang];
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);

  // Action handlers with fallback
  const handleCheckInAction = (id: string) => {
    if (onCheckIn) onCheckIn(id);
    else if (onUpdateStatus) onUpdateStatus(id, 'arrived');
  };

  const handleStartServiceAction = (id: string) => {
    if (onStartService) onStartService(id);
    else if (onUpdateStatus) onUpdateStatus(id, 'in_progress');
  };

  const handleCancelAction = (id: string) => {
    if (onCancel) onCancel(id);
    else if (onUpdateStatus) onUpdateStatus(id, 'cancelled');
  };

  const handleCheckoutAction = (apt: Appointment) => {
    if (onCheckout) onCheckout(apt);
    if (onOpenCheckout) onOpenCheckout(apt);
  };

  const handleOpenBookingAction = () => {
    if (onOpenBookingModal) onOpenBookingModal();
    if (onOpenQuickBooking) onOpenQuickBooking();
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesStaff = staffFilter === 'all' || apt.staffId === staffFilter || apt.staffName === staffFilter;
    const matchesSearch =
      apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.customerPhone.includes(searchQuery) ||
      apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.staffName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesStaff && matchesSearch;
  });

  const handleExport = () => {
    const exportData = filteredAppointments.map(a => ({
      'Mã Lịch Hẹn': a.id,
      'Khách Hàng': a.customerName,
      'Số Điện Thoại': a.customerPhone,
      'Dịch Vụ': a.serviceName,
      'Giá Tiền': a.servicePrice,
      'Kỹ Thuật Viên': a.staffName,
      'Phòng / Giường': a.roomBed,
      'Ngày': a.date,
      'Giờ Hẹn': a.time,
      'Thời Lượng (Phút)': a.duration,
      'Trạng Thái': a.status,
      'Đã Thanh Toán': a.paid ? 'Đã thanh toán' : 'Chưa thanh toán',
    }));
    exportToCSV('Danh_Sach_Lich_Hen_Spa', exportData);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;
    if (onUpdateAppointment) {
      onUpdateAppointment(editingApt);
    }
    setEditingApt(null);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#8BA888]/20 text-[#3F613C] dark:bg-[#8BA888]/20 dark:text-[#8BA888]">
            {t.statusConfirmed}
          </span>
        );
      case 'arrived':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#D4A373]/20 text-[#9E6B38] dark:bg-[#D4A373]/20 dark:text-[#D4A373]">
            {t.statusArrived}
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#A3B18A]/20 text-[#4A7049] dark:bg-[#A3B18A]/20 dark:text-[#CCD5AE] animate-pulse">
            {t.statusInProgress}
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#5A7D57]/20 text-[#385936] dark:bg-[#5A7D57]/30 dark:text-[#A3C2A0]">
            {t.statusCompleted}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E2E6DF] text-[#5E665B] dark:bg-[#222621] dark:text-[#9BA198]">
            {t.statusCancelled}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Header */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
            <CalendarCheck className="w-5 h-5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>{t.allAppointments}</span>
          </h1>
          <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-0.5">
            {lang === 'vi'
              ? 'Quản lý điều phối lịch hẹn, gán phòng giường và phân công Kỹ thuật viên'
              : 'Coordinate bookings, assign treatment rooms and staff'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="btn-export-appointments-csv"
            onClick={handleExport}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E5EAE3] dark:hover:bg-[#2A2F29] transition-colors border border-[#E2E6DF] dark:border-[#2D312C]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>{t.exportData} Excel</span>
          </button>

          <button
            id="btn-new-appointment"
            onClick={handleOpenBookingAction}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newBooking}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5E665B] dark:text-[#9BA198]" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={staffFilter}
            onChange={e => setStaffFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-1 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
          >
            <option value="all">Tất cả Kỹ Thuật Viên</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>
                {s.status === 'resigned' ? `📁 [Đã nghỉ] ${s.name}` : `KTV: ${s.name}`}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-1 bg-[#F0F3EF] dark:bg-[#222621] p-1 rounded-xl text-xs shrink-0">
            {[
              { key: 'all', label: t.all },
              { key: 'confirmed', label: t.statusConfirmed },
              { key: 'arrived', label: t.statusArrived },
              { key: 'in_progress', label: t.statusInProgress },
              { key: 'completed', label: t.statusCompleted },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === f.key
                    ? 'bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] shadow-xs font-semibold'
                    : 'text-[#5E665B] hover:text-[#1C211B] dark:text-[#9BA198] dark:hover:text-[#E0E2DF]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white dark:bg-[#1A1C19] rounded-2xl border border-dashed border-[#E2E6DF] dark:border-[#2D312C]">
            <Calendar className="w-10 h-10 text-[#9BA198] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#5E665B] dark:text-[#9BA198]">
              Không tìm thấy lịch hẹn phù hợp
            </p>
          </div>
        ) : (
          filteredAppointments.map(apt => (
            <div
              key={apt.id}
              className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Time, Status & Quick Edit Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                    <Clock className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                    <span>{apt.time}</span>
                    <span className="text-[#5E665B] dark:text-[#9BA198] font-normal">({apt.duration} phút)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {getStatusBadge(apt.status)}
                    <button
                      onClick={() => setEditingApt(apt)}
                      className="p-1 rounded-lg text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
                      title="Chỉnh sửa lịch hẹn"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Customer Profile Row */}
                <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]/60">
                  <img
                    src={apt.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={apt.customerName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#8BA888]/40"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                      {apt.customerName}
                    </h3>
                    <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                      {apt.customerPhone}
                    </p>
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-1.5 text-xs">
                  <div className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
                    💆‍♀️ {apt.serviceName}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                    <span>Giá dịch vụ: <strong className="text-[#5A7D57] dark:text-[#8BA888] font-bold">{formatCurrency(apt.servicePrice, lang)}</strong></span>
                  </div>
                  <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                    Kỹ thuật viên: <strong className="text-[#1C211B] dark:text-[#E0E2DF]">{apt.staffName}</strong>
                  </div>
                  <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                    Phòng: <strong className="text-[#1C211B] dark:text-[#E0E2DF]">{apt.roomBed}</strong>
                  </div>
                  {apt.notes && (
                    <div className="p-2 rounded-lg bg-[#D4A373]/15 text-[#9E6B38] dark:text-[#D4A373] text-[11px]">
                      📝 {apt.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C] flex items-center gap-2">
                {apt.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleCheckInAction(apt.id)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#B88352] hover:bg-[#A57445] dark:bg-[#D4A373] dark:hover:bg-[#C2956A] text-white dark:text-[#121412] transition-colors flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.checkIn}</span>
                    </button>
                    <button
                      onClick={() => handleCancelAction(apt.id)}
                      className="p-2 rounded-xl text-xs text-[#9BA198] hover:text-red-500 transition-colors"
                      title={t.cancel}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}

                {apt.status === 'arrived' && (
                  <button
                    onClick={() => handleStartServiceAction(apt.id)}
                    className="w-full py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors flex items-center justify-center space-x-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{t.startService}</span>
                  </button>
                )}

                {apt.status === 'in_progress' && (
                  <button
                    onClick={() => handleCheckoutAction(apt)}
                    className="w-full py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors flex items-center justify-center space-x-1"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>{t.checkout} & Thu Tiền</span>
                  </button>
                )}

                {apt.status === 'completed' && (
                  <div className="w-full text-center text-xs font-semibold text-[#4D6E4A] dark:text-[#8BA888] py-1.5 flex items-center justify-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t.statusCompleted} & Đã thanh toán</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Appointment Modal */}
      {editingApt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-lg shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                <span>Chỉnh sửa thông tin lịch hẹn</span>
              </h2>
              <button
                type="button"
                onClick={() => setEditingApt(null)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]">
                <div className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">{editingApt.customerName}</div>
                <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">{editingApt.customerPhone}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Ngày hẹn
                  </label>
                  <input
                    type="date"
                    value={editingApt.date}
                    onChange={e => setEditingApt({ ...editingApt, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Giờ hẹn
                  </label>
                  <input
                    type="time"
                    value={editingApt.time}
                    onChange={e => setEditingApt({ ...editingApt, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Kỹ thuật viên phụ trách
                </label>
                <select
                  value={editingApt.staffId}
                  onChange={e => {
                    const st = staff.find(s => s.id === e.target.value);
                    if (st) {
                      setEditingApt({ ...editingApt, staffId: st.id, staffName: st.name });
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                >
                  {staff.filter(s => s.status !== 'resigned' || s.id === editingApt.staffId).map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.positionTitle}){st.status === 'resigned' ? ' - [Đã thôi việc]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Phòng / Giường
                </label>
                <input
                  type="text"
                  value={editingApt.roomBed}
                  onChange={e => setEditingApt({ ...editingApt, roomBed: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Trạng thái
                </label>
                <select
                  value={editingApt.status}
                  onChange={e => setEditingApt({ ...editingApt, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                >
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="arrived">Đã đến Spa</option>
                  <option value="in_progress">Đang làm dịch vụ</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Ghi chú lịch hẹn
                </label>
                <textarea
                  rows={2}
                  value={editingApt.notes || ''}
                  onChange={e => setEditingApt({ ...editingApt, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setEditingApt(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm"
              >
                {t.save}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

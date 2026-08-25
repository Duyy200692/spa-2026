import React, { useState } from 'react';
import {
  X,
  CalendarPlus,
  Clock,
  User,
  Sparkles,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { Appointment, Customer, Service, Staff, Language } from '../types';
import { translations, formatCurrency } from '../i18n';

interface QuickBookingModalProps {
  customers: Customer[];
  services: Service[];
  staff: Staff[];
  lang: Language;
  onClose: () => void;
  onSaveBooking: (newAppointment: Appointment) => void;
  initialServiceId?: string;
  initialPromoCode?: string;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  customers,
  services,
  staff,
  lang,
  onClose,
  onSaveBooking,
  initialServiceId,
  initialPromoCode,
}) => {
  const t = translations[lang];

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId && services.some(s => s.id === initialServiceId)
      ? initialServiceId
      : services[0]?.id || ''
  );
  const activeStaffList = staff.filter(st => st.status !== 'resigned');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(activeStaffList[0]?.id || staff[0]?.id || '');
  const [bookingDate, setBookingDate] = useState<string>('2026-08-25');
  const [bookingTime, setBookingTime] = useState<string>('15:00');
  const [roomBed, setRoomBed] = useState<string>('Phòng VIP 01 - Giường 1');
  const [notes, setNotes] = useState<string>(
    initialPromoCode ? `[Áp dụng mã ưu đãi: ${initialPromoCode}] ` : ''
  );

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const activeService = services.find(s => s.id === selectedServiceId) || services[0];
  const activeStaff = staff.find(st => st.id === selectedStaffId) || activeStaffList[0] || staff[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      customerId: activeCustomer?.id || 'cust-1',
      customerName: activeCustomer?.name || 'Khách hàng',
      customerPhone: activeCustomer?.phone || '0900000000',
      customerAvatar: activeCustomer?.avatar,
      serviceId: activeService?.id || 'srv-1',
      serviceName: activeService?.name || 'Dịch vụ Spa',
      servicePrice: activeService?.price || 0,
      staffId: activeStaff?.id || 'st-1',
      staffName: activeStaff?.name || 'Kỹ thuật viên',
      staffAvatar: activeStaff?.avatar,
      roomBed,
      date: bookingDate,
      time: bookingTime,
      duration: activeService?.durationMinutes || 60,
      status: 'confirmed',
      notes,
      paid: false,
    };

    onSaveBooking(appointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#141619] rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                {t.newBooking}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {initialPromoCode ? `Đang áp dụng voucher: ${initialPromoCode}` : 'Lên lịch hẹn và gán Kỹ thuật viên phụ trách'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              {t.customer} *:
            </label>
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) - {c.tier}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Dịch vụ Spa *:
            </label>
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.durationMinutes}p - {formatCurrency(s.price, lang)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Kỹ thuật viên phụ trách:
              </label>
              <select
                value={selectedStaffId}
                onChange={e => setSelectedStaffId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              >
                {activeStaffList.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.positionTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                {t.roomBed}:
              </label>
              <select
                value={roomBed}
                onChange={e => setRoomBed(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              >
                <option value="Phòng VIP 01 - Giường 1">Phòng VIP 01 - Giường 1</option>
                <option value="Phòng VIP 01 - Giường 2">Phòng VIP 01 - Giường 2</option>
                <option value="Phòng Trị Liệu Da 02 - Giường 1">Phòng Trị Liệu Da 02 - Giường 1</option>
                <option value="Phòng Body Thảo Dược - Giường 1">Phòng Body Thảo Dược - Giường 1</option>
                <option value="Khu Gội Dưỡng Sinh - Giường 3">Khu Gội Dưỡng Sinh - Giường 3</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Ngày hẹn:
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Giờ hẹn:
              </label>
              <input
                type="time"
                value={bookingTime}
                onChange={e => setBookingTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Ghi chú & Mã Voucher áp dụng:
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Áp dụng mã SPASUMMER20, yêu cầu lực massage vừa..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {t.cancel}
            </button>
            <button
              id="btn-submit-quick-booking"
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm transition-colors"
            >
              Xác Nhận Đặt Lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

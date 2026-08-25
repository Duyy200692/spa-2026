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
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  customers,
  services,
  staff,
  lang,
  onClose,
  onSaveBooking,
}) => {
  const t = translations[lang];

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const activeStaffList = staff.filter(st => st.status !== 'resigned');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(activeStaffList[0]?.id || staff[0]?.id || '');
  const [bookingDate, setBookingDate] = useState<string>('2026-08-25');
  const [bookingTime, setBookingTime] = useState<string>('15:00');
  const [roomBed, setRoomBed] = useState<string>('Phòng VIP 01 - Giường 1');
  const [notes, setNotes] = useState<string>('');

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const activeService = services.find(s => s.id === selectedServiceId) || services[0];
  const activeStaff = staff.find(st => st.id === selectedStaffId) || activeStaffList[0] || staff[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      customerId: activeCustomer.id,
      customerName: activeCustomer.name,
      customerPhone: activeCustomer.phone,
      customerAvatar: activeCustomer.avatar,
      serviceId: activeService.id,
      serviceName: activeService.name,
      servicePrice: activeService.price,
      staffId: activeStaff.id,
      staffName: activeStaff.name,
      staffAvatar: activeStaff.avatar,
      roomBed,
      date: bookingDate,
      time: bookingTime,
      duration: activeService.durationMinutes,
      status: 'confirmed',
      notes,
      paid: false,
    };

    onSaveBooking(appointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1A1C19] rounded-3xl w-full max-w-lg shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-[#5A7D57] dark:bg-[#8BA888] text-white dark:text-[#121412] shadow-sm">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                {t.newBooking}
              </h2>
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                Lên lịch hẹn và gán Kỹ thuật viên phụ trách
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
              {t.customer} *:
            </label>
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] font-medium focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) - {c.tier}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
              Dịch vụ Spa *:
            </label>
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] font-medium focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
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
              <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                Kỹ thuật viên phụ trách:
              </label>
              <select
                value={selectedStaffId}
                onChange={e => setSelectedStaffId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
              >
                {activeStaffList.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.positionTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                {t.roomBed}:
              </label>
              <select
                value={roomBed}
                onChange={e => setRoomBed(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
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
              <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                Ngày hẹn:
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                Giờ hẹn:
              </label>
              <input
                type="time"
                value={bookingTime}
                onChange={e => setBookingTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
              Ghi chú yêu cầu đặc biệt của khách:
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Khách thích lực vừa, lấy nhân mụn kỹ..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
            >
              {t.cancel}
            </button>
            <button
              id="btn-submit-quick-booking"
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm transition-colors"
            >
              Xác Nhận Đặt Lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

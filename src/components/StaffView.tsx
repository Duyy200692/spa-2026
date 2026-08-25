import React, { useState } from 'react';
import {
  UserCog,
  Clock,
  Plus,
  Search,
  Star,
  CheckCircle,
  FileSpreadsheet,
  LogIn,
  LogOut,
  Calendar,
  Sparkles,
  Users,
  Briefcase,
  Layers,
  Award,
  ArrowRightCircle,
  X,
  Edit,
  UserX,
  UserCheck,
  History,
  Gift,
  Archive,
  Phone,
  Mail,
  ShieldCheck,
  BadgePercent,
  CalendarDays,
  FileText,
  DollarSign
} from 'lucide-react';
import { Staff, AttendanceRecord, Language, Role } from '../types';
import { translations, formatCurrency } from '../i18n';
import { exportToCSV } from '../utils/exportUtils';

interface StaffViewProps {
  staff: Staff[];
  attendance: AttendanceRecord[];
  lang: Language;
  currentRole?: Role;
  initialSubTab?: 'directory' | 'timekeeping' | 'tours' | 'resigned';
  onClockIn: (record: AttendanceRecord) => void;
  onClockOut: (id: string) => void;
  onAddStaff: (newStaff: Staff) => void;
  onUpdateStaff?: (updatedStaff: Staff) => void;
  onToggleStaffStatus?: (staffId: string, newStatus: Staff['status'], resignationData?: { endDate: string; reason: string }) => void;
}

// Calculate tenure in years and months from startDate to endDate (or today)
export const calculateTenure = (startDate?: string, endDate?: string) => {
  if (!startDate) return { months: 0, text: 'Chưa cập nhật', years: 0, rewardTier: 'Mới vào', rewardBadgeColor: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300', bonusSuggestion: '' };
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) {
    months = Math.max(0, months - 1);
  }
  if (months < 0) months = 0;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let text = '';
  if (years > 0 && remainingMonths > 0) {
    text = `${years} năm ${remainingMonths} tháng`;
  } else if (years > 0) {
    text = `${years} năm`;
  } else if (months > 0) {
    text = `${months} tháng`;
  } else {
    text = 'Dưới 1 tháng';
  }

  let rewardTier = 'Mới vào nghề';
  let rewardBadgeColor = 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700';
  let bonusSuggestion = 'Đang trong thời gian đào tạo & thử việc';

  if (months >= 24) {
    rewardTier = 'Thâm Niên Vàng (> 2 Năm)';
    rewardBadgeColor = 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700/60';
    bonusSuggestion = 'Đề xuất Thưởng Cống Hiến: 1.000.000đ - 2.000.000đ/tháng & Du lịch hằng năm';
  } else if (months >= 12) {
    rewardTier = 'Thâm Niên Bạc (1 - 2 Năm)';
    rewardBadgeColor = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60';
    bonusSuggestion = 'Đề xuất Thưởng Gắn Bó: 500.000đ/tháng & Xét nâng bậc lương';
  } else if (months >= 6) {
    rewardTier = 'Chính Thức (6 - 12 Tháng)';
    rewardBadgeColor = 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-700/60';
    bonusSuggestion = 'Đạt chuẩn kỹ thuật chính thức, xét thưởng KPI tháng';
  }

  return { months, years, text, rewardTier, rewardBadgeColor, bonusSuggestion };
};

export const StaffView: React.FC<StaffViewProps> = ({
  staff,
  attendance,
  lang,
  currentRole = 'owner',
  initialSubTab = 'tours',
  onClockIn,
  onClockOut,
  onAddStaff,
  onUpdateStaff,
  onToggleStaffStatus,
}) => {
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'timekeeping' | 'tours' | 'resigned'>(
    currentRole === 'receptionist' ? 'tours' : (initialSubTab as any) || 'tours'
  );

  React.useEffect(() => {
    if (currentRole === 'receptionist' && (initialSubTab === 'directory' || initialSubTab === 'resigned')) {
      setActiveSubTab('tours');
    } else if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab, currentRole]);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [seniorityFilter, setSeniorityFilter] = useState<string>('all'); // all, over_1yr, over_2yr, probation

  // Timekeeping State
  const activeStaffList = staff.filter(s => s.status !== 'resigned');
  const resignedStaffList = staff.filter(s => s.status === 'resigned');

  const [selectedStaffId, setSelectedStaffId] = useState<string>(activeStaffList[0]?.id || '');
  const [selectedShift, setSelectedShift] = useState<'morning' | 'afternoon' | 'full_day'>('morning');
  const [timeNote, setTimeNote] = useState<string>('');

  // Modals State
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [resigningStaff, setResigningStaff] = useState<Staff | null>(null);
  const [resignationForm, setResignationForm] = useState({
    endDate: new Date().toISOString().slice(0, 10),
    reason: 'Chuyển nơi ở / Có kế hoạch cá nhân',
    notes: 'Đã hoàn tất bàn giao dụng cụ, đồng phục và thanh toán lương.',
  });

  // New staff form state
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    phone: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    role: 'technician' as Role,
    positionTitle: 'Kỹ Thuật Viên Da Liễu',
    specialties: 'Điều trị mụn, Cấy tảo xoắn, Điện di tinh chất',
    baseSalary: 7500000,
    commissionRate: 15,
    startDate: new Date().toISOString().slice(0, 10),
    seniorityBonusAmount: 0,
    notes: '',
  });

  // Clock In Action
  const handleClockInAction = () => {
    const s = staff.find(st => st.id === selectedStaffId);
    if (!s) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 30);

    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      staffId: s.id,
      staffName: s.name,
      date: now.toISOString().slice(0, 10),
      shift: selectedShift,
      clockInTime: timeStr,
      status: isLate ? 'late' : 'on_time',
      workingHours: selectedShift === 'full_day' ? 12 : 6,
      notes: timeNote || (isLate ? 'Đi muộn sau 08:30' : 'Chấm công đúng giờ tại Spa'),
    };

    onClockIn(record);
    setTimeNote('');
  };

  const handleExportAttendanceCSV = () => {
    const rows = attendance.map(att => ({
      'Mã Chấm Công': att.id,
      'Nhân Viên': att.staffName,
      'Ngày': att.date,
      'Ca Làm Việc': att.shift === 'morning' ? 'Ca Sáng' : att.shift === 'afternoon' ? 'Ca Chiều' : 'Cả Ngày',
      'Giờ Vào': att.clockInTime,
      'Giờ Ra': att.clockOutTime || 'Chưa ra ca',
      'Trạng Thái': att.status === 'on_time' ? 'Đúng giờ' : 'Đi muộn',
      'Số Giờ Làm': att.workingHours,
      'Ghi Chú': att.notes || '',
    }));
    exportToCSV('Bang_Cham_Cong_Nhan_Vien_Spa', rows);
  };

  const handleExportStaffCSV = () => {
    const rows = staff.map(st => {
      const tenure = calculateTenure(st.startDate, st.endDate);
      return {
        'Mã Nhân Viên': st.id,
        'Họ và Tên': st.name,
        'Số Điện Thoại': st.phone,
        'Email': st.email,
        'Chức Danh': st.positionTitle,
        'Vai Trò Hệ Thống': st.role,
        'Trạng Thái': st.status === 'resigned' ? 'Đã nghỉ việc (Lưu trữ)' : 'Đang làm việc',
        'Ngày Bắt Đầu Làm': st.startDate || 'Chưa rõ',
        'Ngày Nghỉ Việc': st.endDate || 'Đang làm',
        'Thâm Niên': tenure.text,
        'Cấp Bậc Thâm Niên': tenure.rewardTier,
        'Lương Cơ Bản': st.baseSalary,
        'Tỷ Lệ Hoa Hồng (%)': st.commissionRate,
        'Thưởng Thâm Niên (VNĐ)': st.seniorityBonusAmount || 0,
        'Số Ca Phục Vụ': st.completedServicesCount,
        'Lý Do Nghỉ Việc': st.resignationReason || '',
        'Ghi Chú': st.notes || '',
      };
    });
    exportToCSV('Danh_Sach_Nhan_Su_Va_Tham_Nien_Spa', rows);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Staff = {
      id: `st-${Date.now()}`,
      name: newStaffForm.name,
      phone: newStaffForm.phone,
      email: newStaffForm.email,
      avatar: newStaffForm.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
      role: newStaffForm.role,
      positionTitle: newStaffForm.positionTitle,
      specialty: newStaffForm.specialties.split(',').map(s => s.trim()).filter(Boolean),
      baseSalary: Number(newStaffForm.baseSalary) || 7000000,
      commissionRate: Number(newStaffForm.commissionRate) || 15,
      rating: 5.0,
      status: 'active',
      startDate: newStaffForm.startDate || new Date().toISOString().slice(0, 10),
      seniorityBonusAmount: Number(newStaffForm.seniorityBonusAmount) || 0,
      notes: newStaffForm.notes,
      completedServicesCount: 0,
      monthlyCommission: 0,
    };

    onAddStaff(created);
    setShowAddStaffModal(false);
    // Reset form
    setNewStaffForm({
      name: '',
      phone: '',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
      role: 'technician',
      positionTitle: 'Kỹ Thuật Viên Da Liễu',
      specialties: 'Điều trị mụn, Cấy tảo xoắn, Điện di tinh chất',
      baseSalary: 7500000,
      commissionRate: 15,
      startDate: new Date().toISOString().slice(0, 10),
      seniorityBonusAmount: 0,
      notes: '',
    });
  };

  const handleSaveEditedStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff || !onUpdateStaff) return;
    onUpdateStaff(editingStaff);
    setEditingStaff(null);
  };

  const handleConfirmResignation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resigningStaff || !onToggleStaffStatus) return;
    onToggleStaffStatus(resigningStaff.id, 'resigned', {
      endDate: resignationForm.endDate,
      reason: `${resignationForm.reason}. Ghi chú: ${resignationForm.notes}`,
    });
    setResigningStaff(null);
  };

  const handleReactivateStaff = (st: Staff) => {
    if (!onToggleStaffStatus) return;
    if (window.confirm(`Bạn có chắc chắn muốn khôi phục nhân viên "${st.name}" trở lại làm việc (Đang hoạt động)?`)) {
      onToggleStaffStatus(st.id, 'active');
    }
  };

  // Real-time tour & shift calculation for dispatching (Only for active staff!)
  const staffTourData = activeStaffList.map((st, idx) => {
    const isClockedInToday = attendance.some(a => a.staffId === st.id);
    const shiftType = idx % 3 === 0 ? 'Ca Sáng (08:30 - 14:30)' : idx % 3 === 1 ? 'Ca Chiều (14:00 - 20:30)' : 'Cả Ngày (08:30 - 20:30)';
    const tourStatus: 'ready' | 'in_service' | 'off_duty' =
      !isClockedInToday && idx % 4 === 3
        ? 'off_duty'
        : idx % 2 === 0
        ? 'ready'
        : 'in_service';
    const currentTask =
      tourStatus === 'in_service'
        ? `Đang phục vụ Phòng ${idx + 1} (${st.specialty[0] || 'Chăm sóc da'})`
        : tourStatus === 'ready'
        ? '🟢 Đang rảnh - Sẵn sàng nhận khách mới'
        : '⚪ Nghỉ ca / Chưa vào ca';

    return {
      ...st,
      shiftType,
      tourStatus,
      currentTask,
      toursDoneToday: (st.completedServicesCount % 4) + (idx % 2),
    };
  });

  const filteredTourStaff = staffTourData.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.positionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery)
  );

  // Filter Active Staff
  const filteredActiveStaff = activeStaffList.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.positionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);
    const matchesRole = selectedRoleFilter === 'all' || s.role === selectedRoleFilter;
    
    const tenure = calculateTenure(s.startDate, s.endDate);
    let matchesSeniority = true;
    if (seniorityFilter === 'over_2yr') matchesSeniority = tenure.months >= 24;
    else if (seniorityFilter === 'over_1yr') matchesSeniority = tenure.months >= 12;
    else if (seniorityFilter === 'probation') matchesSeniority = tenure.months < 6;

    return matchesSearch && matchesRole && matchesSeniority;
  });

  // Filter Resigned Staff
  const filteredResignedStaff = resignedStaffList.filter(s => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.positionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      (s.resignationReason && s.resignationReason.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Summary Metrics
  const totalStaffCount = staff.length;
  const activeCount = activeStaffList.length;
  const resignedCount = resignedStaffList.length;
  const veteranCount = activeStaffList.filter(s => calculateTenure(s.startDate).months >= 12).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
            <UserCog className="w-5 h-5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>
              {currentRole === 'receptionist'
                ? 'Đội Ngũ Kỹ Thuật Viên & Sắp Xếp Tour Làm Việc'
                : 'Quản Lý Nhân Sự, Thâm Niên & Chấm Công'}
            </span>
          </h1>
          <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-0.5">
            {currentRole === 'receptionist'
              ? 'Theo dõi ca làm việc, trạng thái rảnh/bận và số lượt đã làm để Lễ tân điều phối tour công bằng'
              : 'Theo dõi ngày bắt đầu làm việc, xét thưởng thâm niên, chỉnh sửa hồ sơ & lưu trữ nhân sự đã nghỉ việc'}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            id="btn-export-staff-csv"
            onClick={handleExportStaffCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E5EAE3] dark:hover:bg-[#2A2F29] transition-colors border border-[#E2E6DF] dark:border-[#2D312C]"
            title="Xuất danh sách nhân sự và thâm niên ra file Excel CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>Xuất Hồ Sơ & Thâm Niên</span>
          </button>

          {currentRole !== 'receptionist' && (
            <button
              id="btn-add-staff-modal"
              onClick={() => setShowAddStaffModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addStaff}</span>
            </button>
          )}
        </div>
      </div>

      {/* Role notice banner for Receptionist */}
      {currentRole === 'receptionist' && (
        <div className="bg-[#A3B18A]/15 border border-[#A3B18A]/30 rounded-2xl p-3.5 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#3E5C39] dark:text-[#CCD5AE]">
            <Sparkles className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888] shrink-0" />
            <span>
              <strong>Chế độ Lễ Tân & Điều Phối Tour:</strong> Xem ca trực, chuyên môn và trạng thái trực tiếp của KTV để gán lịch hẹn cho khách nhanh chóng.
            </span>
          </div>
        </div>
      )}

      {/* Overview Statistics Ribbon (Admin/Manager) */}
      {currentRole !== 'receptionist' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-[#1A1C19] p-3.5 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#5E665B] dark:text-[#9BA198] font-medium">Tổng Nhân Sự</span>
              <Users className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
            </div>
            <div className="text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] mt-1">{totalStaffCount}</div>
            <div className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">Bao gồm cả hồ sơ lưu trữ</div>
          </div>

          <div className="bg-white dark:bg-[#1A1C19] p-3.5 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Đang Làm Việc</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{activeCount}</div>
            <div className="text-[10px] text-emerald-600/80">Sẵn sàng nhận ca & tính lương</div>
          </div>

          <div className="bg-white dark:bg-[#1A1C19] p-3.5 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Thâm Niên &gt; 1 Năm</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{veteranCount}</div>
            <div className="text-[10px] text-amber-600/80">Đủ điều kiện thưởng cống hiến</div>
          </div>

          <div className="bg-white dark:bg-[#1A1C19] p-3.5 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">Đã Nghỉ Việc (Lưu Trữ)</span>
              <Archive className="w-4 h-4 text-stone-500" />
            </div>
            <div className="text-xl font-bold text-stone-600 dark:text-stone-400 mt-1">{resignedCount}</div>
            <div className="text-[10px] text-stone-500">Bảo tồn 100% lịch sử công</div>
          </div>
        </div>
      )}

      {/* Sub-tab switcher */}
      <div className="flex items-center space-x-2 border-b border-[#E2E6DF] dark:border-[#2D312C] pb-2 overflow-x-auto">
        <button
          id="tab-staff-tours"
          onClick={() => setActiveSubTab('tours')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'tours'
              ? 'bg-[#5A7D57] dark:bg-[#8BA888] text-white dark:text-[#121412] shadow-sm'
              : 'text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Bảng Điều Phối Tour & Ca Trực ({activeStaffList.length})</span>
        </button>

        <button
          id="tab-staff-timekeeping"
          onClick={() => setActiveSubTab('timekeeping')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'timekeeping'
              ? 'bg-[#5A7D57] dark:bg-[#8BA888] text-white dark:text-[#121412] shadow-sm'
              : 'text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t.timekeeping} & Điểm Danh</span>
        </button>

        {currentRole !== 'receptionist' && (
          <>
            <button
              id="tab-staff-active-directory"
              onClick={() => setActiveSubTab('directory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeSubTab === 'directory'
                  ? 'bg-[#5A7D57] dark:bg-[#8BA888] text-white dark:text-[#121412] shadow-sm'
                  : 'text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Đang Làm Việc & Thâm Niên ({activeStaffList.length})</span>
            </button>

            <button
              id="tab-staff-resigned-archive"
              onClick={() => setActiveSubTab('resigned')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeSubTab === 'resigned'
                  ? 'bg-[#5A7D57] dark:bg-[#8BA888] text-white dark:text-[#121412] shadow-sm'
                  : 'text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Đã Nghỉ Việc / Lưu Trữ ({resignedStaffList.length})</span>
            </button>
          </>
        )}
      </div>

      {/* VIEW 0: Bảng Điều Phối Tour Làm Việc & Ca Trực Cho Lễ Tân & Quản Lý */}
      {activeSubTab === 'tours' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5E665B] dark:text-[#9BA198]" />
              <input
                type="text"
                placeholder="Tìm Kỹ thuật viên theo tên, ca trực, chuyên môn..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
              />
            </div>
            <div className="flex items-center space-x-3 text-xs text-[#5E665B] dark:text-[#9BA198]">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Sẵn sàng ({staffTourData.filter(s => s.tourStatus === 'ready').length})</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Đang làm khách ({staffTourData.filter(s => s.tourStatus === 'in_service').length})</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                <span>Nghỉ ca ({staffTourData.filter(s => s.tourStatus === 'off_duty').length})</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTourStaff.map((st, idx) => (
              <div
                key={st.id}
                className={`bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-all ${
                  st.tourStatus === 'ready'
                    ? 'border-emerald-300 dark:border-emerald-800/60 ring-1 ring-emerald-400/20'
                    : st.tourStatus === 'in_service'
                    ? 'border-amber-300 dark:border-amber-800/60'
                    : 'border-[#E2E6DF] dark:border-[#2D312C] opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8BA888]/40"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#1A1C19] ${
                            st.tourStatus === 'ready'
                              ? 'bg-emerald-500'
                              : st.tourStatus === 'in_service'
                              ? 'bg-amber-500'
                              : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
                          <span>{st.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-[#8BA888]/20 text-[#3C5E39] dark:text-[#8BA888]">
                            Tour #{idx + 1}
                          </span>
                        </h3>
                        <p className="text-xs text-[#5A7D57] dark:text-[#8BA888] font-medium">
                          {st.positionTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-xs font-bold text-[#D4A373]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{st.rating}</span>
                    </div>
                  </div>

                  {/* Ca trực & Trạng thái hiện tại */}
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] flex items-center justify-between">
                      <span className="text-[#5E665B] dark:text-[#9BA198]">Ca làm việc:</span>
                      <span className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
                        {st.shiftType}
                      </span>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl text-xs font-medium ${
                        st.tourStatus === 'ready'
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : st.tourStatus === 'in_service'
                          ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {st.currentTask}
                    </div>
                  </div>

                  {/* Kỹ năng chuyên môn */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198] uppercase font-bold tracking-wider">
                      Tay nghề thế mạnh:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {st.specialty.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E2E6DF] dark:border-[#2D312C] text-xs flex items-center justify-between">
                  <span className="text-[#5E665B] dark:text-[#9BA198]">
                    Hôm nay đã nhận: <strong className="text-[#1C211B] dark:text-[#E0E2DF]">{st.toursDoneToday} tour</strong>
                  </span>
                  {st.tourStatus === 'ready' ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                      <span>Ưu tiên nhận tour</span>
                      <ArrowRightCircle className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                      {st.phone}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 1: Timekeeping Clock-in Terminal */}
      {activeSubTab === 'timekeeping' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clock In Panel */}
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
              <LogIn className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
              <span>Chấm Công Trực Tiếp (GPS/Vân Tay)</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Chọn nhân viên chấm công:
                </label>
                <select
                  value={selectedStaffId}
                  onChange={e => setSelectedStaffId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                >
                  {activeStaffList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.positionTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  {t.shift}:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { key: 'morning', label: t.morningShift },
                    { key: 'afternoon', label: t.afternoonShift },
                    { key: 'full_day', label: t.fullDayShift },
                  ].map(s => (
                    <label
                      key={s.key}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        selectedShift === s.key
                          ? 'border-[#5A7D57] dark:border-[#8BA888] bg-[#8BA888]/15 dark:bg-[#8BA888]/20 font-semibold text-[#2C492A] dark:text-[#A3C2A0]'
                          : 'border-[#E2E6DF] dark:border-[#2D312C] text-[#5E665B] dark:text-[#9BA198]'
                      }`}
                    >
                      <span className="text-[11px]">{s.label}</span>
                      <input
                        type="radio"
                        name="shift"
                        checked={selectedShift === s.key}
                        onChange={() => setSelectedShift(s.key as any)}
                        className="accent-[#5A7D57] dark:accent-[#8BA888]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Ghi chú (Lý do muộn nếu có):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kẹt xe, đã báo trước..."
                  value={timeNote}
                  onChange={e => setTimeNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <button
                id="btn-confirm-clock-in"
                onClick={handleClockInAction}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{t.clockIn} (Vào Ca)</span>
              </button>
            </div>
          </div>

          {/* Real-time Timekeeping Table */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                <span>Nhật Ký Chấm Công Hôm Nay ({attendance.length} lượt)</span>
              </h2>
              <button
                onClick={handleExportAttendanceCSV}
                className="text-xs text-[#5A7D57] dark:text-[#8BA888] font-semibold hover:underline flex items-center space-x-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Xuất bảng công</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] uppercase bg-[#F5F7F4] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198] border-b border-[#E2E6DF] dark:border-[#2D312C]">
                  <tr>
                    <th className="px-3 py-2.5 font-bold">Nhân Viên</th>
                    <th className="px-3 py-2.5 font-bold">Ca Trực</th>
                    <th className="px-3 py-2.5 font-bold">Giờ Vào</th>
                    <th className="px-3 py-2.5 font-bold">Giờ Ra</th>
                    <th className="px-3 py-2.5 font-bold">Trạng Thái</th>
                    <th className="px-3 py-2.5 font-bold text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E6DF] dark:divide-[#2D312C]">
                  {attendance.map(att => (
                    <tr key={att.id} className="hover:bg-[#F5F7F4]/60 dark:hover:bg-[#222621]/60">
                      <td className="px-3 py-2.5 font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
                        {att.staffName}
                      </td>
                      <td className="px-3 py-2.5 text-[#5E665B] dark:text-[#9BA198]">
                        {att.shift === 'morning' ? 'Ca Sáng' : att.shift === 'afternoon' ? 'Ca Chiều' : 'Cả Ngày'}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[#5A7D57] dark:text-[#8BA888] font-bold">
                        {att.clockInTime}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[#5E665B] dark:text-[#9BA198]">
                        {att.clockOutTime || <span className="text-amber-500 italic">Đang làm việc</span>}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            att.status === 'on_time'
                              ? 'bg-[#8BA888]/20 text-[#30522E] dark:text-[#A3C2A0]'
                              : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {att.status === 'on_time' ? t.statusOnTime : t.statusLate}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {!att.clockOutTime && (
                          <button
                            onClick={() => onClockOut(att.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors inline-flex items-center space-x-1"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Tan Ca</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ĐANG LÀM VIỆC & QUẢN LÝ THÂM NIÊN XÉT THƯỞNG */}
      {activeSubTab === 'directory' && currentRole !== 'receptionist' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5E665B] dark:text-[#9BA198]" />
              <input
                type="text"
                placeholder="Tìm theo tên, số điện thoại, chức vụ..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <select
                value={selectedRoleFilter}
                onChange={e => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none"
              >
                <option value="all">Tất cả chức danh</option>
                <option value="technician">Kỹ Thuật Viên</option>
                <option value="receptionist">Lễ Tân / Thu Ngân</option>
                <option value="manager">Quản Lý Spa</option>
                <option value="owner">Chủ Cơ Sở</option>
              </select>

              <select
                value={seniorityFilter}
                onChange={e => setSeniorityFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none"
              >
                <option value="all">Tất cả thâm niên</option>
                <option value="over_2yr">Thâm niên &gt; 2 Năm (Vàng)</option>
                <option value="over_1yr">Thâm niên &gt; 1 Năm (Bạc)</option>
                <option value="probation">Thử việc / Mới &lt; 6 tháng</option>
              </select>
            </div>
          </div>

          {/* Active Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActiveStaff.map(st => {
              const tenure = calculateTenure(st.startDate, st.endDate);

              return (
                <div
                  key={st.id}
                  className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-4 flex flex-col justify-between relative hover:border-[#5A7D57]/50 transition-all group"
                >
                  <div className="space-y-3">
                    {/* Header with avatar & name */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8BA888]/40"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
                            <span>{st.name}</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Đang làm việc" />
                          </h3>
                          <p className="text-xs text-[#5A7D57] dark:text-[#8BA888] font-medium">
                            {st.positionTitle}
                          </p>
                        </div>
                      </div>

                      {/* Edit button */}
                      <button
                        onClick={() => setEditingStaff(st)}
                        className="p-1.5 rounded-lg text-[#5E665B] hover:text-[#1C211B] dark:text-[#9BA198] dark:hover:text-[#E0E2DF] hover:bg-[#F0F3EF] dark:hover:bg-[#222621] transition-colors"
                        title="Chỉnh sửa thông tin nhân viên"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Start Date & Tenure Tracking (Quan trọng cho xét thưởng) */}
                    <div className="p-2.5 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] space-y-1.5 border border-[#E2E6DF]/60 dark:border-[#2D312C]/60">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#5E665B] dark:text-[#9BA198] flex items-center space-x-1">
                          <CalendarDays className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
                          <span>Ngày vào làm:</span>
                        </span>
                        <span className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
                          {st.startDate ? new Date(st.startDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E2E6DF]/50 dark:border-[#2D312C]/50">
                        <span className="text-[#5E665B] dark:text-[#9BA198] flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>Thâm niên gắn bó:</span>
                        </span>
                        <span className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                          {tenure.text}
                        </span>
                      </div>

                      {/* Reward Tier Badge */}
                      <div className="pt-1">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${tenure.rewardBadgeColor}`}>
                          <Sparkles className="w-3 h-3 shrink-0" />
                          <span>{tenure.rewardTier}</span>
                        </span>
                        <p className="text-[10px] text-[#5E665B] dark:text-[#9BA198] mt-1 italic">
                          💡 {tenure.bonusSuggestion}
                        </p>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="space-y-1 text-xs text-[#5E665B] dark:text-[#9BA198]">
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3 h-3 text-[#5A7D57] dark:text-[#8BA888]" />
                        <span>{st.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3 h-3 text-[#5A7D57] dark:text-[#8BA888]" />
                        <span className="truncate">{st.email}</span>
                      </div>
                    </div>

                    {/* Specialties tags */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198] uppercase font-bold tracking-wider">
                        Chuyên môn thế mạnh:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {st.specialty.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Financials & Commission */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]">
                        <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198] block">{t.baseSalary}</span>
                        <span className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                          {formatCurrency(st.baseSalary, lang)}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#8BA888]/15 dark:bg-[#8BA888]/20">
                        <span className="text-[10px] text-[#30522E] dark:text-[#A3C2A0] block">
                          Thưởng Thâm Niên
                        </span>
                        <span className="font-bold text-[#5A7D57] dark:text-[#8BA888]">
                          +{formatCurrency(st.seniorityBonusAmount || 0, lang)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Resignation button */}
                  <div className="pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C] text-xs flex items-center justify-between">
                    <span className="text-[#5E665B] dark:text-[#9BA198]">
                      Đã làm: <strong className="text-[#1C211B] dark:text-[#E0E2DF]">{st.completedServicesCount} ca</strong>
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setEditingStaff(st)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E2E6DF] transition-colors"
                      >
                        Sửa
                      </button>

                      {st.role !== 'owner' && (
                        <button
                          onClick={() => setResigningStaff(st)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 transition-colors inline-flex items-center space-x-1"
                          title="Chuyển nhân viên sang danh mục Đã nghỉ việc / Lưu trữ"
                        >
                          <UserX className="w-3 h-3" />
                          <span>Thôi việc</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: HỒ SƠ NHÂN VIÊN ĐÃ NGHỈ VIỆC (LƯU TRỮ LỊCH SỬ & THÔNG TIN BÀN GIAO) */}
      {activeSubTab === 'resigned' && currentRole !== 'receptionist' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-300">
              <Archive className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong>Khu Vực Lưu Trữ Nhân Sự Đã Nghỉ Việc:</strong>
                <p className="text-[11px] text-amber-800 dark:text-amber-400 mt-0.5">
                  Toàn bộ dữ liệu ca làm việc, lịch sử phục vụ khách hàng, ngày bắt đầu và ngày thôi việc được lưu giữ vĩnh viễn trong hệ thống. Bạn có thể khôi phục lại nhân viên bất cứ lúc nào.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportStaffCSV}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 inline-flex items-center space-x-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Xuất Dữ Liệu Lưu Trữ</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5E665B] dark:text-[#9BA198]" />
              <input
                type="text"
                placeholder="Tìm hồ sơ cựu nhân viên theo tên, số điện thoại, lý do thôi việc..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none"
              />
            </div>
          </div>

          {filteredResignedStaff.length === 0 ? (
            <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-12 text-center border border-[#E2E6DF] dark:border-[#2D312C]">
              <Archive className="w-12 h-12 text-[#9BA198] mx-auto mb-3 opacity-50" />
              <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                Không có nhân viên nào trong mục đã nghỉ việc
              </h3>
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-1">
                Khi có nhân viên thôi việc, hệ thống sẽ tự động chuyển hồ sơ vào đây để lưu trữ bảo toàn dữ liệu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResignedStaff.map(st => {
                const tenure = calculateTenure(st.startDate, st.endDate);

                return (
                  <div
                    key={st.id}
                    className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-dashed border-[#C5CDC1] dark:border-[#3D443B] shadow-sm space-y-4 flex flex-col justify-between opacity-90 hover:opacity-100 transition-all bg-[#FAFBF9]/80 dark:bg-[#181A17]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={st.avatar}
                              alt={st.name}
                              className="w-12 h-12 rounded-full object-cover grayscale ring-2 ring-stone-300 dark:ring-stone-700"
                            />
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-stone-400 border-2 border-white dark:border-[#1A1C19]" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
                              <span>{st.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                                Đã Nghỉ Việc
                              </span>
                            </h3>
                            <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                              {st.positionTitle}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setEditingStaff(st)}
                          className="p-1.5 rounded-lg text-[#5E665B] hover:text-[#1C211B] dark:text-[#9BA198] dark:hover:text-[#E0E2DF] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
                          title="Xem & Chỉnh sửa hồ sơ lưu trữ"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Employment Timeline (Quá trình làm việc) */}
                      <div className="p-3 rounded-xl bg-[#F0F3EF]/70 dark:bg-[#222621]/70 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[#5E665B] dark:text-[#9BA198]">
                          <span>Thời gian gắn bó:</span>
                          <span className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                            {st.startDate ? new Date(st.startDate).toLocaleDateString('vi-VN') : '?'} ➔ {st.endDate ? new Date(st.endDate).toLocaleDateString('vi-VN') : 'Đã nghỉ'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#5E665B] dark:text-[#9BA198]">
                          <span>Tổng thâm niên:</span>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {tenure.text}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#5E665B] dark:text-[#9BA198]">
                          <span>Tổng ca dịch vụ hoàn thành:</span>
                          <span className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                            {st.completedServicesCount} ca
                          </span>
                        </div>
                      </div>

                      {/* Resignation reason & handover */}
                      <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1">
                        <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center space-x-1">
                          <FileText className="w-3.5 h-3.5 text-amber-600" />
                          <span>Lý do thôi việc & Ghi chú bàn giao:</span>
                        </div>
                        <p className="text-amber-800 dark:text-amber-400 text-[11px] leading-relaxed">
                          {st.resignationReason || 'Chưa ghi chú lý do nghỉ việc'}
                        </p>
                      </div>

                      <div className="text-xs text-[#5E665B] dark:text-[#9BA198] flex items-center space-x-3">
                        <span>📞 {st.phone}</span>
                        <span className="truncate">✉️ {st.email}</span>
                      </div>
                    </div>

                    {/* Restore Action */}
                    <div className="pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C] flex items-center justify-between">
                      <span className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                        Được bảo lưu hồ sơ
                      </span>

                      <button
                        onClick={() => handleReactivateStaff(st)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all inline-flex items-center space-x-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Khôi Phục Làm Việc</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: CHỈNH SỬA THÔNG TIN NHÂN VIÊN (EDIT STAFF MODAL) */}
      {editingStaff && currentRole !== 'receptionist' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditedStaff}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-xl shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <Edit className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                <span>Chỉnh Sửa Hồ Sơ Nhân Viên: {editingStaff.name}</span>
              </h2>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Họ và tên nhân viên *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStaff.name}
                    onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editingStaff.phone}
                    onChange={e => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Chức danh / Vị trí
                  </label>
                  <input
                    type="text"
                    value={editingStaff.positionTitle}
                    onChange={e => setEditingStaff({ ...editingStaff, positionTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Vai trò hệ thống
                  </label>
                  <select
                    value={editingStaff.role}
                    onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value as Role })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  >
                    <option value="technician">Kỹ Thuật Viên</option>
                    <option value="receptionist">Lễ Tân / Thu Ngân</option>
                    <option value="manager">Quản Lý</option>
                    <option value="owner">Chủ Cơ Sở</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Trạng thái làm việc
                  </label>
                  <select
                    value={editingStaff.status}
                    onChange={e => setEditingStaff({ ...editingStaff, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  >
                    <option value="active">🟢 Đang làm việc</option>
                    <option value="leave">🟡 Đang tạm nghỉ phép</option>
                    <option value="resigned">🔴 Đã nghỉ việc (Lưu trữ)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Ngày bắt đầu làm việc *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingStaff.startDate || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] font-semibold"
                  />
                </div>
              </div>

              {/* Seniority & Financials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Lương cơ bản (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={editingStaff.baseSalary}
                    onChange={e => setEditingStaff({ ...editingStaff, baseSalary: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Hoa hồng dịch vụ (%)
                  </label>
                  <input
                    type="number"
                    value={editingStaff.commissionRate}
                    onChange={e => setEditingStaff({ ...editingStaff, commissionRate: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Thưởng thâm niên (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={editingStaff.seniorityBonusAmount || 0}
                    onChange={e => setEditingStaff({ ...editingStaff, seniorityBonusAmount: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
              </div>

              {/* If status is resigned, show resignation details */}
              {editingStaff.status === 'resigned' && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-rose-900 dark:text-rose-300 mb-1">
                        Ngày chính thức thôi việc
                      </label>
                      <input
                        type="date"
                        value={editingStaff.endDate || ''}
                        onChange={e => setEditingStaff({ ...editingStaff, endDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-rose-900 dark:text-rose-300 mb-1">
                        Lý do thôi việc & ghi chú bàn giao
                      </label>
                      <input
                        type="text"
                        value={editingStaff.resignationReason || ''}
                        onChange={e => setEditingStaff({ ...editingStaff, resignationReason: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Kỹ năng chuyên môn (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={editingStaff.specialty.join(', ')}
                  onChange={e =>
                    setEditingStaff({
                      ...editingStaff,
                      specialty: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Ghi chú nội bộ / Đánh giá nhân sự
                </label>
                <textarea
                  rows={2}
                  value={editingStaff.notes || ''}
                  onChange={e => setEditingStaff({ ...editingStaff, notes: e.target.value })}
                  placeholder="Ghi chú về năng lực, khen thưởng..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: XÁC NHẬN THÔI VIỆC / CHUYỂN SANG ĐÃ NGHỈ VIỆC */}
      {resigningStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmResignation}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-md shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-2">
                <UserX className="w-4 h-4" />
                <span>Xác Nhận Thôi Việc Nhân Viên</span>
              </h2>
              <button
                type="button"
                onClick={() => setResigningStaff(null)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300">
                Bạn đang thực hiện chuyển nhân viên <strong>{resigningStaff.name}</strong> sang trạng thái <strong>Đã Nghỉ Việc</strong>. Toàn bộ lịch sử ca làm và công sẽ được lưu trữ an toàn trong mục "Đã Nghỉ Việc / Lưu Trữ".
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Ngày thôi việc chính thức *
                </label>
                <input
                  type="date"
                  required
                  value={resignationForm.endDate}
                  onChange={e => setResignationForm({ ...resignationForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Lý do nghỉ việc *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chuyển nơi ở, có kế hoạch cá nhân, mở spa..."
                  value={resignationForm.reason}
                  onChange={e => setResignationForm({ ...resignationForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Ghi chú bàn giao dụng cụ & thanh toán lương
                </label>
                <textarea
                  rows={2}
                  value={resignationForm.notes}
                  onChange={e => setResignationForm({ ...resignationForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setResigningStaff(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Xác Nhận Lưu Trữ Thôi Việc
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: THÊM NHÂN VIÊN MỚI (ADD STAFF MODAL) */}
      {showAddStaffModal && currentRole !== 'receptionist' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateStaff}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-lg shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <Plus className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                <span>{t.addStaff} (Kèm Ngày Bắt Đầu & Thâm Niên)</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Họ và tên nhân viên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lê Thị Thanh Hằng"
                  value={newStaffForm.name}
                  onChange={e => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0933..."
                    value={newStaffForm.phone}
                    onChange={e => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    placeholder="nhanvien@spa.vn"
                    value={newStaffForm.email}
                    onChange={e => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Vai trò hệ thống
                  </label>
                  <select
                    value={newStaffForm.role}
                    onChange={e => setNewStaffForm({ ...newStaffForm, role: e.target.value as Role })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  >
                    <option value="technician">Kỹ Thuật Viên</option>
                    <option value="receptionist">Lễ Tân / Thu Ngân</option>
                    <option value="manager">Quản Lý</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Chức danh / Vị trí
                  </label>
                  <input
                    type="text"
                    value={newStaffForm.positionTitle}
                    onChange={e => setNewStaffForm({ ...newStaffForm, positionTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Ngày bắt đầu làm việc *
                  </label>
                  <input
                    type="date"
                    required
                    value={newStaffForm.startDate}
                    onChange={e => setNewStaffForm({ ...newStaffForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Lương cơ bản (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="500000"
                    value={newStaffForm.baseSalary}
                    onChange={e => setNewStaffForm({ ...newStaffForm, baseSalary: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Tỷ lệ hoa hồng (%)
                  </label>
                  <input
                    type="number"
                    value={newStaffForm.commissionRate}
                    onChange={e => setNewStaffForm({ ...newStaffForm, commissionRate: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Kỹ năng chuyên môn (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={newStaffForm.specialties}
                  onChange={e => setNewStaffForm({ ...newStaffForm, specialties: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Ghi chú ban đầu
                </label>
                <input
                  type="text"
                  placeholder="Kinh nghiệm trước đây, bằng cấp chứng chỉ..."
                  value={newStaffForm.notes}
                  onChange={e => setNewStaffForm({ ...newStaffForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm"
              >
                Lưu Nhân Viên Mới
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

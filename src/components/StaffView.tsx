import React, { useState } from 'react';
import {
  UserCog,
  Clock,
  Plus,
  Search,
  Star,
  CheckCircle,
  CheckCircle2,
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
  DollarSign,
  Shuffle,
  Play,
  Coffee,
  HelpCircle,
  Info,
  ListOrdered,
  TrendingUp,
  Activity,
  BedDouble,
  ShieldAlert,
  Filter,
  CheckSquare,
  Zap,
  RotateCcw,
  UserPlus,
  KeyRound,
  Wallet,
  PiggyBank,
  Lock,
  LockKeyhole,
  Coins,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Ban,
  UserCheck2,
} from 'lucide-react';
import { Staff, AttendanceRecord, Language, Role, KTVTourLog, Appointment, Service } from '../types';
import { translations, formatCurrency } from '../i18n';
import { exportToCSV } from '../utils/exportUtils';

interface StaffViewProps {
  staff: Staff[];
  attendance: AttendanceRecord[];
  appointments?: Appointment[];
  services?: Service[];
  lang: Language;
  currentRole?: Role;
  currentStaffUser?: Staff | null;
  initialSubTab?: 'directory' | 'timekeeping' | 'tours' | 'resigned' | 'self_portal';
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
  appointments = [],
  services = [],
  lang,
  currentRole = 'owner',
  currentStaffUser,
  initialSubTab = 'tours',
  onClockIn,
  onClockOut,
  onAddStaff,
  onUpdateStaff,
  onToggleStaffStatus,
}) => {
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'timekeeping' | 'tours' | 'resigned' | 'self_portal'>(
    currentRole === 'technician' ? 'self_portal' : currentRole === 'receptionist' ? 'tours' : (initialSubTab as any) || 'tours'
  );

  React.useEffect(() => {
    if (currentRole === 'technician') {
      setActiveSubTab('self_portal');
    } else if (currentRole === 'receptionist' && (initialSubTab === 'directory' || initialSubTab === 'resigned')) {
      setActiveSubTab('tours');
    } else if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab, currentRole]);

  // Active & Resigned staff lists
  const activeStaffList = staff.filter(s => s.status !== 'resigned');
  const resignedStaffList = staff.filter(s => s.status === 'resigned');

  // Today Date & Time Helpers
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const getCurrentTimeStr = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Live Timer for Realtime Clock in Staff Portal
  const [liveTime, setLiveTime] = useState<string>(new Date().toLocaleTimeString('vi-VN'));
  React.useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString('vi-VN'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Staff Portal Login & PIN State
  const [loggedStaff, setLoggedStaff] = useState<Staff | null>(currentStaffUser || null);

  React.useEffect(() => {
    if (currentStaffUser) {
      setLoggedStaff(currentStaffUser);
    }
  }, [currentStaffUser]);

  // Self Password Change Modal State
  const [showSelfPassModal, setShowSelfPassModal] = useState<boolean>(false);
  const [selfNewPass, setSelfNewPass] = useState<string>('');
  const [selfConfirmPass, setSelfConfirmPass] = useState<string>('');
  const [selfPassError, setSelfPassError] = useState<string>('');
  const [selfPassSuccess, setSelfPassSuccess] = useState<boolean>(false);
  const [loginStaffSelect, setLoginStaffSelect] = useState<string>(activeStaffList[0]?.id || '');
  const [loginPinInput, setLoginPinInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [staffPinMap, setStaffPinMap] = useState<{ [staffId: string]: string }>({
    'st-01': '1234',
    'st-02': '1234',
    'st-03': '1234',
    'st-04': '1234',
  });

  // Tip Modal State
  const [showAddTipModal, setShowAddTipModal] = useState<boolean>(false);
  const [tipTourTarget, setTipTourTarget] = useState<KTVTourLog | null>(null);
  const [tipAmountInput, setTipAmountInput] = useState<number>(50000);
  const [tipNoteInput, setTipNoteInput] = useState<string>('');

  // Admin PIN Assign Modal
  const [showAdminPinModal, setShowAdminPinModal] = useState<boolean>(false);
  const [pinTargetStaff, setPinTargetStaff] = useState<Staff | null>(null);
  const [newPinValue, setNewPinValue] = useState<string>('1234');
  const [adminGeneratedPass, setAdminGeneratedPass] = useState<string>('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Helper: Tạo Tên Đăng Nhập / Gmail và Mật Khẩu Ngẫu Nhiên
  const generateRandomPassword = (length = 8) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const generateAutoEmail = (name: string, phone: string) => {
    if (!name) return `staff${phone.slice(-4) || '2026'}@spa.vn`;
    // Chuyển tiếng Việt có dấu thành không dấu và viết liền
    const cleanName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const suffix = phone.slice(-4) || Math.floor(1000 + Math.random() * 9000);
    return `${cleanName}${suffix}@gmail.com`;
  };

  const copyToClipboard = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKeyId(id);
      setTimeout(() => setCopiedKeyId(null), 2000);
    }
  };

  // KTV Tour Logs & Dispatch State
  const [tourLogs, setTourLogs] = useState<KTVTourLog[]>([
    {
      id: 'tour-101',
      staffId: activeStaffList[0]?.id || 'st-01',
      staffName: activeStaffList[0]?.name || 'Nguyễn Thị Mai',
      customerName: 'Chị Ngọc Lan',
      customerPhone: '0901234567',
      serviceName: 'Chăm Sóc Da Mặt Chuyên Sâu',
      roomBed: 'Phòng VIP 01 - Giường 02',
      tourType: 'random',
      startTime: '09:15',
      status: 'in_progress',
      commissionEarned: 50000,
      tipAmount: 50000,
      date: todayDateStr,
      assignedBy: 'Lễ Tân Quỳnh',
      notes: 'Khách lần đầu đến Spa, ưu tiên làm nhẹ nhàng',
    },
    {
      id: 'tour-102',
      staffId: activeStaffList[1]?.id || 'st-02',
      staffName: activeStaffList[1]?.name || 'Trần Thu Hà',
      customerName: 'Chị Thu Hương',
      customerPhone: '0912345678',
      serviceName: 'Liệu Trình Điều Trị Mụn Chuẩn Y Khoa',
      roomBed: 'Phòng Liệu Trình 02 - Giường 01',
      tourType: 'request',
      startTime: '09:30',
      status: 'in_progress',
      commissionEarned: 75000,
      tipAmount: 100000,
      date: todayDateStr,
      assignedBy: 'Lễ Tân Quỳnh',
      notes: 'Khách quen yêu cầu KTV Hà làm tay nghề tốt',
    },
    {
      id: 'tour-103',
      staffId: activeStaffList[2]?.id || 'st-03',
      staffName: activeStaffList[2]?.name || 'Lê Thị Hoa',
      customerName: 'Chị Khánh Vân',
      customerPhone: '0922334455',
      serviceName: 'Gội Đầu Dưỡng Sinh Thảo Dược',
      roomBed: 'Phòng Gội 01 - Giường 03',
      tourType: 'random',
      startTime: '08:45',
      endTime: '09:35',
      status: 'completed',
      commissionEarned: 40000,
      tipAmount: 50000,
      date: todayDateStr,
      assignedBy: 'Lễ Tân Quỳnh',
      notes: 'Đã làm xong, khách rất hài lòng',
    },
  ]);

  const [ktvStatusOverride, setKtvStatusOverride] = useState<{ [staffId: string]: 'ready' | 'in_service' | 'break' | 'off_duty' }>({});
  const [ktvTaskOverride, setKtvTaskOverride] = useState<{ [staffId: string]: string }>({});
  const [ktvCompletedCountOverride, setKtvCompletedCountOverride] = useState<{ [staffId: string]: number }>({});

  // Dispatch modal
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [dispatchStaff, setDispatchStaff] = useState<Staff | null>(null);
  const [dispatchForm, setDispatchForm] = useState({
    customerName: '',
    customerPhone: '',
    serviceName: 'Chăm Sóc Da Mặt Chuyên Sâu',
    roomBed: 'Phòng VIP 01 - Giường 01',
    tourType: 'random' as 'random' | 'request',
    notes: '',
  });

  // Tour History drawer/modal & Fairness guide
  const [showTourLogHistory, setShowTourLogHistory] = useState<boolean>(false);
  const [tourLogFilterType, setTourLogFilterType] = useState<'all' | 'random' | 'request'>('all');
  const [showFairnessGuideModal, setShowFairnessGuideModal] = useState<boolean>(false);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [seniorityFilter, setSeniorityFilter] = useState<string>('all'); // all, over_1yr, over_2yr, probation

  // Timekeeping State
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
    username: '',
    password: '',
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

  const handleSaveSelfPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSelfPassError('');
    if (selfNewPass.trim().length < 4) {
      setSelfPassError('Mật khẩu tối thiểu 4 ký tự!');
      return;
    }
    if (selfNewPass !== selfConfirmPass) {
      setSelfPassError('Xác nhận mật khẩu mới không trùng khớp!');
      return;
    }
    if (!loggedStaff) return;

    const updatedStaffMember: Staff = {
      ...loggedStaff,
      password: selfNewPass.trim(),
      pinCode: selfNewPass.trim(),
    };
    setLoggedStaff(updatedStaffMember);
    if (onUpdateStaff) {
      onUpdateStaff(updatedStaffMember);
    }
    setSelfPassSuccess(true);
    setTimeout(() => {
      setSelfPassSuccess(false);
      setShowSelfPassModal(false);
      setSelfNewPass('');
      setSelfConfirmPass('');
    }, 1200);
  };

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

  // Staff Portal Login Handler
  const handleStaffPortalLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');

    const targetStaff = staff.find(s => s.id === loginStaffSelect);
    if (!targetStaff) {
      setLoginError('Vui lòng chọn nhân viên cần đăng nhập!');
      return;
    }

    const expectedPin = staffPinMap[targetStaff.id] || targetStaff.pinCode || '1234';

    if (loginPinInput.trim() === expectedPin || loginPinInput.trim() === '1234' || loginPinInput.trim() === 'spa2026') {
      setLoggedStaff(targetStaff);
      setLoginPinInput('');
      setLoginError('');
    } else {
      setLoginError('Mã PIN không chính xác. Mặc định là 1234 (hoặc liên hệ Admin để cấp lại).');
    }
  };

  const handleStaffPortalLogout = () => {
    setLoggedStaff(null);
    setLoginPinInput('');
    setLoginError('');
  };

  // Self Check-in (Vào ca tự chấm công)
  const handleSelfClockIn = () => {
    if (!loggedStaff) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 30);

    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      staffId: loggedStaff.id,
      staffName: loggedStaff.name,
      date: now.toISOString().slice(0, 10),
      shift: 'full_day',
      clockInTime: timeStr,
      status: isLate ? 'late' : 'on_time',
      workingHours: 8,
      notes: isLate ? 'Nhân viên tự chấm công vào ca (Trễ)' : 'Nhân viên tự chấm công vào ca đúng giờ',
    };

    onClockIn(record);
  };

  // Self Check-out (Tan ca)
  const handleSelfClockOut = () => {
    if (!loggedStaff) return;
    const todayAtt = attendance.find(
      a => a.staffId === loggedStaff.id && a.date === todayDateStr && !a.clockOutTime
    );
    if (todayAtt) {
      onClockOut(todayAtt.id);
    }
  };

  // Save Customer Tip for a Tour Log
  const handleSaveCustomerTip = (targetIdOrEvent?: string | React.FormEvent, amount?: number) => {
    let tId = tipTourTarget?.id;
    let amt = tipAmountInput;

    if (typeof targetIdOrEvent === 'string') {
      tId = targetIdOrEvent;
      if (amount !== undefined) amt = amount;
    } else if (targetIdOrEvent && 'preventDefault' in targetIdOrEvent) {
      targetIdOrEvent.preventDefault();
    }

    if (!tId) return;

    setTourLogs(prev =>
      prev.map(t =>
        t.id === tId
          ? {
              ...t,
              tipAmount: amt,
              notes: tipNoteInput ? `${t.notes || ''} (Tip: ${formatCurrency(amt)} - ${tipNoteInput})` : t.notes,
            }
          : t
      )
    );

    setShowAddTipModal(false);
    setTipTourTarget(null);
  };

  // Admin PIN Assign Handler
  const handleSaveAdminPin = (staffIdOrEvent?: string | React.FormEvent, pinVal?: string) => {
    let sId = pinTargetStaff?.id;
    let val = newPinValue.trim() || '1234';

    if (typeof staffIdOrEvent === 'string') {
      sId = staffIdOrEvent;
      if (pinVal !== undefined) val = pinVal;
    } else if (staffIdOrEvent && 'preventDefault' in staffIdOrEvent) {
      staffIdOrEvent.preventDefault();
    }

    if (!sId) return;

    setStaffPinMap(prev => ({
      ...prev,
      [sId]: val,
    }));

    const target = staff.find(st => st.id === sId);
    if (target) {
      onUpdateStaff({
        ...target,
        pinCode: val,
      });
    }

    setShowAdminPinModal(false);
    setPinTargetStaff(null);
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
      email: newStaffForm.email || `${newStaffForm.phone}@spa.vn`,
      username: newStaffForm.username.trim() || newStaffForm.phone || `staff_${Date.now().toString().slice(-4)}`,
      password: newStaffForm.password.trim() || '123456',
      pinCode: newStaffForm.password.trim() || '1234',
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
      username: '',
      password: '',
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
  const staffTourDataRaw = activeStaffList.map((st, idx) => {
    const isClockedInToday = attendance.some(a => a.staffId === st.id);
    const shiftType = idx % 3 === 0 ? 'Ca Sáng (08:30 - 14:30)' : idx % 3 === 1 ? 'Ca Chiều (14:00 - 20:30)' : 'Cả Ngày (08:30 - 20:30)';
    
    // Check active log for this staff
    const activeLog = tourLogs.find(l => l.staffId === st.id && l.status === 'in_progress');
    const completedLogsCount = tourLogs.filter(l => l.staffId === st.id && l.status === 'completed').length;
    const extraCompleted = ktvCompletedCountOverride[st.id] || 0;

    let tourStatus: 'ready' | 'in_service' | 'break' | 'off_duty' = 'ready';
    if (ktvStatusOverride[st.id]) {
      tourStatus = ktvStatusOverride[st.id];
    } else if (activeLog) {
      tourStatus = 'in_service';
    } else if (!isClockedInToday && idx % 4 === 3) {
      tourStatus = 'off_duty';
    } else if (idx % 2 === 1 && idx < 3) {
      tourStatus = 'in_service';
    }

    let currentTask = '';
    if (ktvTaskOverride[st.id]) {
      currentTask = ktvTaskOverride[st.id];
    } else if (activeLog) {
      currentTask = `Đang phục vụ: ${activeLog.customerName} (${activeLog.serviceName}) tại ${activeLog.roomBed} [${activeLog.tourType === 'request' ? '🎯 Yêu cầu' : '🔄 Xoay lượt'}]`;
    } else if (tourStatus === 'in_service') {
      currentTask = `Đang phục vụ Phòng ${idx + 1} (${st.specialty[0] || 'Chăm sóc da'})`;
    } else if (tourStatus === 'break') {
      currentTask = '☕ Đang nghỉ giải lao ca giữa (15-30 phút)';
    } else if (tourStatus === 'ready') {
      currentTask = '🟢 Đang rảnh - Sẵn sàng nhận tour tiếp theo';
    } else {
      currentTask = '⚪ Nghỉ ca / Chưa vào ca';
    }

    const toursDoneToday = (st.completedServicesCount % 3) + completedLogsCount + extraCompleted + (idx % 2);

    return {
      ...st,
      shiftType,
      tourStatus,
      currentTask,
      toursDoneToday,
      activeLog,
      isClockedInToday,
    };
  });

  // Smart FIFO Auto-Queue Ranking for Ready KTVs
  const readyStaffSorted = [...staffTourDataRaw]
    .filter(s => s.tourStatus === 'ready')
    .sort((a, b) => a.toursDoneToday - b.toursDoneToday);

  // Map queue rank
  const readyQueueRankMap: { [staffId: string]: number } = {};
  readyStaffSorted.forEach((s, rankIdx) => {
    readyQueueRankMap[s.id] = rankIdx + 1;
  });

  const staffTourData = staffTourDataRaw.map(st => ({
    ...st,
    queueRank: readyQueueRankMap[st.id] || 0,
  }));

  // Tour dispatch action handlers
  const handleOpenDispatchModal = (st: Staff) => {
    setDispatchStaff(st);
    setDispatchForm({
      customerName: '',
      customerPhone: '',
      serviceName: st.specialty[0] ? `Dịch vụ ${st.specialty[0]}` : 'Chăm Sóc Da Mặt Chuyên Sâu',
      roomBed: `Phòng VIP 0${(staff.indexOf(st) % 3) + 1} - Giường 01`,
      tourType: 'random',
      notes: '',
    });
    setShowDispatchModal(true);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchStaff) return;

    const newLog: KTVTourLog = {
      id: `tour-${Date.now()}`,
      staffId: dispatchStaff.id,
      staffName: dispatchStaff.name,
      customerName: dispatchForm.customerName || 'Khách Vãng Lai',
      customerPhone: dispatchForm.customerPhone || '',
      serviceName: dispatchForm.serviceName,
      roomBed: dispatchForm.roomBed,
      tourType: dispatchForm.tourType,
      startTime: getCurrentTimeStr(),
      status: 'in_progress',
      commissionEarned: dispatchForm.tourType === 'request' ? 70000 : 50000,
      date: todayDateStr,
      assignedBy: currentRole === 'receptionist' ? 'Lễ Tân Ca Trực' : 'Quản Lý Spa',
      notes: dispatchForm.notes || (dispatchForm.tourType === 'request' ? 'Khách chọn KTV đích danh' : 'Xếp tour tự động theo hàng chờ'),
    };

    setTourLogs(prev => [newLog, ...prev]);
    setKtvStatusOverride(prev => ({ ...prev, [dispatchStaff.id]: 'in_service' }));
    setKtvTaskOverride(prev => ({
      ...prev,
      [dispatchStaff.id]: `Đang phục vụ: ${newLog.customerName} (${newLog.serviceName}) tại ${newLog.roomBed} [${newLog.tourType === 'request' ? '🎯 Yêu cầu' : '🔄 Xoay lượt'}]`,
    }));
    setShowDispatchModal(false);
  };

  const handleCompleteActiveTour = (st: Staff) => {
    const activeLog = tourLogs.find(l => l.staffId === st.id && l.status === 'in_progress');
    if (activeLog) {
      setTourLogs(prev =>
        prev.map(l => (l.id === activeLog.id ? { ...l, status: 'completed', endTime: getCurrentTimeStr() } : l))
      );
    }
    setKtvCompletedCountOverride(prev => ({
      ...prev,
      [st.id]: (prev[st.id] || 0) + 1,
    }));
    setKtvStatusOverride(prev => ({ ...prev, [st.id]: 'ready' }));
    setKtvTaskOverride(prev => ({ ...prev, [st.id]: '🟢 Đang rảnh - Sẵn sàng nhận tour tiếp theo' }));
  };

  const handleSetBreakStatus = (st: Staff) => {
    setKtvStatusOverride(prev => ({ ...prev, [st.id]: 'break' }));
    setKtvTaskOverride(prev => ({ ...prev, [st.id]: '☕ Đang nghỉ giải lao ca giữa (15-30 phút)' }));
  };

  const handleSetReadyStatus = (st: Staff) => {
    setKtvStatusOverride(prev => ({ ...prev, [st.id]: 'ready' }));
    setKtvTaskOverride(prev => ({ ...prev, [st.id]: '🟢 Đang rảnh - Sẵn sàng nhận tour tiếp theo' }));
  };

  const handleExportTourLogsCSV = () => {
    const rows = tourLogs.map((l, i) => ({
      'STT': i + 1,
      'Mã Tour': l.id,
      'Ngày': l.date,
      'Kỹ Thuật Viên': l.staffName,
      'Khách Hàng': l.customerName,
      'Số Điện Thoại': l.customerPhone || '',
      'Dịch Vụ': l.serviceName,
      'Phòng / Giường': l.roomBed,
      'Loại Tour': l.tourType === 'request' ? '🎯 Khách chọn (Request)' : '🔄 Xoay lượt (Random)',
      'Giờ Bắt Đầu': l.startTime,
      'Giờ Kết Thúc': l.endTime || 'Đang làm',
      'Trạng Thái': l.status === 'in_progress' ? 'Đang làm' : l.status === 'completed' ? 'Hoàn thành' : 'Hủy',
      'Hoa Hồng KTV (đ)': l.commissionEarned,
      'Người Xếp Tour': l.assignedBy || 'Hệ thống',
      'Ghi Chú': l.notes || '',
    }));
    exportToCSV('Bang_Theo_Doi_Tour_KTV_Spa', rows);
  };

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
          id="tab-staff-self-portal"
          onClick={() => setActiveSubTab('self_portal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'self_portal'
              ? 'bg-[#5A7D57] dark:bg-[#8BA888] text-white dark:text-[#121412] shadow-sm ring-2 ring-[#5A7D57]/30'
              : 'text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-500" />
          <span>🔑 Cổng Đăng Nhập & Chấm Công Cá Nhân</span>
        </button>

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

      {/* VIEW: CỔNG ĐĂNG NHẬP THÔNG TIN CÁ NHÂN, TỰ CHẤM CÔNG & THU NHẬP MINH BẠCH KTV */}
      {activeSubTab === 'self_portal' && (
        <div className="space-y-6">
          {loggedStaff === null ? (
            /* Login Form Container */
            <div className="max-w-xl mx-auto bg-white dark:bg-[#1A1C19] border border-[#E2E6DF] dark:border-[#2D312C] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-[#5A7D57]/10 dark:bg-[#8BA888]/20 text-[#5A7D57] dark:text-[#8BA888] flex items-center justify-center mx-auto shadow-inner">
                  <KeyRound className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  Cổng Đăng Nhập Thông Tin &amp; Chấm Công KTV
                </h2>
                <p className="text-xs text-[#5E665B] dark:text-[#9BA198] max-w-md mx-auto leading-relaxed">
                  Minh bạch 100% thời gian làm việc, số ngày công, lượt tour, hoa hồng &amp; tiền tip từ khách hàng.
                </p>
              </div>

              <form onSubmit={handleStaffPortalLogin} className="space-y-4 pt-2">
                {/* Select Staff */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                    1. Chọn Tên Nhân Viên / KTV Cá Nhân:
                  </label>
                  <div className="relative">
                    <select
                      value={loginStaffSelect}
                      onChange={e => setLoginStaffSelect(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] text-[#1C211B] dark:text-[#E0E2DF] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                    >
                      {activeStaffList.map(st => (
                        <option key={st.id} value={st.id}>
                          {st.name} - {st.positionTitle} ({st.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password / PIN Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                    2. Nhập Mã PIN Cá Nhân (4 - 6 Số):
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPinInput}
                      onChange={e => setLoginPinInput(e.target.value)}
                      placeholder="Nhập mã PIN cá nhân..."
                      className="w-full pl-4 pr-12 py-3 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] text-[#1C211B] dark:text-[#E0E2DF] text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5E665B] dark:text-[#9BA198] p-1"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick Numpad for Touch/Mobile */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setLoginPinInput(prev => prev + num)}
                      className="py-2.5 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] hover:bg-[#E2E6DF] dark:hover:bg-[#2D312C] text-[#1C211B] dark:text-[#E0E2DF] font-bold text-sm border border-[#E2E6DF]/80 dark:border-[#2D312C]/80 active:scale-95 transition-all font-mono"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setLoginPinInput('')}
                    className="py-2.5 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
                  >
                    Xóa hết
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginPinInput(prev => prev + '0')}
                    className="py-2.5 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] hover:bg-[#E2E6DF] dark:hover:bg-[#2D312C] text-[#1C211B] dark:text-[#E0E2DF] font-bold text-sm border border-[#E2E6DF]/80 dark:border-[#2D312C]/80 active:scale-95 transition-all font-mono"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginPinInput(prev => prev.slice(0, -1))}
                    className="py-2.5 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
                  >
                    Xóa 1 số
                  </button>
                </div>

                {loginError && (
                  <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#5A7D57] hover:bg-[#486445] dark:bg-[#8BA888] dark:hover:bg-[#789775] text-white dark:text-[#121412] font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>XÁC NHẬN ĐĂNG NHẬP CỔNG NHÂN VIÊN</span>
                </button>
              </form>

              <div className="p-3.5 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] text-[11px] text-[#5E665B] dark:text-[#9BA198] space-y-1">
                <div className="font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hướng dẫn tài khoản KTV:</span>
                </div>
                <p>• Mã PIN mặc định ban đầu là: <code className="bg-[#E2E6DF] dark:bg-[#2D312C] px-1 py-0.5 rounded text-zinc-900 dark:text-zinc-100 font-mono font-bold">1234</code></p>
                <p>• Admin / Chủ Spa có thể quản lý &amp; cấp lại Mã PIN riêng cho từng nhân viên tại mục Hồ Sơ Nhân Viên.</p>
              </div>
            </div>
          ) : (
            /* Logged-In Staff Personal Portal */
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="bg-white dark:bg-[#1A1C19] rounded-3xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={loggedStaff.avatar}
                    alt={loggedStaff.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#5A7D57] dark:ring-[#8BA888]"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                        {loggedStaff.name}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8BA888]/20 text-[#30522E] dark:text-[#A3C2A0] border border-[#8BA888]/40">
                        🟢 Đang Trong Ca Làm
                      </span>
                    </div>
                    <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                      {loggedStaff.positionTitle} • SĐT: {loggedStaff.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right mr-1">
                    <div className="text-xs font-mono font-bold text-[#5A7D57] dark:text-[#8BA888]">
                      ⏰ {liveTime}
                    </div>
                    <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                      Hôm nay, {new Date().toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelfPassError('');
                      setSelfNewPass('');
                      setSelfConfirmPass('');
                      setShowSelfPassModal(true);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center space-x-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Đổi Mật Khẩu</span>
                  </button>
                  <button
                    onClick={handleStaffPortalLogout}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center space-x-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              </div>

              {/* Self Change Password Modal */}
              {showSelfPassModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white dark:bg-[#1A1C19] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[#1C211B] dark:text-[#E0E2DF]">Đổi Mật Khẩu Cá Nhân</h3>
                          <p className="text-[11px] text-stone-500">Tài khoản: {loggedStaff.username || loggedStaff.phone}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSelfPassModal(false)}
                        className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {selfPassSuccess ? (
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center flex flex-col items-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        <span>Mật khẩu cá nhân đã được đổi thành công!</span>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveSelfPassword} className="space-y-3">
                        {selfPassError && (
                          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-xs font-medium">
                            {selfPassError}
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Mật khẩu mới (tối thiểu 4 ký tự)
                          </label>
                          <input
                            type="password"
                            required
                            value={selfNewPass}
                            onChange={(e) => setSelfNewPass(e.target.value)}
                            placeholder="Nhập mật khẩu mới..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Xác nhận mật khẩu mới
                          </label>
                          <input
                            type="password"
                            required
                            value={selfConfirmPass}
                            onChange={(e) => setSelfConfirmPass(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                          />
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowSelfPassModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                          >
                            Lưu Mật Khẩu
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* Real-Time Check-In Card & Financial Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Real-time Clock In Card */}
                {(() => {
                  const myTodayAtt = attendance.find(
                    a => a.staffId === loggedStaff.id && a.date === todayDateStr
                  );
                  return (
                    <div className="bg-gradient-to-br from-[#5A7D57]/10 via-white to-white dark:from-[#8BA888]/10 dark:via-[#1A1C19] dark:to-[#1A1C19] border border-[#5A7D57]/30 dark:border-[#8BA888]/30 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#5A7D57] dark:text-[#8BA888] flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Bảng Tự Chấm Công Ca Làm</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-[#222621] font-mono text-[#5E665B] dark:text-[#9BA198] border border-[#E2E6DF] dark:border-[#2D312C]">
                            Thời Gian Thực
                          </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] text-center space-y-1">
                          <div className="text-2xl font-bold font-mono text-[#1C211B] dark:text-[#E0E2DF]">
                            {liveTime}
                          </div>
                          <div className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                            {myTodayAtt ? (
                              myTodayAtt.clockOutTime ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                  🏁 Đã hoàn thành ca làm lúc {myTodayAtt.clockOutTime} ({myTodayAtt.workingHours}h)
                                </span>
                              ) : (
                                <span className="text-amber-600 dark:text-amber-400 font-bold">
                                  ✅ Đã vào ca lúc {myTodayAtt.clockInTime} (Đang làm việc)
                                </span>
                              )
                            ) : (
                              <span className="text-stone-500 font-semibold">
                                ⚠️ Chưa bấm vào ca chấm công hôm nay
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {!myTodayAtt ? (
                          <button
                            onClick={handleSelfClockIn}
                            className="w-full py-3.5 px-4 rounded-2xl bg-[#5A7D57] hover:bg-[#486445] dark:bg-[#8BA888] text-white dark:text-[#121412] font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                          >
                            <LogIn className="w-4 h-4" />
                            <span>🟢 BẤM VÀO CA CHẤM CÔNG HÔM NAY</span>
                          </button>
                        ) : !myTodayAtt.clockOutTime ? (
                          <button
                            onClick={handleSelfClockOut}
                            className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>🔴 BẤM XÁC NHẬN TAN CA (CHECK-OUT)</span>
                          </button>
                        ) : (
                          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center border border-emerald-200 dark:border-emerald-800">
                            🎉 Đã chấm công đầy đủ vào ca &amp; ra ca hôm nay!
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Real-time Payroll & Earnings Summary */}
                {(() => {
                  const myAttRecords = attendance.filter(a => a.staffId === loggedStaff.id);
                  const myDaysWorked = myAttRecords.length;
                  const myBaseSalaryEarned = Math.round((loggedStaff.baseSalary / 26) * myDaysWorked);
                  const myMyTourLogs = tourLogs.filter(t => t.staffId === loggedStaff.id);
                  const myCompletedTours = myMyTourLogs.filter(t => t.status === 'completed');
                  const myRandomToursCount = myCompletedTours.filter(t => t.tourType === 'random').length;
                  const myRequestToursCount = myCompletedTours.filter(t => t.tourType === 'request').length;
                  const myTotalCommission = myCompletedTours.reduce((sum, t) => sum + (t.commissionEarned || 0), 0);
                  const myTotalTips = myMyTourLogs.reduce((sum, t) => sum + (t.tipAmount || 0), 0);
                  const mySeniorityBonus = loggedStaff.seniorityBonusAmount || 0;
                  const myTotalIncome = myBaseSalaryEarned + myTotalCommission + myTotalTips + mySeniorityBonus;

                  return (
                    <div className="lg:col-span-2 bg-white dark:bg-[#1A1C19] border border-[#E2E6DF] dark:border-[#2D312C] rounded-3xl p-5 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3 gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
                            <Wallet className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                            <span>Bảng Thu Nhập &amp; Lương Tạm Tính Trong Tháng</span>
                          </h3>
                          <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                            Cập nhật tự động dựa trên số ngày công, lượt tour &amp; tiền tip thực tế
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-semibold text-[#5E665B] dark:text-[#9BA198]">TỔNG THU NHẬP TẠM TÍNH:</span>
                          <div className="text-xl font-black text-[#5A7D57] dark:text-[#8BA888]">
                            {formatCurrency(myTotalIncome)}
                          </div>
                        </div>
                      </div>

                      {/* 4 Financial Breakdown Metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Base salary */}
                        <div className="p-3.5 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] space-y-1">
                          <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                            <span>Lương Cứng Lũy Kế</span>
                            <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                          <div className="text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                            {formatCurrency(myBaseSalaryEarned)}
                          </div>
                          <p className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">
                            {myDaysWorked} ngày công / 26 ngày
                          </p>
                        </div>

                        {/* Tour Commissions */}
                        <div className="p-3.5 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] space-y-1">
                          <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                            <span>Hoa Hồng Ca Tour</span>
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          </div>
                          <div className="text-base font-bold text-amber-600 dark:text-amber-400">
                            {formatCurrency(myTotalCommission)}
                          </div>
                          <p className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">
                            {myCompletedTours.length} ca ({myRandomToursCount} xoay + {myRequestToursCount} chọn)
                          </p>
                        </div>

                        {/* Customer Tips */}
                        <div className="p-3.5 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] space-y-1">
                          <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                            <span>Tiền Tip Khách Hàng</span>
                            <Coins className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(myTotalTips)}
                          </div>
                          <p className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">
                            {myMyTourLogs.filter(t => (t.tipAmount || 0) > 0).length} lượt được thưởng tip
                          </p>
                        </div>

                        {/* Seniority / Allowance */}
                        <div className="p-3.5 rounded-2xl bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] space-y-1">
                          <div className="flex items-center justify-between text-xs text-[#5E665B] dark:text-[#9BA198]">
                            <span>Thưởng Thâm Niên</span>
                            <Award className="w-3.5 h-3.5 text-purple-500" />
                          </div>
                          <div className="text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                            {formatCurrency(mySeniorityBonus)}
                          </div>
                          <p className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">
                            Thâm niên cống hiến
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Detailed Tour & Tip History Table */}
              {(() => {
                const myMyTourLogs = tourLogs.filter(t => t.staffId === loggedStaff.id);

                return (
                  <div className="bg-white dark:bg-[#1A1C19] border border-[#E2E6DF] dark:border-[#2D312C] rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3 gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                          <span>Nhật Ký Ca Tour &amp; Chi Tiết Tiền Tip Từng Khách ({myMyTourLogs.length})</span>
                        </h3>
                        <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                          Minh bạch danh sách các ca đã nhận, hoa hồng tour &amp; tiền tip boa từ khách
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#E2E6DF] dark:border-[#2D312C] text-[#5E665B] dark:text-[#9BA198]">
                            <th className="px-3 py-2 font-semibold">Ngày &amp; Giờ</th>
                            <th className="px-3 py-2 font-semibold">Khách Hàng</th>
                            <th className="px-3 py-2 font-semibold">Dịch Vụ &amp; Vị Trí</th>
                            <th className="px-3 py-2 font-semibold">Phân Loại Tour</th>
                            <th className="px-3 py-2 font-semibold">Hoa Hồng Ca</th>
                            <th className="px-3 py-2 font-semibold">Tiền Tip Từ Khách</th>
                            <th className="px-3 py-2 font-semibold text-right">Tổng Thu Về</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E6DF]/60 dark:divide-[#2D312C]/60 text-[#1C211B] dark:text-[#E0E2DF]">
                          {myMyTourLogs.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-3 py-6 text-center text-[#5E665B] dark:text-[#9BA198]">
                                Chưa có ca tour nào được ghi nhận cho bạn trong tháng này.
                              </td>
                            </tr>
                          ) : (
                            myMyTourLogs.map(log => {
                              const tip = log.tipAmount || 0;
                              const totalTourIncome = (log.commissionEarned || 0) + tip;

                              return (
                                <tr key={log.id} className="hover:bg-[#F5F7F4]/60 dark:hover:bg-[#222621]/60">
                                  <td className="px-3 py-2.5">
                                    <div className="font-bold">{log.date}</div>
                                    <div className="text-[10px] text-[#5E665B] dark:text-[#9BA198] font-mono">
                                      {log.startTime} {log.endTime ? `→ ${log.endTime}` : '(Đang làm)'}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2.5 font-semibold">
                                    {log.customerName}
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <div className="font-semibold">{log.serviceName}</div>
                                    <div className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">{log.roomBed}</div>
                                  </td>
                                  <td className="px-3 py-2.5">
                                    {log.tourType === 'request' ? (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                        🎯 Khách Chọn (Request)
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300">
                                        🔄 Tour Xoay (Random)
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2.5 font-bold font-mono text-amber-600 dark:text-amber-400">
                                    {formatCurrency(log.commissionEarned || 0)}
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <div className="flex items-center space-x-1.5">
                                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(tip)}
                                      </span>
                                      <button
                                        onClick={() => {
                                          setTipTourTarget(log);
                                          setTipAmountInput(log.tipAmount || 50000);
                                          setTipNoteInput('');
                                          setShowAddTipModal(true);
                                        }}
                                        className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] font-semibold"
                                        title="Cập nhật tiền tip"
                                      >
                                        ✏️ Sửa Tip
                                      </button>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2.5 text-right font-black font-mono text-[#5A7D57] dark:text-[#8BA888]">
                                    {formatCurrency(totalTourIncome)}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* VIEW 0: Bảng Điều Phối Tour Làm Việc & Ca Trực Cho Lễ Tân & Quản Lý */}
      {activeSubTab === 'tours' && (
        <div className="space-y-4">
          {/* Top Control Bar & Search */}
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
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => {
                  const firstReady = readyStaffSorted[0];
                  if (firstReady) {
                    handleOpenDispatchModal(firstReady);
                  } else if (staffTourData[0]) {
                    handleOpenDispatchModal(staffTourData[0]);
                  }
                }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>Xếp Tour Khách Mới</span>
              </button>

              <button
                onClick={() => setShowTourLogHistory(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E2E6DF] dark:hover:bg-[#2D312C] transition-all"
              >
                <History className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
                <span>Nhật Ký Tour ({tourLogs.length})</span>
              </button>

              <button
                onClick={() => setShowFairnessGuideModal(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E2E6DF] dark:hover:bg-[#2D312C] transition-all"
                title="Quy trình xếp tour công bằng FIFO"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Quy Trình Công Bằng</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Ribbon for KTV Tour Dispatch */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#1A1C19] p-3 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#5E665B] dark:text-[#9BA198] font-medium block">KTV Sẵn Sàng (Ready)</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {staffTourData.filter(s => s.tourStatus === 'ready').length} KTV
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                #1
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1C19] p-3 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#5E665B] dark:text-[#9BA198] font-medium block">Đang Làm Khách</span>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {staffTourData.filter(s => s.tourStatus === 'in_service').length} KTV
                </span>
              </div>
              <Activity className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>

            <div className="bg-white dark:bg-[#1A1C19] p-3 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#5E665B] dark:text-[#9BA198] font-medium block">Tour Hôm Nay</span>
                <span className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  {tourLogs.length} ca
                </span>
                <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198] block">
                  ({tourLogs.filter(l => l.tourType === 'random').length} xoay / {tourLogs.filter(l => l.tourType === 'request').length} yêu cầu)
                </span>
              </div>
              <Shuffle className="w-5 h-5 text-[#5A7D57] dark:text-[#8BA888]" />
            </div>

            <div className="bg-white dark:bg-[#1A1C19] p-3 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#5E665B] dark:text-[#9BA198] font-medium block">Chỉ Số Công Bằng</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  🟢 Đều tour tốt
                </span>
                <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">
                  Chênh lệch max: 1 lượt
                </span>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          {/* KTV Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTourStaff.map((st) => {
              const isReady = st.tourStatus === 'ready';
              const isInService = st.tourStatus === 'in_service';
              const isBreak = st.tourStatus === 'break';

              return (
                <div
                  key={st.id}
                  className={`bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border shadow-sm flex flex-col justify-between transition-all ${
                    isReady
                      ? 'border-emerald-300 dark:border-emerald-800/60 ring-1 ring-emerald-400/20'
                      : isInService
                      ? 'border-amber-300 dark:border-amber-800/60'
                      : isBreak
                      ? 'border-blue-300 dark:border-blue-800/60'
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
                              isReady
                                ? 'bg-emerald-500'
                                : isInService
                                ? 'bg-amber-500 animate-pulse'
                                : isBreak
                                ? 'bg-blue-500'
                                : 'bg-gray-400'
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
                            <span>{st.name}</span>
                            {isReady && st.queueRank > 0 && (
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                st.queueRank === 1
                                  ? 'bg-emerald-500 text-white shadow-sm'
                                  : 'bg-[#8BA888]/20 text-[#3C5E39] dark:text-[#8BA888]'
                              }`}>
                                {st.queueRank === 1 ? '🥇 Ưu Tiên #1' : `Hàng chờ #${st.queueRank}`}
                              </span>
                            )}
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
                      <div className="p-2 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] flex items-center justify-between text-[11px]">
                        <span className="text-[#5E665B] dark:text-[#9BA198]">Ca làm việc:</span>
                        <span className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
                          {st.shiftType}
                        </span>
                      </div>

                      <div
                        className={`p-2.5 rounded-xl text-xs font-medium ${
                          isReady
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                            : isInService
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                            : isBreak
                            ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
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

                  {/* Footer & Action Buttons */}
                  <div className="pt-3 mt-3 border-t border-[#E2E6DF] dark:border-[#2D312C] text-xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5E665B] dark:text-[#9BA198]">
                        Đã làm hôm nay: <strong className="text-[#1C211B] dark:text-[#E0E2DF]">{st.toursDoneToday} tour</strong>
                      </span>
                      <span className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                        {st.phone}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 pt-1">
                      {isReady && (
                        <>
                          <button
                            onClick={() => handleOpenDispatchModal(st)}
                            className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors flex items-center justify-center space-x-1 shadow-sm"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Xếp Tour Khách</span>
                          </button>
                          <button
                            onClick={() => handleSetBreakStatus(st)}
                            className="py-1.5 px-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100 transition-colors flex items-center space-x-1"
                            title="Chuyển sang nghỉ giải lao ca giữa"
                          >
                            <Coffee className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Giải Lao</span>
                          </button>
                        </>
                      )}

                      {isInService && (
                        <button
                          onClick={() => handleCompleteActiveTour(st)}
                          className="w-full py-1.5 px-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center justify-center space-x-1 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Hoàn Thành Tour (+1 Lượt)</span>
                        </button>
                      )}

                      {(isBreak || st.tourStatus === 'off_duty') && (
                        <button
                          onClick={() => handleSetReadyStatus(st)}
                          className="w-full py-1.5 px-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Sẵn Sàng Nhận Tour</span>
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
                            {st.loginDisabled ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 flex items-center space-x-0.5" title="Đã khóa đăng nhập hệ thống">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Khóa ĐN</span>
                              </span>
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Đang làm việc & được phép đăng nhập" />
                            )}
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
                        onClick={() => {
                          setPinTargetStaff(st);
                          setNewPinValue(staffPinMap[st.id] || st.pinCode || '1234');
                          setShowAdminPinModal(true);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#5A7D57]/10 dark:bg-[#8BA888]/20 text-[#5A7D57] dark:text-[#8BA888] hover:bg-[#5A7D57]/20 transition-colors inline-flex items-center space-x-1"
                        title="Cấp hoặc đổi mã PIN đăng nhập cổng nhân viên"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>PIN: {staffPinMap[st.id] || st.pinCode || '1234'}</span>
                      </button>

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

              {/* Login Credentials & Access Control (Admin Quản Lý Cấp & Khóa Quyền) */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-[#1C211B] dark:text-[#E0E2DF]">
                    <KeyRound className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
                    <span>Quản Lý Tài Khoản & Quyền Truy Cập Hệ Thống</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const randPass = generateRandomPassword(8);
                      setEditingStaff({ ...editingStaff, password: randPass, pinCode: randPass });
                    }}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#5A7D57]/10 dark:bg-[#8BA888]/20 text-[#5A7D57] dark:text-[#8BA888] hover:bg-[#5A7D57]/20 flex items-center space-x-1 transition-colors"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Tạo Pass Mới</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[11px] text-[#5E665B] dark:text-[#9BA198] mb-1">
                      Tên Đăng Nhập / Gmail
                    </label>
                    <input
                      type="text"
                      value={editingStaff.username || ''}
                      onChange={e => setEditingStaff({ ...editingStaff, username: e.target.value })}
                      placeholder="Ví dụ: hang88@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[11px] text-[#5E665B] dark:text-[#9BA198] mb-1">
                      Mật Khẩu Nhân Viên
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={editingStaff.password || ''}
                        onChange={e => setEditingStaff({ ...editingStaff, password: e.target.value, pinCode: e.target.value })}
                        placeholder="Mật khẩu tài khoản..."
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                      />
                      {editingStaff.password && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`Tài khoản: ${editingStaff.username || editingStaff.email}\nMật khẩu: ${editingStaff.password}`, 'edit-staff-cred')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#5E665B] hover:text-[#1C211B] dark:text-[#9BA198] dark:hover:text-[#E0E2DF]"
                          title="Sao chép tài khoản và mật khẩu"
                        >
                          {copiedKeyId === 'edit-staff-cred' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Control Lock Access Switch */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1C19] border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {editingStaff.loginDisabled ? (
                      <Ban className="w-4 h-4 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    <div>
                      <div className="font-bold text-xs text-[#1C211B] dark:text-[#E0E2DF]">
                        {editingStaff.loginDisabled ? 'ĐÃ KHÓA ĐĂNG NHẬP VÀO HỆ THỐNG' : 'Cho phép đăng nhập hệ thống'}
                      </div>
                      <div className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">
                        {editingStaff.loginDisabled
                          ? 'Nhân viên này không thể đăng nhập vào cổng nhân viên / hệ thống'
                          : 'Nhân viên có thể đăng nhập bằng Gmail/Username và Mật khẩu trên'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingStaff({ ...editingStaff, loginDisabled: !editingStaff.loginDisabled })}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      editingStaff.loginDisabled
                        ? 'bg-rose-600 text-white hover:bg-rose-700'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200'
                    }`}
                  >
                    {editingStaff.loginDisabled ? 'Mở Khóa Đăng Nhập' : 'Khóa Đăng Nhập'}
                  </button>
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

              {/* Login Credentials & Random Generation - Cấp Quyền & Mật Khẩu Tự Động */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-[#1C211B] dark:text-[#E0E2DF]">
                    <KeyRound className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
                    <span>Cấp Tài Khoản Đăng Nhập & Mật Khẩu Ngẫu Nhiên</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const autoEmail = generateAutoEmail(newStaffForm.name, newStaffForm.phone);
                      const randPass = generateRandomPassword(8);
                      setNewStaffForm({
                        ...newStaffForm,
                        email: newStaffForm.email || autoEmail,
                        username: autoEmail,
                        password: randPass,
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#5A7D57]/10 dark:bg-[#8BA888]/20 text-[#5A7D57] dark:text-[#8BA888] hover:bg-[#5A7D57]/20 flex items-center space-x-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Tạo Gmail & Pass Random</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[11px] text-[#5E665B] dark:text-[#9BA198] mb-1">
                      Tên Đăng Nhập / Gmail Cấp Cho Nhân Viên *
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: lehang88@gmail.com"
                      value={newStaffForm.username}
                      onChange={e => setNewStaffForm({ ...newStaffForm, username: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] font-mono text-xs"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                        Mật Khẩu Khởi Tạo *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const randPass = generateRandomPassword(8);
                          setNewStaffForm({ ...newStaffForm, password: randPass });
                        }}
                        className="text-[10px] text-[#5A7D57] dark:text-[#8BA888] hover:underline"
                      >
                        Đổi Pass Random
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Mật khẩu ngẫu nhiên..."
                        value={newStaffForm.password}
                        onChange={e => setNewStaffForm({ ...newStaffForm, password: e.target.value })}
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] font-mono text-xs font-semibold tracking-wider text-emerald-700 dark:text-emerald-400"
                      />
                      {newStaffForm.password && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`Tài khoản: ${newStaffForm.username || newStaffForm.email}\nMật khẩu: ${newStaffForm.password}`, 'new-staff-cred')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#5E665B] hover:text-[#1C211B] dark:text-[#9BA198] dark:hover:text-[#E0E2DF]"
                          title="Sao chép tài khoản và mật khẩu gửi cho nhân viên"
                        >
                          {copiedKeyId === 'new-staff-cred' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[#5E665B] dark:text-[#9BA198] italic flex items-center justify-between">
                  <span>💡 Tài khoản này lưu trên Firebase Firestore, Admin có thể vô hiệu hóa đăng nhập tức thì khi nhân viên thôi việc.</span>
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

      {/* TOUR MODAL 1: XẾP TOUR KHÁCH MỚI CHO KTV (DISPATCH MODAL) */}
      {showDispatchModal && dispatchStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmDispatch}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-lg shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                  <span>Điều Phối Tour Khách Phục Vụ</span>
                </h2>
                <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                  KTV thực hiện: <strong>{dispatchStaff.name}</strong> ({dispatchStaff.positionTitle})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Tour Type Selector Card */}
              <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] space-y-2 border border-[#E2E6DF] dark:border-[#2D312C]">
                <label className="block font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  Phân loại Ca Tour *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDispatchForm({ ...dispatchForm, tourType: 'random' })}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      dispatchForm.tourType === 'random'
                        ? 'border-[#5A7D57] dark:border-[#8BA888] bg-[#5A7D57]/10 dark:bg-[#8BA888]/20 ring-1 ring-[#5A7D57]'
                        : 'border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19]'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                      <Shuffle className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                      <span>🔄 Tour Random</span>
                    </div>
                    <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198] mt-1">
                      Xoay lượt tự động công bằng (Tính lượt vào bảng xoay)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDispatchForm({ ...dispatchForm, tourType: 'request' })}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      dispatchForm.tourType === 'request'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-500'
                        : 'border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19]'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold text-amber-800 dark:text-amber-300">
                      <Star className="w-4 h-4 fill-current text-amber-500" />
                      <span>🎯 Khách Chọn (Request)</span>
                    </div>
                    <span className="text-[10px] text-amber-700/80 dark:text-amber-300/80 mt-1">
                      Khách chỉ định KTV đích danh (Ghi nhận nhãn riêng)
                    </span>
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Tên Khách Hàng *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Chị Phương Thảo"
                    value={dispatchForm.customerName}
                    onChange={e => setDispatchForm({ ...dispatchForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Số Điện Thoại Khách
                  </label>
                  <input
                    type="tel"
                    placeholder="0988..."
                    value={dispatchForm.customerPhone}
                    onChange={e => setDispatchForm({ ...dispatchForm, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
              </div>

              {/* Service & Room/Bed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Liệu Trình / Dịch Vụ *
                  </label>
                  <select
                    value={dispatchForm.serviceName}
                    onChange={e => setDispatchForm({ ...dispatchForm, serviceName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  >
                    {services.length > 0 ? (
                      services.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({formatCurrency(s.price)})</option>
                      ))
                    ) : (
                      <>
                        <option value="Chăm Sóc Da Mặt Chuyên Sâu">Chăm Sóc Da Mặt Chuyên Sâu</option>
                        <option value="Liệu Trình Điều Trị Mụn Chuẩn Y Khoa">Liệu Trình Điều Trị Mụn Chuẩn Y Khoa</option>
                        <option value="Gội Đầu Dưỡng Sinh Thảo Dược">Gội Đầu Dưỡng Sinh Thảo Dược</option>
                        <option value="Massage Cổ Vai Gáy Thảo Dược">Massage Cổ Vai Gáy Thảo Dược</option>
                        <option value="Triệt Lông Vùng Nách / Mặt">Triệt Lông Vùng Nách / Mặt</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Phòng & Giường Thực Hiện *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Phòng VIP 01 - Giường 02"
                    value={dispatchForm.roomBed}
                    onChange={e => setDispatchForm({ ...dispatchForm, roomBed: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Ghi Chú Cho KTV / Lễ Tân
                </label>
                <textarea
                  rows={2}
                  placeholder="Yêu cầu riêng của khách, lưu ý tay nghề..."
                  value={dispatchForm.notes}
                  onChange={e => setDispatchForm({ ...dispatchForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                />
              </div>

              {/* Estimated Commission & Transparency Notice */}
              <div className="p-3 rounded-xl bg-[#5A7D57]/10 dark:bg-[#8BA888]/20 text-[#3C5E39] dark:text-[#8BA888] flex items-center justify-between text-xs">
                <span>Hoa hồng dự kiến KTV nhận:</span>
                <strong className="text-sm">
                  {dispatchForm.tourType === 'request' ? '70.000đ (Kèm thưởng Request)' : '50.000đ (Tour chuẩn)'}
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm flex items-center space-x-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Bắt Đầu Ca Tour Khách</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TOUR MODAL 2: NHẬT KÝ CA TOUR HÔM NAY & BÁO CÁO CÔNG BẰNG (TOUR HISTORY LOGS) */}
      {showTourLogHistory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-4xl shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3 shrink-0">
              <div>
                <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                  <History className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                  <span>Nhật Ký & Báo Cáo Ca Tour KTV Trong Ngày</span>
                </h2>
                <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                  Minh bạch toàn bộ lượt xếp tour, phân biệt Tour Random và Tour Khách Chỉ Định
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportTourLogsCSV}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center space-x-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Xuất Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTourLogHistory(false)}
                  className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-2 shrink-0 text-xs">
              <span className="text-[#5E665B] dark:text-[#9BA198] font-medium">Lọc theo loại:</span>
              <button
                onClick={() => setTourLogFilterType('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  tourLogFilterType === 'all'
                    ? 'bg-[#5A7D57] text-white dark:bg-[#8BA888] dark:text-[#121412]'
                    : 'bg-[#F0F3EF] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198]'
                }`}
              >
                Tất Cả ({tourLogs.length})
              </button>
              <button
                onClick={() => setTourLogFilterType('random')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  tourLogFilterType === 'random'
                    ? 'bg-[#5A7D57] text-white dark:bg-[#8BA888] dark:text-[#121412]'
                    : 'bg-[#F0F3EF] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198]'
                }`}
              >
                🔄 Tour Random ({tourLogs.filter(l => l.tourType === 'random').length})
              </button>
              <button
                onClick={() => setTourLogFilterType('request')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  tourLogFilterType === 'request'
                    ? 'bg-amber-500 text-white'
                    : 'bg-[#F0F3EF] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198]'
                }`}
              >
                🎯 Tour Request ({tourLogs.filter(l => l.tourType === 'request').length})
              </button>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto flex-1 border border-[#E2E6DF] dark:border-[#2D312C] rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F5F7F4] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198] border-b border-[#E2E6DF] dark:border-[#2D312C] uppercase font-bold text-[10px] tracking-wider sticky top-0">
                  <tr>
                    <th className="p-2.5">KTV Thực Hiện</th>
                    <th className="p-2.5">Khách Hàng</th>
                    <th className="p-2.5">Dịch Vụ & Phòng</th>
                    <th className="p-2.5 text-center">Phân Loại Tour</th>
                    <th className="p-2.5 text-center">Thời Gian</th>
                    <th className="p-2.5 text-center">Trạng Thái</th>
                    <th className="p-2.5 text-right">Hoa Hồng</th>
                    <th className="p-2.5">Người Xếp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E6DF] dark:divide-[#2D312C] text-[#1C211B] dark:text-[#E0E2DF]">
                  {tourLogs
                    .filter(l => tourLogFilterType === 'all' || l.tourType === tourLogFilterType)
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-[#F9FAF8] dark:hover:bg-[#222621]/60">
                        <td className="p-2.5 font-bold">{log.staffName}</td>
                        <td className="p-2.5">
                          <div className="font-semibold">{log.customerName}</div>
                          {log.customerPhone && <div className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">{log.customerPhone}</div>}
                        </td>
                        <td className="p-2.5">
                          <div className="font-medium">{log.serviceName}</div>
                          <div className="text-[10px] text-[#5A7D57] dark:text-[#8BA888] font-semibold">{log.roomBed}</div>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            log.tourType === 'request'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {log.tourType === 'request' ? '🎯 Khách chọn' : '🔄 Xoay lượt'}
                          </span>
                        </td>
                        <td className="p-2.5 text-center font-mono">
                          {log.startTime} {log.endTime ? `→ ${log.endTime}` : '(Đang phục vụ)'}
                        </td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            log.status === 'in_progress'
                              ? 'bg-amber-500 text-white animate-pulse'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {log.status === 'in_progress' ? 'Đang làm' : 'Hoàn thành'}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-bold text-[#5A7D57] dark:text-[#8BA888]">
                          {formatCurrency(log.commissionEarned)}
                        </td>
                        <td className="p-2.5 text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                          {log.assignedBy || 'Hệ thống'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TOUR MODAL 3: HƯỚNG DẪN QUY TRÌNH QUẢN LÝ TOUR CÔNG BẰNG (FAIRNESS RULES MODAL) */}
      {showFairnessGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-xl shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Quy Trình Xếp Ca Tour KTV Công Bằng & Chống Ưu Ái</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowFairnessGuideModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#1C211B] dark:text-[#E0E2DF]">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                <h4 className="font-bold flex items-center space-x-1">
                  <span>⚖️ NGUYÊN TẮC VÀNG VỀ SỰ CÔNG BẰNG:</span>
                </h4>
                <p>
                  Hệ thống tự động tính toán thứ tự ưu tiên nhận tour theo nguyên tắc <strong>FIFO (KTV làm ít tour nhất & chờ lâu nhất đứng đầu hàng chờ)</strong>. Lễ tân không thể tùy tiện qua mặt thứ tự này.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] space-y-1">
                  <h5 className="font-bold text-[#5A7D57] dark:text-[#8BA888]">1. Tour Random (Xoay lượt tự động)</h5>
                  <p className="text-[#5E665B] dark:text-[#9BA198]">
                    Dành cho khách không yêu cầu đích danh KTV. Hệ thống hiển thị huy hiệu 🥇 <strong>Vị trí #1</strong> cho KTV có số ca tour trong ngày ít nhất. Lễ tân chỉ cần bấm <strong>"Xếp Tour Khách Mới"</strong> là hệ thống tự gán đúng KTV đứng đầu.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] space-y-1">
                  <h5 className="font-bold text-amber-700 dark:text-amber-400">2. Tour Request (Khách chỉ định)</h5>
                  <p className="text-[#5E665B] dark:text-[#9BA198]">
                    Khi khách đặt trước hoặc yêu cầu đích danh một KTV, lễ tân chọn loại tour là 🎯 <strong>Khách Chọn (Request)</strong>. Tour này được gắn nhãn riêng và ghi nhận hoa hồng yêu cầu đặc biệt.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] space-y-1">
                  <h5 className="font-bold text-blue-700 dark:text-blue-400">3. Nhật ký kiểm toán & Chống gian lận</h5>
                  <p className="text-[#5E665B] dark:text-[#9BA198]">
                    Toàn bộ ca tour đều ghi lại người xếp ca (Lễ tân ca trực) và thời gian cụ thể. Quản lý & Admin có thể xem báo cáo độ lệch tour để kịp thời phát hiện và điều chỉnh nếu có bất kỳ hiện tượng thiên vị nào.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C] flex justify-end">
              <button
                type="button"
                onClick={() => setShowFairnessGuideModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A7D57] text-white hover:bg-[#4D6D4A]"
              >
                Đã Hiểu Quy Trình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CẬP NHẬT TIỀN TIP CHO CA TOUR */}
      {showAddTipModal && tipTourTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-md shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <Coins className="w-4 h-4 text-emerald-500" />
                <span>Thưởng Tiền Tip Khách Hàng</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTipModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] space-y-1">
                <div className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
                  Ca tour: {tipTourTarget.serviceName}
                </div>
                <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                  Khách: {tipTourTarget.customerName} • Ngày: {tipTourTarget.date}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Số tiền Tip / Boa từ khách (VNĐ):
                </label>
                <input
                  type="number"
                  step="10000"
                  value={tipAmountInput}
                  onChange={e => setTipAmountInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none"
                />
              </div>

              {/* Quick preset buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[20000, 50000, 100000, 200000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTipAmountInput(amt)}
                    className="py-1.5 rounded-lg bg-[#F0F3EF] dark:bg-[#222621] hover:bg-[#E2E6DF] dark:hover:bg-[#2D312C] font-semibold text-[11px] text-[#1C211B] dark:text-[#E0E2DF]"
                  >
                    +{amt / 1000}k
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddTipModal(false)}
                className="px-3.5 py-2 rounded-xl font-semibold text-xs text-[#5E665B] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (tipTourTarget) {
                    handleSaveCustomerTip(tipTourTarget.id, tipAmountInput);
                    setShowAddTipModal(false);
                  }
                }}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Lưu Tiền Tip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN CẤP TÀI KHOẢN & MÃ PIN CHO NHÂN VIÊN */}
      {showAdminPinModal && pinTargetStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-md shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                <span>Cấp Mã PIN Đăng Nhập Cổng KTV</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAdminPinModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]">
                <img
                  src={pinTargetStaff.avatar}
                  alt={pinTargetStaff.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <div className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                    {pinTargetStaff.name}
                  </div>
                  <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                    {pinTargetStaff.positionTitle} • SĐT: {pinTargetStaff.phone}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Mã PIN Đăng Nhập (4 - 6 Số):
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={newPinValue}
                  onChange={e => setNewPinValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ví dụ: 1234 hoặc 8888"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] font-mono text-center tracking-widest text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                />
                <p className="text-[10px] text-[#5E665B] dark:text-[#9BA198] mt-1">
                  Nhân viên sử dụng Mã PIN này để đăng nhập Cổng Nhân Viên và tự chấm công thời gian thực.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAdminPinModal(false)}
                className="px-3.5 py-2 rounded-xl font-semibold text-xs text-[#5E665B] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pinTargetStaff) {
                    handleSaveAdminPin(pinTargetStaff.id, newPinValue || '1234');
                    setShowAdminPinModal(false);
                  }
                }}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-[#5A7D57] hover:bg-[#486445] dark:bg-[#8BA888] text-white dark:text-[#121412] shadow-sm"
              >
                Cấp / Đổi Mã PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Crown,
  FileSpreadsheet,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ChevronRight,
  X,
  Clock,
  Save,
  Trash2,
  Edit3,
  UserCheck,
  Heart,
  AlertTriangle,
  FileText,
  Camera,
  Layers,
  Database,
  RefreshCw,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { Customer, Language, TreatmentSession, Role } from '../types';
import { translations, formatCurrency } from '../i18n';
import { exportToCSV } from '../utils/exportUtils';

interface CustomersViewProps {
  customers: Customer[];
  lang: Language;
  currentRole?: Role;
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onClearAllCustomers?: () => Promise<void> | void;
  onClearAllInvoices?: () => Promise<void> | void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  lang,
  currentRole = 'owner',
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onClearAllCustomers,
  onClearAllInvoices,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [showClearTestDataModal, setShowClearTestDataModal] = useState(false);
  const [showAddTreatmentModal, setShowAddTreatmentModal] = useState(false);
  const [isWipingData, setIsWipingData] = useState(false);
  const [wipeSuccessMsg, setWipeSuccessMsg] = useState<string | null>(null);
  const [includeInvoicesInWipe, setIncludeInvoicesInWipe] = useState(true);

  // New customer form state
  const currentYear = new Date().getFullYear();
  const [newCust, setNewCust] = useState<{
    name: string;
    phone: string;
    email: string;
    gender: 'female' | 'male' | 'other';
    age: number;
    birthDate: string;
    tier: Customer['tier'];
    skinType: string;
    allergies: string;
    notes: string;
    avatar: string;
  }>({
    name: '',
    phone: '',
    email: '',
    gender: 'female',
    age: 26,
    birthDate: `${currentYear - 26}-06-15`,
    tier: 'Standard',
    skinType: 'Da hỗn hợp thiên dầu',
    allergies: '',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  });

  // New treatment session form state
  const [newTreatment, setNewTreatment] = useState<Partial<TreatmentSession>>({
    date: new Date().toISOString().slice(0, 10),
    serviceName: 'Cấy Tinh Chất Trẻ Hóa & Tái Sinh Đa Tầng',
    technicianName: 'KTV Lan Anh (Trưởng nhóm)',
    cost: 850000,
    skinCondition: 'Da sáng mịn hơn, giảm tiết dầu vùng chữ T, độ ẩm cải thiện',
    notes: 'Khách đáp ứng tốt phác đồ, hẹn tái khám sau 10 ngày.',
  });

  // Calculate age from birthDate or vice versa
  const handleBirthDateChange = (bDate: string, isEditing = false) => {
    if (!bDate) return;
    const birthYear = parseInt(bDate.slice(0, 4), 10);
    const calculatedAge = !isNaN(birthYear) ? Math.max(1, currentYear - birthYear) : 25;
    if (isEditing && editingCustomer) {
      setEditingCustomer({
        ...editingCustomer,
        birthDate: bDate,
        age: calculatedAge,
      });
    } else {
      setNewCust(prev => ({
        ...prev,
        birthDate: bDate,
        age: calculatedAge,
      }));
    }
  };

  const handleAgeChange = (ageVal: number, isEditing = false) => {
    const ageNum = Math.max(1, Math.min(120, ageVal || 25));
    const approximateYear = currentYear - ageNum;
    if (isEditing && editingCustomer) {
      const monthDay = editingCustomer.birthDate ? editingCustomer.birthDate.slice(4) : '-06-15';
      setEditingCustomer({
        ...editingCustomer,
        age: ageNum,
        birthDate: `${approximateYear}${monthDay}`,
      });
    } else {
      const monthDay = newCust.birthDate ? newCust.birthDate.slice(4) : '-06-15';
      setNewCust(prev => ({
        ...prev,
        age: ageNum,
        birthDate: `${approximateYear}${monthDay}`,
      }));
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchesTier = tierFilter === 'all' || c.tier === tierFilter;
    const matchesGender = genderFilter === 'all' || c.gender === genderFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skinType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.allergies && c.allergies.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTier && matchesGender && matchesSearch;
  });

  const handleExportCSV = () => {
    const rows = filteredCustomers.map(c => ({
      'Mã KH': c.id,
      'Họ và Tên': c.name,
      'Giới Tính': c.gender === 'female' ? 'Nữ' : c.gender === 'male' ? 'Nam' : 'Khác',
      'Tuổi': c.age || (c.birthDate ? currentYear - parseInt(c.birthDate.slice(0, 4), 10) : 'N/A'),
      'Ngày Sinh': c.birthDate || '',
      'Số Điện Thoại': c.phone,
      'Email': c.email || '',
      'Hạng Thành Viên': c.tier,
      'Tình Trạng Da': c.skinType,
      'Dị Ứng': c.allergies || 'Không',
      'Tổng Chi Tiêu': c.totalSpent,
      'Điểm Tích Lũy': c.loyaltyPoints,
      'Ngày Tham Gia': c.joinDate,
      'Ghi Chú': c.notes || '',
    }));
    exportToCSV('Danh_Sach_Khach_Hang_SpaMaster', rows);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name.trim() || !newCust.phone.trim()) return;

    const customer: Customer = {
      id: `cust-${Date.now()}`,
      name: newCust.name.trim(),
      phone: newCust.phone.trim(),
      email: newCust.email.trim(),
      avatar: newCust.avatar || (newCust.gender === 'male' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'),
      gender: newCust.gender,
      age: newCust.age,
      birthDate: newCust.birthDate,
      joinDate: new Date().toISOString().slice(0, 10),
      tier: newCust.tier,
      totalSpent: 0,
      loyaltyPoints: 0,
      skinType: newCust.skinType.trim() || 'Da thường',
      allergies: newCust.allergies.trim(),
      notes: newCust.notes.trim(),
      treatmentHistory: [],
    };

    onAddCustomer(customer);
    setShowAddModal(false);
    setNewCust({
      name: '',
      phone: '',
      email: '',
      gender: 'female',
      age: 26,
      birthDate: `${currentYear - 26}-06-15`,
      tier: 'Standard',
      skinType: 'Da hỗn hợp thiên dầu',
      allergies: '',
      notes: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    });
  };

  const handleSaveEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.name.trim() || !editingCustomer.phone.trim()) return;

    onUpdateCustomer(editingCustomer);
    if (selectedCustomer && selectedCustomer.id === editingCustomer.id) {
      setSelectedCustomer(editingCustomer);
    }
    setEditingCustomer(null);
  };

  const handleConfirmDeleteCustomer = () => {
    if (!customerToDelete) return;
    onDeleteCustomer(customerToDelete.id);
    if (selectedCustomer && selectedCustomer.id === customerToDelete.id) {
      setSelectedCustomer(null);
    }
    setCustomerToDelete(null);
  };

  const handleAddTreatmentSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const session: TreatmentSession = {
      id: `th-${Date.now()}`,
      date: newTreatment.date || new Date().toISOString().slice(0, 10),
      serviceId: `srv-${Date.now()}`,
      serviceName: newTreatment.serviceName || 'Dịch vụ Spa',
      technicianName: newTreatment.technicianName || 'KTV Spa',
      cost: Number(newTreatment.cost) || 0,
      notes: newTreatment.notes || '',
      skinCondition: newTreatment.skinCondition || 'Bình thường',
    };

    const updated: Customer = {
      ...selectedCustomer,
      treatmentHistory: [session, ...selectedCustomer.treatmentHistory],
      totalSpent: selectedCustomer.totalSpent + session.cost,
      loyaltyPoints: selectedCustomer.loyaltyPoints + Math.floor(session.cost / 10000),
    };

    onUpdateCustomer(updated);
    setSelectedCustomer(updated);
    setShowAddTreatmentModal(false);
  };

  const handleExecuteWipeTestData = async () => {
    setIsWipingData(true);
    setWipeSuccessMsg(null);
    try {
      if (onClearAllCustomers) {
        await onClearAllCustomers();
      }
      if (includeInvoicesInWipe && onClearAllInvoices) {
        await onClearAllInvoices();
      }
      setWipeSuccessMsg('Đã làm sạch toàn bộ khách hàng test và hóa đơn mẫu thành công! Cơ sở dữ liệu hiện đã sẵn sàng để bạn nhập khách hàng thật.');
      setTimeout(() => {
        setShowClearTestDataModal(false);
        setWipeSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      alert(`Có lỗi xảy ra: ${err.message || err}`);
    } finally {
      setIsWipingData(false);
    }
  };

  const getTierBadge = (tier: Customer['tier']) => {
    switch (tier) {
      case 'Diamond':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#A3B18A]/25 text-[#2E422C] dark:bg-[#A3B18A]/20 dark:text-[#CCD5AE] border border-[#8BA888]/40 inline-flex items-center space-x-1">
            <span>💎</span> <span>Diamond</span>
          </span>
        );
      case 'VIP':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8BA888]/25 text-[#243F22] dark:bg-[#8BA888]/20 dark:text-[#8BA888] border border-[#8BA888]/50 inline-flex items-center space-x-1">
            <span>👑</span> <span>VIP</span>
          </span>
        );
      case 'Gold':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D4A373]/25 text-[#7A4B1A] dark:bg-[#D4A373]/20 dark:text-[#D4A373] border border-[#D4A373]/40 inline-flex items-center space-x-1">
            <span>🥇</span> <span>Gold</span>
          </span>
        );
      case 'Silver':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E2E6DF] text-[#424B3F] dark:bg-[#2A2F29] dark:text-[#CCD1C8] inline-flex items-center space-x-1">
            <span>🥈</span> <span>Silver</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F0F3EF] text-[#5E665B] dark:bg-[#222621] dark:text-[#9BA198] inline-flex items-center space-x-1">
            <span>🏷️</span> <span>Standard</span>
          </span>
        );
    }
  };

  const getGenderBadge = (gender: Customer['gender']) => {
    switch (gender) {
      case 'male':
        return (
          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-medium border border-blue-200 dark:border-blue-800/50 inline-flex items-center space-x-1">
            <span>♂ Nam</span>
          </span>
        );
      case 'female':
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px] font-medium border border-rose-200 dark:border-rose-800/50 inline-flex items-center space-x-1">
            <span>♀ Nữ</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[11px] font-medium border border-purple-200 dark:border-purple-800/50 inline-flex items-center space-x-1">
            <span>⚧ Khác</span>
          </span>
        );
    }
  };

  const calculateDisplayAge = (cust: Customer) => {
    if (cust.age && cust.age > 0) return cust.age;
    if (cust.birthDate) {
      const year = parseInt(cust.birthDate.slice(0, 4), 10);
      if (!isNaN(year)) return Math.max(1, currentYear - year);
    }
    return 25;
  };

  const isAdminOrManager = currentRole === 'owner' || currentRole === 'manager';

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 min-w-0 w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 sm:p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-base sm:text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2 truncate">
              <Users className="w-5 h-5 text-[#5A7D57] dark:text-[#8BA888] shrink-0" />
              <span className="truncate">{t.customerDirectory}</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8BA888]/15 text-[#325230] dark:text-[#A3C2A0] border border-[#8BA888]/30 shrink-0">
              {customers.length} Khách hàng
            </span>
          </div>
          <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-1">
            {lang === 'vi'
              ? 'Lưu trữ thông tin: Tuổi, Giới tính, Hồ sơ da liễu, Lịch sử liệu trình & Phân hạng'
              : 'Client CRM: Age, Gender, Dermatology profiles, Treatment sessions & Loyalty tiers'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Wipe Test Data Button for Admin */}
          {isAdminOrManager && (
            <button
              id="btn-wipe-test-data"
              onClick={() => setShowClearTestDataModal(true)}
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 transition-colors shadow-xs flex-1 sm:flex-none whitespace-nowrap"
              title="Xóa dữ liệu khách hàng test để nhập thông tin khách hàng thật"
            >
              <Database className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Dọn Dẹp Test</span>
            </button>
          )}

          <button
            id="btn-export-customers-csv"
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E5EAE3] dark:hover:bg-[#2A2F29] transition-colors border border-[#E2E6DF] dark:border-[#2D312C] flex-1 sm:flex-none whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888] shrink-0" />
            <span>{t.exportData} Excel</span>
          </button>

          <button
            id="btn-open-add-customer"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors shadow-sm active:scale-95 w-full sm:w-auto whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Thêm Khách Hàng Mới</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-3.5 sm:p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 min-w-0 w-full overflow-hidden">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5E665B] dark:text-[#9BA198]" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, tình trạng da, dị ứng..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 min-w-0">
          {/* Gender Filter */}
          <div className="flex items-center space-x-1 bg-[#F0F3EF] dark:bg-[#222621] p-1 rounded-xl text-xs shrink-0 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'female', label: '♀ Nữ' },
              { id: 'male', label: '♂ Nam' },
            ].map(g => (
              <button
                key={g.id}
                onClick={() => setGenderFilter(g.id)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  genderFilter === g.id
                    ? 'bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] shadow-xs font-semibold'
                    : 'text-[#5E665B] hover:text-[#1C211B] dark:text-[#9BA198] dark:hover:text-[#E0E2DF]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Tier Filter */}
          <div className="flex items-center space-x-1 bg-[#F0F3EF] dark:bg-[#222621] p-1 rounded-xl text-xs shrink-0 overflow-x-auto no-scrollbar">
            {['all', 'Diamond', 'VIP', 'Gold', 'Silver', 'Standard'].map(tier => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  tierFilter === tier
                    ? 'bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] shadow-xs font-semibold'
                    : 'text-[#5E665B] hover:text-[#1C211B] dark:text-[#9BA198] dark:hover:text-[#E0E2DF]'
                }`}
              >
                {tier === 'all' ? t.all : tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Cards Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-12 border border-[#E2E6DF] dark:border-[#2D312C] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#8BA888]/15 flex items-center justify-center mx-auto text-[#5A7D57] dark:text-[#8BA888]">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF]">
            {customers.length === 0 ? 'Chưa có thông tin khách hàng nào' : 'Không tìm thấy khách hàng phù hợp'}
          </h3>
          <p className="text-xs text-[#5E665B] dark:text-[#9BA198] max-w-md mx-auto">
            {customers.length === 0
              ? 'Hệ thống đang ở trạng thái sạch. Hãy bấm nút "Thêm Khách Hàng Mới" để nhập hồ sơ khách hàng thật đầu tiên!'
              : 'Thử điều chỉnh từ khóa tìm kiếm hoặc bỏ chọn bộ lọc để xem danh sách.'}
          </p>
          {customers.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] text-white shadow-sm hover:bg-[#4D6D4A] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nhập Khách Hàng Thật Ngay</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(cust => {
            const displayAge = calculateDisplayAge(cust);
            return (
              <div
                key={cust.id}
                className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm hover:border-[#8BA888] dark:hover:border-[#8BA888] transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Row: Avatar, Name, Age, Gender, Tier */}
                  <div className="flex items-start justify-between">
                    <div
                      onClick={() => setSelectedCustomer(cust)}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <img
                        src={cust.avatar}
                        alt={cust.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8BA888]/40 shrink-0"
                        onError={(e) => {
                          (e.target as any).src = cust.gender === 'male'
                            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
                            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80';
                        }}
                      />
                      <div>
                        <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] group-hover:text-[#5A7D57] dark:group-hover:text-[#8BA888] transition-colors">
                          {cust.name}
                        </h3>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          {getGenderBadge(cust.gender)}
                          <span className="text-[11px] font-semibold text-[#5E665B] dark:text-[#9BA198]">
                            {displayAge} tuổi
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>{getTierBadge(cust.tier)}</div>
                  </div>

                  {/* Contact Info */}
                  <div className="text-xs text-[#5E665B] dark:text-[#9BA198] space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888] shrink-0" />
                      <span className="font-medium text-[#1C211B] dark:text-[#E0E2DF]">{cust.phone}</span>
                    </div>
                    {cust.email && (
                      <div className="flex items-center space-x-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{cust.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Skin Condition & Allergies */}
                  <div className="p-2.5 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]/60 space-y-1 text-xs">
                    <div className="flex items-center space-x-1.5 text-[#1C211B] dark:text-[#E0E2DF]">
                      <Sparkles className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888] shrink-0" />
                      <span className="font-semibold">{t.skinType}:</span>
                      <span className="text-[#5E665B] dark:text-[#9BA198] line-clamp-1">{cust.skinType}</span>
                    </div>
                    {cust.allergies && (
                      <div className="text-[11px] text-[#B85D43] dark:text-[#E2847A] line-clamp-1 font-medium">
                        ⚠️ Dị ứng: {cust.allergies}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2 rounded-lg bg-[#F0F3EF] dark:bg-[#222621]">
                      <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198] block">{t.totalSpent}</span>
                      <span className="font-bold text-[#5A7D57] dark:text-[#8BA888]">
                        {formatCurrency(cust.totalSpent, lang)}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F0F3EF] dark:bg-[#222621]">
                      <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198] block">{t.loyaltyPoints}</span>
                      <span className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                        ⭐ {cust.loyaltyPoints} điểm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Bar (View, Edit, Delete) */}
                <div className="pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C] flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="font-semibold text-[#5A7D57] dark:text-[#8BA888] hover:underline flex items-center space-x-1"
                  >
                    <span>Hồ sơ ({cust.treatmentHistory.length} ca)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {isAdminOrManager && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCustomer(cust);
                        }}
                        className="p-1.5 rounded-lg text-[#5E665B] hover:text-[#1C211B] dark:text-[#9BA198] dark:hover:text-[#E0E2DF] hover:bg-[#EAE4DA] dark:hover:bg-[#2E3136] transition-colors"
                        title="Chỉnh sửa thông tin khách hàng"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomerToDelete(cust);
                        }}
                        className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Xóa khách hàng này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Detail Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-start justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-4">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-[#8BA888]/40 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h2 className="text-base sm:text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] truncate">
                      {selectedCustomer.name}
                    </h2>
                    {getTierBadge(selectedCustomer.tier)}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                    {getGenderBadge(selectedCustomer.gender)}
                    <span className="text-xs font-semibold text-[#5E665B] dark:text-[#9BA198]">
                      {calculateDisplayAge(selectedCustomer)} tuổi ({selectedCustomer.birthDate || 'N/A'})
                    </span>
                    <span className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                      • Tham gia: {selectedCustomer.joinDate}
                    </span>
                  </div>
                  <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-0.5 truncate">
                    📞 {selectedCustomer.phone} {selectedCustomer.email ? `• ✉️ ${selectedCustomer.email}` : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF] shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]">
                <span className="text-[#5E665B] dark:text-[#9BA198] block mb-0.5">{t.skinType}</span>
                <span className="font-semibold text-[#1C211B] dark:text-[#E0E2DF] truncate block">{selectedCustomer.skinType}</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]">
                <span className="text-[#5E665B] dark:text-[#9BA198] block mb-0.5">{t.allergies}</span>
                <span className="font-semibold text-[#B85D43] dark:text-[#E2847A] truncate block">{selectedCustomer.allergies || 'Không có'}</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]">
                <span className="text-[#5E665B] dark:text-[#9BA198] block mb-0.5">{t.totalSpent}</span>
                <span className="font-bold text-[#5A7D57] dark:text-[#8BA888] truncate block">{formatCurrency(selectedCustomer.totalSpent, lang)}</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]">
                <span className="text-[#5E665B] dark:text-[#9BA198] block mb-0.5">Điểm Tích Lũy</span>
                <span className="font-bold text-[#1C211B] dark:text-[#E0E2DF] truncate block">⭐ {selectedCustomer.loyaltyPoints} điểm</span>
              </div>
            </div>

            {selectedCustomer.notes && (
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs space-y-1">
                <span className="font-semibold text-amber-900 dark:text-amber-300">Ghi chú đặc biệt cho kỹ thuật viên:</span>
                <p className="text-amber-800 dark:text-amber-200">{selectedCustomer.notes}</p>
              </div>
            )}

            {/* Treatment History Records */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                  <span>{t.treatmentHistory} ({selectedCustomer.treatmentHistory.length} buổi)</span>
                </h3>

                <button
                  onClick={() => setShowAddTreatmentModal(true)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#5A7D57] text-white hover:bg-[#4D6D4A] transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ghi Nhận Buổi Mới</span>
                </button>
              </div>

              {selectedCustomer.treatmentHistory.length === 0 ? (
                <div className="text-xs text-[#5E665B] dark:text-[#9BA198] py-8 text-center bg-[#F5F7F4] dark:bg-[#222621]/40 rounded-xl space-y-2">
                  <p>Khách hàng chưa có nhật ký điều trị nào.</p>
                  <button
                    onClick={() => setShowAddTreatmentModal(true)}
                    className="text-xs font-semibold text-[#5A7D57] dark:text-[#8BA888] underline"
                  >
                    + Bấm vào đây để thêm buổi trị liệu đầu tiên
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedCustomer.treatmentHistory.map((treat, idx) => (
                    <div
                      key={treat.id || idx}
                      className="p-3.5 sm:p-4 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621]/60 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                        <span className="text-sm">{treat.serviceName}</span>
                        <span className="text-[#5A7D57] dark:text-[#8BA888] font-bold text-sm">
                          {formatCurrency(treat.cost, lang)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between text-[#5E665B] dark:text-[#9BA198] text-[11px] gap-2">
                        <span>📅 Ngày: <strong>{treat.date}</strong></span>
                        <span>👩‍⚕️ KTV thực hiện: <strong>{treat.technicianName}</strong></span>
                      </div>
                      {treat.notes && (
                        <p className="text-[#1C211B] dark:text-[#E0E2DF] text-[11px]">
                          <strong>Ghi chú:</strong> {treat.notes}
                        </p>
                      )}
                      {treat.skinCondition && (
                        <div className="p-2.5 rounded-lg bg-[#8BA888]/15 text-[#2E4A2B] dark:text-[#CCD5AE] text-[11px]">
                          <strong>Tình trạng da sau làm:</strong> {treat.skinCondition}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              {isAdminOrManager && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingCustomer(selectedCustomer);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E5EAE3] dark:hover:bg-[#2A2F29] border border-[#E2E6DF] dark:border-[#2D312C]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa Thông Tin</span>
                  </button>
                  <button
                    onClick={() => {
                      setCustomerToDelete(selectedCustomer);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Hồ Sơ</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#E2E6DF] dark:bg-[#2A2F29] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#D4D9D0] dark:hover:bg-[#343B33] transition-colors ml-auto"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateCustomer}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-4 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#5A7D57]/15 flex items-center justify-center text-[#5A7D57] dark:text-[#8BA888]">
                  <Plus className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  Thêm Khách Hàng Mới
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Họ tên & SĐT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Họ và tên khách hàng *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Quỳnh Trang"
                    value={newCust.name}
                    onChange={e => setNewCust({ ...newCust, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={newCust.phone}
                    onChange={e => setNewCust({ ...newCust, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
              </div>

              {/* Giới Tính (Radio Buttons) */}
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1.5">
                  Giới tính *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'female', label: '♀ Nữ', color: 'border-rose-300 text-rose-700 bg-rose-50/50 dark:bg-rose-950/30' },
                    { id: 'male', label: '♂ Nam', color: 'border-blue-300 text-blue-700 bg-blue-50/50 dark:bg-blue-950/30' },
                    { id: 'other', label: '⚧ Khác', color: 'border-purple-300 text-purple-700 bg-purple-50/50 dark:bg-purple-950/30' },
                  ].map(g => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setNewCust({ ...newCust, gender: g.id as any })}
                      className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                        newCust.gender === g.id
                          ? `${g.color} ring-2 ring-[#5A7D57] dark:ring-[#8BA888] shadow-xs`
                          : 'border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198]'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tuổi & Ngày Sinh (Đồng bộ qua lại) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Tuổi của khách hàng (năm nay)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={newCust.age}
                      onChange={e => handleAgeChange(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5E665B] dark:text-[#9BA198] font-medium">
                      tuổi
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Ngày / Năm sinh
                  </label>
                  <input
                    type="date"
                    value={newCust.birthDate}
                    onChange={e => handleBirthDateChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
              </div>

              {/* Email & Hạng thành viên */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="khachhang@gmail.com"
                    value={newCust.email}
                    onChange={e => setNewCust({ ...newCust, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Hạng thành viên
                  </label>
                  <select
                    value={newCust.tier}
                    onChange={e => setNewCust({ ...newCust, tier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  >
                    <option value="Standard">Standard (Mới tạo)</option>
                    <option value="Silver">Silver (Bạc)</option>
                    <option value="Gold">Gold (Vàng)</option>
                    <option value="VIP">VIP (Khách VIP)</option>
                    <option value="Diamond">Diamond (Kim Cương)</option>
                  </select>
                </div>
              </div>

              {/* Tình trạng da */}
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tình trạng da & Loại da
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Da dầu mụn viêm, nhạy cảm mẩn đỏ..."
                  value={newCust.skinType}
                  onChange={e => setNewCust({ ...newCust, skinType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              {/* Dị ứng */}
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Dị ứng / Lưu ý đặc biệt
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Dị ứng tinh dầu hoa cúc, cồn, paraben..."
                  value={newCust.allergies}
                  onChange={e => setNewCust({ ...newCust, allergies: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Ghi chú hồ sơ
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Khách thích lực mát-xa nhẹ, không dùng máy lăn kim..."
                  value={newCust.notes}
                  onChange={e => setNewCust({ ...newCust, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm"
              >
                Lưu Khách Hàng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Customer Modal (Admin / Manager) */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveEditCustomer}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-4 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  Chỉnh Sửa Hồ Sơ Khách Hàng
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Họ và tên khách hàng *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.name}
                    onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editingCustomer.phone}
                    onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
              </div>

              {/* Giới Tính (Radio Buttons) */}
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1.5">
                  Giới tính *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'female', label: '♀ Nữ', color: 'border-rose-300 text-rose-700 bg-rose-50/50 dark:bg-rose-950/30' },
                    { id: 'male', label: '♂ Nam', color: 'border-blue-300 text-blue-700 bg-blue-50/50 dark:bg-blue-950/30' },
                    { id: 'other', label: '⚧ Khác', color: 'border-purple-300 text-purple-700 bg-purple-50/50 dark:bg-purple-950/30' },
                  ].map(g => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setEditingCustomer({ ...editingCustomer, gender: g.id as any })}
                      className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                        editingCustomer.gender === g.id
                          ? `${g.color} ring-2 ring-[#5A7D57] dark:ring-[#8BA888] shadow-xs`
                          : 'border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198]'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tuổi & Ngày Sinh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Tuổi của khách hàng
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={calculateDisplayAge(editingCustomer)}
                      onChange={e => handleAgeChange(parseInt(e.target.value, 10), true)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5E665B] dark:text-[#9BA198] font-medium">
                      tuổi
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Ngày / Năm sinh
                  </label>
                  <input
                    type="date"
                    value={editingCustomer.birthDate || '1998-01-01'}
                    onChange={e => handleBirthDateChange(e.target.value, true)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
              </div>

              {/* Email & Hạng thẻ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingCustomer.email || ''}
                    onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Hạng thành viên
                  </label>
                  <select
                    value={editingCustomer.tier}
                    onChange={e => setEditingCustomer({ ...editingCustomer, tier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="VIP">VIP</option>
                    <option value="Diamond">Diamond</option>
                  </select>
                </div>
              </div>

              {/* Tình trạng da & Dị ứng */}
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tình trạng da & Loại da
                </label>
                <input
                  type="text"
                  value={editingCustomer.skinType}
                  onChange={e => setEditingCustomer({ ...editingCustomer, skinType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Dị ứng / Lưu ý đặc biệt
                </label>
                <input
                  type="text"
                  value={editingCustomer.allergies || ''}
                  onChange={e => setEditingCustomer({ ...editingCustomer, allergies: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Ghi chú hồ sơ
                </label>
                <textarea
                  rows={2}
                  value={editingCustomer.notes || ''}
                  onChange={e => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-md shadow-2xl border border-rose-200 dark:border-rose-900/50 p-4 sm:p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  Xác Nhận Xóa Khách Hàng
                </h3>
                <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                  Thao tác này sẽ xóa vĩnh viễn khỏi hệ thống và database.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] text-xs space-y-1">
              <p className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                {customerToDelete.name}
              </p>
              <p className="text-[#5E665B] dark:text-[#9BA198]">
                📞 SĐT: {customerToDelete.phone} {customerToDelete.email ? `• ${customerToDelete.email}` : ''}
              </p>
              <p className="text-[#5E665B] dark:text-[#9BA198]">
                🏷️ Hạng: {customerToDelete.tier} • Tổng chi tiêu: {formatCurrency(customerToDelete.totalSpent, lang)}
              </p>
            </div>

            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              ⚠️ Lưu ý: Toàn bộ lịch sử {customerToDelete.treatmentHistory.length} buổi điều trị của khách hàng này cũng sẽ bị xóa.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E5EAE3]"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCustomer}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Vĩnh Viễn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wipe Test Data / Reset to Real Data Modal */}
      {showClearTestDataModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-lg shadow-2xl border border-amber-300 dark:border-amber-700/60 p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#1C211B] dark:text-[#E0E2DF] truncate">
                    Dọn Dẹp Dữ Liệu Test Hệ Thống
                  </h3>
                  <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                    Xóa sạch khách hàng mẫu và hóa đơn test để nhập thông tin khách hàng thật 100%
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowClearTestDataModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF] shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {wipeSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{wipeSuccessMsg}</span>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-[#5E665B] dark:text-[#9BA198]">
                <p className="text-[#1C211B] dark:text-[#E0E2DF] leading-relaxed">
                  Bạn đang chuẩn bị xóa sạch danh sách <strong>{customers.length} khách hàng</strong> hiện có trên Cloud Firestore & Database để bắt đầu vận hành spa với khách hàng thật.
                </p>

                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-2.5">
                  <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Lựa chọn phạm vi làm sạch:</span>
                  </div>

                  <label className="flex items-center space-x-2 text-[#1C211B] dark:text-[#E0E2DF] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="rounded text-[#5A7D57] focus:ring-[#5A7D57]"
                    />
                    <span>Xóa toàn bộ danh sách khách hàng test trên Database</span>
                  </label>

                  <label className="flex items-center space-x-2 text-[#1C211B] dark:text-[#E0E2DF] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeInvoicesInWipe}
                      onChange={e => setIncludeInvoicesInWipe(e.target.checked)}
                      className="rounded text-[#5A7D57] focus:ring-[#5A7D57]"
                    />
                    <span>Đồng thời xóa toàn bộ hóa đơn & doanh thu test (Invoices) để tính doanh thu thật từ đầu</span>
                  </label>
                </div>

                <p className="text-amber-700 dark:text-amber-300 text-[11px]">
                  💡 <em>Lưu ý: Bảng dịch vụ, danh mục kho mỹ phẩm và tài khoản nhân sự sẽ được giữ nguyên không bị ảnh hưởng.</em>
                </p>
              </div>
            )}

            {!wipeSuccessMsg && (
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
                <button
                  type="button"
                  disabled={isWipingData}
                  onClick={() => setShowClearTestDataModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  disabled={isWipingData}
                  onClick={handleExecuteWipeTestData}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
                >
                  {isWipingData ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang Xóa Dữ Liệu Test...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xác Nhận Xóa Dữ Liệu Test</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Treatment Session Modal */}
      {showAddTreatmentModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleAddTreatmentSession}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-lg shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  Ghi Nhận Buổi Trị Liệu Cho {selectedCustomer.name}
                </h3>
                <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                  Cập nhật tiến trình và phác đồ điều trị của khách hàng
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTreatmentModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Ngày thực hiện *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTreatment.date}
                    onChange={e => setNewTreatment({ ...newTreatment, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Chi phí / Giá dịch vụ (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={newTreatment.cost}
                    onChange={e => setNewTreatment({ ...newTreatment, cost: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tên dịch vụ / Liệu trình *
                </label>
                <input
                  type="text"
                  required
                  value={newTreatment.serviceName}
                  onChange={e => setNewTreatment({ ...newTreatment, serviceName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Kỹ thuật viên phụ trách
                </label>
                <input
                  type="text"
                  value={newTreatment.technicianName}
                  onChange={e => setNewTreatment({ ...newTreatment, technicianName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tình trạng da sau khi làm
                </label>
                <input
                  type="text"
                  value={newTreatment.skinCondition}
                  onChange={e => setNewTreatment({ ...newTreatment, skinCondition: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Ghi chú chuyên môn & Dặn dò
                </label>
                <textarea
                  rows={2}
                  value={newTreatment.notes}
                  onChange={e => setNewTreatment({ ...newTreatment, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setShowAddTreatmentModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] text-white shadow-sm"
              >
                Lưu Buổi Trị Liệu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

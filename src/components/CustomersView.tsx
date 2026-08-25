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
  Save
} from 'lucide-react';
import { Customer, Language, TreatmentSession } from '../types';
import { translations, formatCurrency } from '../i18n';
import { exportToCSV } from '../utils/exportUtils';

interface CustomersViewProps {
  customers: Customer[];
  lang: Language;
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  lang,
  onAddCustomer,
  onUpdateCustomer,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New customer form state
  const [newCust, setNewCust] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    gender: 'female',
    birthDate: '1998-05-15',
    tier: 'Standard',
    skinType: 'Da hỗn hợp thiên dầu',
    allergies: '',
    notes: '',
  });

  const filteredCustomers = customers.filter(c => {
    const matchesTier = tierFilter === 'all' || c.tier === tierFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skinType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleExportCSV = () => {
    const rows = filteredCustomers.map(c => ({
      'Mã KH': c.id,
      'Họ và Tên': c.name,
      'Số Điện Thoại': c.phone,
      'Email': c.email,
      'Hạng Thành Viên': c.tier,
      'Tình Trạng Da': c.skinType,
      'Dị Ứng': c.allergies || 'Không',
      'Tổng Chi Tiêu': c.totalSpent,
      'Điểm Tích Lũy': c.loyaltyPoints,
      'Ngày Tham Gia': c.joinDate,
    }));
    exportToCSV('Danh_Sach_Khach_Hang_Spa', rows);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name || !newCust.phone) return;

    const customer: Customer = {
      id: `cust-${Date.now()}`,
      name: newCust.name!,
      phone: newCust.phone!,
      email: newCust.email || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      gender: (newCust.gender as any) || 'female',
      birthDate: newCust.birthDate || '1998-01-01',
      joinDate: new Date().toISOString().slice(0, 10),
      tier: (newCust.tier as any) || 'Standard',
      totalSpent: 0,
      loyaltyPoints: 0,
      skinType: newCust.skinType || 'Da thường',
      allergies: newCust.allergies || '',
      notes: newCust.notes || '',
      treatmentHistory: [],
    };

    onAddCustomer(customer);
    setShowAddModal(false);
    setNewCust({
      name: '',
      phone: '',
      email: '',
      gender: 'female',
      birthDate: '1998-05-15',
      tier: 'Standard',
      skinType: 'Da hỗn hợp',
      allergies: '',
      notes: '',
    });
  };

  const getTierBadge = (tier: Customer['tier']) => {
    switch (tier) {
      case 'Diamond':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#A3B18A]/25 text-[#2E422C] dark:bg-[#A3B18A]/20 dark:text-[#CCD5AE] border border-[#8BA888]/40">
            💎 Diamond
          </span>
        );
      case 'VIP':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#8BA888]/25 text-[#243F22] dark:bg-[#8BA888]/20 dark:text-[#8BA888] border border-[#8BA888]/50">
            👑 VIP
          </span>
        );
      case 'Gold':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#D4A373]/25 text-[#7A4B1A] dark:bg-[#D4A373]/20 dark:text-[#D4A373] border border-[#D4A373]/40">
            🥇 Gold
          </span>
        );
      case 'Silver':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#E2E6DF] text-[#424B3F] dark:bg-[#2A2F29] dark:text-[#CCD1C8]">
            🥈 Silver
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#F0F3EF] text-[#5E665B] dark:bg-[#222621] dark:text-[#9BA198]">
            Standard
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>{t.customerDirectory}</span>
          </h1>
          <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-0.5">
            {lang === 'vi'
              ? 'Lưu trữ hồ sơ da liễu, lịch sử liệu trình và quản lý hạng thành viên'
              : 'Client CRM, treatment histories and loyalty tiers'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="btn-export-customers-csv"
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E5EAE3] dark:hover:bg-[#2A2F29] transition-colors border border-[#E2E6DF] dark:border-[#2D312C]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>{t.exportData} Excel</span>
          </button>

          <button
            id="btn-open-add-customer"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addCustomer}</span>
          </button>
        </div>
      </div>

      {/* Search & Tier Filter */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5E665B] dark:text-[#9BA198]" />
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng, số điện thoại, tình trạng da..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
          />
        </div>

        <div className="flex items-center space-x-1 bg-[#F0F3EF] dark:bg-[#222621] p-1 rounded-xl text-xs shrink-0 overflow-x-auto">
          {['all', 'Diamond', 'VIP', 'Gold', 'Silver', 'Standard'].map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
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

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(cust => (
          <div
            key={cust.id}
            onClick={() => setSelectedCustomer(cust)}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm hover:border-[#8BA888] dark:hover:border-[#8BA888] transition-all cursor-pointer space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={cust.avatar}
                    alt={cust.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8BA888]/40"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                      {cust.name}
                    </h3>
                    <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                      {cust.phone}
                    </p>
                  </div>
                </div>
                {getTierBadge(cust.tier)}
              </div>

              {/* Skin Condition & Allergies */}
              <div className="p-2.5 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]/60 space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-[#1C211B] dark:text-[#E0E2DF]">
                  <Sparkles className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888] shrink-0" />
                  <span className="font-semibold">{t.skinType}:</span>
                  <span className="text-[#5E665B] dark:text-[#9BA198] line-clamp-1">{cust.skinType}</span>
                </div>
                {cust.allergies && (
                  <div className="text-[11px] text-[#B85D43] dark:text-[#E2847A] line-clamp-1">
                    ⚠️ {cust.allergies}
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

            <div className="pt-2 border-t border-[#E2E6DF] dark:border-[#2D312C] flex items-center justify-between text-xs font-semibold text-[#5A7D57] dark:text-[#8BA888]">
              <span>Xem {cust.treatmentHistory.length} buổi liệu trình</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Customer Detail Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-[#8BA888]/40"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                      {selectedCustomer.name}
                    </h2>
                    {getTierBadge(selectedCustomer.tier)}
                  </div>
                  <p className="text-xs text-[#5E665B] dark:text-[#9BA198]">{selectedCustomer.phone} • {selectedCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]">
                <span className="text-[#5E665B] dark:text-[#9BA198] block mb-0.5">{t.skinType}</span>
                <span className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">{selectedCustomer.skinType}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]">
                <span className="text-[#5E665B] dark:text-[#9BA198] block mb-0.5">{t.allergies}</span>
                <span className="font-semibold text-[#B85D43] dark:text-[#E2847A]">{selectedCustomer.allergies || 'Không có'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]">
                <span className="text-[#5E665B] dark:text-[#9BA198] block mb-0.5">{t.totalSpent}</span>
                <span className="font-bold text-[#5A7D57] dark:text-[#8BA888]">{formatCurrency(selectedCustomer.totalSpent, lang)}</span>
              </div>
            </div>

            {/* Treatment History Records */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                <span>{t.treatmentHistory} ({selectedCustomer.treatmentHistory.length} buổi)</span>
              </h3>

              {selectedCustomer.treatmentHistory.length === 0 ? (
                <p className="text-xs text-[#5E665B] dark:text-[#9BA198] py-4 text-center">
                  Khách hàng mới chưa có nhật ký liệu trình.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {selectedCustomer.treatmentHistory.map(treat => (
                    <div
                      key={treat.id}
                      className="p-3.5 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621]/60 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                        <span>{treat.serviceName}</span>
                        <span className="text-[#5A7D57] dark:text-[#8BA888]">{formatCurrency(treat.cost, lang)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#5E665B] dark:text-[#9BA198] text-[11px]">
                        <span>Ngày thực hiện: <strong>{treat.date}</strong></span>
                        <span>KTV: <strong>{treat.technicianName}</strong></span>
                      </div>
                      <p className="text-[#1C211B] dark:text-[#E0E2DF] text-[11px]">
                        <strong>Ghi chú:</strong> {treat.notes}
                      </p>
                      <div className="p-2 rounded-lg bg-[#8BA888]/15 text-[#2E4A2B] dark:text-[#CCD5AE] text-[11px]">
                        <strong>Tình trạng da sau làm:</strong> {treat.skinCondition}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#E2E6DF] dark:bg-[#2A2F29] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#D4D9D0] dark:hover:bg-[#343B33] transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCustomer}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-lg shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                {t.addCustomer}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Hạng thành viên
                  </label>
                  <select
                    value={newCust.tier}
                    onChange={e => setNewCust({ ...newCust, tier: e.target.value as any })}
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

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tình trạng da & Loại da
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Da mụn viêm vùng má, nhạy cảm"
                  value={newCust.skinType}
                  onChange={e => setNewCust({ ...newCust, skinType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Dị ứng / Lưu ý kỹ thuật viên
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Dị ứng tinh chất hoa hồng, cồn..."
                  value={newCust.allergies}
                  onChange={e => setNewCust({ ...newCust, allergies: e.target.value })}
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
                {t.save}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

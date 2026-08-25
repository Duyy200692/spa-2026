import React, { useState } from 'react';
import {
  Package,
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  X,
  CheckCircle2,
  Edit2,
  Trash2,
  Calculator,
  ArrowRight,
  RefreshCw,
  Boxes,
  TrendingDown,
  Info
} from 'lucide-react';
import { InventoryItem, Language } from '../types';
import { translations, formatCurrency } from '../i18n';
import { exportToCSV } from '../utils/exportUtils';

interface InventoryViewProps {
  inventory: InventoryItem[];
  lang: Language;
  onUpdateInventory: (item: InventoryItem) => void;
  onAddInventoryItem: (item: InventoryItem) => void;
  onDeleteInventoryItem?: (id: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  lang,
  onUpdateInventory,
  onAddInventoryItem,
  onDeleteInventoryItem,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Stock In / Out Modal State
  const [activeActionModal, setActiveActionModal] = useState<{
    type: 'in' | 'out';
    item: InventoryItem;
  } | null>(null);
  const [actionInputMode, setActionInputMode] = useState<'package' | 'subunit'>('package');
  const [actionPackageQty, setActionPackageQty] = useState<number>(1);
  const [actionSubunitQty, setActionSubunitQty] = useState<number>(0);
  const [actionNote, setActionNote] = useState<string>('');

  // Add / Edit Modal State
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Vật tư tiêu hao',
    brand: '',
    packageUnit: 'Hộp',
    subUnitsPerPackage: 200,
    subUnitName: 'miếng',
    packagePurchasePrice: 50000,
    stockPackages: 10,
    minThresholdSubUnits: 100,
    expiryDate: '2028-12-31',
    supplier: 'Nhà Phân Phối Dược Mỹ Phẩm',
  });

  // Unique categories list
  const categories = ['all', ...Array.from(new Set(inventory.map(i => i.category)))];

  // Filtered inventory list
  const filteredInventory = inventory.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subUnitName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate high-level KPIs
  const totalItemsCount = inventory.length;
  const totalStockValue = inventory.reduce(
    (sum, item) => sum + item.stockPackages * item.packagePurchasePrice,
    0
  );
  const lowStockItems = inventory.filter(
    item => item.stockSubUnits <= item.minThresholdSubUnits
  );

  // Open modal for new item
  const handleOpenAddModal = () => {
    setEditingItemId(null);
    setFormData({
      code: `SKU-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: '',
      category: 'Vật tư tiêu hao',
      brand: '',
      packageUnit: 'Hộp',
      subUnitsPerPackage: 200,
      subUnitName: 'miếng',
      packagePurchasePrice: 50000,
      stockPackages: 10,
      minThresholdSubUnits: 100,
      expiryDate: '2028-12-31',
      supplier: 'Nhà Phân Phối Mỹ Phẩm Spa',
    });
    setShowItemModal(true);
  };

  // Open modal for editing existing item
  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItemId(item.id);
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      brand: item.brand,
      packageUnit: item.packageUnit || item.packageType.split(' ')[0] || 'Hộp',
      subUnitsPerPackage: item.subUnitsPerPackage,
      subUnitName: item.subUnitName,
      packagePurchasePrice: item.packagePurchasePrice,
      stockPackages: item.stockPackages,
      minThresholdSubUnits: item.minThresholdSubUnits,
      expiryDate: item.expiryDate,
      supplier: item.supplier,
    });
    setShowItemModal(true);
  };

  // Live calculation of unit cost for the form
  const formCalculatedCostPerSubUnit =
    formData.subUnitsPerPackage > 0
      ? Math.round(formData.packagePurchasePrice / formData.subUnitsPerPackage)
      : 0;

  // Handle save from Add/Edit modal
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const packageTypeStr = `${formData.packageUnit} ${formData.subUnitsPerPackage} ${formData.subUnitName}`;
    const costPerSubUnit = formCalculatedCostPerSubUnit;
    const totalSubUnits = (Number(formData.stockPackages) || 0) * (Number(formData.subUnitsPerPackage) || 1);

    if (editingItemId) {
      // Update existing item
      const existing = inventory.find(i => i.id === editingItemId);
      if (existing) {
        const updated: InventoryItem = {
          ...existing,
          code: formData.code,
          name: formData.name,
          category: formData.category,
          brand: formData.brand,
          packageUnit: formData.packageUnit,
          packageType: packageTypeStr,
          subUnitsPerPackage: Number(formData.subUnitsPerPackage) || 1,
          subUnitName: formData.subUnitName,
          packagePurchasePrice: Number(formData.packagePurchasePrice) || 0,
          costPerSubUnit,
          stockPackages: Number(formData.stockPackages) || 0,
          stockSubUnits: totalSubUnits,
          minThresholdSubUnits: Number(formData.minThresholdSubUnits) || 10,
          expiryDate: formData.expiryDate,
          supplier: formData.supplier,
          lastRestocked: new Date().toISOString().slice(0, 10),
        };
        onUpdateInventory(updated);
      }
    } else {
      // Create brand new item
      const created: InventoryItem = {
        id: `inv-${Date.now()}`,
        code: formData.code || `SKU-${Math.floor(Math.random() * 9000 + 1000)}`,
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        packageUnit: formData.packageUnit,
        packageType: packageTypeStr,
        subUnitsPerPackage: Number(formData.subUnitsPerPackage) || 1,
        subUnitName: formData.subUnitName,
        packagePurchasePrice: Number(formData.packagePurchasePrice) || 0,
        costPerSubUnit,
        stockPackages: Number(formData.stockPackages) || 0,
        stockSubUnits: totalSubUnits,
        minThresholdSubUnits: Number(formData.minThresholdSubUnits) || 10,
        expiryDate: formData.expiryDate,
        supplier: formData.supplier,
        lastRestocked: new Date().toISOString().slice(0, 10),
      };
      onAddInventoryItem(created);
    }

    setShowItemModal(false);
  };

  // Open Stock In / Out action modal
  const handleOpenStockAction = (type: 'in' | 'out', item: InventoryItem) => {
    setActiveActionModal({ type, item });
    setActionInputMode('package');
    setActionPackageQty(1);
    setActionSubunitQty(item.subUnitsPerPackage);
    setActionNote('');
  };

  // Stock In / Out execution
  const handleConfirmStockAction = () => {
    if (!activeActionModal) return;
    const { type, item } = activeActionModal;
    
    let subUnitsChanged = 0;
    if (actionInputMode === 'package') {
      subUnitsChanged = (Number(actionPackageQty) || 0) * item.subUnitsPerPackage;
    } else {
      subUnitsChanged = Number(actionSubunitQty) || 0;
    }

    if (subUnitsChanged <= 0) return;

    let newStockSubUnits = item.stockSubUnits;
    if (type === 'in') {
      newStockSubUnits += subUnitsChanged;
    } else {
      newStockSubUnits = Math.max(0, newStockSubUnits - subUnitsChanged);
    }

    // Recalculate package count (approximate rounded or fractional)
    const newStockPackages = Number((newStockSubUnits / item.subUnitsPerPackage).toFixed(1));

    const updatedItem: InventoryItem = {
      ...item,
      stockPackages: newStockPackages,
      stockSubUnits: newStockSubUnits,
      lastRestocked: new Date().toISOString().slice(0, 10),
    };

    onUpdateInventory(updatedItem);
    setActiveActionModal(null);
  };

  // Export inventory table to CSV
  const handleExportCSV = () => {
    const rows = filteredInventory.map(item => ({
      'Mã Hàng': item.code,
      'Tên Mỹ Phẩm': item.name,
      'Thương Hiệu': item.brand,
      'Danh Mục': item.category,
      'Đơn Vị Nhập (Gói/Hộp)': item.packageUnit || item.packageType,
      'Quy Cách Đóng Gói': item.packageType,
      'Số Lượng Quy Đổi': item.subUnitsPerPackage,
      'Đơn Vị Sử Dụng Lẻ (BOM)': item.subUnitName,
      'Giá Nhập Gốc / Hộp (VNĐ)': item.packagePurchasePrice,
      'Giá Vốn / Đơn Vị Lẻ (VNĐ)': item.costPerSubUnit,
      'Số Hộp Tồn': item.stockPackages,
      'Tổng Số Lượng Lẻ Tồn': item.stockSubUnits,
      'Ngưỡng Cảnh Báo': item.minThresholdSubUnits,
      'Hạn Sử Dụng': item.expiryDate,
      'Nhà Cung Cấp': item.supplier,
    }));
    exportToCSV('Kho_My_Pham_Dinh_Luong_Spa', rows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
            <Package className="w-5 h-5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>{t.inventoryTitle} & Quy Đổi Định Lượng</span>
          </h1>
          <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-0.5">
            Nhập kho theo Hộp/Chai, tự động tính giá lẻ từng Miếng/ml để liên kết trực tiếp làm giá cost cho bài dịch vụ
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="btn-export-inventory-csv"
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E5EAE3] dark:hover:bg-[#2A2F29] transition-colors border border-[#E2E6DF] dark:border-[#2D312C]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>{t.exportData} Excel</span>
          </button>

          <button
            id="btn-open-add-inventory"
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Mỹ Phẩm & Thiết Lập Quy Đổi</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-[#8BA888]/20 text-[#30522E] dark:text-[#A3C2A0]">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#5E665B] dark:text-[#9BA198] font-medium">Tổng Mặt Hàng Quản Lý</div>
            <div className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF]">
              {totalItemsCount} <span className="text-xs font-normal text-[#5E665B]">sản phẩm</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-[#D4A373]/20 text-[#7A4B20] dark:text-[#E6C29E]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#5E665B] dark:text-[#9BA198] font-medium">Tổng Giá Trị Nhập Tồn Kho</div>
            <div className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF]">
              {formatCurrency(totalStockValue, lang)}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm flex items-center space-x-3.5">
          <div className={`p-2.5 rounded-xl ${lowStockItems.length > 0 ? 'bg-[#965A54]/20 text-[#965A54] dark:text-[#D98A84]' : 'bg-[#8BA888]/20 text-[#30522E] dark:text-[#A3C2A0]'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#5E665B] dark:text-[#9BA198] font-medium">Cảnh Báo Sắp Hết Hàng</div>
            <div className="text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF]">
              {lowStockItems.length} <span className="text-xs font-normal text-[#5E665B]">mặt hàng cần nhập thêm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Unit Conversion Explainer Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F0F3EF] to-[#E9EFE7] dark:from-[#1E221D] dark:to-[#242A22] border border-[#D5DED2] dark:border-[#2F382E] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-[#5A7D57] dark:bg-[#8BA888] text-white dark:text-[#121412] mt-0.5 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <span>Cơ Chế Quy Đổi Tự Động: Nhập Hộp Lớn ➔ Tính Giá Lẻ Phục Vụ Bài Dịch Vụ</span>
              </h3>
              <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198] mt-0.5 leading-relaxed">
                Ví dụ: Bạn nhập <strong>1 Hộp Bông tẩy trang (50.000đ)</strong> chứa <strong>200 miếng</strong> ➔ Hệ thống tự động tính <strong>250đ / miếng</strong>. Khi tạo bài chăm sóc da dùng 4 miếng, hệ thống sẽ tự lấy 4 × 250đ = 1.000đ vào giá cost.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 bg-white/80 dark:bg-[#1A1C19]/80 px-3 py-1.5 rounded-xl border border-[#D5DED2] dark:border-[#2F382E] text-xs font-semibold text-[#30522E] dark:text-[#A3C2A0]">
            <span>1 Hộp (50k) = 200 Miếng ➔ 250đ/miếng</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA198]" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã SKU, tên mỹ phẩm, thương hiệu, đơn vị lẻ..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#5A7D57] text-white dark:bg-[#8BA888] dark:text-[#121412] font-semibold shadow-sm'
                    : 'bg-[#F0F3EF] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198] hover:bg-[#E5EAE3] dark:hover:bg-[#2A2F29]'
                }`}
              >
                {cat === 'all' ? 'Tất Cả Danh Mục' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Inventory Table with Detailed Conversion Breakdown */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7F4] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198] font-semibold border-b border-[#E2E6DF] dark:border-[#2D312C]">
              <tr>
                <th className="py-3.5 px-4">Tên Mỹ Phẩm & Mã SKU</th>
                <th className="py-3.5 px-3">Quy Cách Đóng Gói</th>
                <th className="py-3.5 px-3 text-right">Giá Gốc / Hộp</th>
                <th className="py-3.5 px-3 text-center">Hệ Số Quy Đổi</th>
                <th className="py-3.5 px-3 text-right">Giá Lẻ Làm Dịch Vụ</th>
                <th className="py-3.5 px-3 text-center">Tồn Kho Hiện Có</th>
                <th className="py-3.5 px-3 text-center">Hạn Dùng</th>
                <th className="py-3.5 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6DF] dark:divide-[#2D312C]">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#9BA198]">
                    Không tìm thấy mặt hàng nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredInventory.map(item => {
                  const isLowStock = item.stockSubUnits <= item.minThresholdSubUnits;
                  const pkgUnit = item.packageUnit || 'Hộp/Chai';
                  return (
                    <tr key={item.id} className="hover:bg-[#F5F7F4]/60 dark:hover:bg-[#222621]/40 transition-colors">
                      {/* Name & SKU */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
                          <span>{item.name}</span>
                        </div>
                        <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198] flex items-center space-x-2 mt-0.5">
                          <span className="font-mono bg-[#F0F3EF] dark:bg-[#222621] px-1 rounded text-[10px]">{item.code}</span>
                          <span>• {item.brand || 'Chính hãng'}</span>
                          <span>• {item.category}</span>
                        </div>
                      </td>

                      {/* Package Spec */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
                          {item.packageType}
                        </div>
                        <div className="text-[10px] text-[#5E665B] dark:text-[#9BA198]">
                          Đơn vị nhập: <strong>{pkgUnit}</strong>
                        </div>
                      </td>

                      {/* Purchase Price per Package */}
                      <td className="py-3 px-3 text-right font-medium text-[#1C211B] dark:text-[#E0E2DF]">
                        {formatCurrency(item.packagePurchasePrice, lang)}
                        <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198] block">/{pkgUnit}</span>
                      </td>

                      {/* Conversion Multiplier */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-[#F0F3EF] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] text-[11px] font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
                          <span>1 {pkgUnit}</span>
                          <ArrowRight className="w-3 h-3 text-[#5A7D57] dark:text-[#8BA888]" />
                          <span className="text-[#5A7D57] dark:text-[#8BA888]">{item.subUnitsPerPackage} {item.subUnitName}</span>
                        </div>
                      </td>

                      {/* Cost per Usage Unit */}
                      <td className="py-3 px-3 text-right">
                        <div className="inline-block px-2 py-1 rounded-lg bg-[#8BA888]/15 dark:bg-[#8BA888]/20 border border-[#8BA888]/30">
                          <span className="font-bold text-[#30522E] dark:text-[#A3C2A0] text-xs">
                            {formatCurrency(item.costPerSubUnit, lang)}
                          </span>
                          <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198] block">
                            /{item.subUnitName}
                          </span>
                        </div>
                      </td>

                      {/* Current Stock */}
                      <td className="py-3 px-3 text-center">
                        <div className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                          {item.stockPackages} {pkgUnit}
                        </div>
                        <div className="text-[11px] text-[#5A7D57] dark:text-[#8BA888] font-semibold">
                          = {item.stockSubUnits.toLocaleString()} {item.subUnitName}
                        </div>
                        {isLowStock ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4A373]/20 text-[#7A4B20] dark:text-[#E6C29E] mt-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{t.lowStock} (≤{item.minThresholdSubUnits})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#8BA888]/20 text-[#30522E] dark:text-[#A3C2A0] mt-0.5">
                            {t.inStock}
                          </span>
                        )}
                      </td>

                      {/* Expiry Date */}
                      <td className="py-3 px-3 text-center text-[#5E665B] dark:text-[#9BA198] font-mono text-[11px]">
                        {item.expiryDate}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            title="Nhập thêm hàng vào kho"
                            onClick={() => handleOpenStockAction('in', item)}
                            className="px-2 py-1 rounded-lg bg-[#8BA888]/20 hover:bg-[#8BA888]/30 text-[#30522E] dark:text-[#A3C2A0] font-semibold text-[11px] border border-[#8BA888]/40 flex items-center space-x-1 transition-colors"
                          >
                            <ArrowDownToLine className="w-3 h-3" />
                            <span>Nhập</span>
                          </button>
                          
                          <button
                            title="Xuất dùng mỹ phẩm"
                            onClick={() => handleOpenStockAction('out', item)}
                            className="px-2 py-1 rounded-lg bg-[#D4A373]/20 hover:bg-[#D4A373]/30 text-[#7A4B20] dark:text-[#E6C29E] font-semibold text-[11px] border border-[#D4A373]/40 flex items-center space-x-1 transition-colors"
                          >
                            <ArrowUpFromLine className="w-3 h-3" />
                            <span>Xuất</span>
                          </button>

                          <button
                            title="Chỉnh sửa thông tin & quy đổi"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621] hover:text-[#1C211B] dark:hover:text-[#E0E2DF] transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {onDeleteInventoryItem && (
                            <button
                              title="Xóa mặt hàng"
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc chắn muốn xóa "${item.name}" khỏi kho?`)) {
                                  onDeleteInventoryItem(item.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-[#9BA198] hover:bg-[#965A54]/10 hover:text-[#965A54] dark:hover:text-[#D98A84] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock In / Out Modal */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-md shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                {activeActionModal.type === 'in' ? (
                  <ArrowDownToLine className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                ) : (
                  <ArrowUpFromLine className="w-4 h-4 text-[#D4A373]" />
                )}
                <span>
                  {activeActionModal.type === 'in' ? 'Nhập Hàng Vào Kho' : 'Xuất Dùng Mỹ Phẩm'}
                </span>
              </h2>
              <button
                onClick={() => setActiveActionModal(null)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] space-y-1.5 border border-[#E2E6DF] dark:border-[#2D312C]">
                <div className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  {activeActionModal.item.name}
                </div>
                <div className="text-[#5E665B] dark:text-[#9BA198] text-[11px] flex items-center justify-between">
                  <span>Quy cách: 1 {activeActionModal.item.packageUnit || 'Hộp'} = {activeActionModal.item.subUnitsPerPackage} {activeActionModal.item.subUnitName}</span>
                  <span className="font-semibold text-[#5A7D57] dark:text-[#8BA888]">
                    {formatCurrency(activeActionModal.item.costPerSubUnit, lang)}/{activeActionModal.item.subUnitName}
                  </span>
                </div>
                <div className="text-[#5E665B] dark:text-[#9BA198] text-[11px]">
                  Tồn kho hiện tại: <strong>{activeActionModal.item.stockPackages}</strong> {activeActionModal.item.packageUnit || 'hộp'} ({activeActionModal.item.stockSubUnits.toLocaleString()} {activeActionModal.item.subUnitName})
                </div>
              </div>

              {/* Mode Toggle: By Package or By SubUnit */}
              <div className="flex rounded-xl bg-[#F0F3EF] dark:bg-[#222621] p-1 border border-[#E2E6DF] dark:border-[#2D312C]">
                <button
                  type="button"
                  onClick={() => setActionInputMode('package')}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-colors ${
                    actionInputMode === 'package'
                      ? 'bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] shadow-xs'
                      : 'text-[#5E665B] dark:text-[#9BA198]'
                  }`}
                >
                  Nhập theo {activeActionModal.item.packageUnit || 'Hộp'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActionInputMode('subunit');
                    setActionSubunitQty(actionPackageQty * activeActionModal.item.subUnitsPerPackage);
                  }}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-colors ${
                    actionInputMode === 'subunit'
                      ? 'bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] shadow-xs'
                      : 'text-[#5E665B] dark:text-[#9BA198]'
                  }`}
                >
                  Nhập theo {activeActionModal.item.subUnitName}
                </button>
              </div>

              {actionInputMode === 'package' ? (
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Số lượng ({activeActionModal.item.packageUnit || 'Hộp'}) {activeActionModal.type === 'in' ? 'nhập thêm' : 'xuất dùng'}:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={actionPackageQty}
                    onChange={e => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setActionPackageQty(val);
                      setActionSubunitQty(val * activeActionModal.item.subUnitsPerPackage);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-sm font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                  <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198] mt-1.5 flex items-center justify-between">
                    <span>= Quy đổi ra: <strong className="text-[#5A7D57] dark:text-[#8BA888]">{actionPackageQty * activeActionModal.item.subUnitsPerPackage} {activeActionModal.item.subUnitName}</strong></span>
                    {activeActionModal.type === 'in' && (
                      <span>Tổng tiền: <strong>{formatCurrency(actionPackageQty * activeActionModal.item.packagePurchasePrice, lang)}</strong></span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Số lượng chi tiết ({activeActionModal.item.subUnitName}) {activeActionModal.type === 'in' ? 'nhập' : 'xuất'}:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={actionSubunitQty}
                    onChange={e => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setActionSubunitQty(val);
                      setActionPackageQty(Number((val / activeActionModal.item.subUnitsPerPackage).toFixed(1)));
                    }}
                    className="w-full px-3 py-2 rounded-xl text-sm font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                  <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198] mt-1.5 flex items-center justify-between">
                    <span>= Tương đương: <strong className="text-[#5A7D57] dark:text-[#8BA888]">{(actionSubunitQty / activeActionModal.item.subUnitsPerPackage).toFixed(2)} {activeActionModal.item.packageUnit || 'Hộp'}</strong></span>
                    {activeActionModal.type === 'in' && (
                      <span>Chi phí: <strong>{formatCurrency(actionSubunitQty * activeActionModal.item.costPerSubUnit, lang)}</strong></span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#5E665B] dark:text-[#9BA198] mb-1">
                  Ghi chú phiếu {activeActionModal.type === 'in' ? 'nhập hàng' : 'xuất kho'}:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nhập đợt mới từ nhà phân phối / Xuất làm ca trị mụn..."
                  value={actionNote}
                  onChange={e => setActionNote(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setActiveActionModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmStockAction}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-colors ${
                  activeActionModal.type === 'in'
                    ? 'bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] dark:text-[#121412]'
                    : 'bg-[#B88352] hover:bg-[#A37345]'
                }`}
              >
                Xác Nhận {activeActionModal.type === 'in' ? 'Nhập Kho' : 'Xuất Kho'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Cosmetic Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveItem}
            className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-lg shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-6 space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3">
              <h2 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <Package className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                <span>
                  {editingItemId ? 'Chỉnh Sửa Mỹ Phẩm & Công Thức Quy Đổi' : 'Thêm Mỹ Phẩm Mới & Thiết Lập Quy Đổi'}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Product Name */}
              <div>
                <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tên sản phẩm / Mỹ phẩm *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bông tẩy trang tròn tiệt trùng Ipek"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Danh mục
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  >
                    <option value="Vật tư tiêu hao">Vật tư tiêu hao</option>
                    <option value="Tinh chất & Ampoule">Tinh chất & Ampoule</option>
                    <option value="Tẩy trang & Rửa mặt">Tẩy trang & Rửa mặt</option>
                    <option value="Mặt nạ & Bột đắp">Mặt nạ & Bột đắp</option>
                    <option value="Tinh dầu massage">Tinh dầu massage</option>
                    <option value="Gel & Dung môi máy">Gel & Dung môi máy</option>
                    <option value="Chăm sóc tóc & da đầu">Chăm sóc tóc & da đầu</option>
                    <option value="Mỹ phẩm thải độc">Mỹ phẩm thải độc</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Thương hiệu / Xuất xứ
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Ipek / Bioderma / Hàn Quốc"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
              </div>

              {/* Conversion Setup Box (Core Feature) */}
              <div className="p-3.5 rounded-xl bg-[#F0F3EF] dark:bg-[#222621] border border-[#D5DED2] dark:border-[#2F382E] space-y-3">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#30522E] dark:text-[#A3C2A0]">
                  <Calculator className="w-4 h-4" />
                  <span>Quy Cách Nhập Kho & Đơn Vị Sử Dụng Dịch Vụ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Package Unit */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5E665B] dark:text-[#9BA198] mb-1">
                      1. Đơn vị nhập lớn:
                    </label>
                    <select
                      value={formData.packageUnit}
                      onChange={e => setFormData({ ...formData, packageUnit: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] text-xs font-semibold"
                    >
                      <option value="Hộp">Hộp</option>
                      <option value="Chai">Chai</option>
                      <option value="Can">Can</option>
                      <option value="Tuýp">Tuýp</option>
                      <option value="Hũ">Hũ</option>
                      <option value="Gói">Gói</option>
                      <option value="Túi">Túi</option>
                      <option value="Thùng">Thùng</option>
                    </select>
                  </div>

                  {/* Number of subUnits per package */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5E665B] dark:text-[#9BA198] mb-1">
                      2. Chứa bao nhiêu:
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.subUnitsPerPackage}
                      onChange={e => setFormData({ ...formData, subUnitsPerPackage: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] text-xs font-bold"
                    />
                  </div>

                  {/* SubUnit Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5E665B] dark:text-[#9BA198] mb-1">
                      3. Đơn vị lẻ làm DV:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="miếng, ml, g, ống..."
                      value={formData.subUnitName}
                      onChange={e => setFormData({ ...formData, subUnitName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Purchase Price per Package */}
                <div className="pt-2 border-t border-[#E2E6DF] dark:border-[#2D312C]">
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Giá tiền nhập gốc 1 {formData.packageUnit} (VNĐ) *
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    required
                    value={formData.packagePurchasePrice}
                    onChange={e => setFormData({ ...formData, packagePurchasePrice: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] font-bold text-sm"
                  />
                </div>

                {/* Interactive Live Calculated Result */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#1A1C19] border border-[#8BA888]/40 shadow-xs space-y-1">
                  <div className="text-[11px] text-[#5E665B] dark:text-[#9BA198] flex items-center justify-between">
                    <span>Công thức tính giá cost lẻ:</span>
                    <span className="font-mono">
                      {formatCurrency(formData.packagePurchasePrice, lang)} ÷ {formData.subUnitsPerPackage} {formData.subUnitName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#E2E6DF] dark:border-[#2D312C]">
                    <span className="font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                      ➔ Giá lẻ gốc áp dụng vào bài dịch vụ:
                    </span>
                    <span className="text-sm font-extrabold text-[#5A7D57] dark:text-[#8BA888]">
                      {formatCurrency(formCalculatedCostPerSubUnit, lang)} <span className="text-xs font-normal text-[#5E665B]">/{formData.subUnitName}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Initial Stock & Warning Threshold */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Số lượng tồn ({formData.packageUnit})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockPackages}
                    onChange={e => setFormData({ ...formData, stockPackages: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] font-semibold"
                  />
                  <span className="text-[10px] text-[#5E665B] dark:text-[#9BA198] mt-0.5 block">
                    = {(formData.stockPackages * formData.subUnitsPerPackage).toLocaleString()} {formData.subUnitName}
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Ngưỡng báo sắp hết ({formData.subUnitName})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minThresholdSubUnits}
                    onChange={e => setFormData({ ...formData, minThresholdSubUnits: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
              </div>

              {/* Expiry & Supplier */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Hạn sử dụng (Expiry)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    Nhà cung cấp
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621]"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] shadow-sm flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingItemId ? 'Lưu Thay Đổi' : 'Tạo Mặt Hàng & Đồng Bộ BOM'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

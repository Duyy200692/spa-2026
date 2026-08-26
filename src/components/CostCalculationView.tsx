import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Save,
  Sparkles,
  Layers,
  DollarSign,
  TrendingUp,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Boxes,
  Percent
} from 'lucide-react';
import { Service, InventoryItem, ServiceCostItem, Language } from '../types';
import { translations, formatCurrency } from '../i18n';

interface CostCalculationViewProps {
  services: Service[];
  inventory: InventoryItem[];
  lang: Language;
  onUpdateService?: (updatedService: Service) => void;
  onAddService?: (newService: Service) => void;
  onSaveServiceCost?: (savedService: Service) => void;
}

export const CostCalculationView: React.FC<CostCalculationViewProps> = ({
  services,
  inventory,
  lang,
  onUpdateService,
  onAddService,
  onSaveServiceCost,
}) => {
  const t = translations[lang];

  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Active working state for currently edited service
  const currentService = services.find(s => s.id === selectedServiceId) || services[0];

  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    category: string;
    price: number;
    durationMinutes: number;
    description: string;
    technicianCommission: number;
    otherOverheads: number;
    costItems: ServiceCostItem[];
  }>({
    id: currentService?.id || 'srv-custom',
    name: currentService?.name || '',
    category: currentService?.category || 'Chăm sóc & Điều trị da mặt',
    price: currentService?.price || 450000,
    durationMinutes: currentService?.durationMinutes || 60,
    description: currentService?.description || '',
    technicianCommission: currentService?.technicianCommission || 60000,
    otherOverheads: currentService?.otherOverheads || 25000,
    costItems: currentService?.costItems || [],
  });

  const [selectedInventoryToAdd, setSelectedInventoryToAdd] = useState<string>(inventory[0]?.id || '');
  const [quantityToAdd, setQuantityToAdd] = useState<number>(4);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState(false);

  // Selected item object for quick live preview
  const selectedInvObj = inventory.find(i => i.id === selectedInventoryToAdd) || inventory[0];

  // Sync formData when selected service changes
  const handleSelectService = (serviceId: string) => {
    const srv = services.find(s => s.id === serviceId);
    if (srv) {
      setSelectedServiceId(serviceId);
      setIsCreatingNew(false);
      setFormData({
        id: srv.id,
        name: srv.name,
        category: srv.category,
        price: srv.price,
        durationMinutes: srv.durationMinutes,
        description: srv.description,
        technicianCommission: srv.technicianCommission,
        otherOverheads: srv.otherOverheads,
        costItems: [...srv.costItems],
      });
      setSaveSuccessMsg(false);
    }
  };

  // Switch to creating a new service recipe
  const handleStartNewService = () => {
    setIsCreatingNew(true);
    const newId = `srv-${Date.now()}`;
    setSelectedServiceId(newId);
    
    // Default with cotton pads and serum from inventory
    const cottonInv = inventory.find(i => i.id === 'inv-cotton') || inventory[0];
    const serumInv = inventory.find(i => i.id === 'inv-1') || inventory[1] || inventory[0];

    const initialCostItems: ServiceCostItem[] = [];
    if (cottonInv) {
      initialCostItems.push({
        inventoryItemId: cottonInv.id,
        name: `${cottonInv.name} (${cottonInv.packageType})`,
        unit: cottonInv.subUnitName,
        quantityUsed: 4,
        costPerUnit: cottonInv.costPerSubUnit,
        totalCost: cottonInv.costPerSubUnit * 4,
      });
    }
    if (serumInv) {
      initialCostItems.push({
        inventoryItemId: serumInv.id,
        name: `${serumInv.name} (${serumInv.packageType})`,
        unit: serumInv.subUnitName,
        quantityUsed: 1,
        costPerUnit: serumInv.costPerSubUnit,
        totalCost: serumInv.costPerSubUnit * 1,
      });
    }

    setFormData({
      id: newId,
      name: 'Bài Chăm Sóc & Trẻ Hóa Tái Sinh Mới',
      category: 'Chăm sóc & Điều trị da mặt',
      price: 450000,
      durationMinutes: 60,
      description: 'Công thức định lượng chi phí chuẩn y khoa lấy từ kho mỹ phẩm.',
      technicianCommission: 60000,
      otherOverheads: 25000,
      costItems: initialCostItems,
    });
    setSaveSuccessMsg(false);
  };

  // Add inventory consumable item to formula
  const handleAddCostItem = () => {
    const inv = inventory.find(i => i.id === selectedInventoryToAdd);
    if (!inv) return;

    const newItem: ServiceCostItem = {
      inventoryItemId: inv.id,
      name: `${inv.name} (${inv.packageType})`,
      unit: inv.subUnitName,
      quantityUsed: quantityToAdd,
      costPerUnit: inv.costPerSubUnit,
      totalCost: Math.round(inv.costPerSubUnit * quantityToAdd),
    };

    setFormData(prev => ({
      ...prev,
      costItems: [...prev.costItems, newItem],
    }));
  };

  // Remove consumable item from formula
  const handleRemoveCostItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      costItems: prev.costItems.filter((_, idx) => idx !== index),
    }));
  };

  // Update quantity of existing cost item
  const handleUpdateItemQuantity = (index: number, newQty: number) => {
    const qty = Math.max(0.01, newQty);
    setFormData(prev => {
      const updated = [...prev.costItems];
      updated[index] = {
        ...updated[index],
        quantityUsed: qty,
        totalCost: Math.round(updated[index].costPerUnit * qty),
      };
      return { ...prev, costItems: updated };
    });
  };

  // Sync / refresh cost prices from current Inventory database
  const handleSyncPricesFromInventory = () => {
    setFormData(prev => {
      const updatedCostItems = prev.costItems.map(item => {
        const inv = inventory.find(i => i.id === item.inventoryItemId);
        if (inv) {
          return {
            ...item,
            name: `${inv.name} (${inv.packageType})`,
            unit: inv.subUnitName,
            costPerUnit: inv.costPerSubUnit,
            totalCost: Math.round(inv.costPerSubUnit * item.quantityUsed),
          };
        }
        return item;
      });
      return {
        ...prev,
        costItems: updatedCostItems,
      };
    });

    setSyncSuccessMsg(true);
    setTimeout(() => setSyncSuccessMsg(false), 3000);
  };

  // Real-time calculations
  const totalCosmeticsCost = formData.costItems.reduce((sum, item) => sum + item.totalCost, 0);
  const totalCalculatedCost = totalCosmeticsCost + formData.technicianCommission + formData.otherOverheads;
  const grossProfit = formData.price - totalCalculatedCost;
  const profitMarginPercent = formData.price > 0 ? Number(((grossProfit / formData.price) * 100).toFixed(1)) : 0;

  // Save changes to service list
  const handleSave = () => {
    const finalService: Service = {
      ...formData,
      totalCalculatedCost,
      grossProfit,
      profitMarginPercent,
    };

    if (isCreatingNew) {
      if (onAddService) onAddService(finalService);
      if (onSaveServiceCost) onSaveServiceCost(finalService);
      setIsCreatingNew(false);
    } else {
      if (onUpdateService) onUpdateService(finalService);
      if (onSaveServiceCost) onSaveServiceCost(finalService);
    }

    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info Banner */}
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-[#5A7D57] dark:bg-[#8BA888] text-white dark:text-[#121412] shadow-sm">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <span>{t.costCalculatorTitle}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#8BA888]/20 text-[#30522E] dark:text-[#A3C2A0]">
                  BOM Engine
                </span>
              </h1>
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-1 max-w-3xl leading-relaxed">
                Tự động lấy đơn giá gốc từng <strong>miếng, ml, gram, ống</strong> từ Kho Mỹ Phẩm để lập định mức nguyên vật liệu (BOM), tính giá cost chính xác và tối ưu biên lợi nhuận cho từng dịch vụ Spa.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="btn-sync-inventory-prices"
              onClick={handleSyncPricesFromInventory}
              title="Đồng bộ giá cost mới nhất từ kho hàng"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F0F3EF] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#E5EAE3] dark:hover:bg-[#2A2F29] border border-[#E2E6DF] dark:border-[#2D312C] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
              <span>Đồng Bộ Giá Kho</span>
            </button>

            <button
              id="btn-add-new-service-recipe"
              onClick={handleStartNewService}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewService}</span>
            </button>
          </div>
        </div>

        {/* Quick Example Simulation Box */}
        <div className="mt-4 p-3 rounded-xl bg-[#F0F3EF] dark:bg-[#222621] border border-[#D5DED2] dark:border-[#2F382E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#30522E] dark:text-[#A3C2A0]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888] shrink-0" />
            <span>
              <strong>Ví dụ thực tế:</strong> 1 Hộp Bông tẩy trang (50.000đ/200 miếng = 250đ/miếng) ➔ Dùng 4 miếng = <strong>1.000đ</strong> tiền bông.
            </span>
          </div>
          {syncSuccessMsg && (
            <span className="text-xs font-bold text-[#30522E] dark:text-[#A3C2A0] flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã cập nhật đơn giá mới từ Kho!</span>
            </span>
          )}
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 Cols): Service Selector & Comparative Profit Margins */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] uppercase tracking-wider">
              {t.selectServiceToInspect}
            </h2>

            <div className="space-y-2">
              {services.map(srv => {
                const isSelected = !isCreatingNew && srv.id === selectedServiceId;
                return (
                  <div
                    key={srv.id}
                    id={`service-card-${srv.id}`}
                    onClick={() => handleSelectService(srv.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'border-[#5A7D57] dark:border-[#8BA888] bg-[#8BA888]/15 dark:bg-[#8BA888]/20 ring-1 ring-[#5A7D57] dark:ring-[#8BA888]'
                        : 'border-[#E2E6DF] dark:border-[#2D312C] hover:border-[#8BA888] bg-[#F5F7F4] dark:bg-[#222621]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] line-clamp-1">
                        {srv.name}
                      </span>
                      <span className="text-xs font-extrabold text-[#5A7D57] dark:text-[#8BA888]">
                        {formatCurrency(srv.price, lang)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                      <span>Cost: {formatCurrency(srv.totalCalculatedCost, lang)}</span>
                      <span className="font-bold text-[#30522E] dark:text-[#A3C2A0]">
                        Lãi: {srv.profitMarginPercent}% ({formatCurrency(srv.grossProfit, lang)})
                      </span>
                    </div>

                    {/* Progress Bar of Margin */}
                    <div className="w-full bg-[#E2E6DF] dark:bg-[#2D312C] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          srv.profitMarginPercent >= 65
                            ? 'bg-[#5A7D57] dark:bg-[#8BA888]'
                            : srv.profitMarginPercent >= 50
                            ? 'bg-[#D4A373] dark:text-[#E6C29E]'
                            : 'bg-[#965A54] dark:bg-[#D98A84]'
                        }`}
                        style={{ width: `${Math.min(100, srv.profitMarginPercent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (8 Cols): Formula Editor & Real-time Live Cost Breakdown */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-5 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-5">
            {/* Header & Basic Service Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E6DF] dark:border-[#2D312C]">
              <div>
                <h3 className="text-sm font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                  <span>
                    {isCreatingNew ? 'Thiết Lập Định Lượng Dịch Vụ Mới' : `Định Lượng Giá Cost: ${formData.name}`}
                  </span>
                </h3>
                <span className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                  Thời lượng: {formData.durationMinutes} phút • Danh mục: {formData.category}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {saveSuccessMsg && (
                  <span className="text-xs font-semibold text-[#30522E] dark:text-[#A3C2A0] flex items-center space-x-1 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã lưu thành công!</span>
                  </span>
                )}
                <button
                  id="btn-save-service-cost"
                  onClick={handleSave}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.saveFormula}</span>
                </button>
              </div>
            </div>

            {/* Price & Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  {t.serviceName}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  {t.sellingPrice} (VNĐ)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>
            </div>

            {/* Consumable Cosmetics Itemized Table (BOM) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-[#5A7D57]/15 dark:bg-[#8BA888]/20 text-[#30522E] dark:text-[#A3C2A0]">
                    <Boxes className="w-4 h-4" />
                  </div>
                  <span>Bảng Định Lượng Nguyên Liệu Tiêu Hao (Lấy Từ Kho)</span>
                </h4>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                  <span className="text-emerald-700 dark:text-emerald-300">Tổng tiền mỹ phẩm/ca:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{formatCurrency(totalCosmeticsCost, lang)}</strong>
                </div>
              </div>

              {/* Mobile View: High-Legibility Card List */}
              <div className="block sm:hidden space-y-2.5">
                {formData.costItems.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 text-xs">
                    Chưa có mỹ phẩm tiêu hao nào trong bài. Vui lòng chọn nguyên liệu từ kho bên dưới để thêm vào.
                  </div>
                ) : (
                  formData.costItems.map((item, idx) => {
                    const matchedInv = inventory.find(i => i.id === item.inventoryItemId);
                    const cleanName = matchedInv?.name || item.name.replace(/\s*\(.*?\)\s*$/, '');
                    const packageSpec = matchedInv ? `1 ${matchedInv.packageUnit || 'Hộp'} = ${matchedInv.subUnitsPerPackage} ${matchedInv.subUnitName}` : '';

                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-3"
                      >
                        {/* Header: Clean Item Name, Spec Badges & Delete */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0">
                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                              {cleanName}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {packageSpec && (
                                <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                                  {packageSpec}
                                </span>
                              )}
                              <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                                {formatCurrency(item.costPerUnit, lang)}/{item.unit}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveCostItem(idx)}
                            className="p-1.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0"
                            title="Xóa khỏi công thức"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Bottom Row: Stepper & Total Cost */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80">
                          {/* Stepper */}
                          <div className="flex items-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(idx, Math.max(0.1, item.quantityUsed - (item.quantityUsed > 5 ? 1 : 0.5)))}
                              className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-bold flex items-center justify-center hover:bg-zinc-200 active:scale-95 text-xs"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              step="0.5"
                              min="0.01"
                              value={item.quantityUsed}
                              onChange={e => handleUpdateItemQuantity(idx, parseFloat(e.target.value) || 0.1)}
                              className="w-14 px-1.5 py-1 text-center rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(idx, item.quantityUsed + (item.quantityUsed >= 5 ? 1 : 0.5))}
                              className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-bold flex items-center justify-center hover:bg-zinc-200 active:scale-95 text-xs"
                            >
                              +
                            </button>
                            <span className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold pl-0.5">
                              {item.unit}
                            </span>
                          </div>

                          {/* Calculated Cost */}
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-400 block font-medium">Thành tiền cost:</span>
                            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                              {formatCurrency(item.totalCost, lang)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop & Tablet Table View */}
              <div className="hidden sm:block overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <table className="w-full text-left text-xs min-w-[560px]">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-4 w-[45%]">Mỹ Phẩm / Vật Tư (Từ Kho)</th>
                      <th className="py-3 px-3 text-center w-[22%]">Định Mức Sử Dụng</th>
                      <th className="py-3 px-3 text-right w-[15%]">Đơn Giá Lẻ</th>
                      <th className="py-3 px-4 text-right w-[18%]">Thành Tiền Cost</th>
                      <th className="py-3 px-2 text-center w-[40px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {formData.costItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-400 text-xs">
                          Chưa có mỹ phẩm tiêu hao nào trong bài. Vui lòng chọn nguyên liệu từ kho bên dưới để thêm vào.
                        </td>
                      </tr>
                    ) : (
                      formData.costItems.map((item, idx) => {
                        const matchedInv = inventory.find(i => i.id === item.inventoryItemId);
                        const cleanName = matchedInv?.name || item.name.replace(/\s*\(.*?\)\s*$/, '');
                        const packageSpec = matchedInv ? `1 ${matchedInv.packageUnit || 'Hộp'} = ${matchedInv.subUnitsPerPackage} ${matchedInv.subUnitName}` : '';

                        return (
                          <tr key={idx} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                                {cleanName}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {packageSpec && (
                                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                                    {packageSpec}
                                  </span>
                                )}
                                <span className="text-[10px] text-zinc-400 font-mono">
                                  {matchedInv?.code || item.inventoryItemId}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="inline-flex items-center space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItemQuantity(idx, Math.max(0.1, item.quantityUsed - (item.quantityUsed > 5 ? 1 : 0.5)))}
                                  className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold flex items-center justify-center hover:bg-zinc-200 text-xs"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0.01"
                                  value={item.quantityUsed}
                                  onChange={e => handleUpdateItemQuantity(idx, parseFloat(e.target.value) || 0.1)}
                                  className="w-14 px-1.5 py-1 text-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItemQuantity(idx, item.quantityUsed + (item.quantityUsed >= 5 ? 1 : 0.5))}
                                  className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold flex items-center justify-center hover:bg-zinc-200 text-xs"
                                >
                                  +
                                </button>
                                <span className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold">{item.unit}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right text-zinc-600 dark:text-zinc-300">
                              <div className="font-semibold">{formatCurrency(item.costPerUnit, lang)}</div>
                              <span className="text-[10px] text-zinc-400">/{item.unit}</span>
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-amber-600 dark:text-amber-400 text-xs">
                              {formatCurrency(item.totalCost, lang)}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveCostItem(idx)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                title="Xóa khỏi công thức"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Cosmetic Selector Widget with Live Conversion preview */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
                    <span>Chọn Mỹ Phẩm Từ Kho Để Thêm Định Lượng:</span>
                  </div>
                  {selectedInvObj && (
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal">
                      Đơn giá: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedInvObj.costPerSubUnit, lang)}/{selectedInvObj.subUnitName}</strong>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="flex-1">
                    <select
                      value={selectedInventoryToAdd}
                      onChange={e => setSelectedInventoryToAdd(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                    >
                      {inventory.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} — [1 {inv.packageUnit || inv.packageType} = {inv.subUnitsPerPackage} {inv.subUnitName} ➔ {formatCurrency(inv.costPerSubUnit, lang)}/{inv.subUnitName}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0.1"
                        value={quantityToAdd}
                        onChange={e => setQuantityToAdd(parseFloat(e.target.value) || 1)}
                        className="w-20 px-2 py-2.5 text-center rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                      />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold px-1">
                        {selectedInvObj?.subUnitName || 'đơn vị'}
                      </span>
                    </div>

                    <button
                      id="btn-add-item-to-recipe"
                      type="button"
                      onClick={handleAddCostItem}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#5A7D57] hover:bg-[#4A6A47] dark:bg-[#8BA888] dark:hover:bg-[#789875] text-white dark:text-[#121412] transition-all shrink-0 flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm (+{formatCurrency((selectedInvObj?.costPerSubUnit || 0) * quantityToAdd, lang)})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Cost Factors: Staff Commission + Overheads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] space-y-1.5">
                <label className="block text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  {t.staffCommission} (VNĐ)
                </label>
                <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                  Tiền công hoa hồng chi trả trực tiếp cho Kỹ thuật viên làm ca
                </p>
                <input
                  type="number"
                  step="5000"
                  value={formData.technicianCommission}
                  onChange={e => setFormData({ ...formData, technicianCommission: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] space-y-1.5">
                <label className="block text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                  {t.overheads} (VNĐ)
                </label>
                <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                  Điện, nước, tinh dầu thơm phòng, giặt sấy ga giường, khấu hao máy
                </p>
                <input
                  type="number"
                  step="5000"
                  value={formData.otherOverheads}
                  onChange={e => setFormData({ ...formData, otherOverheads: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>
            </div>

            {/* Live Financial Outcome & Margin Result Banner */}
            <div className="bg-[#1C211B] dark:bg-[#121412] text-[#E0E2DF] rounded-2xl p-5 border border-[#2D312C] shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-[#2D312C] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8BA888]">
                  Kết Quả Phân Tích Lợi Nhuận Gộp (Gross Profit)
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#222621] text-[#E0E2DF] font-medium border border-[#2D312C]">
                  {profitMarginPercent >= 60 ? '🟢 Siêu Lợi Nhuận' : profitMarginPercent >= 40 ? '🟡 Tốt' : '🔴 Biên Lợi Nhuận Thấp'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-[#222621] space-y-1">
                  <div className="text-[11px] text-[#9BA198]">{t.sellingPrice}</div>
                  <div className="text-sm sm:text-base font-bold text-[#E0E2DF]">
                    {formatCurrency(formData.price, lang)}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#222621] space-y-1">
                  <div className="text-[11px] text-[#9BA198]">{t.totalCost}</div>
                  <div className="text-sm sm:text-base font-bold text-[#D98A84]">
                    {formatCurrency(totalCalculatedCost, lang)}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#222621] space-y-1">
                  <div className="text-[11px] text-[#9BA198]">{t.grossProfit}</div>
                  <div className="text-sm sm:text-base font-bold text-[#8BA888]">
                    +{formatCurrency(grossProfit, lang)}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#233322] border border-[#8BA888]/30 space-y-1">
                  <div className="text-[11px] text-[#8BA888]">{t.profitMargin}</div>
                  <div className="text-base sm:text-lg font-black text-[#8BA888]">
                    {profitMarginPercent}%
                  </div>
                </div>
              </div>

              {/* Cost Ratio Breakdown Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-[#9BA198]">
                  <span>Cơ cấu chi phí trên giá bán:</span>
                  <span>Mỹ phẩm ({(formData.price > 0 ? (totalCosmeticsCost / formData.price) * 100 : 0).toFixed(0)}%) • KTV ({(formData.price > 0 ? (formData.technicianCommission / formData.price) * 100 : 0).toFixed(0)}%) • Khấu hao ({(formData.price > 0 ? (formData.otherOverheads / formData.price) * 100 : 0).toFixed(0)}%)</span>
                </div>
                <div className="h-3 w-full bg-[#2D312C] rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, (totalCosmeticsCost / (formData.price || 1)) * 100)}%` }}
                    className="bg-[#965A54] h-full"
                    title={`Mỹ phẩm: ${formatCurrency(totalCosmeticsCost, lang)}`}
                  />
                  <div
                    style={{ width: `${Math.min(100, (formData.technicianCommission / (formData.price || 1)) * 100)}%` }}
                    className="bg-[#D4A373] h-full"
                    title={`KTV: ${formatCurrency(formData.technicianCommission, lang)}`}
                  />
                  <div
                    style={{ width: `${Math.min(100, (formData.otherOverheads / (formData.price || 1)) * 100)}%` }}
                    className="bg-[#5E665B] h-full"
                    title={`Khấu hao: ${formatCurrency(formData.otherOverheads, lang)}`}
                  />
                  <div
                    style={{ width: `${Math.max(0, Math.min(100, (grossProfit / (formData.price || 1)) * 100))}%` }}
                    className="bg-[#5A7D57] dark:bg-[#8BA888] h-full"
                    title={`Lợi nhuận gộp: ${formatCurrency(grossProfit, lang)}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

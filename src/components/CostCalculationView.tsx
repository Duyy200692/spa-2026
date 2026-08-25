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
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
                  <Boxes className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
                  <span>Bảng Định Lượng Nguyên Liệu Tiêu Hao (Lấy Trực Tiếp Từ Kho)</span>
                </h4>
                <span className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                  Tổng tiền mỹ phẩm/ca: <strong className="text-[#5A7D57] dark:text-[#8BA888]">{formatCurrency(totalCosmeticsCost, lang)}</strong>
                </span>
              </div>

              <div className="overflow-x-auto border border-[#E2E6DF] dark:border-[#2D312C] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F0F3EF] dark:bg-[#222621] text-[#5E665B] dark:text-[#9BA198] font-semibold border-b border-[#E2E6DF] dark:border-[#2D312C]">
                    <tr>
                      <th className="py-2.5 px-3">Mỹ Phẩm / Vật Tư (Từ Kho)</th>
                      <th className="py-2.5 px-3 text-center">Định Mức Sử Dụng</th>
                      <th className="py-2.5 px-3 text-right">Đơn Giá Lẻ Gốc</th>
                      <th className="py-2.5 px-3 text-right">Thành Tiền Cost</th>
                      <th className="py-2.5 px-3 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E6DF] dark:divide-[#2D312C]">
                    {formData.costItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-5 text-center text-[#9BA198] text-xs">
                          Chưa có mỹ phẩm tiêu hao nào trong bài. Vui lòng chọn nguyên liệu từ kho bên dưới để thêm vào.
                        </td>
                      </tr>
                    ) : (
                      formData.costItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#F5F7F4] dark:hover:bg-[#222621] transition-colors">
                          <td className="py-2.5 px-3 font-medium text-[#1C211B] dark:text-[#E0E2DF]">
                            <div>{item.name}</div>
                            <span className="text-[10px] text-[#5A7D57] dark:text-[#8BA888] font-mono">
                              Kho: {item.inventoryItemId}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="inline-flex items-center space-x-1.5">
                              <input
                                type="number"
                                step="0.5"
                                min="0.01"
                                value={item.quantityUsed}
                                onChange={e => handleUpdateItemQuantity(idx, parseFloat(e.target.value) || 0.1)}
                                className="w-16 px-1.5 py-1 text-center rounded-lg border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] text-xs font-bold"
                              />
                              <span className="text-[#5E665B] dark:text-[#9BA198] text-[11px] font-semibold">{item.unit}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right text-[#5E665B] dark:text-[#9BA198]">
                            {formatCurrency(item.costPerUnit, lang)}
                            <span className="text-[10px] block">/{item.unit}</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#8A504B] dark:text-[#D98A84]">
                            {formatCurrency(item.totalCost, lang)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => handleRemoveCostItem(idx)}
                              className="p-1 rounded-lg text-[#9BA198] hover:text-[#965A54] dark:hover:text-[#D98A84] hover:bg-[#965A54]/10 transition-colors"
                              title="Xóa khỏi công thức"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Cosmetic Selector Widget with Live Conversion preview */}
              <div className="p-3.5 bg-[#F5F7F4] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] rounded-xl space-y-2.5">
                <div className="text-[11px] font-bold text-[#30522E] dark:text-[#A3C2A0] flex items-center space-x-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Chọn Nguyên Liệu Từ Kho Để Đưa Vào Bài Dịch Vụ:</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="flex-1">
                    <select
                      value={selectedInventoryToAdd}
                      onChange={e => setSelectedInventoryToAdd(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl text-xs font-medium border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                    >
                      {inventory.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} — [1 {inv.packageType} = {inv.subUnitsPerPackage} {inv.subUnitName} ➔ {formatCurrency(inv.costPerSubUnit, lang)}/{inv.subUnitName}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28 flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={quantityToAdd}
                      onChange={e => setQuantityToAdd(parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-2 text-center rounded-xl text-xs font-bold border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                    />
                    <span className="text-xs text-[#5E665B] dark:text-[#9BA198] font-semibold">
                      {selectedInvObj?.subUnitName || 'đơn vị'}
                    </span>
                  </div>

                  <button
                    id="btn-add-item-to-recipe"
                    onClick={handleAddCostItem}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors shrink-0 flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Vào Bài (+{formatCurrency((selectedInvObj?.costPerSubUnit || 0) * quantityToAdd, lang)})</span>
                  </button>
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

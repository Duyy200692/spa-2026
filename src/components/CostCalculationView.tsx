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
  Percent,
  Tag,
  Wand2,
  Search,
  BookOpen,
  FileText,
  ListOrdered,
  ShieldCheck,
  AlertTriangle,
  Printer,
  Eye,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  Clock,
  Package,
  Wrench
} from 'lucide-react';
import { Service, InventoryItem, ServiceCostItem, ServiceStep, Language, Role } from '../types';
import { translations, formatCurrency } from '../i18n';
import { generateServiceCode, getServiceShortName, resolveServiceMeta } from '../utils/serviceUtils';
import { getDefaultSOPForService } from '../data/defaultSOPs';
import { ServiceSOPManualModal } from './ServiceSOPManualModal';

interface CostCalculationViewProps {
  services: Service[];
  inventory: InventoryItem[];
  lang: Language;
  currentRole?: Role;
  onUpdateService?: (updatedService: Service) => void;
  onAddService?: (newService: Service) => void;
  onDeleteService?: (serviceId: string) => void;
  onSaveServiceCost?: (savedService: Service) => void;
}

export const CostCalculationView: React.FC<CostCalculationViewProps> = ({
  services,
  inventory,
  lang,
  currentRole,
  onUpdateService,
  onAddService,
  onDeleteService,
  onSaveServiceCost,
}) => {
  const t = translations[lang];
  const isAdminOrManager = currentRole === 'owner' || currentRole === 'manager';

  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState(services.length === 0);
  const [activeSection, setActiveSection] = useState<'formula' | 'sop'>(isAdminOrManager ? 'formula' : 'sop');
  const [isSOPModalOpen, setIsSOPModalOpen] = useState(false);

  // Active working state for currently edited service
  const currentService = services.find(s => s.id === selectedServiceId) || services[0];
  const defaultSOP = getDefaultSOPForService(currentService?.name || '', currentService?.category || '');

  const [formData, setFormData] = useState<{
    id: string;
    code: string;
    shortName: string;
    name: string;
    category: string;
    price: number;
    durationMinutes: number;
    description: string;
    technicianCommission: number;
    otherOverheads: number;
    costItems: ServiceCostItem[];
    // SOP fields
    steps: ServiceStep[];
    preparationSteps: string[];
    targetSkinType: string;
    benefitsSummary: string;
    contraindications: string;
    homeCareNotes: string;
  }>({
    id: currentService?.id || `srv-${Date.now()}`,
    code: currentService?.code || generateServiceCode(currentService?.category || currentService?.name || 'DV', 1),
    shortName: currentService?.shortName || getServiceShortName(currentService?.name || '', 28),
    name: currentService?.name || '',
    category: currentService?.category || 'Chăm sóc & Điều trị da mặt',
    price: currentService?.price || 350000,
    durationMinutes: currentService?.durationMinutes || 60,
    description: currentService?.description || '',
    technicianCommission: currentService?.technicianCommission || 50000,
    otherOverheads: currentService?.otherOverheads || 20000,
    costItems: currentService?.costItems || [],
    steps: currentService?.steps && currentService.steps.length > 0 ? currentService.steps : defaultSOP.steps,
    preparationSteps: currentService?.preparationSteps && currentService.preparationSteps.length > 0 ? currentService.preparationSteps : defaultSOP.preparationSteps,
    targetSkinType: currentService?.targetSkinType || defaultSOP.targetSkinType,
    benefitsSummary: currentService?.benefitsSummary || currentService?.description || defaultSOP.benefitsSummary,
    contraindications: currentService?.contraindications || defaultSOP.contraindications,
    homeCareNotes: currentService?.homeCareNotes || defaultSOP.homeCareNotes,
  });

  // Automatically switch to create mode if services list is empty
  useEffect(() => {
    if (services.length === 0) {
      setIsCreatingNew(true);
      const newId = `srv-${Date.now()}`;
      setSelectedServiceId(newId);
      setFormData({
        id: newId,
        code: generateServiceCode('Chăm sóc & Điều trị da mặt', 1),
        shortName: 'Chăm Sóc Tái Sinh',
        name: '',
        category: 'Chăm sóc & Điều trị da mặt',
        price: 350000,
        durationMinutes: 60,
        description: '',
        technicianCommission: 50000,
        otherOverheads: 20000,
        costItems: [],
      });
    } else if (!isCreatingNew && !services.find(s => s.id === selectedServiceId)) {
      handleSelectService(services[0].id);
    }
  }, [services.length]);

  const [selectedInventoryToAdd, setSelectedInventoryToAdd] = useState<string>(inventory[0]?.id || '');
  const [quantityToAdd, setQuantityToAdd] = useState<number>(4);
  const [inventorySearchQuery, setInventorySearchQuery] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState(false);

  // Filtered inventory list based on quick search query
  const filteredInventoryForAdd = inventory.filter(inv =>
    inv.name.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
    (inv.brand && inv.brand.toLowerCase().includes(inventorySearchQuery.toLowerCase())) ||
    (inv.category && inv.category.toLowerCase().includes(inventorySearchQuery.toLowerCase()))
  );

  // Selected item object for quick live preview
  const selectedInvObj = inventory.find(i => i.id === selectedInventoryToAdd) || inventory[0];

  // Sync formData when selected service changes
  const handleSelectService = (serviceId: string) => {
    const srv = services.find(s => s.id === serviceId);
    if (srv) {
      setSelectedServiceId(serviceId);
      setIsCreatingNew(false);
      const sop = getDefaultSOPForService(srv.name, srv.category);

      setFormData({
        id: srv.id,
        code: srv.code || generateServiceCode(srv.category || srv.name, 1),
        shortName: srv.shortName || getServiceShortName(srv.name, 28),
        name: srv.name,
        category: srv.category,
        price: srv.price,
        durationMinutes: srv.durationMinutes,
        description: srv.description,
        technicianCommission: srv.technicianCommission,
        otherOverheads: srv.otherOverheads,
        costItems: [...srv.costItems],
        steps: srv.steps && srv.steps.length > 0 ? srv.steps : sop.steps,
        preparationSteps: srv.preparationSteps && srv.preparationSteps.length > 0 ? srv.preparationSteps : sop.preparationSteps,
        targetSkinType: srv.targetSkinType || sop.targetSkinType,
        benefitsSummary: srv.benefitsSummary || srv.description || sop.benefitsSummary,
        contraindications: srv.contraindications || sop.contraindications,
        homeCareNotes: srv.homeCareNotes || sop.homeCareNotes,
      });
      setSaveSuccessMsg(false);
    }
  };

  // Auto generate service code helper
  const handleAutoGenerateCode = () => {
    const nextIdx = services.length + 1;
    const generated = generateServiceCode(formData.name || formData.category, nextIdx);
    const short = getServiceShortName(formData.name, 28);
    setFormData(prev => ({
      ...prev,
      code: generated,
      shortName: prev.shortName || short,
    }));
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

    const defaultCode = generateServiceCode('Chăm sóc da', services.length + 1);
    const sop = getDefaultSOPForService('Detox 60m', 'Chăm sóc & Điều trị da mặt');

    setFormData({
      id: newId,
      code: defaultCode,
      shortName: 'Chăm Sóc Trẻ Hóa',
      name: 'Bài Chăm Sóc & Trẻ Hóa Tái Sinh Mới',
      category: 'Chăm sóc & Điều trị da mặt',
      price: 450000,
      durationMinutes: 60,
      description: 'Công thức định lượng chi phí chuẩn y khoa lấy từ kho mỹ phẩm.',
      technicianCommission: 60000,
      otherOverheads: 25000,
      costItems: initialCostItems,
      steps: sop.steps,
      preparationSteps: sop.preparationSteps,
      targetSkinType: sop.targetSkinType,
      benefitsSummary: sop.benefitsSummary,
      contraindications: sop.contraindications,
      homeCareNotes: sop.homeCareNotes,
    });
    setSaveSuccessMsg(false);
  };

  // Load standard medical SOP template for current service
  const handleLoadSOPTemplate = () => {
    const template = getDefaultSOPForService(formData.name || 'Detox 60m', formData.category);
    setFormData(prev => ({
      ...prev,
      steps: template.steps,
      preparationSteps: template.preparationSteps,
      targetSkinType: template.targetSkinType,
      benefitsSummary: template.benefitsSummary,
      contraindications: template.contraindications,
      homeCareNotes: template.homeCareNotes,
    }));
  };

  // SOP Step list handlers
  const handleAddStep = () => {
    const nextNum = (formData.steps?.length || 0) + 1;
    const newStep: ServiceStep = {
      id: `step-${Date.now()}`,
      stepNumber: nextNum,
      title: `Bước ${nextNum}: Thao tác trị liệu mới`,
      durationMinutes: 5,
      description: '',
      productsUsed: '',
      toolsUsed: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      steps: [...(prev.steps || []), newStep]
    }));
  };

  const handleRemoveStep = (index: number) => {
    setFormData(prev => {
      const updated = prev.steps.filter((_, idx) => idx !== index).map((st, idx) => ({
        ...st,
        stepNumber: idx + 1
      }));
      return { ...prev, steps: updated };
    });
  };

  const handleUpdateStep = (index: number, field: keyof ServiceStep, value: any) => {
    setFormData(prev => {
      const updated = [...prev.steps];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, steps: updated };
    });
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === formData.steps.length - 1)) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    setFormData(prev => {
      const updated = [...prev.steps];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      const renumbered = updated.map((st, idx) => ({ ...st, stepNumber: idx + 1 }));
      return { ...prev, steps: renumbered };
    });
  };

  const handleAddPrepStep = (text: string) => {
    if (!text.trim()) return;
    setFormData(prev => ({
      ...prev,
      preparationSteps: [...(prev.preparationSteps || []), text.trim()]
    }));
  };

  const handleRemovePrepStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preparationSteps: (prev.preparationSteps || []).filter((_, idx) => idx !== index)
    }));
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
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                <span>{isAdminOrManager ? t.costCalculatorTitle : 'Quy Trình SOP & Định Mức Kỹ Thuật'}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#8BA888]/20 text-[#30522E] dark:text-[#A3C2A0]">
                  {isAdminOrManager ? 'BOM Engine & Pricing' : 'Quy Trình Chuẩn KTV'}
                </span>
              </h1>
              <p className="text-xs text-[#5E665B] dark:text-[#9BA198] mt-1 max-w-3xl leading-relaxed">
                {isAdminOrManager
                  ? 'Tự động lấy đơn giá gốc từng miếng, ml, gram, ống từ Kho Mỹ Phẩm để lập định mức nguyên vật liệu (BOM), tính giá cost chính xác và tối ưu biên lợi nhuận cho từng dịch vụ Spa.'
                  : 'Tra cứu quy trình chuẩn y khoa từng bước, các nguyên vật liệu mỹ phẩm và dụng cụ cần chuẩn bị sẵn sàng cho từng ca liệu trình.'}
              </p>
            </div>
          </div>

          {isAdminOrManager && (
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
          )}
        </div>

        {/* Quick Example Simulation Box */}
        {isAdminOrManager && (
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
        )}
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 Cols): Service Selector & Comparative Profit Margins */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 border border-[#E2E6DF] dark:border-[#2D312C] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] uppercase tracking-wider">
                {t.selectServiceToInspect} ({services.length})
              </h2>
              {isAdminOrManager && (
                <button
                  onClick={handleStartNewService}
                  className="text-xs font-bold text-[#5A7D57] dark:text-[#8BA888] hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Mới</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {services.length === 0 ? (
                <div className="p-5 text-center rounded-2xl border border-dashed border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4]/50 dark:bg-[#222621]/30 space-y-2">
                  <div className="w-9 h-9 mx-auto rounded-full bg-[#8BA888]/20 flex items-center justify-center text-[#5A7D57] dark:text-[#8BA888]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">Chưa có bài dịch vụ nào</p>
                  <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198] leading-relaxed">
                    Điền thông tin và quy trình ở bên phải để tạo bài dịch vụ đầu tiên!
                  </p>
                </div>
              ) : (
                services.map(srv => {
                  const isSelected = !isCreatingNew && srv.id === selectedServiceId;
                  const code = srv.code || generateServiceCode(srv.category || srv.name, 1);
                  return (
                    <div
                      key={srv.id}
                      id={`service-card-${srv.id}`}
                      onClick={() => handleSelectService(srv.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 relative group ${
                        isSelected
                          ? 'border-[#5A7D57] dark:border-[#8BA888] bg-[#8BA888]/15 dark:bg-[#8BA888]/20 ring-1 ring-[#5A7D57] dark:ring-[#8BA888]'
                          : 'border-[#E2E6DF] dark:border-[#2D312C] hover:border-[#8BA888] bg-[#F5F7F4] dark:bg-[#222621]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-black uppercase bg-[#5A7D57]/20 text-[#30522E] dark:bg-[#8BA888]/25 dark:text-[#A3C2A0] border border-[#5A7D57]/30 shrink-0">
                            {code}
                          </span>
                          <span className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] truncate">
                            {srv.shortName || srv.name}
                          </span>
                        </div>
                        {isAdminOrManager && (
                          <span className="text-xs font-extrabold text-[#5A7D57] dark:text-[#8BA888] shrink-0">
                            {formatCurrency(srv.price, lang)}
                          </span>
                        )}
                      </div>

                      {isAdminOrManager ? (
                        <>
                          <div className="flex items-center justify-between text-[11px] text-[#5E665B] dark:text-[#9BA198]">
                            <span>Cost: {formatCurrency(srv.totalCalculatedCost, lang)}</span>
                            <span className="font-bold text-[#30522E] dark:text-[#A3C2A0]">
                              Lãi: {srv.profitMarginPercent}% ({formatCurrency(srv.grossProfit, lang)})
                            </span>
                          </div>

                          <div className="w-full bg-[#E2E6DF] dark:border-[#2D312C] h-1.5 rounded-full overflow-hidden">
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
                        </>
                      ) : (
                        <div className="flex items-center justify-between text-[11px] text-[#5E665B] dark:text-[#9BA198] pt-0.5">
                          <span className="flex items-center space-x-1 font-medium">
                            <Clock className="w-3 h-3 text-[#5A7D57] dark:text-[#8BA888]" />
                            <span>{srv.durationMinutes || 60} phút</span>
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                            {srv.category || 'Liệu trình'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
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
                    {isCreatingNew ? 'Thiết Lập Bài Dịch Vụ Mới' : `Định Lượng Giá Cost: [${formData.code}] ${formData.name || 'Bài dịch vụ'}`}
                  </span>
                </h3>
                <span className="text-xs text-[#5E665B] dark:text-[#9BA198]">
                  Thời lượng: {formData.durationMinutes} phút • Danh mục: {formData.category}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {!isCreatingNew && onDeleteService && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc muốn xóa bài dịch vụ "${formData.name}"?`)) {
                        onDeleteService(formData.id);
                      }
                    }}
                    className="p-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 transition-colors"
                    title="Xóa bài dịch vụ này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
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

            {/* Service Codes, Short Names & Prices */}
            <div className={`grid grid-cols-1 ${isAdminOrManager ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3.5`}>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                    Mã Ký Hiệu (Mã DV)
                  </label>
                  {isAdminOrManager && (
                    <button
                      type="button"
                      onClick={handleAutoGenerateCode}
                      className="text-[11px] font-semibold text-[#5A7D57] dark:text-[#8BA888] hover:underline flex items-center space-x-0.5"
                      title="Tự động tạo mã ký hiệu từ tên dịch vụ"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Tạo tự động</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="VD: TM-01, MS-02..."
                  value={formData.code}
                  readOnly={!isAdminOrManager}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tên Rút Gọn (Bảng/Di động)
                </label>
                <input
                  type="text"
                  placeholder="VD: Trị Mụn Y Khoa..."
                  value={formData.shortName}
                  onChange={e => setFormData({ ...formData, shortName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              {isAdminOrManager && (
                <div>
                  <label className="block text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                    {t.sellingPrice} (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl text-xs font-black border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#5A7D57] dark:text-[#8BA888] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                  />
                </div>
              )}
            </div>

            {/* Full Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Tên Đầy Đủ Dịch Vụ (Hiển thị khi xem chi tiết)
                </label>
                <input
                  type="text"
                  placeholder="VD: Trị Mụn Chuyên Sâu Chuẩn Y Khoa 12 Bước"
                  value={formData.name}
                  onChange={e => {
                    const newName = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name: newName,
                      shortName: prev.shortName || getServiceShortName(newName, 28)
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Danh Mục Phân Loại
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Thời Lượng (Phút)
                </label>
                <input
                  type="number"
                  step="5"
                  value={formData.durationMinutes}
                  onChange={e => setFormData({ ...formData, durationMinutes: Number(e.target.value) || 60 })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57] dark:focus:ring-[#8BA888]"
                />
              </div>
            </div>

            {/* Section Navigation Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E2E6DF] dark:border-[#2D312C]">
              <div className="flex items-center space-x-2 p-1 rounded-2xl bg-[#F0F3EF] dark:bg-[#222621]">
                <button
                  type="button"
                  onClick={() => setActiveSection('formula')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeSection === 'formula'
                      ? 'bg-white dark:bg-[#1A1C19] text-[#30522E] dark:text-[#A3C2A0] shadow-xs'
                      : 'text-[#5E665B] dark:text-[#9BA198] hover:text-[#1C211B]'
                  }`}
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>{isAdminOrManager ? '1. Định Mức Mỹ Phẩm & Costing' : '1. Nguyên Vật Liệu & Mỹ Phẩm Chuẩn Bị'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('sop')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeSection === 'sop'
                      ? 'bg-white dark:bg-[#1A1C19] text-[#30522E] dark:text-[#A3C2A0] shadow-xs'
                      : 'text-[#5E665B] dark:text-[#9BA198] hover:text-[#1C211B]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>2. Quy Trình SOP Nội Bộ ({formData.steps?.length || 0} Bước)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsSOPModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#5A7D57]/15 hover:bg-[#5A7D57]/25 text-[#30522E] dark:text-[#A3C2A0] border border-[#5A7D57]/30 flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
                title="Mở giao diện xem & in thẻ SOP thực hành dành cho nhân viên"
              >
                <Eye className="w-4 h-4" />
                <span>Xem & In Thẻ SOP</span>
              </button>
            </div>

            {/* SECTION 1: CONSUMABLE COSMETICS & FORMULA COSTING */}
            {activeSection === 'formula' && (
              <div className="space-y-5 animate-in fade-in">
                {/* Consumable Cosmetics Itemized Table (BOM) */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-[#5A7D57]/15 dark:bg-[#8BA888]/20 text-[#30522E] dark:text-[#A3C2A0]">
                        <Boxes className="w-4 h-4" />
                      </div>
                      <span>{isAdminOrManager ? 'Bảng Định Lượng Nguyên Liệu Tiêu Hao (Lấy Từ Kho)' : 'Danh Sách Nguyên Vật Liệu & Mỹ Phẩm Cần Chuẩn Bị'}</span>
                    </h4>
                    {isAdminOrManager && (
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                        <span className="text-emerald-700 dark:text-emerald-300">Tổng tiền mỹ phẩm/ca:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{formatCurrency(totalCosmeticsCost, lang)}</strong>
                      </div>
                    )}
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
                              {isAdminOrManager && (
                                <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                                  {formatCurrency(item.costPerUnit, lang)}/{item.unit}
                                </span>
                              )}
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
                          {isAdminOrManager && (
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-400 block font-medium">Thành tiền cost:</span>
                              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                                {formatCurrency(item.totalCost, lang)}
                              </span>
                            </div>
                          )}
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
                      <th className="py-3 px-3 text-center w-[25%]">Định Mức Sử Dụng</th>
                      {isAdminOrManager && <th className="py-3 px-3 text-right w-[15%]">Đơn Giá Lẻ</th>}
                      {isAdminOrManager && <th className="py-3 px-4 text-right w-[18%]">Thành Tiền Cost</th>}
                      <th className="py-3 px-2 text-center w-[40px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {formData.costItems.length === 0 ? (
                      <tr>
                        <td colSpan={isAdminOrManager ? 5 : 3} className="py-8 text-center text-zinc-400 text-xs">
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
                            {isAdminOrManager && (
                              <td className="py-3 px-3 text-right text-zinc-600 dark:text-zinc-300">
                                <div className="font-semibold">{formatCurrency(item.costPerUnit, lang)}</div>
                                <span className="text-[10px] text-zinc-400">/{item.unit}</span>
                              </td>
                            )}
                            {isAdminOrManager && (
                              <td className="py-3 px-4 text-right font-bold text-amber-600 dark:text-amber-400 text-xs">
                                {formatCurrency(item.totalCost, lang)}
                              </td>
                            )}
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
              {inventory.length === 0 ? (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl text-xs text-zinc-600 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <Boxes className="w-4 h-4 text-zinc-400" />
                    <span>Kho mỹ phẩm đang trống. Bạn vẫn có thể lưu bài dịch vụ với quy trình thực hiện, hoặc thêm vật tư vào kho mỹ phẩm bất cứ lúc nào.</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Plus className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
                      <span>Chọn Mỹ Phẩm Từ Kho Để Thêm Định Lượng:</span>
                    </div>
                    {isAdminOrManager && selectedInvObj && (
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal">
                        Đơn giá: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedInvObj.costPerSubUnit, lang)}/{selectedInvObj.subUnitName}</strong>
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* Quick Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="🔍 Tìm kiếm nhanh mỹ phẩm/vật tư (nhập tên, thương hiệu...)..."
                        value={inventorySearchQuery}
                        onChange={e => setInventorySearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <div className="flex-1">
                        <select
                          value={selectedInventoryToAdd}
                          onChange={e => setSelectedInventoryToAdd(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                        >
                          {filteredInventoryForAdd.length === 0 ? (
                            <option value="" disabled>Không tìm thấy mỹ phẩm phù hợp...</option>
                          ) : (
                            filteredInventoryForAdd.map(inv => (
                              <option key={inv.id} value={inv.id}>
                                {inv.name} — {isAdminOrManager
                                  ? `[1 ${inv.packageUnit || inv.packageType} = ${inv.subUnitsPerPackage} ${inv.subUnitName} ➔ ${formatCurrency(inv.costPerSubUnit, lang)}/${inv.subUnitName}]`
                                  : `[1 ${inv.packageUnit || inv.packageType} = ${inv.subUnitsPerPackage} ${inv.subUnitName}]`}
                              </option>
                            ))
                          )}
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
                          <span>{isAdminOrManager ? `Thêm (+${formatCurrency((selectedInvObj?.costPerSubUnit || 0) * quantityToAdd, lang)})` : 'Thêm Vào Danh Sách'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Cost Factors: Staff Commission + Overheads */}
            {isAdminOrManager && (
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
            )}

            {/* Live Financial Outcome & Margin Result Banner */}
            {isAdminOrManager && (
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
              </div>
            )}
              {/* Cost Ratio Breakdown Bar */}
              {isAdminOrManager && (
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
              )}
            </div>
          )}

        {/* SECTION 2: SOP INTERNAL PROTOCOL & STAFF INSTRUCTION EDITOR */}
        {activeSection === 'sop' && (
          <div className="space-y-6 animate-in fade-in">
            {/* SOP Top Action Bar */}
            <div className="p-4 rounded-2xl bg-[#F0F3EF] dark:bg-[#222621] border border-[#E2E6DF] dark:border-[#2D312C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                  <span>Biên Soạn Quy Trình Kỹ Thuật Nội Bộ (SOP)</span>
                </h4>
                <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198] mt-0.5">
                  Tự định nghĩa các bước thực hiện, thời lượng, mỹ phẩm & dụng cụ từng bước để nhân viên cũ & mới tuân thủ nghiêm ngặt quy trình chuẩn y khoa.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={handleLoadSOPTemplate}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors flex items-center space-x-1"
                  title="Nạp quy trình mẫu chuẩn y khoa cho dịch vụ này"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Nạp Mẫu Quy Trình</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#5A7D57] hover:bg-[#4A6A47] dark:bg-[#8BA888] text-white dark:text-[#121412] transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Bước (+1)</span>
                </button>
              </div>
            </div>

            {/* Benefits & Target Skin Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Công Dụng & Tác Dụng Nổi Bật Dịch Vụ
                </label>
                <textarea
                  rows={3}
                  placeholder="VD: Giúp loại bỏ các gốc tự do & độc tố, làm sạch sâu bề mặt da, mang lại làn da tươi trẻ..."
                  value={formData.benefitsSummary}
                  onChange={e => setFormData({ ...formData, benefitsSummary: e.target.value })}
                  className="w-full p-3 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] mb-1">
                  Loại Da Áp Dụng (Khuyên Dùng)
                </label>
                <textarea
                  rows={3}
                  placeholder="VD: Chiết xuất tự nhiên phù hợp với mọi loại da (da mệt mỏi, da nhiễm độc tố...)"
                  value={formData.targetSkinType}
                  onChange={e => setFormData({ ...formData, targetSkinType: e.target.value })}
                  className="w-full p-3 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                />
              </div>
            </div>

            {/* Preparation Steps Checklist */}
            <div className="p-4 rounded-2xl border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                  <span>Các Bước Chuẩn Bị Trước Trị Liệu (Preparation Checklist)</span>
                </label>
              </div>

              <div className="space-y-2">
                {(formData.preparationSteps || []).map((prep, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-[#5A7D57]/20 text-[#30522E] dark:text-[#A3C2A0] text-[10px] font-bold flex items-center justify-center shrink-0">
                      ✓
                    </span>
                    <input
                      type="text"
                      value={prep}
                      onChange={e => {
                        const updated = [...formData.preparationSteps];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, preparationSteps: updated });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] text-[#1C211B] dark:text-[#E0E2DF] focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePrepStep(idx)}
                      className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="text"
                  id="input-new-prep-step"
                  placeholder="Thêm chuẩn bị mới (VD: Bật máy xông nóng trước 5 phút...)"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPrepStep(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1A1C19] text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('input-new-prep-step') as HTMLInputElement;
                    if (el && el.value) {
                      handleAddPrepStep(el.value);
                      el.value = '';
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#5A7D57] text-white text-xs font-bold"
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Step-by-Step SOP Detailed Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-2">
                  <ListOrdered className="w-4 h-4 text-[#5A7D57] dark:text-[#8BA888]" />
                  <span>Các Bước Thực Hiện Kỹ Thuật Chi Tiết ({formData.steps?.length || 0} Bước)</span>
                </h4>

                <button
                  type="button"
                  onClick={handleAddStep}
                  className="text-xs font-bold text-[#5A7D57] dark:text-[#8BA888] hover:underline flex items-center space-x-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Thêm bước mới</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.steps || []).map((step, idx) => (
                  <div
                    key={step.id || idx}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-3"
                  >
                    {/* Step Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="w-7 h-7 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-xs flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <input
                          type="text"
                          placeholder="Tên bước thực hiện (VD: Tẩy trang, Massage đá nóng...)"
                          value={step.title}
                          onChange={e => handleUpdateStep(idx, 'title', e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#5A7D57]"
                        />
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          <input
                            type="number"
                            min="1"
                            placeholder="Phút"
                            value={step.durationMinutes || ''}
                            onChange={e => handleUpdateStep(idx, 'durationMinutes', Number(e.target.value) || 0)}
                            className="w-14 px-2 py-1 text-center rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                          />
                          <span className="text-[11px] text-zinc-400 font-medium">phút</span>
                        </div>

                        <div className="flex items-center space-x-1 border-l border-zinc-200 dark:border-zinc-800 pl-2">
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                            title="Di chuyển bước lên"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, 'down')}
                            disabled={idx === (formData.steps.length - 1)}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                            title="Di chuyển bước xuống"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            title="Xóa bước này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Description & Technical details */}
                    <div>
                      <textarea
                        rows={2}
                        placeholder="Mô tả kỹ thuật thực hiện chi tiết cho kỹ thuật viên..."
                        value={step.description || ''}
                        onChange={e => handleUpdateStep(idx, 'description', e.target.value)}
                        className="w-full p-2.5 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      />
                    </div>

                    {/* Products, Tools & Technician Notes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 mb-0.5">💊 Mỹ phẩm sử dụng:</label>
                        <input
                          type="text"
                          placeholder="VD: Kem Detox DBH, Serum HA..."
                          value={step.productsUsed || ''}
                          onChange={e => handleUpdateStep(idx, 'productsUsed', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 mb-0.5">🛠️ Dụng cụ đi kèm:</label>
                        <input
                          type="text"
                          placeholder="VD: 2 viên đá nóng basalt 45°C..."
                          value={step.toolsUsed || ''}
                          onChange={e => handleUpdateStep(idx, 'toolsUsed', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-amber-600 mb-0.5">⚠️ Lưu ý kỹ thuật viên:</label>
                        <input
                          type="text"
                          placeholder="VD: Kiểm tra nhiệt độ đá trước khi miết..."
                          value={step.notes || ''}
                          onChange={e => handleUpdateStep(idx, 'notes', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contraindications & Home Care Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-rose-700 dark:text-rose-400 mb-1 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Chống Chỉ Định & Lưu Ý Y Khoa</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Không dùng cho da đang có vết thương hở lớn, da vừa laser..."
                  value={formData.contraindications}
                  onChange={e => setFormData({ ...formData, contraindications: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-xs border border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-700 dark:text-blue-400 mb-1 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Dặn Dò Khách Hàng Chăm Sóc Tại Nhà</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Uống nhiều nước sau detox, thoa kem chống nắng hàng ngày..."
                  value={formData.homeCareNotes}
                  onChange={e => setFormData({ ...formData, homeCareNotes: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-xs border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Staff SOP Manual Modal */}
    <ServiceSOPManualModal
      isOpen={isSOPModalOpen}
      onClose={() => setIsSOPModalOpen(false)}
      service={formData as any}
      allServices={services}
      onSelectService={(srv) => {
        handleSelectService(srv.id);
      }}
      lang={lang}
    />
  </div>
  </div>
  );
};

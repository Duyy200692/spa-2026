import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Clock,
  DollarSign,
  Tag,
  Layers,
  Copy,
  Check,
  FileText,
  CheckCircle2,
  Boxes
} from 'lucide-react';
import { Service, Language } from '../types';
import { translations, formatCurrency } from '../i18n';

export interface ServiceDetailMeta {
  code: string;
  shortName: string;
  fullName: string;
  fullService?: Service;
}

interface ServiceDetailModalProps {
  meta: ServiceDetailMeta | null;
  lang: Language;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  meta,
  lang,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!meta) return null;

  const t = translations[lang];
  const service = meta.fullService;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(meta.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#1A1C19] rounded-2xl w-full max-w-lg shadow-2xl border border-[#E2E6DF] dark:border-[#2D312C] p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2E6DF] dark:border-[#2D312C] pb-3.5">
          <div className="space-y-1.5 min-w-0 pr-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-2.5 py-1 rounded-md font-mono text-xs font-black tracking-wider uppercase bg-[#5A7D57]/20 text-[#30522E] dark:bg-[#8BA888]/25 dark:text-[#A3C2A0] border border-[#5A7D57]/40 shadow-xs">
                Mã: {meta.code}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold text-[#5E665B] dark:text-[#9BA198] hover:bg-[#F0F3EF] dark:hover:bg-[#222621] transition-colors"
                title="Sao chép mã dịch vụ"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1C211B] dark:text-[#E0E2DF] leading-snug break-words">
              {meta.fullName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF] hover:bg-[#F0F3EF] dark:hover:bg-[#222621] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Attributes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] space-y-0.5">
            <span className="text-[#5E665B] dark:text-[#9BA198] flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
              <span>Giá Niêm Yết</span>
            </span>
            <p className="font-bold text-sm text-[#5A7D57] dark:text-[#8BA888]">
              {service?.price ? formatCurrency(service.price, lang) : 'Theo biểu giá'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] space-y-0.5">
            <span className="text-[#5E665B] dark:text-[#9BA198] flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
              <span>Thời Lượng</span>
            </span>
            <p className="font-bold text-sm text-[#1C211B] dark:text-[#E0E2DF]">
              {service?.durationMinutes ? `${service.durationMinutes} phút` : '60 phút'}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[#F5F7F4] dark:bg-[#222621] space-y-0.5">
            <span className="text-[#5E665B] dark:text-[#9BA198] flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Danh Mục</span>
            </span>
            <p className="font-semibold text-xs text-[#1C211B] dark:text-[#E0E2DF] truncate">
              {service?.category || 'Chăm sóc & Trị liệu'}
            </p>
          </div>
        </div>

        {/* Description or Protocols */}
        <div className="p-3.5 rounded-xl bg-[#F5F7F4] dark:bg-[#222621]/60 border border-[#E2E6DF] dark:border-[#2D312C] space-y-1.5 text-xs">
          <div className="font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>Mô Tả & Quy Trình Dịch Vụ</span>
          </div>
          <p className="text-[#5E665B] dark:text-[#9BA198] leading-relaxed">
            {service?.description ||
              'Liệu trình chuẩn y khoa ứng dụng dược mỹ phẩm sinh học cao cấp, thực hiện bởi kỹ thuật viên tay nghề chuyên sâu theo phác đồ vô trùng.'}
          </p>
        </div>

        {/* Costing breakdown if available */}
        {service?.costItems && service.costItems.length > 0 && (
          <div className="space-y-2 text-xs">
            <div className="font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Boxes className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
                <span>Định Lượng Mỹ Phẩm ({service.costItems.length} nguyên liệu)</span>
              </span>
              <span className="text-[11px] font-semibold text-[#5A7D57] dark:text-[#8BA888]">
                Lãi gộp: {service.profitMarginPercent}%
              </span>
            </div>
            <div className="divide-y divide-[#E2E6DF] dark:divide-[#2D312C] border border-[#E2E6DF] dark:border-[#2D312C] rounded-xl overflow-hidden">
              {service.costItems.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-white dark:bg-[#1A1C19] flex items-center justify-between">
                  <span className="text-[#1C211B] dark:text-[#E0E2DF]">{item.name}</span>
                  <span className="text-[#5E665B] dark:text-[#9BA198] font-mono">
                    {item.quantityUsed} {item.unit} ({formatCurrency(item.totalCost, lang)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-[#E2E6DF] dark:border-[#2D312C]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold bg-[#5A7D57] hover:bg-[#4D6D4A] dark:bg-[#8BA888] dark:hover:bg-[#7A9877] text-white dark:text-[#121412] transition-colors shadow-sm"
          >
            Đóng Cửa Sổ
          </button>
        </div>
      </div>
    </div>
  );
};

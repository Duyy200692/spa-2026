import React from 'react';
import { Eye, Info, Sparkles } from 'lucide-react';
import { Service } from '../types';
import { resolveServiceMeta } from '../utils/serviceUtils';

interface ServiceBadgeTagProps {
  serviceName: string;
  serviceId?: string;
  serviceCode?: string;
  allServices?: Service[];
  onOpenDetail?: (serviceMeta: {
    code: string;
    shortName: string;
    fullName: string;
    fullService?: Service;
  }) => void;
  compact?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const ServiceBadgeTag: React.FC<ServiceBadgeTagProps> = ({
  serviceName,
  serviceId,
  serviceCode,
  allServices = [],
  onOpenDetail,
  compact = false,
  showIcon = true,
  className = '',
}) => {
  const meta = resolveServiceMeta(serviceName, serviceId, serviceCode, allServices);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenDetail) {
      onOpenDetail(meta);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Bấm để xem thông tin chi tiết: ${meta.fullName}`}
      className={`inline-flex items-center text-left group cursor-pointer max-w-full transition-all focus:outline-none ${className}`}
    >
      <span className="inline-flex items-center gap-1.5 max-w-full">
        {/* Service Code Badge */}
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md font-mono text-[11px] font-black tracking-wider uppercase bg-[#5A7D57]/15 text-[#30522E] dark:bg-[#8BA888]/25 dark:text-[#A3C2A0] border border-[#5A7D57]/30 group-hover:bg-[#5A7D57] group-hover:text-white dark:group-hover:bg-[#8BA888] dark:group-hover:text-[#121412] transition-colors shrink-0 shadow-2xs">
          {meta.code}
        </span>

        {/* Shortened Name if not compact */}
        {!compact && (
          <span className="text-xs font-semibold text-[#1C211B] dark:text-[#E0E2DF] group-hover:text-[#5A7D57] dark:group-hover:text-[#8BA888] truncate transition-colors">
            {meta.shortName}
          </span>
        )}

        {/* Quick view indicator */}
        {showIcon && (
          <span className="opacity-40 group-hover:opacity-100 text-[#5A7D57] dark:text-[#8BA888] transition-opacity shrink-0">
            <Info className="w-3.5 h-3.5" />
          </span>
        )}
      </span>
    </button>
  );
};

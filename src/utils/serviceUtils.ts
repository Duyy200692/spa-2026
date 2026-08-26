import { Service } from '../types';

/**
 * Auto-generates a clean, short service code based on category, name and sequence number.
 * Example outputs: TM-01, MS-02, GD-03, CSD-04, TA-05
 */
export function generateServiceCode(
  nameOrCategory: string,
  index: number = 1
): string {
  const text = (nameOrCategory || '').trim().toLowerCase();
  let prefix = 'DV';

  if (text.includes('mụn') || text.includes('acne') || text.includes('trị mụn')) {
    prefix = 'TM';
  } else if (text.includes('massage') || text.includes('body') || text.includes('mát-xa') || text.includes('thư giãn')) {
    prefix = 'MS';
  } else if (text.includes('gội') || text.includes('dưỡng sinh') || text.includes('head') || text.includes('tóc')) {
    prefix = 'GD';
  } else if (text.includes('nám') || text.includes('tàn nhang') || text.includes('pigment')) {
    prefix = 'TN';
  } else if (text.includes('trẻ hóa') || text.includes('hifu') || text.includes('nâng cơ') || text.includes('căng bóng')) {
    prefix = 'TH';
  } else if (text.includes('chăm sóc') || text.includes('facial') || text.includes('da mặt') || text.includes('skin')) {
    prefix = 'CSD';
  } else if (text.includes('triệt lông') || text.includes('laser') || text.includes('wax')) {
    prefix = 'TL';
  } else if (text.includes('tắm trắng') || text.includes('ủ trắng') || text.includes('white')) {
    prefix = 'TT';
  } else if (text.includes('combo') || text.includes('gói')) {
    prefix = 'CB';
  } else if (text.includes('phun xăm') || text.includes('mày') || text.includes('môi')) {
    prefix = 'PX';
  } else {
    // Take first letter of each significant word
    const words = (nameOrCategory || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);
    
    if (words.length >= 2) {
      prefix = words.slice(0, 3).map(w => w[0].toUpperCase()).join('');
    } else if (words.length === 1 && words[0].length >= 2) {
      prefix = words[0].substring(0, 3).toUpperCase();
    }
  }

  const numStr = index.toString().padStart(2, '0');
  return `${prefix}-${numStr}`;
}

/**
 * Returns a concise, beautiful short title from a long verbose service name
 */
export function getServiceShortName(fullName: string, maxLength: number = 32): string {
  if (!fullName) return '';
  const trimmed = fullName.trim();
  if (trimmed.length <= maxLength) return trimmed;

  // Smart contractions for common spa services
  let short = trimmed
    .replace(/Chuyên Sâu Chuẩn Y Khoa/gi, 'Y Khoa')
    .replace(/Toàn Thân Đá Nóng & Tinh Dầu Gừng/gi, 'Body Đá Nóng')
    .replace(/Dưỡng Sinh Trung Hoa \d+ Bước Thảo Mộc/gi, 'Dưỡng Sinh Thảo Mộc')
    .replace(/Chăm Sóc & /gi, '')
    .replace(/Điều Trị & /gi, '')
    .replace(/Công Nghệ Cao/gi, 'CNC')
    .replace(/Chuẩn Y Khoa/gi, 'Y Khoa');

  if (short.length > maxLength) {
    return short.slice(0, maxLength - 1) + '…';
  }
  return short;
}

export interface ServiceDisplayMeta {
  code: string;
  shortName: string;
  fullName: string;
  price?: number;
  duration?: number;
  category?: string;
  description?: string;
  fullService?: Service;
}

/**
 * Finds or synthesizes Service Code, Short Name and Details for any service item.
 * Supports passing a Service object directly or individual string parameters.
 */
export function resolveServiceMeta(
  serviceOrName: Service | string,
  serviceId?: string,
  serviceCode?: string,
  allServices: Service[] = []
): ServiceDisplayMeta {
  let name = '';
  let id = serviceId;
  let code = serviceCode;
  let passedPrice: number | undefined;
  let passedDuration: number | undefined;
  let passedCategory: string | undefined;
  let passedDescription: string | undefined;
  let passedShortName: string | undefined;
  let matchedService: Service | undefined;

  if (typeof serviceOrName === 'object' && serviceOrName !== null) {
    matchedService = serviceOrName;
    name = serviceOrName.name || 'Dịch vụ Spa';
    id = serviceOrName.id;
    code = serviceOrName.code;
    passedShortName = serviceOrName.shortName;
    passedPrice = serviceOrName.price;
    passedDuration = serviceOrName.durationMinutes;
    passedCategory = serviceOrName.category;
    passedDescription = serviceOrName.description;
  } else {
    name = typeof serviceOrName === 'string' && serviceOrName ? serviceOrName : 'Dịch vụ Spa';
    if (id) {
      matchedService = allServices.find(s => s.id === id);
    }
    if (!matchedService) {
      matchedService = allServices.find(
        s => s.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
    }
  }

  // Priority 1: explicitly passed code
  let finalCode = code;
  // Priority 2: matched service's code
  if (!finalCode && matchedService?.code) {
    finalCode = matchedService.code;
  }
  // Priority 3: synthesize clean fallback code
  if (!finalCode) {
    finalCode = generateServiceCode(matchedService?.category || name, 1);
  }

  const finalShortName = passedShortName || matchedService?.shortName || getServiceShortName(name, 28);

  return {
    code: finalCode.toUpperCase(),
    shortName: finalShortName,
    fullName: matchedService?.name || name,
    price: matchedService?.price ?? passedPrice,
    duration: matchedService?.durationMinutes ?? passedDuration,
    category: matchedService?.category ?? passedCategory,
    description: matchedService?.description ?? passedDescription,
    fullService: matchedService,
  };
}

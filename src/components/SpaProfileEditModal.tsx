import React, { useState } from 'react';
import {
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Save,
  Check,
  Image as ImageIcon,
  Heart,
  ShieldCheck,
  Plus,
  Trash2,
  Share2,
  Eye,
  Edit3,
  ExternalLink,
  Sliders,
  Star,
  Tag,
  Palette
} from 'lucide-react';
import { SpaProfile, Language } from '../types';

interface SpaProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaProfile: SpaProfile;
  onSave: (updatedProfile: SpaProfile) => void;
  lang: Language;
}

const PRESET_LOGOS = [
  {
    name: 'Lotus Zen Spa',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Aroma Herb Botanic',
    url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Pure Beauty Clinic',
    url: 'https://images.unsplash.com/photo-1512290900672-1f4864c20577?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Luxury Glow Skin',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&auto=format&fit=crop&q=80',
  },
];

const PRESET_BANNERS = [
  {
    name: 'Phòng Trị Liệu Zen Minimalist',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Không Gian Thư Giãn Thảo Dược',
    url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Công Nghệ Thẩm Mỹ Y Khoa',
    url: 'https://images.unsplash.com/photo-1512290900672-1f4864c20577?w=1200&auto=format&fit=crop&q=80',
  },
];

export const SpaProfileEditModal: React.FC<SpaProfileEditModalProps> = ({
  isOpen,
  onClose,
  spaProfile,
  onSave,
  lang,
}) => {
  const [formData, setFormData] = useState<SpaProfile>({
    ...spaProfile,
    highlights: spaProfile.highlights && spaProfile.highlights.length > 0
      ? spaProfile.highlights
      : [
          { title: '100% Mỹ Phẩm Chuẩn Dược Khoa', description: 'Nhập khẩu chính hãng có chứng nhận FDA/Bộ Y Tế.' },
          { title: 'Phòng Trị Liệu Vô Trùng Riêng Biệt', description: 'Không gian riêng tư, thơm hương tinh dầu thiên nhiên.' },
          { title: 'Đội Ngũ Kỹ Thuật Viên 5+ Năm', description: 'Được cấp chứng chỉ hành nghề y tế, tay nghề chuyên sâu.' },
          { title: 'Soi Da & Phác Đồ Miễn Phí', description: 'Phân tích 8 chỉ số chuyên sâu bằng máy 3D hiện đại.' },
        ],
    commitments: spaProfile.commitments && spaProfile.commitments.length > 0
      ? spaProfile.commitments
      : [
          'Minh bạch tuyệt đối chi phí, không phụ phí phát sinh.',
          'Dụng cụ sử dụng 1 lần hoặc tiệt trùng chuẩn bệnh viện.',
          'Cam kết hiệu quả rõ rệt ngay sau buổi đầu tiên.',
          'Bảo hành liệu trình & hỗ trợ chăm sóc 24/7.',
        ],
    monthlySpecial: spaProfile.monthlySpecial || {
      enabled: true,
      badge: 'DỊCH VỤ ĐẶC BIỆT THÁNG 8 • BESTSELLER',
      title: 'Smoothing Face Serum & Tái Sinh Đa Tầng',
      subtitle: 'Liệu pháp trẻ hóa, thu nhỏ lỗ chân lông & làm mịn màng cấu trúc da',
      description: 'Được điều chế với công thức sinh học độc quyền kết hợp tinh chất thực vật ép lạnh và peptides sinh học giúp tái sinh bề mặt da căng mướt, phục hồi hàng rào ẩm và dưỡng sáng đều màu tự nhiên.',
      price: 650000,
      originalPrice: 950000,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=85',
      themeColor: 'sage',
      buttonText: 'ĐẶT LIỆU TRÌNH ĐẶC BIỆT',
      serviceId: 'srv-3',
    },
  });

  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'special_monthly' | 'story' | 'highlights'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [newCommitmentText, setNewCommitmentText] = useState('');
  const [showSaveNotice, setShowSaveNotice] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof SpaProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHighlightChange = (index: number, key: 'title' | 'description', value: string) => {
    const nextHighlights = [...formData.highlights];
    nextHighlights[index] = {
      ...nextHighlights[index],
      [key]: value,
    };
    setFormData((prev) => ({ ...prev, highlights: nextHighlights }));
  };

  const handleAddCommitment = () => {
    if (!newCommitmentText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      commitments: [...prev.commitments, newCommitmentText.trim()],
    }));
    setNewCommitmentText('');
  };

  const handleRemoveCommitment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      commitments: prev.commitments.filter((_, idx) => idx !== index),
    }));
  };

  const handleCommitmentChange = (index: number, text: string) => {
    const updated = [...formData.commitments];
    updated[index] = text;
    setFormData((prev) => ({ ...prev, commitments: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      onSave(formData);
      setShowSaveNotice(true);
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 600);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shadow-sm">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50">
                Chỉnh Sửa Thông Tin Spa, Địa Chỉ & Logo
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Cập nhật thông tin thương hiệu hiển thị trên toàn bộ hệ thống & Cổng Khách Hàng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-5 pt-3 space-x-2 overflow-x-auto">
          {[
            { id: 'general', label: 'Tên & Logo Spa', icon: Building },
            { id: 'contact', label: 'Địa Chỉ & Liên Hệ', icon: MapPin },
            { id: 'special_monthly', label: 'Dịch Vụ Đặc Biệt Tháng & Layout', icon: Star },
            { id: 'story', label: 'Câu Chuyện & Triết Lý', icon: Heart },
            { id: 'highlights', label: 'Điểm Nổi Bật & Cam Kết', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-zinc-900 text-zinc-950 dark:border-white dark:text-white bg-zinc-100/70 dark:bg-zinc-800/70'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* TAB 1: TÊN & LOGO SPA */}
          {activeTab === 'general' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Live Preview Header Card */}
              <div className="p-4 rounded-2xl bg-zinc-950 text-white dark:bg-[#1C1F24] border border-zinc-800 flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
                  {formData.logo ? (
                    <img
                      src={formData.logo}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as any).src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&q=80';
                      }}
                    />
                  ) : (
                    <Sparkles className="w-6 h-6 text-zinc-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Xem Trước Giao Diện</div>
                  <h4 className="text-sm sm:text-base font-bold text-white truncate">
                    {formData.name || 'Tên Spa Của Bạn'}
                  </h4>
                  <p className="text-xs text-zinc-300 truncate font-light">
                    {formData.tagline || 'Slogan hoặc thông điệp thương hiệu'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                  Tên Thương Hiệu Spa *:
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ví dụ: L’AURA BEAUTY & WELLNESS SPA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                  Slogan / Tagline *:
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="Ví dụ: Kiến Tạo Vẻ Đẹp Thuần Khiết Chuẩn Y Khoa"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center justify-between">
                  <span>URL Đường Dẫn Logo Spa:</span>
                  <span className="text-[11px] text-zinc-500 font-normal">Hỗ trợ link ảnh Web / PNG / JPG</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={formData.logo || ''}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    placeholder="https://.../logo.png"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                  {formData.logo && (
                    <button
                      type="button"
                      onClick={() => handleInputChange('logo', '')}
                      className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                {/* Preset Logo Selection */}
                <div className="mt-3 space-y-2">
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                    Hoặc chọn nhanh logo mẫu chuẩn thẩm mỹ viện:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_LOGOS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInputChange('logo', p.url)}
                        className={`p-2 rounded-xl border flex items-center space-x-2 text-left transition-all ${
                          formData.logo === p.url
                            ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 font-semibold'
                            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                        }`}
                      >
                        <img
                          src={p.url}
                          alt={p.name}
                          className="w-7 h-7 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[11px] truncate">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                  URL Ảnh Bìa / Banner Header:
                </label>
                <input
                  type="url"
                  value={formData.bannerImage || ''}
                  onChange={(e) => handleInputChange('bannerImage', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ĐỊA CHỈ & LIÊN HỆ */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span>Địa Chỉ Cơ Sở Spa *:</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                    <span>Hotline / Số Điện Thoại *:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="0908 688 888 / 028 3822 9999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center space-x-1.5">
                    <Mail className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                    <span>Email Tiếp Nhận *:</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@lauraspa.com.vn"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span>Khung Giờ Mở Cửa & Phục Vụ *:</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.openHours}
                  onChange={(e) => handleInputChange('openHours', e.target.value)}
                  placeholder="08:30 - 20:30 (Tất cả các ngày trong tuần)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center space-x-1.5">
                    <Share2 className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                    <span>Link Facebook Fanpage:</span>
                  </label>
                  <input
                    type="text"
                    value={formData.socialFacebook || ''}
                    onChange={(e) => handleInputChange('socialFacebook', e.target.value)}
                    placeholder="facebook.com/lauraspa.vietnam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center space-x-1.5">
                    <Share2 className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                    <span>Số Zalo Official / Hotline:</span>
                  </label>
                  <input
                    type="text"
                    value={formData.socialZalo || ''}
                    onChange={(e) => handleInputChange('socialZalo', e.target.value)}
                    placeholder="0908688888"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: DỊCH VỤ ĐẶC BIỆT THÁNG & CHỈNH SỬA NHANH LAYOUT */}
          {activeTab === 'special_monthly' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Feature Toggle */}
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      Hiển Thị Banner Dịch Vụ Đặc Biệt Của Tháng
                    </h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      Tự động ghim khối nổi bật ở vị trí trung tâm trang chủ landing page
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.monthlySpecial?.enabled ?? true}
                    onChange={(e) => {
                      const cur = formData.monthlySpecial || {
                        enabled: true,
                        badge: 'DỊCH VỤ ĐẶC BIỆT THÁNG • BESTSELLER',
                        title: '',
                        subtitle: '',
                        description: '',
                        price: 500000,
                        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=85',
                        themeColor: 'sage',
                        buttonText: 'ĐẶT LỊCH NGAY',
                      };
                      handleInputChange('monthlySpecial', {
                        ...cur,
                        enabled: e.target.checked,
                      });
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Special Service Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center space-x-1.5">
                      <Tag className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                      <span>Nhãn Tag Đặc Biệt (Badge):</span>
                    </label>
                    <input
                      type="text"
                      value={formData.monthlySpecial?.badge || ''}
                      onChange={(e) => {
                        const cur = formData.monthlySpecial || {
                          enabled: true,
                          badge: '',
                          title: '',
                          subtitle: '',
                          description: '',
                          price: 0,
                          image: '',
                          themeColor: 'sage',
                          buttonText: 'ĐẶT LỊCH NGAY',
                        };
                        handleInputChange('monthlySpecial', { ...cur, badge: e.target.value });
                      }}
                      placeholder="VD: DỊCH VỤ ĐẶC BIỆT THÁNG 8 • BESTSELLER"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center space-x-1.5">
                      <Palette className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                      <span>Tông Màu Layout Banner:</span>
                    </label>
                    <select
                      value={formData.monthlySpecial?.themeColor || 'sage'}
                      onChange={(e) => {
                        const cur = formData.monthlySpecial || {
                          enabled: true,
                          badge: '',
                          title: '',
                          subtitle: '',
                          description: '',
                          price: 0,
                          image: '',
                          themeColor: 'sage',
                          buttonText: 'ĐẶT LỊCH NGAY',
                        };
                        handleInputChange('monthlySpecial', { ...cur, themeColor: e.target.value as any });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                    >
                      <option value="sage">Xanh Xô Thơm Tự Nhiên (Sage Green - Mặc định)</option>
                      <option value="rose">Hồng Cánh Hoa Dịu Ngọt (Rose Glow)</option>
                      <option value="amber">Vàng Hoàng Gia Ấm Áp (Warm Amber)</option>
                      <option value="blue">Xanh Khoáng Biển Thanh Lọc (Ocean Mineral)</option>
                      <option value="charcoal">Đen Than Sang Trọng Tối Giản (Minimal Charcoal)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                    Tên Liệu Trình / Dịch Vụ Nổi Bật *:
                  </label>
                  <input
                    type="text"
                    value={formData.monthlySpecial?.title || ''}
                    onChange={(e) => {
                      const cur = formData.monthlySpecial || {
                        enabled: true,
                        badge: '',
                        title: '',
                        subtitle: '',
                        description: '',
                        price: 0,
                        image: '',
                        themeColor: 'sage',
                        buttonText: 'ĐẶT LỊCH NGAY',
                      };
                      handleInputChange('monthlySpecial', { ...cur, title: e.target.value });
                    }}
                    placeholder="VD: Smoothing Face Serum & Trẻ Hóa Đa Tầng"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                    Phụ Đề / Slogan Ngắn:
                  </label>
                  <input
                    type="text"
                    value={formData.monthlySpecial?.subtitle || ''}
                    onChange={(e) => {
                      const cur = formData.monthlySpecial || {
                        enabled: true,
                        badge: '',
                        title: '',
                        subtitle: '',
                        description: '',
                        price: 0,
                        image: '',
                        themeColor: 'sage',
                        buttonText: 'ĐẶT LỊCH NGAY',
                      };
                      handleInputChange('monthlySpecial', { ...cur, subtitle: e.target.value });
                    }}
                    placeholder="VD: Liệu pháp trẻ hóa & làm mịn màng cấu trúc da đa tầng chuẩn y khoa"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                    Mô Tả Chi Tiết Quy Trình & Hiệu Quả:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.monthlySpecial?.description || ''}
                    onChange={(e) => {
                      const cur = formData.monthlySpecial || {
                        enabled: true,
                        badge: '',
                        title: '',
                        subtitle: '',
                        description: '',
                        price: 0,
                        image: '',
                        themeColor: 'sage',
                        buttonText: 'ĐẶT LỊCH NGAY',
                      };
                      handleInputChange('monthlySpecial', { ...cur, description: e.target.value });
                    }}
                    placeholder="Mô tả công nghệ sinh học, tinh chất điều chế ép lạnh, cam kết hiệu quả cho làn da..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Giá Khuyến Mãi (VNĐ):
                    </label>
                    <input
                      type="number"
                      value={formData.monthlySpecial?.price || 0}
                      onChange={(e) => {
                        const cur = formData.monthlySpecial || {
                          enabled: true,
                          badge: '',
                          title: '',
                          subtitle: '',
                          description: '',
                          price: 0,
                          image: '',
                          themeColor: 'sage',
                          buttonText: 'ĐẶT LỊCH NGAY',
                        };
                        handleInputChange('monthlySpecial', { ...cur, price: Number(e.target.value) || 0 });
                      }}
                      placeholder="650000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Giá Gốc Chưa Giảm (VNĐ):
                    </label>
                    <input
                      type="number"
                      value={formData.monthlySpecial?.originalPrice || 0}
                      onChange={(e) => {
                        const cur = formData.monthlySpecial || {
                          enabled: true,
                          badge: '',
                          title: '',
                          subtitle: '',
                          description: '',
                          price: 0,
                          image: '',
                          themeColor: 'sage',
                          buttonText: 'ĐẶT LỊCH NGAY',
                        };
                        handleInputChange('monthlySpecial', { ...cur, originalPrice: Number(e.target.value) || 0 });
                      }}
                      placeholder="950000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Nút Kêu Gọi Hành Động (CTA):
                    </label>
                    <input
                      type="text"
                      value={formData.monthlySpecial?.buttonText || 'ĐẶT LIỆU TRÌNH NGAY'}
                      onChange={(e) => {
                        const cur = formData.monthlySpecial || {
                          enabled: true,
                          badge: '',
                          title: '',
                          subtitle: '',
                          description: '',
                          price: 0,
                          image: '',
                          themeColor: 'sage',
                          buttonText: 'ĐẶT LỊCH NGAY',
                        };
                        handleInputChange('monthlySpecial', { ...cur, buttonText: e.target.value });
                      }}
                      placeholder="ĐẶT LIỆU TRÌNH NGAY"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                    <span>Link Hình Ảnh Trưng Bày (Banner Image URL):</span>
                  </label>
                  <input
                    type="text"
                    value={formData.monthlySpecial?.image || ''}
                    onChange={(e) => {
                      const cur = formData.monthlySpecial || {
                        enabled: true,
                        badge: '',
                        title: '',
                        subtitle: '',
                        description: '',
                        price: 0,
                        image: '',
                        themeColor: 'sage',
                        buttonText: 'ĐẶT LỊCH NGAY',
                      };
                      handleInputChange('monthlySpecial', { ...cur, image: e.target.value });
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white font-mono text-[11px]"
                  />

                  {/* Preset quick image selection */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      { name: 'Tinh Chất Serum Tự Nhiên', url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=85' },
                      { name: 'Liệu Pháp Massage Thư Giãn', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=85' },
                      { name: 'Dưỡng Ẩm Thủy Liệu Pháp', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=85' },
                      { name: 'Cấy Dưỡng Chất Căng Bóng', url: 'https://images.unsplash.com/photo-1512290900672-1f4864c20577?w=800&q=85' },
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          const cur = formData.monthlySpecial || {
                            enabled: true,
                            badge: '',
                            title: '',
                            subtitle: '',
                            description: '',
                            price: 0,
                            image: '',
                            themeColor: 'sage',
                            buttonText: 'ĐẶT LỊCH NGAY',
                          };
                          handleInputChange('monthlySpecial', { ...cur, image: preset.url });
                        }}
                        className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[10px] text-zinc-800 dark:text-zinc-200"
                      >
                        + Mẫu ảnh: {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CÂU CHUYỆN & TRIẾT LÝ */}
          {activeTab === 'story' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center space-x-1.5">
                  <Building className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span>Câu Chuyện Thương Hiệu (Story) *:</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.story}
                  onChange={(e) => handleInputChange('story', e.target.value)}
                  placeholder="Giới thiệu về quá trình thành lập, sứ mệnh và giá trị cốt lõi của spa..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center space-x-1.5">
                  <Heart className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span>Triết Lý Trị Liệu & Làm Đẹp (Philosophy) *:</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.philosophy}
                  onChange={(e) => handleInputChange('philosophy', e.target.value)}
                  placeholder="Triết lý chăm sóc da chuẩn y khoa, an toàn cho sức khỏe và thư giãn tinh thần..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 4: ĐIỂM NỔI BẬT & CAM KẾT */}
          {activeTab === 'highlights' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono text-[11px]">
                    4 Điểm Nhấn Giá Trị Khác Biệt
                  </h4>
                </div>

                <div className="space-y-3">
                  {formData.highlights.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold font-mono flex items-center justify-center text-[10px]">
                          0{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={h.title}
                          onChange={(e) => handleHighlightChange(idx, 'title', e.target.value)}
                          placeholder={`Tiêu đề điểm nhấn #${idx + 1}`}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <input
                        type="text"
                        value={h.description}
                        onChange={(e) => handleHighlightChange(idx, 'description', e.target.value)}
                        placeholder="Mô tả chi tiết điểm nổi bật..."
                        className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono text-[11px]">
                    Danh Sách Cam Kết Chất Lượng Dịch Vụ
                  </h4>
                </div>

                <div className="space-y-2">
                  {formData.commitments.map((c, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={c}
                        onChange={(e) => handleCommitmentChange(idx, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCommitment(idx)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new commitment */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={newCommitmentText}
                    onChange={(e) => setNewCommitmentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCommitment();
                      }
                    }}
                    placeholder="Nhập thêm cam kết mới..."
                    className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddCommitment}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-semibold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              * Thay đổi sẽ được lưu cục bộ và đẩy lên bảng <code className="font-mono font-bold">spa_profile</code> trên Firestore.
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Hủy
              </button>
              <button
                id="btn-save-spa-profile"
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm transition-all flex items-center space-x-1.5 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang Lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu & Đồng Bộ Firestore</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

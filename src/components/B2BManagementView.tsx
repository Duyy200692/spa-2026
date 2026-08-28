import React, { useState, useEffect } from 'react';
import {
  Building,
  Award,
  Users,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  Check,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import {
  B2BFullConfig,
  B2BCardConfig,
  B2BSlideSimple,
  defaultB2BConfig,
  getStoredB2BConfig,
  saveStoredB2BConfig
} from '../data/b2bConfigData';
import { Role, Language } from '../types';

interface B2BManagementViewProps {
  currentRole: Role;
  lang: Language;
  onSaveConfig?: (newConfig: B2BFullConfig) => void;
}

export const B2BManagementView: React.FC<B2BManagementViewProps> = ({
  currentRole,
  lang,
  onSaveConfig
}) => {
  const [config, setConfig] = useState<B2BFullConfig>(getStoredB2BConfig());
  const [activeTab, setActiveTab] = useState<'cards' | 'slides'>('cards');
  const [selectedCategory, setSelectedCategory] = useState<'hotel' | 'sports' | 'spa_outsourcing'>('hotel');
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    setConfig(getStoredB2BConfig());
  }, []);

  const handleSaveAll = () => {
    const updated = {
      ...config,
      updatedAt: new Date().toISOString()
    };
    saveStoredB2BConfig(updated);
    if (onSaveConfig) {
      onSaveConfig(updated);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại toàn bộ nội dung chiến lược B2B mặc định ban đầu?')) {
      setConfig(defaultB2BConfig);
      saveStoredB2BConfig(defaultB2BConfig);
      if (onSaveConfig) {
        onSaveConfig(defaultB2BConfig);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Card update helper
  const handleUpdateCard = (cat: 'hotel' | 'sports' | 'spa_outsourcing', field: keyof B2BCardConfig, val: string) => {
    setConfig((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [cat]: {
          ...prev.cards[cat],
          [field]: val
        }
      }
    }));
  };

  // Slide update helper
  const handleUpdateSlideField = (cat: 'hotel' | 'sports' | 'spa_outsourcing', index: number, field: keyof B2BSlideSimple, val: any) => {
    setConfig((prev) => {
      const catSlides = [...prev.slides[cat]];
      if (catSlides[index]) {
        catSlides[index] = {
          ...catSlides[index],
          [field]: val
        };
      }
      return {
        ...prev,
        slides: {
          ...prev.slides,
          [cat]: catSlides
        }
      };
    });
  };

  const activeCard = config.cards[selectedCategory];
  const activeSlides = config.slides[selectedCategory] || [];
  const currentSlide = activeSlides[selectedSlideIndex] || activeSlides[0];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* HEADER BAR */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-900 border border-amber-500/30">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950">
              Quản Lý Nội Dung Hợp Tác B2B
            </h2>
          </div>
          <p className="text-xs text-zinc-500">
            Tùy chỉnh tiêu đề, quyền lợi đối tác & các slide trình chiếu đề án B2B hiển thị trên Landing Page.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-bold transition-all flex items-center space-x-1.5"
            title="Khôi phục nguyên bản thông tin chiến lược B2B mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Mặc Định</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 active:scale-95"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-amber-300" />
                <span>Đã Lưu Tự Động!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-300" />
                <span>Lưu Thay Đổi B2B</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION HEADER CONFIG */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center space-x-2">
          <Edit3 className="w-4 h-4 text-emerald-800" />
          <span>Tiêu Đề Khu Vực B2B Trên Landing Page</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700">Tiêu đề khu vực (Header Title)</label>
            <input
              type="text"
              value={config.sectionTitle}
              onChange={(e) => setConfig((prev) => ({ ...prev, sectionTitle: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700">Mô tả phụ (Header Subtitle)</label>
            <input
              type="text"
              value={config.sectionSubtitle}
              onChange={(e) => setConfig((prev) => ({ ...prev, sectionSubtitle: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
            />
          </div>
        </div>
      </div>

      {/* MODEL / CATEGORY SELECTOR TABS */}
      <div className="flex items-center space-x-2 border-b border-zinc-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory('hotel')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
            selectedCategory === 'hotel'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>1. Mô Hình Lưu Trú & Hotel</span>
        </button>

        <button
          onClick={() => setSelectedCategory('sports')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
            selectedCategory === 'sports'
              ? 'bg-amber-800 text-white shadow-sm'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>2. Mô Hình Thể Thao & Brand Activation</span>
        </button>

        <button
          onClick={() => setSelectedCategory('spa_outsourcing')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
            selectedCategory === 'spa_outsourcing'
              ? 'bg-zinc-900 text-white shadow-sm'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>3. Mô Hình B2B Spa Outsourcing</span>
        </button>
      </div>

      {/* VIEW TABS: CARDS VS SLIDES */}
      <div className="flex items-center space-x-3 bg-zinc-100 p-1 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('cards')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'cards' ? 'bg-white text-zinc-950 shadow-xs font-bold' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Sửa Thẻ Hiển Thị Landing Page
        </button>
        <button
          onClick={() => setActiveTab('slides')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'slides' ? 'bg-white text-zinc-950 shadow-xs font-bold' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Sửa Slide Trình Chiếu Đề Án ({activeSlides.length} Slide)
        </button>
      </div>

      {/* SUB-CONTENT 1: EDIT CARDS */}
      {activeTab === 'cards' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
              Chỉnh Sửa Thông Tin Thẻ: {activeCard.badge}
            </h4>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Hoa Hồng / Mức Chiết Khấu: {activeCard.commissionRate}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Badge Nhãn Thẻ</label>
              <input
                type="text"
                value={activeCard.badge}
                onChange={(e) => handleUpdateCard(selectedCategory, 'badge', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Tên Mô Hình / Tiêu Đề Thẻ</label>
              <input
                type="text"
                value={activeCard.title}
                onChange={(e) => handleUpdateCard(selectedCategory, 'title', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-zinc-700">Mô Tả Giải Pháp Chi Tiết</label>
              <textarea
                rows={3}
                value={activeCard.description}
                onChange={(e) => handleUpdateCard(selectedCategory, 'description', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Tiêu Đề Khung Quyền Lợi Đối Tác</label>
              <input
                type="text"
                value={activeCard.benefitTitle}
                onChange={(e) => handleUpdateCard(selectedCategory, 'benefitTitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Tỷ Lệ Hoa Hồng / Mức Ưu Đãi</label>
              <input
                type="text"
                value={activeCard.commissionRate || ''}
                onChange={(e) => handleUpdateCard(selectedCategory, 'commissionRate', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-zinc-700">Nội Dung Chi Tiết Khung Quyền Lợi</label>
              <textarea
                rows={2}
                value={activeCard.benefitText}
                onChange={(e) => handleUpdateCard(selectedCategory, 'benefitText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-normal focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Nút Nút Xem Slide (Primary CTA)</label>
              <input
                type="text"
                value={activeCard.primaryButtonLabel}
                onChange={(e) => handleUpdateCard(selectedCategory, 'primaryButtonLabel', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Nút Đăng Ký (Secondary CTA)</label>
              <input
                type="text"
                value={activeCard.secondaryButtonLabel}
                onChange={(e) => handleUpdateCard(selectedCategory, 'secondaryButtonLabel', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-CONTENT 2: EDIT SLIDES */}
      {activeTab === 'slides' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-6">
          
          {/* SLIDE NUMBER INDEX TABS */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar border-b border-zinc-100 pb-3">
            {activeSlides.map((slide, idx) => (
              <button
                key={slide.id || idx}
                onClick={() => setSelectedSlideIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedSlideIndex === idx
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                Slide {idx + 1}: {slide.badge.split('•')[0] || `Slide ${idx + 1}`}
              </button>
            ))}
          </div>

          {currentSlide && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <span className="text-xs font-extrabold text-amber-800 uppercase tracking-widest">
                  Đang sửa: Slide {selectedSlideIndex + 1} / {activeSlides.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Badge Nhãn Slide</label>
                  <input
                    type="text"
                    value={currentSlide.badge || ''}
                    onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'badge', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Tiêu Đề Slide (Headline)</label>
                  <input
                    type="text"
                    value={currentSlide.title || ''}
                    onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'title', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-700">Tiêu Đề Phụ (Subtitle)</label>
                  <input
                    type="text"
                    value={currentSlide.subtitle || ''}
                    onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'subtitle', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
                  />
                </div>

                {/* Banner inputs if available */}
                {currentSlide.bannerHeading !== undefined && (
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 md:col-span-2 space-y-3">
                    <span className="text-[11px] font-bold uppercase text-amber-800 block">
                      Khung Banner Nổi Bật Trên Slide
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-700">Badge Banner</label>
                        <input
                          type="text"
                          value={currentSlide.bannerBadge || ''}
                          onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'bannerBadge', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-700">Dòng Nhấn Mạnh Banner</label>
                        <input
                          type="text"
                          value={currentSlide.bannerHeading || ''}
                          onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'bannerHeading', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold text-zinc-700">Nội Dung Chi Tiết Banner</label>
                        <textarea
                          rows={2}
                          value={currentSlide.bannerDescription || ''}
                          onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'bannerDescription', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Stat boxes if available */}
                {currentSlide.stat1Num !== undefined && (
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 md:col-span-2 space-y-3">
                    <span className="text-[11px] font-bold uppercase text-amber-900 block">
                      4 Chỉ Số Ấn Tượng Trên Slide
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <input
                          type="text"
                          placeholder="Chỉ số 1 (e.g. +25%)"
                          value={currentSlide.stat1Num || ''}
                          onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'stat1Num', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-black text-amber-900"
                        />
                        <input
                          type="text"
                          placeholder="Mô tả 1"
                          value={currentSlide.stat1Label || ''}
                          onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'stat1Label', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border border-amber-200 text-[10px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <input
                          type="text"
                          placeholder="Chỉ số 2 (e.g. 0 VNĐ)"
                          value={currentSlide.stat2Num || ''}
                          onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'stat2Num', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-black text-amber-900"
                        />
                        <input
                          type="text"
                          placeholder="Mô tả 2"
                          value={currentSlide.stat2Label || ''}
                          onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'stat2Label', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border border-amber-200 text-[10px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <input
                          type="text"
                          placeholder="Chỉ số 3 (e.g. 100%)"
                          value={currentSlide.stat3Num || ''}
                          onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'stat3Num', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-black text-amber-900"
                        />
                        <input
                          type="text"
                          placeholder="Mô tả 3"
                          value={currentSlide.stat3Label || ''}
                          onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'stat3Label', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border border-amber-200 text-[10px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <input
                          type="text"
                          placeholder="Chỉ số 4 (e.g. 5x LTV)"
                          value={currentSlide.stat4Num || ''}
                          onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'stat4Num', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-black text-amber-900"
                        />
                        <input
                          type="text"
                          placeholder="Mô tả 4"
                          value={currentSlide.stat4Label || ''}
                          onChange={(e) => handleUpdateSlideField(selectedCategory, selectedSlideIndex, 'stat4Label', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border border-amber-200 text-[10px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUICK PREVIEW HINT */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center space-x-3">
        <Info className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="leading-snug">
          Mọi thay đổi thông tin sau khi bấm <strong>Lưu Thay Đổi B2B</strong> sẽ lập tức cập nhật trực tiếp ra Trang Chủ Khách Hàng & Slide Trình Chiếu mà không cần tải lại trang.
        </p>
      </div>

    </div>
  );
};

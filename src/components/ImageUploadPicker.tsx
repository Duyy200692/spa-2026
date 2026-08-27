import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Camera,
  Trash2,
  RefreshCw,
  Sparkles,
  Check,
  Eye,
  X
} from 'lucide-react';
import { fileToOptimizedDataUrl } from '../utils/imageUtils';

interface ImageUploadPickerProps {
  label?: string;
  subLabel?: string;
  value?: string;
  onChange: (dataUrl: string) => void;
  presetOptions?: { label: string; url: string }[];
  className?: string;
  aspectRatio?: 'square' | 'wide' | 'auto';
  maxDimension?: number;
  quality?: number;
}

export const ImageUploadPicker: React.FC<ImageUploadPickerProps> = ({
  label = 'Ảnh đại diện / Hình ảnh',
  subLabel = 'Hỗ trợ tải trực tiếp từ thư viện máy, chụp ảnh hoặc chọn ảnh mẫu',
  value,
  onChange,
  presetOptions,
  className = '',
  aspectRatio = 'square',
  maxDimension = 600,
  quality = 0.85,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chọn file hình ảnh (JPG, PNG, WebP, HEIC...).');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const optimizedDataUrl = await fileToOptimizedDataUrl(file, {
        maxWidth: maxDimension,
        maxHeight: maxDimension,
        quality,
      });
      onChange(optimizedDataUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể tải ảnh. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input value so re-selecting the same file fires onChange
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setErrorMsg(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
            {label}
          </label>
          {subLabel && (
            <span className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
              {subLabel}
            </span>
          )}
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Upload Dropzone & Current Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col sm:flex-row items-center gap-4 ${
          isDragging
            ? 'border-[#5A7D57] bg-[#5A7D57]/10 dark:border-[#8BA888] dark:bg-[#8BA888]/15 ring-2 ring-[#5A7D57]'
            : 'border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] hover:border-[#8BA888] dark:hover:border-[#5A7D57]'
        }`}
      >
        {/* Preview Thumbnail */}
        <div className="relative shrink-0">
          {value ? (
            <div className="relative group/thumb">
              <img
                src={value}
                alt="Selected preview"
                className={`rounded-xl object-cover border border-[#E2E6DF] dark:border-[#2D312C] shadow-xs ${
                  aspectRatio === 'square'
                    ? 'w-20 h-20 sm:w-24 sm:h-24'
                    : aspectRatio === 'wide'
                    ? 'w-32 h-20 sm:w-36 sm:h-24'
                    : 'w-20 h-20 max-w-full'
                }`}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPreviewModal(true);
                }}
                className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition-opacity"
                title="Xem ảnh phóng to"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#E2E6DF]/60 dark:bg-[#2D312C] flex flex-col items-center justify-center text-[#5E665B] dark:text-[#9BA198]">
              <ImageIcon className="w-8 h-8 opacity-60 mb-1" />
              <span className="text-[10px] font-medium">Chưa có ảnh</span>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs rounded-xl flex items-center justify-center text-white">
              <RefreshCw className="w-6 h-6 animate-spin text-[#8BA888]" />
            </div>
          )}
        </div>

        {/* Upload Action Prompt */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1">
            <span className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF] flex items-center space-x-1.5">
              <Upload className="w-3.5 h-3.5 text-[#5A7D57] dark:text-[#8BA888]" />
              <span>{value ? 'Đổi ảnh từ thư viện thiết bị' : 'Tải ảnh trực tiếp từ thiết bị'}</span>
            </span>
          </div>

          <p className="text-[11px] text-[#5E665B] dark:text-[#9BA198] mb-2.5">
            Bấm để chọn file trong máy, kéo thả ảnh vào đây hoặc dùng Camera chụp trực tiếp. Tự động nén tối ưu.
          </p>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#1A1C19] border border-[#E2E6DF] dark:border-[#2D312C] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#F0F3EF] dark:hover:bg-[#2A2F29] shadow-2xs"
            >
              <Upload className="w-3 h-3 text-[#5A7D57] dark:text-[#8BA888]" />
              <span>Chọn từ Thư viện máy</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#1A1C19] border border-[#E2E6DF] dark:border-[#2D312C] text-[#1C211B] dark:text-[#E0E2DF] hover:bg-[#F0F3EF] dark:hover:bg-[#2A2F29] shadow-2xs"
            >
              <Camera className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>Chụp ảnh (Camera)</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="w-3 h-3" />
                <span>Gỡ ảnh</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {errorMsg && (
        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
          ⚠️ {errorMsg}
        </p>
      )}

      {/* Preset Options if provided */}
      {presetOptions && presetOptions.length > 0 && (
        <div className="pt-1">
          <span className="text-[11px] font-semibold text-[#5E665B] dark:text-[#9BA198] block mb-1.5 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#5A7D57] dark:text-[#8BA888]" />
            <span>Hoặc chọn nhanh avatar mẫu:</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {presetOptions.map((opt, idx) => {
              const isSelected = value === opt.url;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => onChange(opt.url)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                    isSelected
                      ? 'border-[#5A7D57] dark:border-[#8BA888] ring-2 ring-[#5A7D57]/30 scale-105'
                      : 'border-transparent hover:border-[#8BA888]/60 opacity-80 hover:opacity-100'
                  }`}
                  title={opt.label}
                >
                  <img
                    src={opt.url}
                    alt={opt.label}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#5A7D57]/40 flex items-center justify-center text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {showPreviewModal && value && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPreviewModal(false)}
        >
          <div className="relative max-w-lg w-full bg-white dark:bg-[#1A1C19] rounded-2xl overflow-hidden p-2 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={value}
              alt="Preview full"
              className="w-full h-auto max-h-[80vh] rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

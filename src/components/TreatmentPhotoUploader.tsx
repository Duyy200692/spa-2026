import React, { useRef, useState } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Trash2,
  Eye,
  Plus,
  RefreshCw,
  X,
  Maximize2
} from 'lucide-react';
import { filesToOptimizedDataUrls } from '../utils/imageUtils';

interface TreatmentPhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  label?: string;
  maxPhotos?: number;
}

export const TreatmentPhotoUploader: React.FC<TreatmentPhotoUploaderProps> = ({
  photos = [],
  onChange,
  label = 'Ảnh Chụp Trước & Sau Liệu Trình (Before / After)',
  maxPhotos = 8,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      const newPhotos = await filesToOptimizedDataUrls(files, {
        maxWidth: 900,
        maxHeight: 900,
        quality: 0.82,
      });
      const combined = [...photos, ...newPhotos].slice(0, maxPhotos);
      onChange(combined);
    } catch (err) {
      console.error('Lỗi tải ảnh:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const updated = photos.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#1C211B] dark:text-[#E0E2DF]">
          {label}
        </label>
        <span className="text-[11px] text-[#5E665B] dark:text-[#9BA198]">
          {photos.length}/{maxPhotos} ảnh
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={e => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={e => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Grid of photos & add buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {photos.map((photoUrl, idx) => (
          <div
            key={idx}
            className="relative group rounded-xl overflow-hidden aspect-square border border-[#E2E6DF] dark:border-[#2D312C] bg-[#F5F7F4] dark:bg-[#222621] shadow-2xs"
          >
            <img
              src={photoUrl}
              alt={`Treatment photo ${idx + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Label index badge */}
            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white font-mono text-[9px] font-bold">
              #{idx + 1}
            </span>

            {/* Hover Actions overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={() => setActivePreviewIndex(idx)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                title="Xem phóng to"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleRemovePhoto(idx)}
                className="p-1.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
                title="Xóa ảnh"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Upload Buttons */}
        {photos.length < maxPhotos && (
          <div className="flex flex-col gap-1.5 aspect-square">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 rounded-xl border-2 border-dashed border-[#E2E6DF] dark:border-[#2D312C] hover:border-[#5A7D57] dark:hover:border-[#8BA888] bg-[#F5F7F4] dark:bg-[#222621] flex flex-col items-center justify-center p-1 text-[#5E665B] dark:text-[#9BA198] hover:text-[#5A7D57] transition-colors text-center"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#5A7D57]" />
              ) : (
                <>
                  <Upload className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] font-semibold">Tải từ máy</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => cameraInputRef.current?.click()}
              className="py-1 px-1.5 rounded-lg border border-[#E2E6DF] dark:border-[#2D312C] bg-white dark:bg-[#1A1C19] hover:bg-[#F0F3EF] dark:hover:bg-[#2A2F29] flex items-center justify-center space-x-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400"
            >
              <Camera className="w-3 h-3" />
              <span>Chụp ảnh</span>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal */}
      {activePreviewIndex !== null && photos[activePreviewIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePreviewIndex(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-[#1A1C19] rounded-2xl overflow-hidden p-2 shadow-2xl space-y-2"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 pt-1 border-b border-[#E2E6DF] dark:border-[#2D312C] pb-2">
              <span className="text-xs font-bold text-[#1C211B] dark:text-[#E0E2DF]">
                Ảnh Liệu Trình #{activePreviewIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => setActivePreviewIndex(null)}
                className="p-1 rounded-lg text-[#9BA198] hover:text-[#1C211B] dark:hover:text-[#E0E2DF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={photos[activePreviewIndex]}
              alt={`Treatment large ${activePreviewIndex + 1}`}
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

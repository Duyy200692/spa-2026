/**
 * Image Utilities for Client-Side Photo Upload & Compression
 * Handles converting local files from Device Gallery / Camera to optimized Base64 Data URLs.
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
}

/**
 * Reads a File object from device, automatically scales it down and compresses it to Base64 string.
 */
export async function fileToOptimizedDataUrl(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File được chọn không phải là định dạng hình ảnh hợp lệ.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio preservation
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw data URL if canvas 2d context fails
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Fill white background in case of transparent png converted to jpeg
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(readerEvent.target?.result as string);
        }
      };

      img.onerror = () => {
        reject(new Error('Không thể giải mã hình ảnh từ máy.'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Không thể đọc file từ thiết bị.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Handles multiple file uploads in batch (e.g. Before / After skin treatment photos).
 */
export async function filesToOptimizedDataUrls(
  files: FileList | File[],
  options: ImageOptimizationOptions = {}
): Promise<string[]> {
  const fileArray = Array.from(files);
  const results: string[] = [];

  for (const file of fileArray) {
    if (file.type.startsWith('image/')) {
      try {
        const dataUrl = await fileToOptimizedDataUrl(file, options);
        results.push(dataUrl);
      } catch (err) {
        console.warn('Error processing image:', err);
      }
    }
  }

  return results;
}

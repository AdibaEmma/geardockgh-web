'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function ImageUploader({ images, onChange, max = 6 }: ImageUploaderProps) {
  const [uploadingCount, setUploadingCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearErrors = useCallback(() => setErrors([]), []);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'geardockgh/products');

    try {
      const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.secure_url as string;
    } catch {
      return null;
    }
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      clearErrors();
      const fileArray = Array.from(files);
      const newErrors: string[] = [];

      // Validate files
      const validFiles: File[] = [];
      for (const file of fileArray) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          newErrors.push(`${file.name}: unsupported format (use PNG, JPG, WebP, or GIF)`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          newErrors.push(`${file.name}: exceeds 5MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
          continue;
        }
        validFiles.push(file);
      }

      const slotsAvailable = max - images.length;
      if (slotsAvailable <= 0) {
        newErrors.push(`Maximum ${max} images reached`);
        setErrors(newErrors);
        return;
      }

      const toUpload = validFiles.slice(0, slotsAvailable);
      if (validFiles.length > slotsAvailable) {
        newErrors.push(`Only ${slotsAvailable} slot(s) available — ${validFiles.length - slotsAvailable} file(s) skipped`);
      }

      if (newErrors.length > 0) setErrors(newErrors);
      if (toUpload.length === 0) return;

      setUploadingCount(toUpload.length);

      const results = await Promise.all(toUpload.map(uploadFile));
      const successUrls = results.filter(Boolean) as string[];
      const failedCount = results.length - successUrls.length;

      if (failedCount > 0) {
        setErrors((prev) => [...prev, `${failedCount} file(s) failed to upload`]);
      }

      if (successUrls.length > 0) {
        onChange([...images, ...successUrls]);
      }

      setUploadingCount(0);
    },
    [images, max, onChange, uploadFile, clearErrors],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const removeImage = useCallback(
    (index: number) => {
      onChange(images.filter((_, i) => i !== index));
    },
    [images, onChange],
  );

  const moveImage = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= images.length) return;
      const updated = [...images];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      onChange(updated);
    },
    [images, onChange],
  );

  // Drag-and-drop reorder handlers
  const handleImageDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Set a transparent drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  }, []);

  const handleImageDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndex !== null && dragIndex !== index) {
      setDropIndex(index);
    }
  }, [dragIndex]);

  const handleImageDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (dragIndex !== null && dragIndex !== index) {
        moveImage(dragIndex, index);
      }
      setDragIndex(null);
      setDropIndex(null);
    },
    [dragIndex, moveImage],
  );

  const handleImageDragEnd = useCallback(() => {
    setDragIndex(null);
    setDropIndex(null);
  }, []);

  const missingConfig = !CLOUD_NAME || !UPLOAD_PRESET;
  const uploading = uploadingCount > 0;

  return (
    <div className="w-full">
      <label
        className="mb-1.5 block text-sm font-medium"
        style={{ color: 'var(--white)' }}
      >
        Images {images.length > 0 && `(${images.length}/${max})`}
      </label>

      {/* Error messages */}
      {errors.length > 0 && (
        <div
          className="mb-3 flex items-start gap-2 rounded-lg border px-3 py-2"
          style={{ borderColor: '#ef4444', background: 'rgba(239,68,68,0.05)' }}
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0" style={{ color: '#ef4444' }} />
          <div className="flex-1">
            {errors.map((err, i) => (
              <p key={i} className="text-xs" style={{ color: '#ef4444' }}>
                {err}
              </p>
            ))}
          </div>
          <button
            type="button"
            onClick={clearErrors}
            className="shrink-0 rounded p-0.5 hover:bg-white/10"
          >
            <X size={12} style={{ color: '#ef4444' }} />
          </button>
        </div>
      )}

      {/* Existing images grid */}
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div
              key={url}
              draggable
              onDragStart={(e) => handleImageDragStart(e, i)}
              onDragOver={(e) => handleImageDragOver(e, i)}
              onDrop={(e) => handleImageDrop(e, i)}
              onDragEnd={handleImageDragEnd}
              className="group relative aspect-square overflow-hidden rounded-lg border transition-all"
              style={{
                borderColor: dropIndex === i ? 'var(--gold)' : dragIndex === i ? 'var(--gold)' : 'var(--border)',
                opacity: dragIndex === i ? 0.5 : 1,
                transform: dropIndex === i ? 'scale(1.02)' : 'scale(1)',
                cursor: 'grab',
              }}
            >
              <img
                src={url}
                alt={`Product image ${i + 1}`}
                className="h-full w-full object-cover pointer-events-none"
              />

              {/* Overlay controls */}
              <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-1.5 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                {/* Reorder arrows */}
                <div className="flex gap-0.5">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(i, i - 1)}
                      className="rounded bg-black/60 p-0.5 text-white hover:bg-black/80"
                      title="Move left"
                    >
                      <ChevronLeft size={12} />
                    </button>
                  )}
                  {i < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(i, i + 1)}
                      className="rounded bg-black/60 p-0.5 text-white hover:bg-black/80"
                      title="Move right"
                    >
                      <ChevronRight size={12} />
                    </button>
                  )}
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="rounded-full bg-red-500/80 p-1 text-white hover:bg-red-500"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>

              {/* First image badge */}
              {i === 0 && (
                <span
                  className="absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: 'var(--gold)', color: 'var(--deep)' }}
                >
                  Main
                </span>
              )}
            </div>
          ))}

          {/* Upload placeholders for remaining slots */}
          {uploading && Array.from({ length: uploadingCount }).map((_, i) => (
            <div
              key={`uploading-${i}`}
              className="flex aspect-square items-center justify-center rounded-lg border"
              style={{ borderColor: 'var(--border)', background: 'var(--deep)' }}
            >
              <Loader2
                size={20}
                className="animate-spin"
                style={{ color: 'var(--gold)' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < max && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !missingConfig && !uploading && fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 transition-colors"
          style={{
            borderColor: dragOver
              ? 'var(--gold)'
              : missingConfig
                ? '#ef4444'
                : 'var(--border)',
            background: dragOver
              ? 'rgba(240,165,0,0.05)'
              : 'transparent',
            opacity: missingConfig ? 0.6 : 1,
            cursor: missingConfig || uploading ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? (
            <>
              <Loader2
                size={24}
                className="animate-spin"
                style={{ color: 'var(--gold)' }}
              />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Uploading {uploadingCount} image{uploadingCount > 1 ? 's' : ''}...
              </p>
            </>
          ) : missingConfig ? (
            <>
              <Upload size={24} style={{ color: '#ef4444' }} />
              <p className="text-center text-xs" style={{ color: '#ef4444' }}>
                Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local
              </p>
            </>
          ) : (
            <>
              <Upload size={24} style={{ color: 'var(--muted)' }} />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Drag & drop images or click to browse
              </p>
              <p
                className="text-[10px]"
                style={{ color: 'var(--border)' }}
              >
                PNG, JPG, WebP up to 5MB &middot; {max - images.length} slot{max - images.length !== 1 ? 's' : ''} remaining
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}

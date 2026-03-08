'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, GripVertical } from 'lucide-react';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function ImageUploader({ images, onChange, max = 6 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'geardockgh/products');

      try {
        const res = await fetch(UPLOAD_URL, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        return data.secure_url as string;
      } catch {
        return null;
      }
    },
    [],
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith('image/'),
      );

      const slotsAvailable = max - images.length;
      if (slotsAvailable <= 0) return;

      const toUpload = fileArray.slice(0, slotsAvailable);
      if (toUpload.length === 0) return;

      setUploading(true);

      const results = await Promise.all(toUpload.map(uploadFile));
      const successUrls = results.filter(Boolean) as string[];

      if (successUrls.length > 0) {
        onChange([...images, ...successUrls]);
      }

      setUploading(false);
    },
    [images, max, onChange, uploadFile],
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

  const missingConfig = !CLOUD_NAME || !UPLOAD_PRESET;

  return (
    <div className="w-full">
      <label
        className="mb-1.5 block text-sm font-medium"
        style={{ color: 'var(--white)' }}
      >
        Images {images.length > 0 && `(${images.length}/${max})`}
      </label>

      {/* Existing images grid */}
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border"
              style={{ borderColor: 'var(--border)' }}
            >
              <img
                src={url}
                alt={`Product image ${i + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Overlay controls */}
              <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-1.5 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                {/* Reorder */}
                <div className="flex flex-col gap-0.5">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(i, i - 1)}
                      className="rounded bg-black/60 p-0.5 text-white hover:bg-black/80"
                      title="Move left"
                    >
                      <GripVertical size={12} />
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
          onClick={() => !missingConfig && fileInputRef.current?.click()}
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
            cursor: missingConfig ? 'not-allowed' : 'pointer',
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
                Uploading...
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
                PNG, JPG, WebP up to 5MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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

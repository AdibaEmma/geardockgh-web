'use client';

import { useState, useRef } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { StarRating } from '@/components/shop/StarRating';
import { Button } from '@/components/ui/Button';
import { useCreateReview } from '@/hooks/use-reviews';
import { useToastStore } from '@/stores/toast-store';

interface ReviewFormProps {
  productId: string;
  onSubmitted: () => void;
}

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ReviewForm({ productId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const addToast = useToastStore((s) => s.addToast);

  const { mutate: submitReview, isPending } = useCreateReview();

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      addToast({ type: 'error', message: 'Image upload is not configured' });
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'geardockgh/reviews');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData },
    );

    if (!res.ok) {
      addToast({ type: 'error', message: 'Failed to upload image' });
      return null;
    }

    const data = await res.json();
    return data.secure_url as string;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      addToast({ type: 'warning', message: `Maximum ${MAX_IMAGES} images allowed` });
      return;
    }

    const validFiles = files.slice(0, remaining).filter((f) => {
      if (f.size > MAX_FILE_SIZE) {
        addToast({ type: 'warning', message: `${f.name} exceeds 5MB limit` });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = validFiles.map((f) => uploadToCloudinary(f));
      const urls = await Promise.all(uploadPromises);
      const successfulUrls = urls.filter((u): u is string => u !== null);
      setImages((prev) => [...prev, ...successfulUrls]);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      addToast({ type: 'warning', message: 'Please select a rating' });
      return;
    }

    submitReview(
      {
        productId,
        rating,
        title: title.trim() || undefined,
        text: text.trim() || undefined,
        imagesJson: images.length > 0 ? JSON.stringify(images) : undefined,
      },
      {
        onSuccess: () => {
          setRating(0);
          setTitle('');
          setText('');
          setImages([]);
          onSubmitted();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--white)' }}>
          Your Rating *
        </label>
        <StarRating rating={rating} size={24} interactive onChange={setRating} />
      </div>

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--white)' }}>
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          maxLength={120}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
        />
      </div>

      {/* Text */}
      <div>
        <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--white)' }}>
          Review
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell others what you think about this product..."
          maxLength={1000}
          rows={4}
          className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--white)' }}
        />
        <p className="mt-1 text-right text-xs" style={{ color: 'var(--muted)' }}>
          {text.length}/1000
        </p>
      </div>

      {/* Images */}
      <div>
        <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--white)' }}>
          Photos ({images.length}/{MAX_IMAGES})
        </label>
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative h-16 w-16 overflow-hidden rounded-lg border"
              style={{ borderColor: 'var(--border)' }}
            >
              <img src={url} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-[var(--gold)]"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
          Max 5MB per image
        </p>
      </div>

      {/* Submit */}
      <Button type="submit" isLoading={isPending} disabled={rating === 0}>
        Submit Review
      </Button>
    </form>
  );
}

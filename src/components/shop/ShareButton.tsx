'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  productName: string;
  productSlug: string;
}

export function ShareButton({ productName, productSlug }: ShareButtonProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/products/${productSlug}`;
    const text = `Check out ${productName} on GearDockGH! ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: productName, text, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to WhatsApp
      }
    }

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
      style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      aria-label={`Share ${productName}`}
    >
      <Share2 size={14} />
      Share
    </button>
  );
}

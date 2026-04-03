'use client';

import { useState } from 'react';
import { Copy, Check, MessageCircle, Share2 } from 'lucide-react';

interface ReferralShareButtonsProps {
  referralCode: string;
  productName?: string;
}

export function ReferralShareButtons({
  referralCode,
  productName,
}: ReferralShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';
  const referralLink = `${siteUrl}?ref=${referralCode}`;

  const whatsappMessage = productName
    ? `I just got ${productName} from GearDockGH! Use my link and get GH₵ 10 off your first order: ${referralLink}`
    : `Check out GearDockGH for premium tech gear in Ghana! Use my link and get GH₵ 10 off your first order: ${referralLink}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GearDockGH — Premium Tech Gear in Ghana',
          text: whatsappMessage,
          url: referralLink,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
        style={{ background: '#25D366' }}
      >
        <MessageCircle size={18} />
        Share on WhatsApp
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
        style={{
          borderColor: 'var(--border)',
          color: copied ? 'var(--teal)' : 'var(--muted)',
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          <Share2 size={16} />
          Share
        </button>
      )}
    </div>
  );
}

'use client';

import { Gift } from 'lucide-react';
import { ReferralShareButtons } from './ReferralShareButtons';

interface ReferralBannerProps {
  orderNumber: string;
  productName?: string;
}

function generateReferralCode(orderNumber: string): string {
  // Simple deterministic code from order number
  const hash = orderNumber.replace(/[^A-Z0-9]/gi, '').slice(-6).toUpperCase();
  return `GD${hash}`;
}

export function ReferralBanner({ orderNumber, productName }: ReferralBannerProps) {
  const referralCode = generateReferralCode(orderNumber);

  return (
    <div
      className="mx-auto mt-8 max-w-lg rounded-xl border p-6"
      style={{ background: 'var(--card)', borderColor: 'var(--gold, #d4a843)33' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: 'var(--gold, #d4a843)1a' }}
        >
          <Gift size={20} style={{ color: 'var(--gold)' }} />
        </div>
        <div>
          <h3
            className="font-[family-name:var(--font-outfit)] text-base font-bold"
            style={{ color: 'var(--white)' }}
          >
            Share & Earn GH₵ 20
          </h3>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Your friend gets GH₵ 10 off, you get GH₵ 20 credit
          </p>
        </div>
      </div>

      <div
        className="mt-4 rounded-lg px-4 py-2.5 text-center font-[family-name:var(--font-space-mono)] text-sm font-bold"
        style={{ background: 'var(--deep)', color: 'var(--gold)' }}
      >
        {referralCode}
      </div>

      <div className="mt-4">
        <ReferralShareButtons
          referralCode={referralCode}
          productName={productName}
        />
      </div>
    </div>
  );
}

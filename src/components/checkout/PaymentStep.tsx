'use client';

import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCheckoutStore } from '@/stores/checkout-store';

const paymentMethods = [
  {
    key: 'PAYSTACK' as const,
    label: 'Debit / Credit Card',
    description: 'Visa, Mastercard & other cards',
    Icon: CreditCard,
  },
  {
    key: 'MOMO' as const,
    label: 'Mobile Money',
    description: 'MTN MoMo, Telecel Cash & AirtelTigo Money',
    Icon: Smartphone,
  },
  {
    key: 'BANK_TRANSFER' as const,
    label: 'Bank Transfer',
    description: 'Pay directly from your bank account',
    Icon: Building2,
  },
];

export function PaymentStep() {
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const setStep = useCheckoutStore((s) => s.setStep);

  return (
    <div className="space-y-4">
      <h3
        className="font-[family-name:var(--font-syne)] text-lg font-bold"
        style={{ color: 'var(--white)' }}
      >
        Payment Method
      </h3>

      <div className="space-y-2">
        {paymentMethods.map(({ key, label, description, Icon }) => (
          <button
            key={key}
            onClick={() => setPaymentMethod(key)}
            className="flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all"
            style={{
              background: paymentMethod === key ? 'var(--card)' : 'transparent',
              borderColor: paymentMethod === key ? 'var(--gold)' : 'var(--border)',
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                background: paymentMethod === key ? 'var(--gold)' : 'var(--card)',
                color: paymentMethod === key ? 'var(--deep)' : 'var(--muted)',
              }}
            >
              <Icon size={20} />
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: 'var(--white)' }}
              >
                {label}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          onClick={() => setStep('address')}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          className="flex-1"
          size="lg"
          onClick={() => setStep('review')}
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
}

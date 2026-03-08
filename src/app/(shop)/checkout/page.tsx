'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useCheckoutStore } from '@/stores/checkout-store';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { AddressStep } from '@/components/checkout/AddressStep';
import { PaymentStep } from '@/components/checkout/PaymentStep';
import { ReviewStep } from '@/components/checkout/ReviewStep';
import { OrderSummary } from '@/components/checkout/OrderSummary';

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const items = useCartStore((s) => s.items);
  const step = useCheckoutStore((s) => s.step);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/login');
    }
  }, [isHydrated, user, router]);

  useEffect(() => {
    if (items.length === 0 && isHydrated) {
      router.push('/products');
    }
  }, [items.length, isHydrated, router]);

  if (!isHydrated || !user || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <span
          className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{ color: 'var(--gold)' }}
        />
      </div>
    );
  }

  return (
    <div className="py-4">
      <h1
        className="mb-6 font-[family-name:var(--font-syne)] text-2xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        Checkout
      </h1>

      <div className="mb-8">
        <CheckoutStepper currentStep={step} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 'address' && <AddressStep />}
          {step === 'payment' && <PaymentStep />}
          {step === 'review' && <ReviewStep />}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

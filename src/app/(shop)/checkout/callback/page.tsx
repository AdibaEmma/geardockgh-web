'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVerifyPayment } from '@/hooks/use-payments';
import { useToastStore } from '@/stores/toast-store';
import { useCartStore } from '@/stores/cart-store';
import { useCheckoutStore } from '@/stores/checkout-store';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2
            size={48}
            className="mb-4 animate-spin"
            style={{ color: 'var(--gold)' }}
          />
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Loading...
          </p>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);

  const clearCart = useCartStore((s) => s.clearCart);
  const resetCheckout = useCheckoutStore((s) => s.reset);

  const reference = searchParams.get('reference') ?? searchParams.get('trxref');
  const { data, isLoading, isError } = useVerifyPayment(reference);

  const payment = data?.data as { status?: string; orderId?: string } | undefined;
  const isSuccess = payment?.status === 'SUCCESS';

  useEffect(() => {
    if (isSuccess && payment?.orderId) {
      clearCart();
      resetCheckout();
      addToast({ type: 'success', message: 'Payment successful!' });
      const timer = setTimeout(() => {
        router.push(`/orders/${payment.orderId}/confirmation`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, payment?.orderId, router, addToast, clearCart, resetCheckout]);

  if (!reference) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <XCircle size={48} className="mb-4" style={{ color: '#ef4444' }} />
        <h2
          className="font-[family-name:var(--font-outfit)] text-xl font-bold"
          style={{ color: 'var(--white)' }}
        >
          Invalid Payment Reference
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
          No payment reference found.
        </p>
        <Button className="mt-6" onClick={() => router.push('/products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2
          size={48}
          className="mb-4 animate-spin"
          style={{ color: 'var(--gold)' }}
        />
        <h2
          className="font-[family-name:var(--font-outfit)] text-xl font-bold"
          style={{ color: 'var(--white)' }}
        >
          Verifying Payment...
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
          Please wait while we confirm your payment.
        </p>
      </div>
    );
  }

  if (isError || !isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <XCircle size={48} className="mb-4" style={{ color: '#ef4444' }} />
        <h2
          className="font-[family-name:var(--font-outfit)] text-xl font-bold"
          style={{ color: 'var(--white)' }}
        >
          Payment Failed
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
          Your payment could not be verified. Please try again.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => router.push('/orders')}>
            View Orders
          </Button>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <CheckCircle size={48} className="mb-4" style={{ color: 'var(--teal)' }} />
      <h2
        className="font-[family-name:var(--font-outfit)] text-xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        Payment Successful!
      </h2>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        Redirecting to your order...
      </p>
    </div>
  );
}

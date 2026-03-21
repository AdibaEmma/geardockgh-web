'use client';

import { MapPin, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCheckoutStore } from '@/stores/checkout-store';
import { useCartStore } from '@/stores/cart-store';
import { useAddresses } from '@/hooks/use-addresses';
import { useCreateOrder } from '@/hooks/use-orders';
import { useInitializePayment } from '@/hooks/use-payments';
import { useToastStore } from '@/stores/toast-store';
import { formatPesewas } from '@/lib/utils/formatters';
import type { Address, Order } from '@/types';

const paymentIcons = {
  PAYSTACK: CreditCard,
  MOMO: Smartphone,
  BANK_TRANSFER: Building2,
};

const paymentLabels = {
  PAYSTACK: 'Debit / Credit Card',
  MOMO: 'Mobile Money',
  BANK_TRANSFER: 'Bank Transfer',
};

export function ReviewStep() {
  const selectedAddressId = useCheckoutStore((s) => s.selectedAddressId);
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const notes = useCheckoutStore((s) => s.notes);
  const setNotes = useCheckoutStore((s) => s.setNotes);
  const setStep = useCheckoutStore((s) => s.setStep);

  const items = useCartStore((s) => s.items);
  const totalPesewas = useCartStore((s) => s.totalPesewas);

  const { data: addressesResponse } = useAddresses();
  const { mutateAsync: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutateAsync: initPayment, isPending: isInitializing } = useInitializePayment();
  const addToast = useToastStore((s) => s.addToast);

  const addresses = (addressesResponse?.data ?? []) as Address[];
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const PaymentIcon = paymentIcons[paymentMethod];
  const isProcessing = isCreating || isInitializing;

  const handlePlaceOrder = async () => {
    try {
      const orderResponse = await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? undefined,
          quantity: item.quantity,
        })),
        shippingAddressId: selectedAddressId ?? undefined,
        notes: notes || undefined,
      });

      const order = orderResponse.data as Order;

      const callbackUrl = `${window.location.origin}/checkout/callback`;
      const paymentResponse = await initPayment({
        orderId: order.id,
        provider: paymentMethod,
        callbackUrl,
      });

      const paymentData = (paymentResponse as any)?.data ?? paymentResponse;

      if (paymentData.authorizationUrl) {
        window.location.href = paymentData.authorizationUrl;
        return;
      }

      addToast({ type: 'error', message: 'Payment initialization failed. Please try again.' });
    } catch (error) {
      console.error('[Checkout] Order/Payment error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3
        className="font-[family-name:var(--font-syne)] text-lg font-bold"
        style={{ color: 'var(--white)' }}
      >
        Review Order
      </h3>

      {/* Address */}
      <div
        className="rounded-lg border p-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} style={{ color: 'var(--gold)' }} />
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--white)' }}
            >
              Delivery Address
            </span>
          </div>
          <button
            onClick={() => setStep('address')}
            className="text-xs font-medium"
            style={{ color: 'var(--gold)' }}
          >
            Change
          </button>
        </div>
        {selectedAddress && (
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            {selectedAddress.street}, {selectedAddress.city},{' '}
            {selectedAddress.region}
          </p>
        )}
      </div>

      {/* Payment Method */}
      <div
        className="rounded-lg border p-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PaymentIcon size={16} style={{ color: 'var(--gold)' }} />
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--white)' }}
            >
              {paymentLabels[paymentMethod]}
            </span>
          </div>
          <button
            onClick={() => setStep('payment')}
            className="text-xs font-medium"
            style={{ color: 'var(--gold)' }}
          >
            Change
          </button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label
          className="mb-1.5 block text-sm font-medium"
          style={{ color: 'var(--white)' }}
        >
          Order Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special instructions..."
          rows={2}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] placeholder:text-[var(--muted)]"
          style={{
            background: 'var(--deep)',
            color: 'var(--white)',
            borderColor: 'var(--border)',
          }}
        />
      </div>

      {/* Total */}
      <div
        className="flex items-center justify-between rounded-lg border p-4"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <span className="text-sm font-medium" style={{ color: 'var(--white)' }}>
          Total
        </span>
        <span
          className="font-[family-name:var(--font-syne)] text-xl font-bold"
          style={{ color: 'var(--gold)' }}
        >
          {formatPesewas(totalPesewas())}
        </span>
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => setStep('payment')}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          className="flex-1"
          size="lg"
          onClick={handlePlaceOrder}
          isLoading={isProcessing}
        >
          Pay Now
        </Button>
      </div>
    </div>
  );
}

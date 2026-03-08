'use client';

import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AddressForm, type AddressFormData } from './AddressForm';
import { useAddresses, useCreateAddress } from '@/hooks/use-addresses';
import { useCheckoutStore } from '@/stores/checkout-store';
import type { Address } from '@/types';

export function AddressStep() {
  const [showForm, setShowForm] = useState(false);
  const { data: addressesResponse, isLoading } = useAddresses();
  const { mutate: createAddr, isPending: isCreating } = useCreateAddress();
  const selectedId = useCheckoutStore((s) => s.selectedAddressId);
  const setSelectedId = useCheckoutStore((s) => s.setSelectedAddressId);
  const setStep = useCheckoutStore((s) => s.setStep);

  const addresses = (addressesResponse?.data ?? []) as Address[];

  const handleCreateAddress = (data: AddressFormData) => {
    createAddr(
      { ...data, isDefault: addresses.length === 0 },
      {
        onSuccess: (response) => {
          const newAddr = response.data as Address;
          setSelectedId(newAddr.id);
          setShowForm(false);
        },
      },
    );
  };

  const handleContinue = () => {
    if (selectedId) {
      setStep('payment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span
          className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{ color: 'var(--gold)' }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3
        className="font-[family-name:var(--font-syne)] text-lg font-bold"
        style={{ color: 'var(--white)' }}
      >
        Shipping Address
      </h3>

      {addresses.length > 0 && (
        <div className="space-y-2">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => setSelectedId(addr.id)}
              className="flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all"
              style={{
                background: selectedId === addr.id ? 'var(--card)' : 'transparent',
                borderColor: selectedId === addr.id ? 'var(--gold)' : 'var(--border)',
              }}
            >
              <MapPin
                size={18}
                className="mt-0.5 flex-shrink-0"
                style={{
                  color: selectedId === addr.id ? 'var(--gold)' : 'var(--muted)',
                }}
              />
              <div>
                {addr.label && (
                  <span
                    className="text-xs font-semibold uppercase"
                    style={{ color: 'var(--gold)' }}
                  >
                    {addr.label}
                  </span>
                )}
                <p
                  className="text-sm"
                  style={{ color: 'var(--white)' }}
                >
                  {addr.street}
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--muted)' }}
                >
                  {addr.city}, {addr.region}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showForm ? (
        <div
          className="rounded-lg border p-4"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
        >
          <AddressForm
            onSubmit={handleCreateAddress}
            onCancel={() => setShowForm(false)}
            isPending={isCreating}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-3 text-sm font-medium transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          <Plus size={16} />
          Add new address
        </button>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleContinue}
        disabled={!selectedId}
      >
        Continue to Payment
      </Button>
    </div>
  );
}

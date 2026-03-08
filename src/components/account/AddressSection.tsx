'use client';

import { useState } from 'react';
import { MapPin, Plus, Trash2, Pencil } from 'lucide-react';
import { useAddresses, useCreateAddress, useDeleteAddress } from '@/hooks/use-addresses';
import { AddressForm, type AddressFormData } from '@/components/checkout/AddressForm';
import { Button } from '@/components/ui/Button';
import type { Address } from '@/types';

export function AddressSection() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useAddresses();
  const { mutate: createAddr, isPending: isCreating } = useCreateAddress();
  const { mutate: deleteAddr } = useDeleteAddress();

  const addresses = (data?.data ?? []) as Address[];

  const handleCreate = (formData: AddressFormData) => {
    createAddr(
      { ...formData, isDefault: addresses.length === 0 },
      { onSuccess: () => setShowForm(false) },
    );
  };

  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={18} style={{ color: 'var(--gold)' }} />
          <h3
            className="font-[family-name:var(--font-syne)] text-lg font-bold"
            style={{ color: 'var(--white)' }}
          >
            Addresses
          </h3>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-[var(--gold)]"
            style={{ color: 'var(--muted)' }}
          >
            <Plus size={12} />
            Add
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <span
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{ color: 'var(--gold)' }}
          />
        </div>
      ) : (
        <>
          {showForm && (
            <div
              className="mb-4 rounded-lg border p-4"
              style={{ borderColor: 'var(--border)' }}
            >
              <AddressForm
                onSubmit={handleCreate}
                onCancel={() => setShowForm(false)}
                isPending={isCreating}
              />
            </div>
          )}

          {addresses.length === 0 && !showForm ? (
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              No saved addresses
            </p>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between rounded-lg border p-3"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {addr.label && (
                        <span
                          className="text-xs font-semibold uppercase"
                          style={{ color: 'var(--gold)' }}
                        >
                          {addr.label}
                        </span>
                      )}
                      {addr.isDefault && (
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: 'rgba(0,201,167,0.1)',
                            color: 'var(--teal)',
                          }}
                        >
                          Default
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--white)' }}
                    >
                      {addr.street}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {addr.city}, {addr.region}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteAddr(addr.id)}
                    className="rounded p-1 text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

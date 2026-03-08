'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Eastern',
  'Central',
  'Northern',
  'Volta',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo',
  'Savannah',
  'North East',
  'Oti',
  'Western North',
] as const;

const addressSchema = z.object({
  label: z.string().optional(),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  region: z.string().min(1, 'Region is required'),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  onCancel?: () => void;
  isPending?: boolean;
  defaultValues?: Partial<AddressFormData>;
}

export function AddressForm({
  onSubmit,
  onCancel,
  isPending,
  defaultValues,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Input
        label="Label (optional)"
        placeholder="e.g. Home, Office"
        error={errors.label?.message}
        {...register('label')}
      />
      <Input
        label="Street Address"
        placeholder="12 Oxford Street"
        error={errors.street?.message}
        {...register('street')}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="City"
          placeholder="Accra"
          error={errors.city?.message}
          {...register('city')}
        />
        <div className="w-full">
          <label
            className="mb-1.5 block text-sm font-medium"
            style={{ color: 'var(--white)' }}
          >
            Region
          </label>
          <select
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
            style={{
              background: 'var(--deep)',
              color: 'var(--white)',
              borderColor: errors.region ? '#ef4444' : 'var(--border)',
            }}
            {...register('region')}
          >
            <option value="">Select region</option>
            {GHANA_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="mt-1 text-xs text-red-400">{errors.region.message}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" isLoading={isPending} className="flex-1">
          Save Address
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

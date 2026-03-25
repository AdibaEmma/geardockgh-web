'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useProfile, useUpdateProfile } from '@/hooks/use-profile';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileSection() {
  const [editing, setEditing] = useState(false);
  const { data } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const profile = data?.data as (ProfileFormData & { email: string; createdAt?: string }) | undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? { firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone ?? '' }
      : undefined,
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => setEditing(false),
    });
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-8">
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{ color: 'var(--gold)' }}
        />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User size={18} style={{ color: 'var(--gold)' }} />
          <h3
            className="font-[family-name:var(--font-outfit)] text-lg font-bold"
            style={{ color: 'var(--white)' }}
          >
            Profile
          </h3>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-[var(--gold)]"
            style={{ color: 'var(--muted)' }}
          >
            <Pencil size={12} />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
          <Input label="Phone" placeholder="+233..." {...register('phone')} />
          <div className="flex gap-2 pt-2">
            <Button type="submit" isLoading={isPending} className="flex-1">
              Save
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditing(false);
                reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                First Name
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                {profile.firstName}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Last Name
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                {profile.lastName}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Email
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
              {profile.email}
            </p>
          </div>
          {profile.phone && (
            <div>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Phone
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                {profile.phone}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

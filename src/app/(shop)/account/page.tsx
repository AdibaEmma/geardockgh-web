'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { ProfileSection } from '@/components/account/ProfileSection';
import { AddressSection } from '@/components/account/AddressSection';
import { Button } from '@/components/ui/Button';

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/login');
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) return null;

  return (
    <div className="py-4">
      <h1
        className="mb-6 font-[family-name:var(--font-syne)] text-2xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        My Account
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileSection />
        <AddressSection />
      </div>

      <div
        className="mt-6 rounded-xl border p-6"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={18} style={{ color: 'var(--gold)' }} />
            <h3
              className="font-[family-name:var(--font-syne)] text-lg font-bold"
              style={{ color: 'var(--white)' }}
            >
              Orders
            </h3>
          </div>
          <Link href="/orders">
            <Button variant="secondary" size="sm">
              View All Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

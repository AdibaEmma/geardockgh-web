import type { ReactNode } from 'react';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { WhatsAppButton } from '@/components/shop/WhatsAppButton';
import { MobileBottomNav } from '@/components/ui/MobileBottomNav';

interface ShopLayoutProps {
  children: ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="min-h-screen">
      <ShopHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <WhatsAppButton />
      <MobileBottomNav />
    </div>
  );
}

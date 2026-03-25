'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/orders': 'Orders',
  '/admin/products': 'Products',
  '/admin/customers': 'Customers',
  '/admin/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];

  // Handle dynamic routes like /admin/orders/[id]
  if (pathname.startsWith('/admin/orders/')) return 'Order Details';
  if (pathname.startsWith('/admin/products/')) return 'Product Details';

  return 'Admin';
}

export function AdminTopbar() {
  const pathname = usePathname();
  const setMobileOpen = useUIStore((s) => s.setSidebarOpen);
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  const title = getPageTitle(pathname);

  return (
    <header
      className="sticky top-0 z-20 border-b"
      style={{ background: 'var(--black)', borderColor: 'var(--border)' }}
    >
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-1.5 transition-colors hover:bg-[var(--hover-bg)] lg:hidden"
          style={{ color: 'var(--muted)' }}
        >
          <Menu size={20} />
        </button>

        {/* Page title */}
        <h2
          className="font-[family-name:var(--font-outfit)] text-base font-semibold"
          style={{ color: 'var(--white)' }}
        >
          {title}
        </h2>

        <div className="flex-1" />
        <ThemeToggle />
      </div>
    </header>
  );
}

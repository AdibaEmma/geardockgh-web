'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  const isLoginPage = pathname === '/admin/login';
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (isHydrated && !isAdmin && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isHydrated, isAdmin, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isHydrated || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span
          className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{ color: 'var(--gold)' }}
        />
      </div>
    );
  }

  const sidebarWidth = collapsed ? 72 : 256;

  return (
    <div className="min-h-screen" style={{ background: 'var(--black)' }}>
      <AdminSidebar />

      <div
        className="flex min-h-screen flex-col transition-[margin] duration-200 ease-in-out"
        style={{ marginLeft: 0 }}
      >
        <style>{`
          @media (min-width: 1024px) {
            #admin-content {
              margin-left: ${sidebarWidth}px;
              transition: margin-left 200ms ease;
            }
          }
        `}</style>
        <div id="admin-content" className="flex min-h-screen flex-col">
          <AdminTopbar />
          <main className="flex-1 px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

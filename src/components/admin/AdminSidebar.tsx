'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/hooks/use-auth';

const mainNav = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', Icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', Icon: Package },
  { href: '/admin/customers', label: 'Customers', Icon: Users },
];

const bottomNav = [
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const mobileOpen = useUIStore((s) => s.sidebarOpen);
  const setCollapsed = useUIStore((s) => s.setSidebarCollapsed);
  const setMobileOpen = useUIStore((s) => s.setSidebarOpen);
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const navLink = (
    href: string,
    label: string,
    Icon: typeof LayoutDashboard,
  ) => {
    const active = isActive(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMobileOpen(false)}
        title={collapsed ? label : undefined}
        className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
        style={{
          background: active ? 'rgba(240,165,0,0.1)' : 'transparent',
          color: active ? 'var(--gold)' : 'var(--muted)',
        }}
      >
        {active && (
          <span
            className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
            style={{ background: 'var(--gold)' }}
          />
        )}
        <Icon size={20} className="shrink-0" />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo + Collapse toggle */}
      <div
        className="flex h-16 shrink-0 items-center justify-between border-b px-4"
        style={{ borderColor: 'var(--border)' }}
      >
        {collapsed ? (
          <>
            <span
              className="font-[family-name:var(--font-outfit)] text-xl font-bold"
              style={{ color: 'var(--teal)' }}
            >
              G
            </span>
            <button
              onClick={() => setCollapsed(false)}
              className="hidden rounded-md p-1 transition-colors hover:bg-[var(--hover-bg)] lg:block"
              style={{ color: 'var(--muted)' }}
              title="Expand sidebar"
            >
              <ChevronRight size={16} />
            </button>
          </>
        ) : (
          <>
            <span
              className="font-[family-name:var(--font-outfit)] text-lg font-bold"
              style={{ color: 'var(--teal)' }}
            >
              GearDock<span style={{ color: 'var(--gold)' }}>GH</span>
            </span>
            <div className="flex items-center gap-1">
              {/* Desktop collapse */}
              <button
                onClick={() => setCollapsed(true)}
                className="hidden rounded-md p-1 transition-colors hover:bg-[var(--hover-bg)] lg:block"
                style={{ color: 'var(--muted)' }}
                title="Collapse sidebar"
              >
                <ChevronLeft size={16} />
              </button>
              {/* Mobile close */}
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1 lg:hidden"
                style={{ color: 'var(--muted)' }}
              >
                <X size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Back to store */}
      <div className="px-3 pt-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors hover:bg-[var(--hover-bg)]"
          style={{ color: 'var(--muted)' }}
          title={collapsed ? 'Back to Store' : undefined}
        >
          <ArrowLeft size={14} className="shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 px-3 pt-4">
        {!collapsed && (
          <p
            className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--muted)' }}
          >
            Main
          </p>
        )}
        {mainNav.map(({ href, label, Icon }) => navLink(href, label, Icon))}
      </nav>

      {/* Bottom section */}
      <div className="space-y-1 px-3 pb-2">
        {!collapsed && (
          <p
            className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--muted)' }}
          >
            System
          </p>
        )}
        {bottomNav.map(({ href, label, Icon }) => navLink(href, label, Icon))}
      </div>

      {/* User + Collapse toggle */}
      <div
        className="shrink-0 border-t px-3 py-3"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* User info */}
        {user && (
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: 'rgba(240,165,0,0.15)', color: 'var(--gold)' }}
            >
              {user.firstName?.[0]?.toUpperCase() ?? 'A'}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" style={{ color: 'var(--white)' }}>
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs" style={{ color: 'var(--muted)' }}>
                  Admin
                </p>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => logout()}
          title={collapsed ? 'Logout' : undefined}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--hover-bg)]"
          style={{ color: 'var(--muted)' }}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden"
        style={{
          background: 'var(--deep)',
          borderRight: '1px solid var(--border)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:flex-col"
        style={{
          width: collapsed ? 72 : 256,
          background: 'var(--deep)',
          borderRight: '1px solid var(--border)',
          transition: 'width 200ms ease',
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

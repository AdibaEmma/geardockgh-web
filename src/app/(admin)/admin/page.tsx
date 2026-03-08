'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart,
  Clock,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { getAdminStats, type DashboardStats } from '@/lib/api/admin';
import { formatPesewas } from '@/lib/utils/formatters';
import { StatCard } from '@/components/admin/StatCard';
import { OrderStatusChart } from '@/components/admin/OrderStatusChart';
import { RecentOrdersTable } from '@/components/admin/RecentOrdersTable';
import { RecentCustomers } from '@/components/admin/RecentCustomers';
import { TopProducts } from '@/components/admin/TopProducts';
import { QuickActions } from '@/components/admin/QuickActions';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => getAdminStats(),
  });

  const stats = data?.data as DashboardStats | undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span
          className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{ color: 'var(--gold)' }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        Overview of your store performance
      </p>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={stats ? formatPesewas(stats.totalRevenuePesewas) : '--'}
          Icon={DollarSign}
          color="var(--gold)"
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders?.toString() ?? '--'}
          subValue={stats ? `${stats.pendingOrders} pending` : undefined}
          Icon={ShoppingCart}
          color="var(--teal)"
        />
        <StatCard
          label="Products"
          value={stats?.totalProducts?.toString() ?? '--'}
          subValue={
            stats && stats.lowStockProducts > 0
              ? `${stats.lowStockProducts} low stock`
              : undefined
          }
          Icon={Package}
          color="#3b82f6"
        />
        <StatCard
          label="Customers"
          value={stats?.totalCustomers?.toString() ?? '--'}
          Icon={Users}
          color="#8b5cf6"
        />
      </div>

      {/* Low stock alert */}
      {stats && stats.lowStockProducts > 0 && (
        <div
          className="flex items-center gap-3 rounded-xl border px-5 py-3"
          style={{
            background: 'rgba(239,68,68,0.08)',
            borderColor: 'rgba(239,68,68,0.2)',
          }}
        >
          <AlertTriangle size={18} style={{ color: '#ef4444' }} />
          <p className="text-sm" style={{ color: '#fca5a5' }}>
            <span className="font-semibold">{stats.lowStockProducts}</span>{' '}
            {stats.lowStockProducts === 1 ? 'product has' : 'products have'} low
            stock (5 or fewer units)
          </p>
        </div>
      )}

      {/* Middle section: Recent Orders table + sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={stats?.recentOrders ?? []} />
        </div>
        <div className="space-y-6">
          <OrderStatusChart
            ordersByStatus={
              stats?.ordersByStatus ?? {
                pending: 0,
                confirmed: 0,
                processing: 0,
                shipped: 0,
                delivered: 0,
                cancelled: 0,
              }
            }
            total={stats?.totalOrders ?? 0}
          />
          <QuickActions />
        </div>
      </div>

      {/* Bottom section: Top Products + Recent Customers */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopProducts products={stats?.topProducts ?? []} />
        <RecentCustomers customers={stats?.recentCustomers ?? []} />
      </div>
    </div>
  );
}

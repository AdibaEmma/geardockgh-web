'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, User, ShoppingCart, Mail, Phone } from 'lucide-react';
import { getAdminCustomers, type AdminCustomer } from '@/lib/api/admin';
import { formatDate } from '@/lib/utils/formatters';

function CustomerRow({ customer }: { customer: AdminCustomer }) {
  return (
    <tr
      className="transition-colors hover:bg-white/[0.02]"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* Name + Avatar */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}
          >
            {customer.firstName[0]?.toUpperCase()}
            {customer.lastName[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium" style={{ color: 'var(--white)' }}>
              {customer.firstName} {customer.lastName}
            </p>
            {customer.role === 'ADMIN' && (
              <span
                className="inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                style={{ background: 'rgba(240,165,0,0.15)', color: 'var(--gold)' }}
              >
                Admin
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
          <Mail size={14} className="shrink-0" />
          <span className="truncate">{customer.email}</span>
        </div>
      </td>

      {/* Phone */}
      <td className="hidden px-5 py-4 md:table-cell">
        {customer.phone ? (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
            <Phone size={14} className="shrink-0" />
            <span>{customer.phone}</span>
          </div>
        ) : (
          <span className="text-xs" style={{ color: 'var(--border)' }}>—</span>
        )}
      </td>

      {/* Orders */}
      <td className="px-5 py-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-sm" style={{ color: 'var(--white)' }}>
          <ShoppingCart size={14} style={{ color: 'var(--muted)' }} />
          <span className="font-medium">{customer.ordersCount}</span>
        </div>
      </td>

      {/* Status */}
      <td className="hidden px-5 py-4 text-center lg:table-cell">
        <span
          className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            background: customer.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            color: customer.isActive ? '#22c55e' : '#ef4444',
          }}
        >
          {customer.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>

      {/* Joined */}
      <td className="hidden px-5 py-4 text-right lg:table-cell">
        <span className="text-sm" style={{ color: 'var(--muted)' }}>
          {formatDate(customer.createdAt)}
        </span>
      </td>
    </tr>
  );
}

export default function AdminCustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', page, search, roleFilter],
    queryFn: () =>
      getAdminCustomers({
        page,
        limit: 20,
        search: search || undefined,
        role: roleFilter || undefined,
      }),
  });

  const result = data?.data as { data: AdminCustomer[]; meta: { total: number; page: number; totalPages: number } } | undefined;
  const customers = result?.data ?? [];
  const meta = result?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div
          className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <Search size={16} style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search customers by name or email..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
            style={{ color: 'var(--white)' }}
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{ background: 'var(--gold)', color: 'var(--black)' }}
        >
          Search
        </button>
      </form>

      {/* Role filter pills */}
      <div className="flex gap-2">
        {([
          { label: 'All', value: '' },
          { label: 'Customers', value: 'CUSTOMER' },
          { label: 'Admins', value: 'ADMIN' },
        ] as const).map((rf) => (
          <button
            key={rf.value}
            onClick={() => {
              setRoleFilter(rf.value);
              setPage(1);
            }}
            className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              background: roleFilter === rf.value ? 'var(--gold)' : 'transparent',
              color: roleFilter === rf.value ? 'var(--deep)' : 'var(--muted)',
              borderColor: roleFilter === rf.value ? 'var(--gold)' : 'var(--border)',
            }}
          >
            {rf.label}
          </button>
        ))}
      </div>

      {/* Total count */}
      {meta && (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {meta.total} {meta.total === 1 ? 'customer' : 'customers'} total
        </p>
      )}

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <span
              className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
              style={{ color: 'var(--gold)' }}
            />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <User size={40} style={{ color: 'var(--border)' }} />
            <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
              {search ? 'No customers match your search' : 'No customers yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                    Customer
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                    Email
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-medium uppercase tracking-wide md:table-cell" style={{ color: 'var(--muted)' }}>
                    Phone
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                    Orders
                  </th>
                  <th className="hidden px-5 py-3 text-center text-xs font-medium uppercase tracking-wide lg:table-cell" style={{ color: 'var(--muted)' }}>
                    Status
                  </th>
                  <th className="hidden px-5 py-3 text-right text-xs font-medium uppercase tracking-wide lg:table-cell" style={{ color: 'var(--muted)' }}>
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--white)' }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= meta.totalPages}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--white)' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

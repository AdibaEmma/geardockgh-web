'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Target,
  Search,
  Users,
  TrendingUp,
  ArrowRight,
  Clock,
  Download,
  Filter,
} from 'lucide-react';
import { SortableHeader, type SortState } from '@/components/admin/SortableHeader';
import {
  getAdminLeads,
  getAdminLeadStats,
  backfillLeads,
  type Lead,
  type LeadStats,
} from '@/lib/api/admin';
import { formatDate } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/stores/toast-store';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  NEW: { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa' },
  ENGAGED: { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24' },
  QUALIFIED: { bg: 'rgba(168,85,247,0.12)', text: '#c084fc' },
  CONVERTED: { bg: 'rgba(34,197,94,0.12)', text: '#4ade80' },
  INACTIVE: { bg: 'rgba(107,114,128,0.12)', text: '#9ca3af' },
};

const SOURCE_LABELS: Record<string, string> = {
  NEWSLETTER: 'Newsletter',
  REGISTRATION: 'Registration',
  WHATSAPP_INQUIRY: 'WhatsApp',
  STOCK_NOTIFICATION: 'Stock Alert',
  CART_ACTIVITY: 'Cart',
  WISHLIST: 'Wishlist',
  DIRECT_VISIT: 'Direct',
  REFERRAL: 'Referral',
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: typeof Target;
  color: string;
}) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-bold" style={{ color }}>{value}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

function PipelineBar({ pipeline, total }: { pipeline: LeadStats['pipeline']; total: number }) {
  if (total === 0) return null;

  const stages = [
    { key: 'NEW' as const, label: 'New', count: pipeline.NEW },
    { key: 'ENGAGED' as const, label: 'Engaged', count: pipeline.ENGAGED },
    { key: 'QUALIFIED' as const, label: 'Qualified', count: pipeline.QUALIFIED },
    { key: 'CONVERTED' as const, label: 'Converted', count: pipeline.CONVERTED },
  ];

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--white)' }}>
        Lead Pipeline
      </h3>
      <div className="flex h-6 overflow-hidden rounded-full" style={{ background: 'var(--deep)' }}>
        {stages.map((stage) => {
          const pct = (stage.count / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={stage.key}
              className="relative flex items-center justify-center text-[10px] font-bold transition-all"
              style={{
                width: `${pct}%`,
                background: STATUS_COLORS[stage.key].text,
                color: '#000',
                minWidth: pct > 0 ? '24px' : 0,
              }}
              title={`${stage.label}: ${stage.count} (${pct.toFixed(0)}%)`}
            >
              {pct >= 8 && stage.count}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-4">
        {stages.map((stage) => (
          <div key={stage.key} className="flex items-center gap-1.5 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: STATUS_COLORS[stage.key].text }}
            />
            <span style={{ color: 'var(--muted)' }}>{stage.label}:</span>
            <span className="font-medium" style={{ color: 'var(--white)' }}>{stage.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourceBreakdown({ breakdown }: { breakdown: Record<string, number> }) {
  const entries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, c]) => s + c, 0);
  if (total === 0) return null;

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--white)' }}>
        Lead Sources
      </h3>
      <div className="space-y-3">
        {entries.map(([source, count]) => {
          const pct = (count / total) * 100;
          return (
            <div key={source}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span style={{ color: 'var(--white)' }}>
                  {SOURCE_LABELS[source] ?? source}
                </span>
                <span style={{ color: 'var(--muted)' }}>
                  {count} ({pct.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--deep)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'var(--gold)' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const statusStyle = STATUS_COLORS[lead.status] ?? STATUS_COLORS.INACTIVE;

  return (
    <tr
      className="transition-colors hover:bg-white/[0.02]"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <td className="px-5 py-4">
        <Link
          href={`/admin/leads/${lead.id}`}
          className="text-sm font-medium hover:underline"
          style={{ color: 'var(--gold)' }}
        >
          {lead.email}
        </Link>
      </td>
      <td className="px-5 py-4">
        <span
          className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase"
          style={{ background: statusStyle.bg, color: statusStyle.text }}
        >
          {lead.status}
        </span>
      </td>
      <td className="px-5 py-4 text-sm font-medium" style={{ color: 'var(--gold)' }}>
        {lead.score}
      </td>
      <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
        {SOURCE_LABELS[lead.source] ?? lead.source}
      </td>
      <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
        {formatDate(lead.lastActivityAt)}
      </td>
      <td className="px-5 py-4">
        <Link
          href={`/admin/leads/${lead.id}`}
          className="rounded-lg p-1.5 transition-colors hover:bg-white/5"
          style={{ color: 'var(--muted)' }}
        >
          <ArrowRight size={14} />
        </Link>
      </td>
    </tr>
  );
}

export default function AdminLeadsPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState<SortState>({ field: 'lastActivityAt', order: 'desc' });

  const { data: statsData } = useQuery({
    queryKey: ['admin-lead-stats'],
    queryFn: getAdminLeadStats,
  });
  const stats = statsData?.data as LeadStats | undefined;

  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['admin-leads', page, search, statusFilter, sort],
    queryFn: () =>
      getAdminLeads({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter || undefined,
        sortBy: sort.field,
        sortOrder: sort.order,
      }),
  });

  const leads = (leadsData?.data ?? []) as Lead[];
  const meta = (leadsData as any)?.meta as { page: number; totalPages: number; total: number } | undefined;

  const { mutate: doBackfill, isPending: isBackfilling } = useMutation({
    mutationFn: backfillLeads,
    onSuccess: (res) => {
      const result = res.data as any;
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-lead-stats'] });
      addToast({ type: 'success', message: `Backfill complete: ${result.created} created, ${result.updated} updated` });
    },
    onError: () => addToast({ type: 'error', message: 'Backfill failed' }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-[family-name:var(--font-outfit)] text-2xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            Leads
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Track and manage your lead pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/leads/scoring">
            <Button variant="secondary" size="sm">
              Scoring Rules
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => doBackfill()}
            disabled={isBackfilling}
          >
            <Download size={14} className="mr-1.5" />
            {isBackfilling ? 'Backfilling...' : 'Backfill'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Leads"
            value={stats.totalLeads}
            icon={Users}
            color="#60a5fa"
          />
          <StatCard
            label="Qualified"
            value={stats.pipeline.QUALIFIED}
            icon={Target}
            color="#c084fc"
          />
          <StatCard
            label="Converted"
            value={stats.pipeline.CONVERTED}
            icon={TrendingUp}
            color="#4ade80"
          />
          <StatCard
            label="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={TrendingUp}
            color="var(--gold)"
          />
        </div>
      )}

      {/* Pipeline + Sources */}
      {stats && (
        <div className="grid gap-4 lg:grid-cols-2">
          <PipelineBar pipeline={stats.pipeline} total={stats.totalLeads} />
          <SourceBreakdown breakdown={stats.sourceBreakdown} />
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
          <div
            className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <Search size={16} style={{ color: 'var(--muted)' }} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by email..."
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: 'var(--white)' }}
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: 'var(--muted)' }} />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border px-3 py-2 text-sm outline-none"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--border)',
              color: 'var(--white)',
            }}
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="ENGAGED">Engaged</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="CONVERTED">Converted</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div
        className="overflow-x-auto rounded-xl border"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th className="px-5 py-3">
                <SortableHeader label="Email" field="email" currentSort={sort} onSort={(s) => setSort(s ?? { field: 'lastActivityAt', order: 'desc' })} />
              </th>
              <th className="px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  Status
                </span>
              </th>
              <th className="px-5 py-3">
                <SortableHeader label="Score" field="score" currentSort={sort} onSort={(s) => setSort(s ?? { field: 'lastActivityAt', order: 'desc' })} />
              </th>
              <th className="px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  Source
                </span>
              </th>
              <th className="px-5 py-3">
                <SortableHeader label="Last Activity" field="lastActivityAt" currentSort={sort} onSort={(s) => setSort(s ?? { field: 'lastActivityAt', order: 'desc' })} />
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm" style={{ color: 'var(--muted)' }}>
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm" style={{ color: 'var(--muted)' }}>
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => <LeadRow key={lead.id} lead={lead} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {meta.total} leads total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--white)' }}
            >
              Previous
            </button>
            <span className="flex items-center px-3 text-sm" style={{ color: 'var(--muted)' }}>
              {page} / {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:opacity-40"
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

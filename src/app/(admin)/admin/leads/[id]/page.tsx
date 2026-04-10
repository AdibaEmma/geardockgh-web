'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Mail,
  Clock,
  Target,
  TrendingUp,
  ShoppingCart,
  Bell,
  MessageCircle,
  UserPlus,
  Eye,
  Heart,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import { getAdminLead, type Lead } from '@/lib/api/admin';
import { formatDatetime } from '@/lib/utils/formatters';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  NEW: { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa' },
  ENGAGED: { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24' },
  QUALIFIED: { bg: 'rgba(168,85,247,0.12)', text: '#c084fc' },
  CONVERTED: { bg: 'rgba(34,197,94,0.12)', text: '#4ade80' },
  INACTIVE: { bg: 'rgba(107,114,128,0.12)', text: '#9ca3af' },
};

const ACTION_ICONS: Record<string, typeof Target> = {
  page_view: Eye,
  add_to_cart: ShoppingCart,
  wishlist_add: Heart,
  checkout_start: CreditCard,
  whatsapp_click: MessageCircle,
  newsletter_signup: Mail,
  account_created: UserPlus,
  stock_notify_subscribe: Bell,
  purchase: CheckCircle,
};

const ACTION_LABELS: Record<string, string> = {
  page_view: 'Viewed product',
  add_to_cart: 'Added to cart',
  wishlist_add: 'Added to wishlist',
  checkout_start: 'Started checkout',
  whatsapp_click: 'Clicked WhatsApp',
  newsletter_signup: 'Signed up for newsletter',
  account_created: 'Created account',
  stock_notify_subscribe: 'Subscribed to stock alert',
  purchase: 'Completed purchase',
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminLeadDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-lead', id],
    queryFn: () => getAdminLead(id),
  });

  const lead = data?.data as Lead | undefined;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded" style={{ background: 'var(--border)' }} />
        <div className="h-40 animate-pulse rounded-xl" style={{ background: 'var(--card)' }} />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium" style={{ color: 'var(--white)' }}>Lead not found</p>
        <Link href="/admin/leads" className="mt-2 text-sm hover:underline" style={{ color: 'var(--gold)' }}>
          Back to leads
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_COLORS[lead.status] ?? STATUS_COLORS.INACTIVE;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm transition-colors hover:underline"
        style={{ color: 'var(--muted)' }}
      >
        <ArrowLeft size={16} />
        Back to leads
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="font-[family-name:var(--font-outfit)] text-2xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            {lead.email}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase"
              style={{ background: statusStyle.bg, color: statusStyle.text }}
            >
              {lead.status}
            </span>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              Source: {SOURCE_LABELS[lead.source] ?? lead.source}
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-2 rounded-xl border px-4 py-3"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <Target size={18} style={{ color: 'var(--gold)' }} />
          <div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Score</p>
            <p className="text-xl font-bold" style={{ color: 'var(--gold)' }}>{lead.score}</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="rounded-xl border p-4"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--muted)' }}>First Touch</p>
          <p className="mt-1 text-sm font-medium" style={{ color: 'var(--white)' }}>
            {formatDatetime(lead.firstTouchAt)}
          </p>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Last Activity</p>
          <p className="mt-1 text-sm font-medium" style={{ color: 'var(--white)' }}>
            {formatDatetime(lead.lastActivityAt)}
          </p>
        </div>
        {lead.convertedAt && (
          <div
            className="rounded-xl border p-4"
            style={{ background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }}
          >
            <p className="text-xs" style={{ color: '#4ade80' }}>Converted</p>
            <p className="mt-1 text-sm font-medium" style={{ color: '#4ade80' }}>
              {formatDatetime(lead.convertedAt)}
            </p>
          </div>
        )}
        {lead.customerId && (
          <div
            className="rounded-xl border p-4"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Customer ID</p>
            <p className="mt-1 truncate text-sm font-mono" style={{ color: 'var(--white)' }}>
              {lead.customerId}
            </p>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div
        className="rounded-xl border p-5"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="mb-4 flex items-center gap-2">
          <Clock size={16} style={{ color: 'var(--gold)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
            Activity Timeline
          </h3>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            ({lead.activities?.length ?? 0} events)
          </span>
        </div>

        {!lead.activities || lead.activities.length === 0 ? (
          <p className="py-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
            No activities recorded yet
          </p>
        ) : (
          <div className="relative space-y-0">
            {/* Timeline line */}
            <div
              className="absolute left-[15px] top-2 bottom-2 w-px"
              style={{ background: 'var(--border)' }}
            />

            {lead.activities.map((activity) => {
              const Icon = ACTION_ICONS[activity.action] ?? Target;
              const label = ACTION_LABELS[activity.action] ?? activity.action;
              let metaInfo: Record<string, unknown> | null = null;
              try {
                if (activity.metadata) metaInfo = JSON.parse(activity.metadata);
              } catch { /* ignore */ }

              return (
                <div key={activity.id} className="relative flex items-start gap-3 py-3 pl-1">
                  <div
                    className="relative z-10 flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'var(--deep)', border: '1px solid var(--border)' }}
                  >
                    <Icon size={14} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                        {label}
                      </span>
                      {activity.scoreDelta > 0 && (
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--gold)' }}
                        >
                          +{activity.scoreDelta}pts
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {formatDatetime(activity.createdAt)}
                    </p>
                    {metaInfo && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {Object.entries(metaInfo).map(([key, val]) =>
                          val ? (
                            <span
                              key={key}
                              className="rounded px-1.5 py-0.5 text-[10px]"
                              style={{ background: 'var(--deep)', color: 'var(--muted)' }}
                            >
                              {key}: {String(val)}
                            </span>
                          ) : null,
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

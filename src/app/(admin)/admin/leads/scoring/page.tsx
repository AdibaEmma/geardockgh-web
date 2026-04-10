'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { getAdminScoringRules, updateAdminScoringRules, type LeadScoringRule } from '@/lib/api/admin';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/stores/toast-store';

const ACTION_LABELS: Record<string, string> = {
  page_view: 'Page View',
  newsletter_signup: 'Newsletter Signup',
  account_created: 'Account Created',
  add_to_cart: 'Add to Cart',
  wishlist_add: 'Wishlist Add',
  checkout_start: 'Checkout Start',
  whatsapp_click: 'WhatsApp Click',
  stock_notify_subscribe: 'Stock Alert Subscribe',
  purchase: 'Purchase',
};

export default function ScoringRulesPage() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-scoring-rules'],
    queryFn: getAdminScoringRules,
  });

  const rules = (data?.data ?? []) as LeadScoringRule[];
  const [editedRules, setEditedRules] = useState<Record<string, { points: number; isActive: boolean }>>({});

  useEffect(() => {
    if (rules.length > 0 && Object.keys(editedRules).length === 0) {
      const map: Record<string, { points: number; isActive: boolean }> = {};
      for (const r of rules) {
        map[r.action] = { points: r.points, isActive: r.isActive };
      }
      setEditedRules(map);
    }
  }, [rules]); // eslint-disable-line react-hooks/exhaustive-deps

  const { mutate: save, isPending } = useMutation({
    mutationFn: () =>
      updateAdminScoringRules(
        Object.entries(editedRules).map(([action, { points, isActive }]) => ({
          action,
          points,
          isActive,
        })),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-scoring-rules'] });
      addToast({ type: 'success', message: 'Scoring rules updated' });
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update rules' }),
  });

  const hasChanges = rules.some(
    (r) =>
      editedRules[r.action] &&
      (editedRules[r.action].points !== r.points || editedRules[r.action].isActive !== r.isActive),
  );

  return (
    <div className="space-y-6">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm transition-colors hover:underline"
        style={{ color: 'var(--muted)' }}
      >
        <ArrowLeft size={16} />
        Back to leads
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-[family-name:var(--font-outfit)] text-2xl font-bold"
            style={{ color: 'var(--white)' }}
          >
            Scoring Rules
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Configure how many points each action awards to a lead
          </p>
        </div>
        <Button
          onClick={() => save()}
          disabled={isPending || !hasChanges}
          size="sm"
        >
          <Save size={14} className="mr-1.5" />
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div
        className="overflow-hidden rounded-xl border"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {isLoading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--muted)' }}>
            Loading...
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="px-5 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                    Action
                  </span>
                </th>
                <th className="px-5 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                    Points
                  </span>
                </th>
                <th className="px-5 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                    Active
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                      {ACTION_LABELS[rule.action] ?? rule.action}
                    </span>
                    <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                      {rule.action}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editedRules[rule.action]?.points ?? rule.points}
                      onChange={(e) =>
                        setEditedRules((prev) => ({
                          ...prev,
                          [rule.action]: {
                            ...prev[rule.action],
                            points: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-20 rounded-lg border px-3 py-1.5 text-sm outline-none transition-colors focus:border-[var(--gold)]"
                      style={{
                        background: 'var(--deep)',
                        borderColor: 'var(--border)',
                        color: 'var(--white)',
                      }}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={editedRules[rule.action]?.isActive ?? rule.isActive}
                        onChange={(e) =>
                          setEditedRules((prev) => ({
                            ...prev,
                            [rule.action]: {
                              ...prev[rule.action],
                              isActive: e.target.checked,
                            },
                          }))
                        }
                        className="peer sr-only"
                      />
                      <div
                        className="h-5 w-9 rounded-full transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"
                        style={{
                          background: (editedRules[rule.action]?.isActive ?? rule.isActive)
                            ? 'var(--gold)'
                            : 'var(--border)',
                        }}
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info */}
      <div
        className="rounded-xl border p-4 text-sm"
        style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.03)', color: 'var(--muted)' }}
      >
        <p className="font-medium" style={{ color: 'var(--gold)' }}>How scoring works</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Each action awards the configured points to a lead&apos;s score</li>
          <li>Score 0–9 = <strong>New</strong>, 10–29 = <strong>Engaged</strong>, 30+ = <strong>Qualified</strong></li>
          <li>Leads automatically transition to <strong>Converted</strong> on first purchase</li>
          <li>Disabled rules award 0 points but the activity is still logged</li>
        </ul>
      </div>
    </div>
  );
}

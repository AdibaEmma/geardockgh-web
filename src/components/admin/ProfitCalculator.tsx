'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface ProfitCalculatorProps {
  costPricePesewas: number;
  currentPricePesewas: number;
  onApplyPrice: (pesewas: number) => void;
}

const MARGIN_PRESETS = [30, 50, 75, 100];

function formatGHS(pesewas: number): string {
  return `GHS ${(pesewas / 100).toFixed(2)}`;
}

export function ProfitCalculator({
  costPricePesewas,
  currentPricePesewas,
  onApplyPrice,
}: ProfitCalculatorProps) {
  const [customMargin, setCustomMargin] = useState<number | ''>('');

  if (!costPricePesewas || costPricePesewas <= 0) return null;

  const currentMargin =
    ((currentPricePesewas - costPricePesewas) / costPricePesewas) * 100;

  const calculateRow = (marginPercent: number) => {
    const sellingPrice = Math.round(costPricePesewas * (1 + marginPercent / 100));
    const profit = sellingPrice - costPricePesewas;
    return { marginPercent, sellingPrice, profit };
  };

  const rows = MARGIN_PRESETS.map(calculateRow);
  const customRow =
    typeof customMargin === 'number' && customMargin > 0
      ? calculateRow(customMargin)
      : null;

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} style={{ color: 'var(--gold)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
            Profit Calculator
          </h3>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            background:
              currentMargin >= 50
                ? 'rgba(0,201,167,0.1)'
                : currentMargin >= 20
                  ? 'rgba(245,158,11,0.1)'
                  : 'rgba(239,68,68,0.1)',
            color:
              currentMargin >= 50
                ? 'var(--teal)'
                : currentMargin >= 20
                  ? 'var(--gold)'
                  : '#ef4444',
          }}
        >
          Current: {currentMargin.toFixed(1)}%
        </span>
      </div>

      <div className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
        Cost: {formatGHS(costPricePesewas)}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="pb-2 text-left text-xs font-medium" style={{ color: 'var(--muted)' }}>
                Margin
              </th>
              <th className="pb-2 text-right text-xs font-medium" style={{ color: 'var(--muted)' }}>
                Selling Price
              </th>
              <th className="pb-2 text-right text-xs font-medium" style={{ color: 'var(--muted)' }}>
                Profit/Unit
              </th>
              <th className="pb-2 text-right text-xs font-medium" style={{ color: 'var(--muted)' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.marginPercent} className="border-b" style={{ borderColor: 'var(--border)' }}>
                <td className="py-2.5 text-sm font-medium" style={{ color: 'var(--white)' }}>
                  {row.marginPercent}%
                </td>
                <td className="py-2.5 text-right text-sm" style={{ color: 'var(--white)' }}>
                  {formatGHS(row.sellingPrice)}
                </td>
                <td className="py-2.5 text-right text-sm" style={{ color: 'var(--teal)' }}>
                  {formatGHS(row.profit)}
                </td>
                <td className="py-2.5 text-right">
                  <button
                    onClick={() => onApplyPrice(row.sellingPrice)}
                    className="rounded-md px-3 py-1 text-xs font-medium transition-colors hover:opacity-80"
                    style={{ background: 'var(--gold)', color: 'var(--black)' }}
                  >
                    Apply
                  </button>
                </td>
              </tr>
            ))}
            {/* Custom margin row */}
            <tr>
              <td className="py-2.5">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    placeholder="Custom"
                    value={customMargin}
                    onChange={(e) => setCustomMargin(e.target.value ? Number(e.target.value) : '')}
                    className="w-16 rounded-md border px-2 py-1 text-sm"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--deep)',
                      color: 'var(--white)',
                    }}
                  />
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>%</span>
                </div>
              </td>
              <td className="py-2.5 text-right text-sm" style={{ color: 'var(--white)' }}>
                {customRow ? formatGHS(customRow.sellingPrice) : '--'}
              </td>
              <td className="py-2.5 text-right text-sm" style={{ color: 'var(--teal)' }}>
                {customRow ? formatGHS(customRow.profit) : '--'}
              </td>
              <td className="py-2.5 text-right">
                {customRow && (
                  <button
                    onClick={() => onApplyPrice(customRow.sellingPrice)}
                    className="rounded-md px-3 py-1 text-xs font-medium transition-colors hover:opacity-80"
                    style={{ background: 'var(--gold)', color: 'var(--black)' }}
                  >
                    Apply
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

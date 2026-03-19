import { formatPesewas, formatDate } from '@/lib/utils/formatters';
import type { Product } from '@/types';

interface PreorderInfoProps {
  product: Product;
  quantity?: number;
}

function calculateDeposit(product: Product, quantity: number): number {
  if (!product.preorderDepositType || product.preorderDepositValue == null) {
    return product.pricePesewas * quantity;
  }

  if (product.preorderDepositType === 'percentage') {
    return Math.round(
      (product.pricePesewas * product.preorderDepositValue * quantity) / 100
    );
  }

  // fixed amount per unit
  return product.preorderDepositValue * quantity;
}

export function PreorderInfo({ product, quantity = 1 }: PreorderInfoProps) {
  const totalPesewas = product.pricePesewas * quantity;
  const depositPesewas = calculateDeposit(product, quantity);
  const balancePesewas = totalPesewas - depositPesewas;

  const hasMinUnits = product.preorderMinUnits != null && product.preorderMinUnits > 0;
  const progress = hasMinUnits
    ? Math.min(100, Math.round((product.preorderSlotsTaken / product.preorderMinUnits!) * 100))
    : null;

  return (
    <div
      className="rounded-xl border p-4 space-y-3"
      style={{ borderColor: 'rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}
    >
      {/* ETA */}
      {product.estArrivalDate && (
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--muted)' }}>Estimated Arrival</span>
          <span className="font-medium" style={{ color: 'var(--gold)' }}>
            {formatDate(product.estArrivalDate)}
          </span>
        </div>
      )}

      {/* Deposit Breakdown */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--muted)' }}>Pay now (deposit)</span>
          <span className="font-semibold" style={{ color: 'var(--white)' }}>
            {formatPesewas(depositPesewas)}
          </span>
        </div>
        {balancePesewas > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--muted)' }}>Balance on arrival</span>
            <span style={{ color: 'var(--muted)' }}>
              {formatPesewas(balancePesewas)}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {hasMinUnits && progress !== null && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              Pre-order progress
            </span>
            <span className="text-xs font-medium" style={{ color: 'var(--gold)' }}>
              {product.preorderSlotsTaken} / {product.preorderMinUnits} units
            </span>
          </div>
          <div
            className="h-2 w-full rounded-full overflow-hidden"
            style={{ background: 'var(--border)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: 'var(--gold)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { calculateDeposit };

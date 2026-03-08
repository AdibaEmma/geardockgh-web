import { formatPesewas } from '@/lib/utils/formatters';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface TopProduct {
  productId: string;
  name: string;
  pricePesewas: number;
  stockCount: number;
  totalSold: number;
}

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <div
      className="rounded-xl border"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
          Top Products
        </h3>
      </div>

      {products.length === 0 ? (
        <p className="py-10 text-center text-sm" style={{ color: 'var(--muted)' }}>
          No sales yet
        </p>
      ) : (
        <ul>
          {products.map((p, i) => (
            <li
              key={p.productId}
              className="flex items-center gap-3 px-5 py-3"
              style={{
                borderBottom: i < products.length - 1 ? '1px solid var(--border)' : undefined,
              }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                style={{ background: 'rgba(240,165,0,0.1)', color: 'var(--gold)' }}
              >
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" style={{ color: 'var(--white)' }}>
                  {p.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {formatPesewas(p.pricePesewas)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--teal)' }}>
                  <TrendingUp size={12} />
                  <span className="font-medium">{p.totalSold} sold</span>
                </div>
                {p.stockCount <= 5 && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#ef4444' }}>
                    <AlertTriangle size={12} />
                    <span>{p.stockCount} left</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

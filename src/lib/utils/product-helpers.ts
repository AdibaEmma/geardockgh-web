import type { Product } from '@/types';

/**
 * A product is "in preorder mode" when EITHER:
 * - isPreorder === true (dedicated preorder product), OR
 * - allowPreorderWhenOOS === true && stockCount === 0 (OOS with preorder fallback)
 */
export function isProductPreorderable(product: Product): boolean {
  return product.isPreorder || (product.allowPreorderWhenOOS && product.stockCount === 0);
}

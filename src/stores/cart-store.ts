import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SelectedOption } from '@/types';

interface CartItem {
  productId: string;
  variantId: string | null;
  name: string;
  pricePesewas: number;
  quantity: number;
  image: string | null;
  isPreorder: boolean;
  depositPesewas: number;
  selectedOptions: SelectedOption[];
}

interface CartState {
  items: CartItem[];
}

function optionsKey(options?: SelectedOption[]): string {
  if (!options || options.length === 0) return '';
  return JSON.stringify(
    options.map((o) => ({ name: o.name, value: o.value })).sort((a, b) => a.name.localeCompare(b.name)),
  );
}

function itemMatches(item: CartItem, productId: string, variantId: string | null, selOptions?: SelectedOption[]): boolean {
  return (
    item.productId === productId &&
    item.variantId === variantId &&
    optionsKey(item.selectedOptions) === optionsKey(selOptions)
  );
}

interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string, variantId: string | null, selectedOptions?: SelectedOption[]) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number, selectedOptions?: SelectedOption[]) => void;
  clearCart: () => void;
  totalPesewas: () => number;
  itemCount: () => number;
  depositTotalPesewas: () => number;
  regularTotalPesewas: () => number;
  hasPreorderItems: () => boolean;
}

type CartStore = CartState & CartActions;

function effectivePrice(item: CartItem): number {
  const optionsDelta = (item.selectedOptions ?? []).reduce((sum, o) => sum + (o.priceDelta ?? 0), 0);
  return item.pricePesewas + optionsDelta;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const selOptions = item.selectedOptions ?? [];
        set((state) => {
          const existing = state.items.find((i) =>
            itemMatches(i, item.productId, item.variantId, selOptions),
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                itemMatches(i, item.productId, item.variantId, selOptions)
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }

          return { items: [...state.items, { ...item, selectedOptions: selOptions, quantity }] };
        });
      },

      removeItem: (productId, variantId, selectedOptions = []) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !itemMatches(i, productId, variantId, selectedOptions),
          ),
        }));
      },

      updateQuantity: (productId, variantId, quantity, selectedOptions = []) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId, selectedOptions);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemMatches(i, productId, variantId, selectedOptions)
              ? { ...i, quantity }
              : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalPesewas: () =>
        get().items.reduce((sum, item) => sum + effectivePrice(item) * item.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      depositTotalPesewas: () =>
        get().items
          .filter((item) => item.isPreorder)
          .reduce((sum, item) => sum + item.depositPesewas * item.quantity, 0),

      regularTotalPesewas: () =>
        get().items
          .filter((item) => !item.isPreorder)
          .reduce((sum, item) => sum + effectivePrice(item) * item.quantity, 0),

      hasPreorderItems: () =>
        get().items.some((item) => item.isPreorder),
    }),
    {
      name: 'geardockgh-cart',
    },
  ),
);

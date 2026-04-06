import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RecentlyViewedItem {
  productId: string;
  name: string;
  slug: string;
  pricePesewas: number;
  comparePricePesewas: number | null;
  image: string | null;
  category: string | null;
  viewedAt: number;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
}

interface RecentlyViewedActions {
  addItem: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;
  clearAll: () => void;
}

type RecentlyViewedStore = RecentlyViewedState & RecentlyViewedActions;

const MAX_ITEMS = 15;

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const filtered = state.items.filter(
            (i) => i.productId !== item.productId,
          );
          return {
            items: [{ ...item, viewedAt: Date.now() }, ...filtered].slice(
              0,
              MAX_ITEMS,
            ),
          };
        });
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'geardockgh-recently-viewed',
    },
  ),
);

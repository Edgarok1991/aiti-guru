import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductSortField, SortOrder } from '../types';

interface SortState {
  sortBy: ProductSortField;
  order: SortOrder;
  setSort: (field: ProductSortField) => void;
  setOrder: (order: SortOrder) => void;
  toggleSort: (field: ProductSortField) => void;
}

export const useSortStore = create<SortState>()(
  persist(
    (set, get) => ({
      sortBy: 'title',
      order: 'asc',

      setSort: (field) => set({ sortBy: field }),

      setOrder: (order) => set({ order }),

      toggleSort: (field) => {
        const { sortBy, order } = get();
        if (sortBy === field) {
          set({ order: order === 'asc' ? 'desc' : 'asc' });
        } else {
          set({ sortBy: field, order: 'asc' });
        }
      },
    }),
    { name: 'aiti-products-sort' },
  ),
);

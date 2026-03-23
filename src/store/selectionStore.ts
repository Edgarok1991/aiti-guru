import { create } from 'zustand';

interface SelectionState {
  selectedIds: Set<number>;
  toggle: (id: number) => void;
  toggleAll: (ids: number[], checked: boolean) => void;
  clear: () => void;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: new Set(),

  toggle: (id) => {
    const next = new Set(get().selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    set({ selectedIds: next });
  },

  toggleAll: (ids, checked) => {
    const next = new Set(get().selectedIds);
    if (checked) {
      ids.forEach((i) => next.add(i));
    } else {
      ids.forEach((i) => next.delete(i));
    }
    set({ selectedIds: next });
  },

  clear: () => set({ selectedIds: new Set() }),
}));

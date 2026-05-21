import { create } from 'zustand';

/**
 * Transient UI state — not persisted. Tracks which detail modal is
 * open: a nation, a legend, or none.
 */
interface UIStore {
  nationModalCode: string | null;
  legendModalId: string | null;
  openNation: (code: string) => void;
  closeNation: () => void;
  openLegend: (id: string) => void;
  closeLegend: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  nationModalCode: null,
  legendModalId: null,
  openNation: (code) => set({ nationModalCode: code, legendModalId: null }),
  closeNation: () => set({ nationModalCode: null }),
  openLegend: (id) => set({ legendModalId: id, nationModalCode: null }),
  closeLegend: () => set({ legendModalId: null }),
}));

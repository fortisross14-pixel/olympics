import { create } from 'zustand';

/**
 * Transient UI state — not persisted. Tracks which detail modal is
 * open: a nation, a legend, an event result, or none.
 */
interface UIStore {
  nationModalCode: string | null;
  legendModalId: string | null;
  eventModalId: string | null;
  openNation: (code: string) => void;
  closeNation: () => void;
  openLegend: (id: string) => void;
  closeLegend: () => void;
  openEvent: (id: string) => void;
  closeEvent: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  nationModalCode: null,
  legendModalId: null,
  eventModalId: null,
  openNation: (code) =>
    set({ nationModalCode: code, legendModalId: null, eventModalId: null }),
  closeNation: () => set({ nationModalCode: null }),
  openLegend: (id) =>
    set({ legendModalId: id, nationModalCode: null, eventModalId: null }),
  closeLegend: () => set({ legendModalId: null }),
  openEvent: (id) =>
    set({ eventModalId: id, nationModalCode: null, legendModalId: null }),
  closeEvent: () => set({ eventModalId: null }),
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LayoutMode = 'adaptive' | 'mobile-optimized';

interface LayoutSettingsState {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}

export const useLayoutSettings = create<LayoutSettingsState>()(
  persist(
    (set) => ({
      layoutMode: 'adaptive',
      setLayoutMode: (mode) => set({ layoutMode: mode }),
    }),
    {
      name: 'smc-layout-settings',
    }
  )
);

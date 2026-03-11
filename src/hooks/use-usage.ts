import { create } from 'zustand';

export interface UsageState {
  speechesCount: number;
  quizzesCount: number;
  crisisCount: number;
  debatesCount: number;
  incrementUsage: (type: 'speeches' | 'quizzes' | 'crisis' | 'debates') => void;
  setUsage: (usage: Partial<UsageState>) => void;
}

export const useUsageStore = create<UsageState>((set) => ({
  speechesCount: 1, // Mock data for testing the gate
  quizzesCount: 0,
  crisisCount: 0,
  debatesCount: 0,
  incrementUsage: (type) =>
    set((state) => {
      const key = `${type}Count` as const;
      return {
        [key]: (state[key] as number) + 1,
      };
    }),
  setUsage: (usage) => set((state) => ({ ...state, ...usage })),
}));

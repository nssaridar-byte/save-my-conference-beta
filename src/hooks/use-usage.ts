/**
 * Usage tracking store with per-day limits.
 * When backend is connected, replace resetIfNewDay / incrementUsage
 * with API calls to GET /api/usage and POST /api/usage/increment.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const FREE_DAILY_LIMITS = {
  speeches: 3,
  quizzes: 5,
  crisis: 1,
  debates: 1,
} as const;

export type UsageType = keyof typeof FREE_DAILY_LIMITS;

export interface DailyUsage {
  speeches: number;
  quizzes: number;
  crisis: number;
  debates: number;
  date: string; // ISO date string YYYY-MM-DD
}

export interface UsageState {
  usage: DailyUsage;
  isProUser: boolean; // toggled by backend subscription webhook later
  incrementUsage: (type: UsageType) => void;
  setUsageFromApi: (apiUsage: DailyUsage) => void;
  setProUser: (isPro: boolean) => void;
  getRemainingToday: (type: UsageType) => number;
  isLimitReached: (type: UsageType) => boolean;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const freshUsage = (): DailyUsage => ({
  speeches: 0,
  quizzes: 0,
  crisis: 0,
  debates: 0,
  date: todayStr(),
});

export const useUsageStore = create<UsageState>()(
  persist(
    (set, get) => ({
      usage: freshUsage(),
      isProUser: false,

      incrementUsage: (type) =>
        set((state) => {
          // Reset if it's a new day
          const today = todayStr();
          const current = state.usage.date === today ? state.usage : freshUsage();
          return {
            usage: { ...current, [type]: current[type] + 1, date: today },
          };
        }),

      setUsageFromApi: (apiUsage) => set({ usage: apiUsage }),

      setProUser: (isPro) => set({ isProUser: isPro }),

      getRemainingToday: (type) => {
        const state = get();
        if (state.isProUser) return Infinity;
        const today = todayStr();
        const count = state.usage.date === today ? state.usage[type] : 0;
        return Math.max(0, FREE_DAILY_LIMITS[type] - count);
      },

      isLimitReached: (type) => {
        const state = get();
        if (state.isProUser) return false;
        const today = todayStr();
        const count = state.usage.date === today ? state.usage[type] : 0;
        return count >= FREE_DAILY_LIMITS[type];
      },
    }),
    {
      name: 'smc-daily-usage',
      // When backend is ready: sync on hydration via onRehydrateStorage
    }
  )
);

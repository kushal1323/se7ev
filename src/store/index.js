import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // User / onboarding
      user: null,
      isOnboarded: false,

      setUser: (user) => set({ user, isOnboarded: true }),
      logout: () => set({ user: null, isOnboarded: false }),

      // Voice recording modal
      isRecordingOpen: false,
      openRecording: () => set({ isRecordingOpen: true }),
      closeRecording: () => set({ isRecordingOpen: false }),

      // Today's summary (fetched from backend)
      todaySummary: {
        sales: 0,
        expenses: 0,
        profit: 0,
        recentEntries: [],
        topItems: [],
      },
      setTodaySummary: (summary) => set({ todaySummary: summary }),

      // Inventory
      inventory: [],
      setInventory: (inventory) => set({ inventory }),

      // Insights filters
      insightsFilter: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        view: 'monthly', // 'monthly' | 'yearly'
      },
      setInsightsFilter: (filter) =>
        set((state) => ({ insightsFilter: { ...state.insightsFilter, ...filter } })),
    }),
    {
      name: 'voicetrace-storage',
      partialize: (state) => ({ user: state.user, isOnboarded: state.isOnboarded }),
    }
  )
)
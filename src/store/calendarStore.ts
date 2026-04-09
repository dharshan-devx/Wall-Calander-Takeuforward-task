'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { addMonths, subMonths, startOfMonth } from 'date-fns';
import { fromDateKey, normalizeRange, toDateKey } from '@/lib/calendarUtils';

type Phase = 'none' | 'start-selected' | 'range-selected';

interface CalendarState {
  currentMonth: string; // Store as ISO string for persistence
  startDate: string | null;
  endDate: string | null;
  hoveredDate: string | null;
  phase: Phase;
  darkMode: boolean;
  activeTab: 'date' | 'range';
  hasSeenOnboarding: boolean;
  showOnboarding: boolean;
}

interface CalendarActions {
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToMonth: (idx: number) => void;
  handleDateClick: (date: Date) => void;
  setHoveredDate: (date: Date | null) => void;
  clearSelection: () => void;
  setRange: (start: Date, end: Date) => void;
  setDarkMode: (v: boolean) => void;
  setActiveTab: (tab: 'date' | 'range') => void;
  setShowOnboarding: (show: boolean) => void;
  completeOnboarding: () => void;
}

export const useCalendarStore = create<CalendarState & CalendarActions>()(
  persist(
    (set, get) => ({
      currentMonth: toDateKey(startOfMonth(new Date())),
      startDate: null,
      endDate: null,
      hoveredDate: null,
      phase: 'none',
      darkMode: false,
      activeTab: 'date',
      hasSeenOnboarding: false,
      showOnboarding: false,

      goToPrevMonth: () => set((s) => {
        const baseDate = fromDateKey(s.currentMonth) ?? new Date();
        return { currentMonth: toDateKey(startOfMonth(subMonths(baseDate, 1))) };
      }),
      goToNextMonth: () => set((s) => {
        const baseDate = fromDateKey(s.currentMonth) ?? new Date();
        return { currentMonth: toDateKey(startOfMonth(addMonths(baseDate, 1))) };
      }),
      goToMonth: (idx) => set((s) => {
        const baseDate = fromDateKey(s.currentMonth) ?? new Date();
        const d = new Date(baseDate.getFullYear(), idx, 1);
        return { currentMonth: toDateKey(startOfMonth(d)) };
      }),

      handleDateClick: (date) => {
        const { phase, startDate } = get();
        const clickedDate = fromDateKey(toDateKey(date));
        if (!clickedDate) return;
        const dateStr = toDateKey(clickedDate);
        
        if (phase === 'none' || phase === 'range-selected') {
          set({
            startDate: dateStr,
            endDate: null,
            hoveredDate: null,
            phase: 'start-selected',
            currentMonth: toDateKey(startOfMonth(clickedDate)),
          });
        } else if (phase === 'start-selected' && startDate) {
          const sd = fromDateKey(startDate);
          if (!sd) return;
          const range = normalizeRange(sd, clickedDate);
          set({
            startDate: toDateKey(range.start),
            endDate: toDateKey(range.end),
            hoveredDate: null,
            phase: 'range-selected',
            currentMonth: toDateKey(startOfMonth(clickedDate)),
          });
        }
      },

      setHoveredDate: (date) => {
        const { phase } = get();
        const nextHoveredDate = phase === 'start-selected' && date ? toDateKey(date) : null;
        set((state) => {
          if (state.hoveredDate === nextHoveredDate) return state;
          return { hoveredDate: nextHoveredDate };
        });
      },

      clearSelection: () => set({
        startDate: null, endDate: null, hoveredDate: null, phase: 'none'
      }),
      setRange: (start, end) => {
        const range = normalizeRange(start, end);
        set({
          startDate: toDateKey(range.start),
          endDate: toDateKey(range.end),
          phase: 'range-selected'
        });
      },
      setDarkMode: (v) => set({ darkMode: v }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setShowOnboarding: (show) => set({ showOnboarding: show }),
      completeOnboarding: () => set({ hasSeenOnboarding: true, showOnboarding: false }),
    }),
    {
      name: 'wc-calendar-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        darkMode: state.darkMode,
        currentMonth: state.currentMonth,
        startDate: state.startDate,
        endDate: state.endDate,
        phase: state.phase,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
);


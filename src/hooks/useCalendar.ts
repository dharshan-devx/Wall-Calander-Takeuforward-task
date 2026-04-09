'use client';

import { useMemo, useCallback } from 'react';
import { differenceInDays, format, isSameDay } from 'date-fns';
import { useCalendarStore } from '@/store/calendarStore';
import { buildCalendarGrid, fromDateKey, resolveActiveRange } from '@/lib/calendarUtils';

/**
 * Hook for core calendar navigation and month state.
 * Encapsulates store interactions and provides semantic methods.
 */
export function useCalendar() {
  const {
    currentMonth: currentMonthStr,
    startDate: startDateStr,
    endDate: endDateStr,
    hoveredDate: hoveredDateStr,
    goToPrevMonth,
    goToNextMonth,
    goToMonth,
    handleDateClick,
    setHoveredDate,
    clearSelection,
    darkMode,
    setDarkMode,
    hasSeenOnboarding,
    showOnboarding,
    setShowOnboarding,
    completeOnboarding,
    setRange,
  } = useCalendarStore();

  const currentMonth = useMemo(
    () => fromDateKey(currentMonthStr) ?? new Date(),
    [currentMonthStr]
  );
  const startDate = useMemo(() => fromDateKey(startDateStr), [startDateStr]);
  const endDate = useMemo(() => fromDateKey(endDateStr), [endDateStr]);
  const hoveredDate = useMemo(() => fromDateKey(hoveredDateStr), [hoveredDateStr]);
  const days = useMemo(() => buildCalendarGrid(currentMonth), [currentMonth]);
  const activeRange = useMemo(
    () => resolveActiveRange(startDate, endDate, hoveredDate),
    [startDate, endDate, hoveredDate]
  );

  const monthName = useMemo(() => format(currentMonth, 'MMMM'), [currentMonth]);
  const year = useMemo(() => format(currentMonth, 'yyyy'), [currentMonth]);
  const selectedDaysCount = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return differenceInDays(endDate, startDate) + 1;
  }, [startDate, endDate]);
  const isSingleDaySelection = useMemo(() => {
    if (!startDate || !endDate) return false;
    return isSameDay(startDate, endDate);
  }, [startDate, endDate]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  return {
    currentMonth,
    days,
    monthName,
    year,
    startDate,
    endDate,
    hoveredDate,
    activeRange,
    selectedDaysCount,
    isSingleDaySelection,
    darkMode,
    goToPrevMonth,
    goToNextMonth,
    goToMonth,
    handleDateClick,
    setHoveredDate,
    clearSelection,
    toggleDarkMode,
    hasSeenOnboarding,
    showOnboarding,
    setShowOnboarding,
    completeOnboarding,
    setRange,
  };
}

'use client';

import { useCalendar } from './useCalendar';

/**
 * Hook for managing date range selection and hover previews.
 */
export function useRangeSelection() {
  const {
    startDate,
    endDate,
    hoveredDate,
    selectedDaysCount,
    handleDateClick,
    setHoveredDate,
    clearSelection,
  } = useCalendar();

  return {
    startDate,
    endDate,
    hoveredDate,
    isRangeActive: !!(startDate && endDate),
    selectedDaysCount,
    handleDateClick,
    setHoveredDate,
    clearSelection,
  };
}

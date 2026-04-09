'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { format, isWithinInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveActiveRange, toDateKey, WEEKDAY_LABELS } from '@/lib/calendarUtils';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';
import DayCell from './DayCell';

export default function CalendarGrid() {
  const {
    currentMonth,
    monthName,
    year,
    days,
    startDate,
    endDate,
    hoveredDate,
    goToPrevMonth,
    goToNextMonth,
    goToMonth,
    handleDateClick,
    setHoveredDate,
    clearSelection,
    setRange,
  } = useCalendar();
  const { hasDateNote, hasActiveRangeNote, rangeKey } = useNotes();
  const monthTransitionKey = `${year}-${monthName}`;
  const [focusedDate, setFocusedDate] = useState<Date | null>(startDate ?? days[0] ?? null);
  const [keyboardRangeAnchor, setKeyboardRangeAnchor] = useState<Date | null>(null);
  const [dragAnchor, setDragAnchor] = useState<Date | null>(null);

  const jumpToToday = useCallback(() => {
    const today = new Date();
    goToMonth(today.getMonth());
    setFocusedDate(today);
  }, [goToMonth]);

  const normalizedFocusedDate = useMemo(() => {
    if (focusedDate) return focusedDate;
    if (startDate) return startDate;
    return days[0] ?? currentMonth;
  }, [focusedDate, startDate, days, currentMonth]);

  const syncVisibleMonthForDate = useCallback((targetDate: Date) => {
    const monthDelta =
      (targetDate.getFullYear() - currentMonth.getFullYear()) * 12 +
      (targetDate.getMonth() - currentMonth.getMonth());

    if (monthDelta !== 0) {
      goToMonth(targetDate.getMonth());
    }
  }, [currentMonth, goToMonth]);

  const moveFocusedDate = useCallback((baseDate: Date, offsetDays: number) => {
    const next = new Date(baseDate);
    next.setDate(baseDate.getDate() + offsetDays);
    setFocusedDate(next);
    syncVisibleMonthForDate(next);
    return next;
  }, [syncVisibleMonthForDate]);

  const onDateKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>, date: Date) => {
    const keyOffsets: Record<string, number> = {
      ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7,
    };
    if (event.key in keyOffsets) {
      event.preventDefault();
      const next = moveFocusedDate(date, keyOffsets[event.key]);

      if (event.shiftKey) {
        // Range selection via shift
        const anchor = keyboardRangeAnchor ?? date;
        if (!keyboardRangeAnchor) {
          setKeyboardRangeAnchor(anchor);
        }
        setRange(anchor, next);
        setHoveredDate(next);
      } else {
        setKeyboardRangeAnchor(null);
        setHoveredDate(null);
      }
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDateClick(date);
      setKeyboardRangeAnchor(null);
      setFocusedDate(date);
      setHoveredDate(null);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      clearSelection();
      setKeyboardRangeAnchor(null);
      setHoveredDate(null);
    }
  }, [clearSelection, handleDateClick, keyboardRangeAnchor, moveFocusedDate, setHoveredDate]);

  const handlePointerDown = useCallback((date: Date) => {
    setDragAnchor(date);
  }, []);

  const handlePointerEnter = useCallback((date: Date | null) => {
    setHoveredDate(date);
    if (!date) return;
    if (dragAnchor && toDateKey(date) !== toDateKey(dragAnchor)) {
      if (!startDate || toDateKey(startDate) !== toDateKey(dragAnchor)) {
        clearSelection();
        handleDateClick(dragAnchor);
      }
    }
  }, [dragAnchor, setHoveredDate, startDate, clearSelection, handleDateClick]);

  const handlePointerUp = useCallback((date: Date) => {
    if (dragAnchor && toDateKey(dragAnchor) !== toDateKey(date)) {
      handleDateClick(date);
    }
    setDragAnchor(null);
  }, [dragAnchor, handleDateClick]);

  useEffect(() => {
    const onGlobalPointerUp = () => setDragAnchor(null);
    window.addEventListener('pointerup', onGlobalPointerUp);
    return () => window.removeEventListener('pointerup', onGlobalPointerUp);
  }, []);

  return (
    <div className="flex flex-col w-full">

      {/* Grid header containing functional controls */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 px-2 sm:px-6 relative h-10">

        {/* Previous Month Button (Left Anchor) */}
        <button
          onClick={goToPrevMonth}
          aria-label="Previous Month"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2A2A2D] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#343438] hover:text-[var(--cal-accent)] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-95 group relative z-10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-0.5 transition-transform">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Today Button - Absolute Absolute Center (guarantees perfection) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none">
          <button
            onClick={jumpToToday}
            className="pointer-events-auto flex items-center justify-center font-sans tracking-wide text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2A2A2D] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:border-[var(--cal-accent)]/50 hover:text-[var(--cal-accent)] px-8 py-2.5 rounded-full transition-all active:scale-95"
          >
            Today
          </button>
        </div>

        {/* Right Controls Anchor: Clear + Next Month */}
        <div className="flex items-center justify-end min-w-[140px] gap-3 relative z-10">
          <AnimatePresence>
            {(startDate || endDate) && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={clearSelection}
                className="flex px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold bg-white dark:bg-[#2A2A2D] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-all active:scale-95 whitespace-nowrap"
              >
                Clear
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={goToNextMonth}
            aria-label="Next Month"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2A2A2D] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#343438] hover:text-[var(--cal-accent)] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-95 group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-0.5 transition-transform">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday headers — Borderless clean text */}
      <div className="grid grid-cols-7 mb-4 sm:mb-6 px-1">
        {WEEKDAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`text-center font-sans text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase ${i === 5 || i === 6 ? 'text-[var(--cal-accent)]' : 'text-gray-500 dark:text-gray-400'
              }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid — soft radial glow behind cells */}
      <div
        className="rounded-xl -mx-1 px-1"
        style={{
          background: 'radial-gradient(ellipse 75% 60% at 50% 45%, rgba(31,80,199,0.02) 0%, transparent 70%)',
          perspective: '1200px',
        }}
        onMouseLeave={() => setHoveredDate(null)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={monthTransitionKey}
            className="grid grid-cols-7 preserve-3d"
            role="grid"
            aria-label={`${monthName} ${year} calendar`}
            initial={{ opacity: 0, rotateX: 20, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, rotateX: -20, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transformOrigin: 'top center', // Crucial: hinges exactly where the physical binder rings are
            }}
          >
            {days.map((date) => {
              const activeRange = resolveActiveRange(startDate, endDate, hoveredDate);
              const isDateInRange = activeRange && isWithinInterval(date, activeRange);

              return (
                <DayCell
                  key={toDateKey(date)}
                  date={date}
                  currentMonth={currentMonth}
                  hasNote={hasDateNote(date)}
                  hasRangeNote={Boolean(hasActiveRangeNote && isDateInRange)}
                  isFocused={toDateKey(normalizedFocusedDate) === toDateKey(date)}
                  startDate={startDate}
                  endDate={endDate}
                  hoveredDate={hoveredDate}
                  onDateClick={handleDateClick}
                  onDateHover={handlePointerEnter}
                  onDateFocus={setFocusedDate}
                  onDateKeyDown={onDateKeyDown}
                  onDatePointerDown={handlePointerDown}
                  onDatePointerUp={handlePointerUp}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

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

  const handlePointerEnter = useCallback((date: Date) => {
    setHoveredDate(date);
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

      {/* Grid header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col">
          <span className="font-serif text-3xl font-bold tracking-tight text-cal-text-primary leading-none mb-1">
            {monthName}
          </span>
          <span className="font-mono text-[10px] text-cal-text-muted font-bold tracking-[0.25em] uppercase mt-1">
            Productivity View - {year}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={jumpToToday}
            className="flex items-center justify-center font-body text-[11px] font-medium text-cal-text-primary border border-[var(--glass-border-sub)] hover:border-[var(--glass-border)] bg-[var(--cal-surface)] hover:bg-[var(--glass-bg-subtle)] px-5 py-2 rounded-full transition-all"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            Today
          </button>
          <AnimatePresence>
            {(startDate || endDate) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={clearSelection}
                className="flex items-center justify-center font-body text-[11px] font-medium text-red-500 hover:text-red-600 bg-red-50 px-5 py-2 rounded-full transition-all border border-red-100"
              >
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Weekday headers — Clean floating text */}
      <div className="grid grid-cols-7 mb-6 px-2">
        {WEEKDAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`text-center font-mono text-[10px] font-bold tracking-[0.20em] uppercase ${
              i >= 5 ? 'text-cal-text-primary' : 'text-cal-text-faint'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid — soft radial glow behind cells */}
      <div
        className="rounded-xl -mx-1 px-1 perspective-1000 preserve-3d"
        style={{
          background: 'radial-gradient(ellipse 75% 60% at 50% 45%, rgba(31,80,199,0.02) 0%, transparent 70%)',
        }}
        onMouseLeave={() => setHoveredDate(null)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={monthTransitionKey}
            className="grid grid-cols-7 preserve-3d"
            role="grid"
            aria-label={`${monthName} ${year} calendar`}
            initial={{ 
              opacity: 0, 
              rotateX: -90, 
              translateZ: 100,
              y: -20,
            }}
            animate={{ 
              opacity: 1, 
              rotateX: 0, 
              translateZ: 0,
              y: 0,
            }}
            exit={{ 
              opacity: 0, 
              rotateX: 90, 
              translateZ: 100,
              y: -20,
            }}
            transition={{ 
              duration: 0.7, // Slower, more physical page flip
              ease: [0.17, 0.84, 0.44, 1] // Elegant CSS-like easeOutQuint
            }}
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

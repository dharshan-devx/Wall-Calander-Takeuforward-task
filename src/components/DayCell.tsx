import { useState, memo, useRef, useEffect } from 'react';
import { isSameMonth, isToday, isSameDay, isAfter, isBefore, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { DayCellProps } from '@/types/calendarTypes';
import { getHoliday } from '@/lib/holidays';
import { resolveActiveRange } from '@/lib/calendarUtils';

const DayCell = memo(({
  date,
  currentMonth,
  hasNote,
  hasRangeNote,
  isFocused,
  startDate,
  endDate,
  hoveredDate,
  onDateClick,
  onDateHover,
  onDateFocus,
  onDateKeyDown,
  onDatePointerDown,
  onDatePointerUp,
}: DayCellProps) => {
  const [showTip, setShowTip] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused) cellRef.current?.focus({ preventScroll: true });
  }, [isFocused]);

  const isCurr = isSameMonth(date, currentMonth);
  const isTod  = isToday(date);
  const isStart = startDate ? isSameDay(date, startDate) : false;
  const isEnd   = endDate   ? isSameDay(date, endDate)   : false;
  const isEp     = isStart || isEnd;
  const isSingle = isStart && isEnd;
  const isWknd   = date.getDay() === 0 || date.getDay() === 6;
  const holiday  = isCurr ? getHoliday(date) : null;

  const activeRange = resolveActiveRange(startDate, endDate, hoveredDate);
  const lo = activeRange?.start ?? null;
  const hi = activeRange?.end ?? null;

  const inRange = lo && hi
    ? (isAfter(date, lo) || isSameDay(date, lo)) && (isBefore(date, hi) || isSameDay(date, hi))
    : false;

  const isRangeStart = lo ? isSameDay(date, lo) : false;
  const isRangeEnd   = hi ? isSameDay(date, hi) : false;

  const showHighlight  = isStart && !endDate && !hoveredDate;
  const isPreview      = !endDate && !!hoveredDate;
  const isPreviewEdge  = isPreview && (isRangeStart || isRangeEnd);

  // ── Text color Map ─────────────────────────────────────────
  let textColorClass = 'text-gray-900 dark:text-gray-100';
  if (!isEp && !showHighlight) {
    if (!isCurr) textColorClass = 'text-gray-300 dark:text-gray-600';
    else if (inRange && !isRangeStart && !isRangeEnd) textColorClass = 'text-gray-800 dark:text-gray-200';
    else if (isWknd) textColorClass = 'text-gray-400';
  }

  return (
    <div
      ref={cellRef}
      className="relative flex items-center justify-center cursor-pointer select-none group h-10 touch-manipulation"
      onClick={() => onDateClick(date)}
      onFocus={() => onDateFocus(date)}
      onPointerDown={(e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        onDatePointerDown?.(date);
      }}
      onPointerUp={(e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        onDatePointerUp?.(date);
      }}
      onPointerEnter={() => { onDateHover(date); setShowTip(true); }}
      onPointerLeave={() => setShowTip(false)}
      role="button"
      aria-selected={isEp || inRange}
      aria-current={isTod ? 'date' : undefined}
      tabIndex={isFocused ? 0 : -1}
      aria-label={`${format(date, 'MMMM d, yyyy')}${holiday ? ` — ${holiday.name}` : ''}`}
      onKeyDown={(e) => onDateKeyDown(e, date)}
    >
      {/* ── Today indicator ─────────────────── */}
      {isTod && !isEp && !showHighlight && (
        <span className="absolute inset-x-0 bottom-1.5 flex justify-center pointer-events-none">
          <span className="w-1 h-1 rounded-full bg-[var(--cal-accent)]" />
        </span>
      )}

      {/* ── Range Strip ─────────────────── */}
      {inRange && !isSingle && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-8 pointer-events-none transition-all duration-200 ${
            isRangeStart ? 'left-1/2 right-0 rounded-l-md' : 'left-0'
          } ${
            isRangeEnd ? 'right-1/2 left-0 rounded-r-md' : 'right-0'
          } ${
            !isRangeStart && !isRangeEnd ? 'left-0 right-0' : ''
          }`}
          style={{
            backgroundColor: 'var(--cal-accent)',
            opacity: isPreview ? 0.08 : 0.15,
          }}
        />
      )}

      {/* ── Day Number Circle ────────── */}
      <motion.div
        className={`relative z-10 flex items-center justify-center w-8 h-8 text-[13px] font-semibold rounded-full transition-shadow duration-200 ${
          isPreviewEdge && !isEp ? 'ring-2 ring-cal-accent/30 ring-offset-2 ring-offset-transparent' : ''
        } ${
          isTod && !isEp && !showHighlight ? 'font-bold' : ''
        } ${
          isFocused && !isEp ? 'ring-2 ring-gray-200 dark:ring-white/20' : ''
        } ${isEp || showHighlight ? 'text-white' : textColorClass}`}
        style={{
          backgroundColor: isEp || showHighlight ? 'var(--cal-accent)' : 'transparent',
          boxShadow: isEp || showHighlight ? '0 4px 10px var(--cal-accent-glow)' : 'none',
        }}
        whileHover={{
          scale: 1.05,
          backgroundColor: isEp || showHighlight ? 'var(--cal-accent)' : 'rgba(0,0,0,0.04)',
        }}
        whileTap={{ scale: 0.95 }}
      >
        {date.getDate()}
      </motion.div>

      {/* Star marker for Events/Notes */}
      {(hasNote || hasRangeNote) && isCurr && (
        <span className="absolute top-1 right-1 z-20 pointer-events-none leading-none text-[8px]" aria-hidden="true">
          ✦
        </span>
      )}

      {/* Holiday marker — simplified icon */}
      {holiday && isCurr && (
        <span className="absolute top-1.5 right-1.5 z-20 pointer-events-none leading-none text-[7px]" aria-hidden="true">
          ✨
        </span>
      )}



      {/* Holiday tooltip — Modern Apple-style UI */}
      <AnimatePresence>
        {holiday && showTip && (
          <motion.div
            className="absolute bottom-full mb-[14px] left-1/2 -translate-x-1/2 text-[11px] px-3.5 py-1.5 rounded-[10px] whitespace-nowrap z-[60] font-sans font-medium flex items-center justify-center gap-1.5"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackFilter: 'blur(16px)',
              color: '#0f172a',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
            }}
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="absolute top-full left-1/2 -translate-x-1/2"
              style={{ borderWidth: 5, borderStyle: 'solid', borderColor: 'transparent', borderTopColor: 'rgba(255,255,255,0.95)' }}
            />
            <span className="text-[13px] leading-none">{holiday.emoji}</span>
            <span className="tracking-wide">{holiday.name}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

DayCell.displayName = 'DayCell';
export default DayCell;

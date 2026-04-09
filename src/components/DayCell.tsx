import { useState, memo, useRef, useEffect } from 'react';
import { isSameMonth, isToday, isSameDay, isAfter, isBefore, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { DayCellProps } from '@/types/calendar';
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

  let textColorClass = 'text-gray-800 dark:text-gray-200';
  if (!isEp && !showHighlight) {
    if (!isCurr) textColorClass = 'text-gray-300/60 dark:text-gray-600/50';
    else if (inRange && !isRangeStart && !isRangeEnd) textColorClass = 'text-gray-900 dark:text-white';
    else if (isWknd) textColorClass = 'text-[var(--cal-accent)]/80';
  }

  let cellBg = 'bg-transparent';
  if (isEp || showHighlight) cellBg = 'bg-[var(--cal-accent)]';
  else if (inRange) cellBg = 'bg-[var(--cal-accent-glow)] rounded-none';

  return (
    <div
      ref={cellRef}
      className={`relative flex items-center justify-center cursor-pointer select-none group touch-manipulation h-10 sm:h-12 md:h-14 transition-all duration-300 outline-none focus:outline-none ${
        !isEp && !inRange ? 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04] rounded-full' : ''
      } ${showTip ? 'z-[100]' : 'z-10'}`}
      onClick={() => onDateClick(date)}
      onFocus={() => onDateFocus(date)}
      onPointerDown={(e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        onDatePointerDown(date);
      }}
      onPointerUp={(e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        onDatePointerUp(date);
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
      {inRange && !isSingle && (
        <div
          className={`absolute top-[2px] bottom-[2px] md:top-[4px] md:bottom-[4px] pointer-events-none transition-all duration-300 ease-out z-0 ${
            isRangeStart ? 'left-1/2 right-0 rounded-l-full' : 'left-0'
          } ${
            isRangeEnd ? 'right-1/2 left-0 rounded-r-full' : 'right-0'
          } ${
            !isRangeStart && !isRangeEnd ? 'left-0 right-0' : ''
          }`}
          style={{
            backgroundColor: 'var(--cal-accent)',
            opacity: isPreview ? 0.08 : 0.14,
          }}
        />
      )}

      <motion.div
        className={`relative z-10 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-[44px] md:h-[44px] rounded-full text-[14px] sm:text-[15px] md:text-[16px] transition-all duration-300 ease-out ${
          isPreviewEdge && !isEp ? 'ring-1 ring-[var(--cal-accent)]/40' : ''
        } ${
          isTod && !isEp && !showHighlight ? 'font-bold ring-1 ring-[var(--cal-accent)]' : 'font-medium'
        } ${
          isEp || showHighlight 
            ? 'bg-[var(--cal-accent)] text-white font-bold' 
            : textColorClass
        }`}
      >
        {date.getDate()}
      </motion.div>

      {/* Note indicator */}
      {(hasNote || hasRangeNote) && isCurr && (
        <span className="absolute top-1 right-1 z-20 pointer-events-none leading-none text-[8px]" aria-hidden="true">
          ✦
        </span>
      )}

      {holiday && isCurr && (
        <span className="absolute top-1.5 right-1.5 z-20 pointer-events-none leading-none text-[7px]" aria-hidden="true">
          ✨
        </span>
      )}

      <AnimatePresence>
        {holiday && showTip && (
          <motion.div
            className={`absolute bottom-full mb-[12px] text-[12px] px-4 py-2 rounded-xl z-[60] font-sans font-medium flex items-center justify-center gap-2 transform border border-white/10 dark:border-white/5 max-w-[220px] whitespace-normal text-center ${
              date.getDay() === 1 ? 'left-0 translate-x-0 origin-bottom-left text-left' :
              date.getDay() === 0 || date.getDay() === 6 ? 'right-0 translate-x-0 origin-bottom-right text-right' :
              'left-1/2 -translate-x-1/2 origin-bottom'
            }`}
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#ffffff',
              boxShadow: '0 20px 50px -12px rgba(0,0,0,0.7), 0 0 0 1px inset rgba(255,255,255,0.1)',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.94, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 4, scale: 0.98, filter: 'blur(2px)' }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className={`absolute top-[calc(100%-1px)] ${
                date.getDay() === 1 ? 'left-[20px] -translate-x-1/2' :
                date.getDay() === 0 || date.getDay() === 6 ? 'right-[20px] translate-x-1/2' :
                'left-1/2 -translate-x-1/2'
              }`}
              style={{ borderWidth: '6px 6px 0 6px', borderStyle: 'solid', borderColor: 'rgba(15, 23, 42, 0.88) transparent transparent transparent' }}
            />
            <span className="text-[14px] leading-none drop-shadow-md">{holiday.emoji}</span>
            <span className="tracking-wide text-white/90">{holiday.name}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

DayCell.displayName = 'DayCell';
export default DayCell;

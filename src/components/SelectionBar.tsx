'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useRangeSelection } from '@/hooks/useRangeSelection';
import { useNotes } from '@/hooks/useNotes';

export default function SelectionBar() {
  const { startDate, endDate, selectedDaysCount, clearSelection } = useRangeSelection();
  const { hasActiveRangeNote, openRangeNotes } = useNotes();

  if (!startDate || !endDate) return null;

  return (
    <motion.div
      className="mx-1.5 mb-1.5 px-4 md:px-5 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-white overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, rgba(36,88,220,0.94) 0%, rgba(22,60,185,0.92) 55%, rgba(28,75,210,0.90) 100%)',
        backdropFilter: 'blur(16px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.6)',
        border: '1px solid rgba(255,255,255,0.20)',
        boxShadow:
          '0 12px 40px rgba(31,80,199,0.38), 0 4px 12px rgba(31,80,199,0.22), inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -1px 0 rgba(0,0,0,0.12)',
      }}
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.24, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Shimmer edge highlight */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent 10%, rgba(255,255,255,0.45) 50%, transparent 90%)' }}
      />

      {/* Date info */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.20)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8"  y1="2" x2="8"  y2="6" />
            <line x1="3"  y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div>
          <div className="font-display text-[13.5px] md:text-[15px] font-semibold tracking-wide leading-tight">
            {format(startDate, 'MMMM d')} – {format(endDate, 'MMMM d, yyyy')}
          </div>
          <div className="font-mono text-[10px] tracking-wide mt-0.5" style={{ color: 'rgba(255,255,255,0.62)' }}>
            {selectedDaysCount} {selectedDaysCount === 1 ? 'day' : 'days'} selected
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={openRangeNotes}
          className="self-start sm:self-auto text-white text-[11px] font-body font-medium px-3.5 py-1.5 rounded-xl cursor-pointer outline-none min-h-8"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
          whileHover={{
            background: 'rgba(255,255,255,0.24)',
            y: -1,
            boxShadow: '0 4px 14px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.28)',
          }}
          whileTap={{ scale: 0.95, y: 0 }}
          transition={{ duration: 0.13 }}
        >
          {hasActiveRangeNote ? '📝 View note' : '+ Add note'}
        </motion.button>

        <motion.button
          onClick={clearSelection}
          className="self-start sm:self-auto text-white text-[11px] font-body font-medium px-3.5 py-1.5 rounded-xl cursor-pointer outline-none min-h-8"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid transparent',
          }}
          whileHover={{
            background: 'rgba(239,68,68,0.28)',
            borderColor: 'rgba(239,68,68,0.35)',
            y: -1,
          }}
          whileTap={{ scale: 0.95, y: 0 }}
          transition={{ duration: 0.13 }}
        >
          Clear ✕
        </motion.button>
      </div>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '@/hooks/useNotes';

const NOTE_LINES = 9;

function EmptyStateIcon() {
  return (
    <svg
      width="30" height="30"
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      className="text-cal-text-faint mb-3"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

export default function NotesPanel() {
  const {
    localVal,
    activeTab,
    dateKey,
    rangeKey,
    dateLabel,
    rangeLabel,
    setActiveTab,
    updateNote,
    clearNote,
  } = useNotes();

  const [savingStatus, setSavingStatus] = useState<'idle' | 'typing' | 'saved'>('idle');

  const handleUpdate = (val: string) => {
    setSavingStatus('typing');
    updateNote(val);
    
    // Debounced "Saved" feedback
    const timer = setTimeout(() => {
      setSavingStatus('saved');
      setTimeout(() => setSavingStatus('idle'), 2000);
    }, 800);
    return () => clearTimeout(timer);
  };

  const isDateDisabled  = !dateKey;
  const isRangeDisabled = !rangeKey;
  const activeKey   = activeTab === 'date' ? dateKey  : rangeKey;
  const isDisabled  = activeTab === 'date' ? isDateDisabled : isRangeDisabled;
  const displayLabel = activeTab === 'date' ? dateLabel : rangeLabel;

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.26em] text-cal-text-muted uppercase">
          Notes
        </span>
        <div className="flex items-center gap-1.5 h-3">
          <AnimatePresence mode="wait">
            {savingStatus === 'typing' && (
              <motion.span
                key="typing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-1.5 h-1.5 rounded-full bg-cal-accent animate-pulse"
              />
            )}
            {savingStatus === 'saved' && (
              <motion.span
                key="saved"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[9px] font-mono text-cal-accent font-bold"
              >
                Saved ✓
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sidebar Header */}
      <h2 className="text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-widest mb-6">
        Plan Schedule
      </h2>

      {/* Modern Segmented Control */}
      <div className="flex bg-gray-200/60 dark:bg-white/10 p-1 rounded-lg mb-6 w-full max-w-[240px]">
        {(['date', 'range'] as const).map(tab => {
          const isActive = activeTab === tab;
          const isTabDisabled = tab === 'date' ? isDateDisabled : isRangeDisabled;
          return (
            <button
              key={tab}
              onClick={() => !isTabDisabled ? setActiveTab(tab) : undefined}
              disabled={isTabDisabled}
              className={`flex-1 text-[12px] font-semibold rounded-md py-1.5 px-3 tracking-wide transition-all duration-200 outline-none ${
                isActive
                  ? 'bg-white dark:bg-[#1a2235] text-gray-900 dark:text-white shadow-sm'
                  : isTabDisabled
                    ? 'cursor-not-allowed opacity-40 text-gray-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer'
              }`}
            >
              {tab === 'date' ? 'Date' : 'Range'}
            </button>
          );
        })}
      </div>

      {/* Active Selection Display */}
      <div className="mb-4 mt-2 h-7 flex items-center">
        {activeKey ? (
          <p className="font-serif text-[18px] font-semibold text-gray-900 dark:text-gray-100 leading-snug tracking-tight truncate">
            {displayLabel}
          </p>
        ) : (
          <p className="font-body text-[13px] text-gray-400 leading-snug font-medium italic">
            No date selected directly
          </p>
        )}
      </div>

      {/* Clean Notepad Card */}
      <div className="flex-1 relative mt-2 flex flex-col group min-h-[220px]">
        <textarea
          disabled={isDisabled}
          value={localVal}
          onChange={(e) => handleUpdate(e.target.value)}
          placeholder={isDisabled ? "Select a date to begin writing..." : `Notes for ${displayLabel}...`}
          className="absolute inset-0 w-full h-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none resize-none transition-all duration-200 shadow-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 disabled:opacity-50 disabled:bg-gray-50"
        />
      </div>

      {/* Footer */}
      <div className="mt-2.5 flex justify-between items-center px-0.5">
        <motion.span
          className="font-mono text-[9px] tracking-wide tabular-nums uppercase opacity-60"
        >
          {localVal.length > 0 ? `${localVal.length.toLocaleString()} chars` : 'Ready to write'}
        </motion.span>
        <AnimatePresence>
          {localVal.length > 0 && (
            <motion.button
              onClick={clearNote}
              className="font-mono text-[9px] text-cal-text-muted uppercase tracking-[0.18em] bg-transparent border-none cursor-pointer hover:text-red-400 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.14 }}
            >
              clear
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

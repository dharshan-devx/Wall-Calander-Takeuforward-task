'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '@/hooks/useNotes';
import { useCalendarStore } from '@/store/calendarStore';
import { fromDateKey, toDateKey } from '@/lib/calendarUtils';
import { startOfMonth } from 'date-fns';

// ─── UTILS ─────────────────────────────────────────────────────────────────

const parseRecentNotes = (allNotes: Record<string, string>, prefix: string = '') => {
  return Object.entries(allNotes || {})
    .filter(([_, val]) => val.trim().length > 0)
    .map(([key, val]) => ({ 
      key: prefix + key, 
      rawKey: key, 
      isRange: prefix === 'R_',
      val, 
      snippet: val.slice(0, 32) + (val.length > 32 ? '...' : '') 
    }))
    .slice(0, 3); // Get top 3
};

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────

function ModeToggle({ activeTab, setActiveTab, isDateDisabled, isRangeDisabled }: any) {
  return (
    <div className="flex bg-gray-100/60 dark:bg-white/5 p-1 rounded-xl w-full max-w-full shadow-inner border border-gray-200/50 dark:border-white/5 mb-4 group h-9">
      {(['date', 'range'] as const).map(tab => {
        const isActive = activeTab === tab;
        const isDisabled = tab === 'date' ? isDateDisabled : isRangeDisabled;
        return (
          <button
            key={tab}
            onClick={() => !isDisabled ? setActiveTab(tab) : undefined}
            disabled={isDisabled}
            className={`flex-1 text-[12px] font-bold rounded-lg px-3 tracking-wide transition-all duration-300 outline-none relative z-10 flex flex-col justify-center items-center ${
              isActive
                ? 'bg-white dark:bg-[#2C2C2E] text-[var(--cal-accent)] shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                : isDisabled
                  ? 'cursor-not-allowed opacity-40 text-gray-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer hover:bg-gray-200/50 dark:hover:bg-white/5'
            }`}
          >
            {tab === 'date' ? 'Single Date' : 'Date Range'}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center flex-1 text-center px-4 min-h-[260px] bg-slate-50/50 dark:bg-white/[0.02] rounded-[16px] border border-dashed border-gray-200 dark:border-white/10"
    >
      <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 shadow-sm" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 mb-1.5">No date selected yet</h3>
      <p className="text-[13px] text-gray-400 dark:text-gray-500 mb-6 max-w-[200px] leading-relaxed">
        Pick a date to start capturing your thoughts and plans.
      </p>
      <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-xl text-[12px] font-bold opacity-60 cursor-not-allowed select-none">
        Choose Date on Calendar
      </div>
    </motion.div>
  );
}

function NotesEditor({ localVal, displayLabel, handleUpdate }: any) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expanding textarea based on scrollHeight
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset
      textareaRef.current.style.height = `${Math.max(160, textareaRef.current.scrollHeight)}px`;
    }
    handleUpdate(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col group min-h-[180px] rounded-[16px] bg-white dark:bg-[#12141A] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--cal-accent)]/50 focus-within:border-[var(--cal-accent)] focus-within:shadow-[0_8px_30px_-10px_var(--cal-accent-glow)]"
    >
      <div className="px-4 pt-4 pb-2 border-b border-gray-50 dark:border-white/[0.02] flex items-center justify-between">
        <span className="font-serif text-[18px] font-bold text-gray-900 dark:text-white leading-none">
          {displayLabel}
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--cal-accent)]/80 shadow-[0_0_8px_var(--cal-accent-glow)] animate-pulse" />
      </div>
      
      <div className="relative flex-1 p-4">
        {/* Lined notebook effect */}
        <div className="absolute inset-x-4 top-4 bottom-4 pointer-events-none opacity-[0.04] dark:opacity-[0.02]" 
             style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #000 27px, #000 28px)', backgroundSize: '100% 28px' }} />
        
        <textarea
          ref={textareaRef}
          value={localVal}
          onChange={handleInput}
          placeholder="What's on your mind for this day?"
          className="relative w-full min-h-[160px] bg-transparent text-[14px] leading-[28px] text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 outline-none resize-none"
          aria-label="Notes input"
        />
      </div>
    </motion.div>
  );
}

function ActionBar({ localVal, onSave, onClear, savingStatus }: any) {
  const hasContent = localVal.length > 0;
  
  return (
    <div className="mt-4 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-gray-100 dark:border-white/5">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] tracking-wider uppercase text-gray-400 dark:text-gray-500 font-semibold px-2">
          {localVal.length.toLocaleString()} chars
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {hasContent && (
          <button
            onClick={() => {
              if (window.confirm('Delete this note permanently?')) {
                onClear();
              }
            }}
            className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
            title="Delete Note"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            Delete
          </button>
        )}
        <button
          onClick={onSave}
          disabled={!hasContent || savingStatus !== 'idle'}
          className={`relative text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all flex items-center justify-center min-w-[80px] overflow-hidden ${
            !hasContent
              ? 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : savingStatus === 'saved'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-[var(--cal-accent)] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
          }`}
        >
          <AnimatePresence mode="wait">
            {savingStatus === 'loading' ? (
              <motion.span key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center gap-1">
                Saving...
              </motion.span>
            ) : savingStatus === 'saved' ? (
              <motion.span key="saved" initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} className="flex items-center gap-1">
                Saved ✓
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{y:10,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-10,opacity:0}}>
                Save Note
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

function RecentNotesList({ allNotes, onSelectNote }: any) {
  const recentDays = parseRecentNotes(allNotes?.dates || {}, '');
  const recentRanges = parseRecentNotes(allNotes?.ranges || {}, 'R_');
  const combined = [...recentDays, ...recentRanges].slice(0, 15);

  if (combined.length === 0) return null;

  return (
    <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5">
      <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-3 px-1">
        Recent Activity
      </h3>
      <div className="flex flex-col gap-2">
        {combined.map((note) => (
          <div 
            key={note.key} 
            onClick={() => onSelectNote(note.rawKey, note.isRange)}
            className="p-3 bg-white dark:bg-[#12141A] rounded-xl border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[var(--cal-accent)]/30 hover:shadow-sm transition-all group"
          >
            <p className="font-mono text-[10px] text-[var(--cal-accent)] mb-1 uppercase tracking-wider">{note.key.replace('R_', 'Range: ')}</p>
            <p className="text-[12px] text-gray-600 dark:text-gray-300 truncate leading-snug">{note.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ORCHESTRATOR ────────────────────────────────────────────────────

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
    allNotes,
  } = useNotes();

  const [savingStatus, setSavingStatus] = useState<'idle' | 'loading' | 'saved'>('idle');

  const isDateDisabled  = !dateKey;
  const isRangeDisabled = !rangeKey;
  const activeKey   = activeTab === 'date' ? dateKey  : rangeKey;
  const displayLabel = activeTab === 'date' ? dateLabel : rangeLabel;

  // Fake save simulation for premium UX
  const handleSave = () => {
    setSavingStatus('loading');
    updateNote(localVal);
    // Fake network delay
    setTimeout(() => {
      setSavingStatus('saved');
      setTimeout(() => setSavingStatus('idle'), 2000);
    }, 600);
  };

  // Intermediate state for auto-sync without loading indicator
  const handleUpdate = (val: string) => {
    updateNote(val);
  };

  const handleSelectRecent = (rawKey: string, isRange: boolean) => {
    const store = useCalendarStore.getState();
    store.clearSelection();
    
    if (isRange) {
      const [startStr, endStr] = rawKey.split('_');
      const sd = fromDateKey(startStr);
      const ed = fromDateKey(endStr);
      if (sd && ed) {
        store.setRange(sd, ed);
        store.setActiveTab('range');
        store.goToMonth(sd.getMonth());
      }
    } else {
      const d = fromDateKey(rawKey);
      if (d) {
        store.handleDateClick(d);
        store.setActiveTab('date');
        store.goToMonth(d.getMonth());
      }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden pr-2 -mr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-black/20 pb-4">

      {/* Guided Workflow UI Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="font-sans text-[9px] font-extrabold tracking-[0.25em] text-gray-400 dark:text-gray-500 uppercase leading-none block mb-1.5 focus:outline-none">
            WORKFLOW
          </span>
          <h2 className="text-[14px] font-bold text-gray-800 dark:text-gray-100 tracking-wide leading-none">
            Capture Thoughts
          </h2>
        </div>
        
        {/* Step Indicator */}
        <div className="flex gap-1.5">
          <div className="h-1.5 w-4 rounded-full bg-[var(--cal-accent)] transition-all" />
          <div className={`h-1.5 rounded-full transition-all duration-500 ${activeKey ? 'w-4 bg-[var(--cal-accent)]' : 'w-1.5 bg-gray-200 dark:bg-white/10'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-500 ${localVal ? 'w-4 bg-[var(--cal-accent)]' : 'w-1.5 bg-gray-200 dark:bg-white/10'}`} />
        </div>
      </div>

      <ModeToggle 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDateDisabled={isDateDisabled} 
        isRangeDisabled={isRangeDisabled} 
      />

      <AnimatePresence mode="wait">
        {!activeKey ? (
          <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div key="editor" className="flex flex-col flex-1" initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} exit={{opacity:0, y: -10}}>
            <NotesEditor 
              localVal={localVal} 
              displayLabel={displayLabel} 
              handleUpdate={handleUpdate} 
            />
            
            <ActionBar 
              localVal={localVal} 
              onSave={handleSave} 
              onClear={clearNote} 
              savingStatus={savingStatus} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!activeKey && <RecentNotesList allNotes={allNotes} onSelectNote={handleSelectRecent} />}

    </div>
  );
}

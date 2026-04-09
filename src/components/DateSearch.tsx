'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as chrono from 'chrono-node';
import { format } from 'date-fns';
import { useCalendar } from '@/hooks/useCalendar';

export default function DateSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [parsedDate, setParsedDate] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { jumpToDate } = useCalendar();

  useEffect(() => {
    if (query.trim().length > 2) {
      const results = chrono.parse(query);
      if (results.length > 0) {
        setParsedDate(results[0].start.date());
      } else {
        setParsedDate(null);
      }
    } else {
      setParsedDate(null);
    }
  }, [query]);

  const handleSearch = () => {
    if (parsedDate) {
      jumpToDate(parsedDate);
      setQuery('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setQuery('');
    }
  };

  useEffect(() => {
    if (isExpanded) inputRef.current?.focus();
  }, [isExpanded]);

  return (
    <div className="relative w-full max-w-[600px] flex flex-col items-center">
      <div 
        className={`flex items-center w-full transition-all duration-300 ${
          isExpanded 
            ? 'bg-blue-50/80 dark:bg-blue-500/10 shadow-2xl ring-2 ring-blue-500/30 dark:ring-blue-400/20' 
            : 'bg-white/50 dark:bg-[#2A2A2D]/50 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 shadow-sm border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20'
        } rounded-full px-5 py-2.5 cursor-text`}
        onClick={() => setIsExpanded(true)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${isExpanded ? 'text-blue-500' : 'text-gray-400'} shrink-0 transition-colors`}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Jump to Year Month Date (e.g. 2026 April 15)"
          className="flex-1 bg-transparent px-4 py-1 text-[15px] font-medium outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
        />

        {isExpanded && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); setQuery(''); }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && parsedDate && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 right-0 z-50 pt-2"
          >
            <div 
              onClick={handleSearch}
              className="bg-white dark:bg-[#2A2A2D] border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-2xl cursor-pointer hover:border-[var(--cal-accent)]/50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--cal-accent)]/10 flex items-center justify-center text-[var(--cal-accent)] font-bold">
                    <span className="text-sm">{format(parsedDate, 'd')}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                      {format(parsedDate, 'yyyy MMMM do')}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                      {format(parsedDate, 'EEEE')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[var(--cal-accent)] font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Jump to Date →
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

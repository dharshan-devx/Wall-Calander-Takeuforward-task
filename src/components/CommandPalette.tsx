'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { goToMonth, clearSelection, toggleDarkMode } = useCalendar();
  const { clearNote, localVal } = useNotes();

  // Open palette with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  type Action = { id: string; label: string; icon: string; onAction: () => void; category: string };

  const actions: Action[] = [
    { id: 'today', category: 'Navigation', label: 'Jump to Today', icon: '📍', onAction: () => { goToMonth(new Date().getMonth()); setIsOpen(false); } },
    { id: 'dark', category: 'System', label: 'Toggle Dark Mode', icon: '🌗', onAction: () => { toggleDarkMode(); setIsOpen(false); } },
    { id: 'clear_sel', category: 'Calendar', label: 'Clear Date Selection', icon: '✕', onAction: () => { clearSelection(); setIsOpen(false); } },
    { id: 'clear_note', category: 'Notes', label: 'Clear Current Note', icon: '🗑', onAction: () => { clearNote(); setIsOpen(false); } },
    
    // Jump to specific months
    ...[
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ].map((m, i) => ({
      id: `jump_${m.toLowerCase()}`,
      category: 'Navigation',
      label: `Go to ${m}`,
      icon: '🗓',
      onAction: () => { goToMonth(i); setIsOpen(false); }
    }))
  ];

  const filtered = actions.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handleNav = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => (i + 1) % filtered.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => (i - 1 + filtered.length) % filtered.length);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        filtered[activeIndex]?.onAction();
      }
    };
    window.addEventListener('keydown', handleNav);
    return () => window.removeEventListener('keydown', handleNav);
  }, [isOpen, filtered, activeIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 font-body">
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
        
        <motion.div 
          className="relative w-full max-w-xl bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-white/5">
            <span className="text-gray-400 mr-3 text-lg">🔍</span>
            <input 
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent w-full text-gray-800 dark:text-gray-100 placeholder-gray-400 text-sm outline-none font-medium"
              placeholder="Type a command or search... (e.g., 'Dark Mode', 'July')"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 dark:bg-white/10 py-1 px-2 rounded">ESC</span>
          </div>
          
          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8 italic">No results.</p>
            ) : (
              filtered.map((action, i) => (
                <div 
                  key={action.id}
                  onClick={action.onAction}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors duration-100 ${
                    i === activeIndex 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg leading-none opacity-80">{action.icon}</span>
                    <span className={`text-sm font-medium ${i === activeIndex ? 'text-white' : ''}`}>{action.label}</span>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${i === activeIndex ? 'text-blue-100' : 'text-gray-400'}`}>
                    {action.category}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

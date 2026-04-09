'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendar } from '@/hooks/useCalendar';

const features = [
  {
    title: 'Dynamic Selection',
    description: 'Click any date to select a single day, or click and drag across multiple dates to define a schedule range instantly.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8"  y2="6"/>
        <line x1="3"  y1="10" x2="21" y2="10"/>
      </svg>
    )
  },
  {
    title: 'Contextual Notes',
    description: 'Use the sidebar to capture plans for your selection. The interface intelligently switches between single-day and range-based notes.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    )
  },
  {
    title: 'Universal Search',
    description: 'Press Cmd+K (or Ctrl+K) from anywhere to open the command palette. Navigate, clear selections, or toggle theme with speed.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    )
  }
];

export default function OnboardingModal() {
  const { showOnboarding, completeOnboarding } = useCalendar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {showOnboarding && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={completeOnboarding}
            className="fixed inset-0 z-[100] bg-black/10 dark:bg-black/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} 
              className="pointer-events-auto w-full max-w-[440px] bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-2xl rounded-[24px] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.15)] relative border border-white/20 dark:border-white/5"
            >
              <div className="relative z-10 flex flex-col h-full">
                <header className="mb-8">
                  <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[var(--cal-accent)] mb-2 block">Quick Start</span>
                  <h2 className="font-sans text-[24px] font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-1">
                    How to use
                  </h2>
                  <p className="font-sans text-[14px] text-gray-500 dark:text-gray-400">
                    Master the interface in three simple steps.
                  </p>
                </header>

                <div className="flex flex-col gap-8 mb-8">
                  {features.map((f) => (
                    <div key={f.title} className="flex gap-4 items-start group">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 flex items-center justify-center text-[var(--cal-accent)] shrink-0 transition-all group-hover:bg-[var(--cal-accent)] group-hover:text-white group-hover:scale-105 shadow-sm">
                        {f.icon}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <h3 className="font-sans font-bold text-gray-900 dark:text-gray-100 text-[15px] mb-1 tracking-tight">
                          {f.title}
                        </h3>
                        <p className="font-sans text-gray-500 dark:text-gray-400 text-[13px] leading-relaxed opacity-80">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={completeOnboarding}
                    className="w-full py-3.5 rounded-xl font-sans text-[13px] font-bold tracking-widest uppercase text-white bg-gray-900 hover:bg-black dark:bg-white dark:text-black transition-all shadow-xl active:scale-[0.98]"
                  >
                    Got it, let&apos;s go
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

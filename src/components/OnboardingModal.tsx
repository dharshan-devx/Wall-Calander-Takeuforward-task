'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendar } from '@/hooks/useCalendar';

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    title: 'Local environment',
    description: 'This is a strictly frontend application. All calendar dates and notes are saved exclusively to your browser\'s native storage. Nothing is sent to any external servers.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Interaction design',
    description: 'Click and drag across dates to select a range. The interface automatically adapts between single-day entry and multi-day sequence planning without manual toggles.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    ),
    title: 'Performance & state',
    description: 'Built on Next.js 14 and Zustand. The calendar runs at a locked 60fps using tailored Framer Motion physics to eliminate layout shifts.',
  },
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
          {/* Subtle minimal backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={completeOnboarding}
            className="fixed inset-0 z-[100] bg-black/10 dark:bg-black/40 backdrop-blur-sm"
          />

          {/* Minimalist Dialog */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} 
              className="pointer-events-auto w-full max-w-[480px] bg-white dark:bg-[#111111] rounded-2xl p-8 shadow-2xl relative border border-gray-100 dark:border-white/5"
            >
              <div className="relative z-10 flex flex-col h-full">
                <header className="mb-8">
                  <h2 className="font-sans text-[22px] font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-1">
                    About this project
                  </h2>
                  <p className="font-sans text-[14px] text-gray-500 dark:text-gray-400">
                    A frontend schedule interface designed for the TUF showcase.
                  </p>
                </header>

                <div className="flex flex-col gap-8 mb-10">
                  {features.map((f) => (
                    <div key={f.title} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300 shrink-0">
                        {f.icon}
                      </div>
                      <div className="pt-1.5 flex-1 leading-tight">
                        <h3 className="font-sans font-semibold text-gray-900 dark:text-gray-100 text-[14px] mb-1.5">
                          {f.title}
                        </h3>
                        <p className="font-sans text-gray-500 dark:text-gray-400 text-[13px] leading-[1.6]">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-6 flex justify-end">
                  <button
                    onClick={completeOnboarding}
                    className="px-6 py-2.5 rounded-lg font-sans text-[13px] font-medium tracking-wide text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 active:scale-95 transition-all outline-none focus:ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#111111]"
                  >
                    Close
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

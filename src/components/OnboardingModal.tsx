'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendar } from '@/hooks/useCalendar';

const features = [
  {
    icon: '📅',
    title: 'Range Selection',
    description: 'Click a start date, then click an end date to select a range. Click again to reset.',
  },
  {
    icon: '📝',
    title: 'Smart Notes',
    description: 'Add specific notes for individual dates or the entire selected range in the left panel.',
  },
  {
    icon: '🎨',
    title: 'Premium UI',
    description: 'Experience a glassmorphic design that adapts to your environment with fluid transitions.',
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    description: 'Switch between light and dark themes using the moon/sun icon in the top binder.',
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={completeOnboarding}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4">
            <motion.div
              // Mac-style "Genie/Folder" animation
              // Expands from the top-left where the help button is
              initial={{ 
                opacity: 0, 
                scale: 0.2, 
                x: -200, 
                y: -300,
                filter: 'blur(10px)',
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x: 0, 
                y: 0,
                filter: 'blur(0px)',
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.2, 
                x: -200, 
                y: -300,
                filter: 'blur(10px)',
                transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] } 
              }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 200,
                mass: 0.8
              }}
              className="pointer-events-auto w-full max-w-lg glass-card rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
              style={{
                background: 'var(--glass-bg-strong)',
                backdropFilter: 'blur(24px) saturate(1.8)',
                border: '1px solid var(--glass-border)',
              }}
            >
              {/* Decorative gradient orb */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-cal-accent/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <header className="mb-8">
                  <h2 className="font-display text-3xl font-bold text-cal-text-primary mb-2">
                    Welcome to Wall Calendar
                  </h2>
                  <p className="font-body text-cal-text-muted text-sm">
                    A premium, interactive experience for your dates and plans.
                  </p>
                </header>

                <div className="grid gap-6 mb-10">
                  {features.map((f) => (
                    <div key={f.title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0 shadow-inner">
                        {f.icon}
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-cal-text-primary text-sm mb-1">
                          {f.title}
                        </h3>
                        <p className="font-body text-cal-text-muted text-[12px] leading-relaxed">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={completeOnboarding}
                  className="w-full glass-btn py-4 rounded-2xl font-display font-bold text-cal-text-primary border-none shadow-lg tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--cal-accent) 0%, #1a44c0 100%)',
                    color: 'white',
                    boxShadow: '0 8px 24px -8px var(--cal-accent)',
                  }}
                >
                  Start Planning
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

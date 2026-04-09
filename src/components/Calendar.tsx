'use client';

import { useEffect, useState } from 'react';
import { getMonth, format } from 'date-fns';
import { HERO_IMAGES } from '@/lib/calendarUtils';
import SpiralBinding from './SpiralBinding';
import HeroSection from './HeroSection';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import CommandPalette from './CommandPalette';
import OnboardingModal from './OnboardingModal';
import { useCalendar } from '@/hooks/useCalendar';

export default function Calendar() {
  const { 
    currentMonth, 
    darkMode, 
    hasSeenOnboarding, 
    setShowOnboarding,
    startDate,
    endDate,
    selectedDaysCount,
    clearSelection,
    toggleDarkMode
  } = useCalendar();
  const [mounted, setMounted] = useState(false);

  const monthIdx = getMonth(currentMonth);
  const hero = HERO_IMAGES[monthIdx];

  useEffect(() => {
    setMounted(true);
    // Auto-trigger onboarding only exactly once on mount if they haven't seen it
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setShowOnboarding(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync dark mode globally to the HTML document tag so the background color transitions correctly
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode, mounted]);

  if (!mounted) {
    return (
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-0">
        <div className="w-full h-[640px] rounded-3xl glass-card animate-pulse" />
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-6xl mx-auto px-2 sm:px-0 transition-all duration-700"
      style={{
        // @ts-ignore
        '--cal-accent': hero.accent,
        '--cal-accent-glow': `${hero.accent}33`, // 20% opacity
        '--hero-color': hero.color,
      }}
    >
      <OnboardingModal />
      <CommandPalette />
      {/* Calendar layout wraps the binder rings and the main card */}
      <div className="relative">

        {/* Main glass card */}
        <div className="relative glass-card rounded-3xl overflow-hidden transition-all duration-500 pb-1">
          <SpiralBinding />
          <HeroSection />

          {/* Body row - Modern Dashboard Split view */}
          <div className="flex flex-col md:flex-row bg-white dark:bg-[#0a0f18] min-h-[400px]">

            {/* Sidebar column (Notes) */}
            <div
              className="order-2 md:order-1 md:w-[360px] lg:w-[440px] flex-shrink-0 p-5 sm:p-6 md:p-8 bg-gray-50 dark:bg-white/[0.02] border-t md:border-t-0 md:border-r border-gray-100 dark:border-white/5"
            >
              <NotesPanel />
            </div>

            {/* Calendar grid column - We will make this the flat clean section */}
            <div
              className="order-1 md:order-2 flex-1 p-4 sm:p-5 md:p-8 lg:p-10 flex justify-center bg-white dark:bg-[#0a0f18]"
            >
              <div className="w-full max-w-[850px] mx-auto flex flex-col justify-center h-full">
                <CalendarGrid />
              </div>
            </div>
          </div>

          {/* Responsive Contextual Action Footer */}
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 md:px-10 py-5 bg-[var(--cal-surface)] border-t border-[var(--glass-border)] relative gap-4"
          >
            {/* Left Box: Dynamic Selection Overview */}
            <div className="flex items-center gap-3 relative z-10 w-full sm:w-[35%]">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500"
                style={{ 
                  background: (startDate || endDate) ? 'var(--cal-accent-glow)' : 'var(--glass-bg-dim)',
                  border: `1px solid ${(startDate || endDate) ? 'var(--cal-accent)' : 'var(--glass-border-sub)'}`
                }}
              >
                <span className="text-[14px]">{(startDate || endDate) ? '✔️' : '📅'}</span>
              </div>
              
              <div className="flex flex-col justify-center min-w-0">
                {startDate && endDate ? (
                   <p className="text-cal-text-primary font-semibold text-xs sm:text-[13px] animate-fade-in flex items-center whitespace-nowrap">
                     {format(startDate, 'MMM do')} <span className="mx-2 text-cal-text-faint font-normal transform -translate-y-[1px]">→</span> {format(endDate, 'MMM do')}
                   </p>
                ) : startDate ? (
                   <p className="text-cal-text-primary font-semibold text-xs sm:text-[13px] animate-fade-in flex items-center whitespace-nowrap">
                     {format(startDate, 'MMM do')} <span className="mx-2 text-cal-text-faint font-normal transform -translate-y-[1px]">→</span> <span className="text-cal-text-muted font-normal">End date</span>
                   </p>
                ) : (
                   <p className="text-cal-text-muted text-xs sm:text-sm italic font-medium whitespace-nowrap">
                     Select a date to begin
                   </p>
                )}
                
                {selectedDaysCount > 0 && (
                  <p className="text-[10px] text-cal-text-muted font-mono uppercase tracking-wider mt-0.5 animate-fade-in truncate">
                    {selectedDaysCount} Day{selectedDaysCount > 1 ? 's' : ''} Selected
                  </p>
                )}
              </div>
            </div>

            {/* Absolute Center Box: Dark Mode Toggle */}
            <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
              <button 
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center bg-white dark:bg-[#2A2A2D] hover:bg-gray-50 dark:hover:bg-[#343438] transition-all border border-gray-100 dark:border-white/10 text-lg active:scale-95 group"
                aria-label="Toggle Theme"
                title="Toggle Dark Mode"
              >
                <span className="transform group-hover:rotate-12 transition-transform duration-300">
                  {darkMode ? '☀️' : '🌙'}
                </span>
              </button>
            </div>

            {/* Right Box: Actions */}
            <div className="flex items-center gap-3 sm:justify-end sm:w-[35%] relative z-10">
              {/* Mobile dark mode (hidden on dekstop) */}
              <button 
                onClick={toggleDarkMode}
                className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#2A2A2D] border border-gray-100 dark:border-white/10 text-sm active:scale-95"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              <div className="sm:hidden w-px h-6 bg-gradient-to-b from-transparent via-[var(--glass-border-sub)] to-transparent" />
              
              <button 
                onClick={() => setShowOnboarding(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 border border-transparent text-xs font-mono font-bold hover:shadow-lg hover:scale-105 active:scale-95 transition-all ml-auto sm:ml-0"
                aria-label="How to use"
                title="Help / How to use"
              >
                ?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

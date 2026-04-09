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
              className="order-2 md:order-1 md:w-80 lg:w-[340px] flex-shrink-0 p-6 md:p-8 bg-gray-50 dark:bg-white/[0.02] border-r border-gray-100 dark:border-white/5"
            >
              <NotesPanel />
            </div>

            {/* Calendar grid column */}
            <div
              className="order-1 md:order-2 flex-1 p-6 md:p-10 lg:p-12 flex justify-center"
            >
              <div className="w-full max-w-[500px]">
                <CalendarGrid />
              </div>
            </div>
          </div>

          {/* Responsive Contextual Action Footer */}
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 md:px-10 py-5 bg-[var(--cal-surface)] border-t border-[var(--glass-border)]"
          >
            {/* Left: Dynamic Selection Overview */}
            <div className="flex items-center gap-3">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500"
                style={{ 
                  background: (startDate || endDate) ? 'var(--cal-accent-glow)' : 'var(--glass-bg-dim)',
                  border: `1px solid ${(startDate || endDate) ? 'var(--cal-accent)' : 'var(--glass-border-sub)'}`
                }}
              >
                <span className="text-[14px]">{(startDate || endDate) ? '✔️' : '📅'}</span>
              </div>
              
              <div className="flex flex-col justify-center">
                {startDate && endDate ? (
                   <p className="text-cal-text-primary font-semibold text-xs sm:text-[13px] animate-fade-in flex items-center">
                     {format(startDate, 'MMM do, yyyy')} <span className="mx-2 text-cal-text-faint font-normal transform -translate-y-[1px]">→</span> {format(endDate, 'MMM do, yyyy')}
                   </p>
                ) : startDate ? (
                   <p className="text-cal-text-primary font-semibold text-xs sm:text-[13px] animate-fade-in flex items-center">
                     {format(startDate, 'MMM do, yyyy')} <span className="mx-2 text-cal-text-faint font-normal transform -translate-y-[1px]">→</span> <span className="text-cal-text-muted font-normal">Select end date</span>
                   </p>
                ) : (
                   <p className="text-cal-text-muted text-xs sm:text-sm italic font-medium">
                     Select a date range to begin planning
                   </p>
                )}
                
                {selectedDaysCount > 0 && (
                  <p className="text-[10px] text-cal-text-muted font-mono uppercase tracking-wider mt-0.5 animate-fade-in">
                    {selectedDaysCount} Day{selectedDaysCount > 1 ? 's' : ''} Selected
                  </p>
                )}
              </div>
            </div>

            {/* Right: Quick Controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto pt-1 sm:pt-0">
              {startDate && (
                <button 
                  onClick={clearSelection}
                  className="px-3 py-1.5 rounded-md text-[11px] font-semibold text-cal-text-muted hover:bg-[var(--cal-bg)] hover:text-cal-text-primary transition-all border border-transparent active:scale-95"
                >
                  Clear Selection
                </button>
              )}
              
              <div className="w-px h-6 mx-1 bg-gradient-to-b from-transparent via-[var(--glass-border-sub)] to-transparent" />
              
              <button 
                onClick={toggleDarkMode}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--glass-bg-subtle)] transition-all border border-transparent hover:border-[var(--glass-border-sub)] text-sm active:scale-95"
                aria-label="Toggle Theme"
                title="Toggle Dark Mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              <button 
                onClick={() => setShowOnboarding(true)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--glass-bg-subtle)] transition-all border border-transparent hover:border-[var(--glass-border-sub)] text-xs font-mono font-bold text-cal-text-muted hover:text-cal-text-primary active:scale-95"
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

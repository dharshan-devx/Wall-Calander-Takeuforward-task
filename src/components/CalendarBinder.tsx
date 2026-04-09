'use client';

import { useCalendar } from '@/hooks/useCalendar';

function SpiralHoles() {
  return (
    <div className="wire-o-wrapper">
      {/* 14 Left Loops */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={`left-${i}`} className="wire-o-hole" />
      ))}

      {/* Center Hanger Notch */}
      <div className="hanger-cutout">
        <div className="hanger-wire" />
      </div>

      {/* 14 Right Loops */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={`right-${i}`} className="wire-o-hole" />
      ))}
    </div>
  );
}

export default function CalendarBinder() {
  const { year, darkMode, toggleDarkMode, showOnboarding, setShowOnboarding } = useCalendar();

  return (
    <div
      className="rounded-t-3xl flex items-center justify-between px-5 md:px-6 py-2.5"
      style={{
        background: 'var(--glass-bg-subtle)',
        backdropFilter: 'blur(12px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.5)',
        border: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border-sub)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)',
      }}
    >
      {/* Brand label */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] tracking-[.28em] text-cal-text-muted uppercase font-medium select-none whitespace-nowrap">
          Wall Calendar<span className="text-cal-text-faint mx-1.5">·</span>{year}
        </span>
        

      </div>

      <SpiralHoles />

      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="glass-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-body tracking-wide text-cal-text-secondary hover:text-cal-text-primary select-none"
        aria-label="Toggle light or dark theme"
        style={{ minHeight: 30 }}
      >
        <span className="text-[12px] leading-none">{darkMode ? '☀️' : '🌙'}</span>
        <span>{darkMode ? 'Light' : 'Dark'}</span>
      </button>
    </div>
  );
}

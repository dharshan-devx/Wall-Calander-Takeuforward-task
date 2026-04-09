'use client';

import { getMonth, format } from 'date-fns';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HERO_IMAGES } from '@/lib/calendarUtils';
import { useCalendar } from '@/hooks/useCalendar';

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

const QUOTES = [
  { text: "A new year: another chance to completely ignore your resolutions.", type: "Humor" },
  { text: "Motivation gets you started. Habit is what keeps you going.", type: "Psychology" },
  { text: "Spring is nature’s way of saying, 'Let's party!'", type: "Humor" },
  { text: "Perfectionism is just procrastination with better branding.", type: "Psychology" },
  { text: "If Plan A fails, remember there are 25 more letters.", type: "Motivation" },
  { text: "Sunlight is the best physiological reset button. Go outside.", type: "Psychology" },
  { text: "You can't pour from an empty cup. Take a break.", type: "Motivation" },
  { text: "A year from now, you will wish you had started today.", type: "Motivation" },
  { text: "The mind is everything. What you think, you become.", type: "Psychology" },
  { text: "Don't take life too seriously. You won't get out of it alive.", type: "Humor" },
  { text: "Gratitude turns what we currently have into enough.", type: "Psychology" },
  { text: "The only time to look back is to see how far you've come.", type: "Motivation" },
];


function QuoteWidget() {
  const { currentMonth } = useCalendar();
  const idx = getMonth(currentMonth);
  const quote = QUOTES[idx];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-8 md:px-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 12, scale: 0.96, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, scale: 1.02, filter: 'blur(5px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-2xl text-center mt-6"
        >
          {/* Elegantly styled, calm, central quote text */}
          <p
            className="font-serif italic text-[18px] sm:text-[22px] md:text-[26px] leading-relaxed text-white/95"
            style={{
              textShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)',
              letterSpacing: '0.04em',
              fontWeight: 300
            }}
          >
            "{quote.text}"
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function HeroSection() {
  const { currentMonth, goToPrevMonth, goToNextMonth, goToMonth } = useCalendar();

  const idx = getMonth(currentMonth);
  const hero = HERO_IMAGES[idx];

  return (
    <div className="relative overflow-hidden h-64 md:h-[268px] group">

      {/* ── Photo layer — Ken Burns transition ─────────── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={hero.url}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={hero.url}
            alt={hero.location}
            fill
            className="object-cover"
            priority
            sizes="900px"
          />

          {/* ── Live Wallpaper Overlay ── */}
          {hero.videoUrl && (
            <motion.video
              key={`video-${hero.videoUrl}`}
              src={hero.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Ambient breathe — animated color wash ──────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none hero-ambient"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 25% 35%, rgba(59,130,246,0.22) 0%, transparent 65%)',
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── Primary darkening overlay ───────────────────── */}
      <div className="hero-overlay absolute inset-0" />

      {/* ── Frosted glass strip — top nav zone ────────── */}
      <div
        className="absolute top-0 inset-x-0 h-[58px] pointer-events-none z-[4]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 100%)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        }}
      />

      {/* ── Multi-Color Realistic Beach Waves ─────────────────────── */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full z-[4] transition-transform duration-700 ease-out origin-bottom group-hover:scale-y-125 pointer-events-none"
        style={{ height: '76px', filter: 'drop-shadow(0px -4px 16px rgba(2, 132, 199, 0.3))' }}
        viewBox="0 0 600 66"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beachDeep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2563eb" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="beachMid" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="beachFoam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        
        {/* Back wave: deep water */}
        <motion.path
          fill="url(#beachDeep)"
          style={{ mixBlendMode: 'multiply' }}
          animate={{ 
            x: [0, -600],
            d: [
              "M 0 35 Q 150 10 300 35 T 600 35 T 900 35 T 1200 35 L 1200 66 L 0 66 Z",
              "M 0 35 Q 150 25 300 35 T 600 35 T 900 35 T 1200 35 L 1200 66 L 0 66 Z",
              "M 0 35 Q 150 -5 300 35 T 600 35 T 900 35 T 1200 35 L 1200 66 L 0 66 Z",
              "M 0 35 Q 150 10 300 35 T 600 35 T 900 35 T 1200 35 L 1200 66 L 0 66 Z"
            ]
          }}
          transition={{ x: { repeat: Infinity, duration: 25, ease: "linear" }, d: { repeat: Infinity, duration: 8, ease: "easeInOut" } }}
        />
        
        {/* Mid wave: bright turquoise */}
        <motion.path
          fill="url(#beachMid)"
          style={{ mixBlendMode: 'overlay' }}
          animate={{ 
            x: [-600, 0],
            d: [
              "M 0 45 Q 150 25 300 45 T 600 45 T 900 45 T 1200 45 L 1200 66 L 0 66 Z",
              "M 0 45 Q 150 10 300 45 T 600 45 T 900 45 T 1200 45 L 1200 66 L 0 66 Z",
              "M 0 45 Q 150 35 300 45 T 600 45 T 900 45 T 1200 45 L 1200 66 L 0 66 Z",
              "M 0 45 Q 150 25 300 45 T 600 45 T 900 45 T 1200 45 L 1200 66 L 0 66 Z"
            ]
          }}
          transition={{ x: { repeat: Infinity, duration: 32, ease: "linear" }, d: { repeat: Infinity, duration: 11, ease: "easeInOut" } }}
        />

        {/* Front wave: white foam cap */}
        <motion.path
          fill="url(#beachFoam)"
          style={{ mixBlendMode: 'soft-light' }}
          animate={{ 
            x: [0, -600],
            d: [
              "M 0 48 Q 150 35 300 48 T 600 48 T 900 48 T 1200 48 L 1200 66 L 0 66 Z",
              "M 0 48 Q 150 45 300 48 T 600 48 T 900 48 T 1200 48 L 1200 66 L 0 66 Z",
              "M 0 48 Q 150 25 300 48 T 600 48 T 900 48 T 1200 48 L 1200 66 L 0 66 Z",
              "M 0 48 Q 150 35 300 48 T 600 48 T 900 48 T 1200 48 L 1200 66 L 0 66 Z"
            ]
          }}
          transition={{ x: { repeat: Infinity, duration: 16, ease: "linear" }, d: { repeat: Infinity, duration: 6, ease: "easeInOut" } }}
        />
      </svg>
      
      {/* ── Subtitle Dark Anchoring Fade ─────────────────────── */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 z-[3] pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)' }}
      />

      {/* ── Month navigation dots ─────────────────────── */}
      <div className="absolute top-[44px] left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToMonth(i)}
            className={`h-1.5 rounded-full transition-all duration-300 border-none cursor-pointer focus-visible:outline-none ${i === idx
                ? 'w-7 shadow-[0_0_6px_rgba(255,255,255,0.6)]'
                : 'w-2 hover:w-3'
              }`}
            style={{
              background: i === idx
                ? 'rgba(255,255,255,0.95)'
                : 'rgba(255,255,255,0.30)',
            }}
            aria-label={MONTHS[i]}
          />
        ))}
      </div>

      {/* ── Prev / Next controls (glass pill) ─────────── */}
      <div className="absolute top-[38px] left-0 right-0 flex justify-between px-4 md:px-5 z-10">
        <button
          onClick={goToPrevMonth}
          className="glass-btn-hero inline-flex items-center gap-1.5 text-white text-[11px] px-4 py-2 sm:py-1.5 rounded-full font-body font-medium outline-none shrink-0 min-h-9"
        >
          ← <span className="hidden sm:inline tracking-wide">Prev</span>
        </button>
        <button
          onClick={goToNextMonth}
          className="glass-btn-hero inline-flex items-center gap-1.5 text-white text-[11px] px-4 py-2 sm:py-1.5 rounded-full font-body font-medium outline-none shrink-0 min-h-9"
        >
          <span className="hidden sm:inline tracking-wide">Next</span> →
        </button>
      </div>

      {/* ── Month / Year editorial block ─────────────── */}
      <div className="absolute bottom-0 right-0 px-6 md:px-8 pb-[17px] z-10 text-right select-none">
        <motion.span
          key={`year-${idx}`}
          className="block font-mono font-semibold uppercase mb-0.5"
          style={{
            fontSize: '9.5px',
            letterSpacing: '0.44em',
            color: 'rgba(255,255,255,0.65)',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {format(currentMonth, 'yyyy')}
        </motion.span>
        <AnimatePresence mode="wait">
          <motion.span
            key={`month-${idx}`}
            className="block font-display font-bold leading-none"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 3.4rem)',
              letterSpacing: '0.10em',
              color: 'rgba(255,255,255,1)',
              textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)',
            }}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 1.01 }}
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {MONTHS[idx]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Motif Feature: Monthly Wall Quote ──────────────────────── */}
      <QuoteWidget />
    </div>
  );
}

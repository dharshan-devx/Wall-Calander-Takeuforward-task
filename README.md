# Premium Wall Calendar Showcase

A high-end, immersive wall calendar built with **Next.js 14**, **Framer Motion**, and **Tailwind CSS**. This project was designed to push the boundaries of traditional UI, blending a minimalist aesthetic with dynamic, performance-optimized motion that feels "alive."

## 🎨 Design Philosophy

The objective was to create a digital experience that feels as tactile as a premium physical wall calendar.
- **Nature & Future Theme**: Curated high-resolution imagery paired with a deep, calm color palette to create a sense of focus and serenity.
- **Live Wallpaper Motion**: Subtle SVG wave path-morphing and video overlays in the hero section provide an ambient, non-distracting background that responds to the selected month.
- **Glassmorphism & Depth**: Leveraged high-contrast tooltips and semi-transparent layers to maintain readability while ensuring the UI feels deep and layered.
- **Performance-First**: Custom logic to disable heavy animations on mobile devices ensures a 60fps experience even on lower-end hardware.

## ✨ Key Features

- **Intuitive Range Selection**: Smooth drag-to-select or click-to-range selection using `framer-motion` layout animations.
- **Contextual Notes Engine**: A custom-built state management system for capturing thoughts and plans, with local persistence and recent activity tracking.
- **Mobile-First Responsiveness**: Every component, from the spiral binder to the calendar grid, adapts seamlessly to mobile without losing functional depth.
- **Haptic Animations**: 3D "bending" month flips and interactive holiday tooltips that respond to the user's cursor position.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Custom Design Tokens)
- **Motion**: Framer Motion (SVG Morphing & 3D Transitions)
- **State**: Custom Store / Hooks
- **Icons**: Custom SVG + Lucide

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   git clone <your-repo-link>
   cd calendar-showcase
   npm install
   ```

2. **Environment**:
   Ensure you have Node.js 18+ installed.

3. **Development**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🎬 Video Demonstration

When watching the demo, pay close attention to:
1. **The Range Selection**: Notice how the selection "breathes" as you hover over different dates.
2. **The 3D Bending**: The month transitions use a physical hinge logic to simulate a real page flip.
3. **Responsive Flow**: Watch how the hero section simplifies for mobile while the calendar grid scales for touch-friendliness.

---
*Built with ❤️ for the TUF Frontend Developer Task.*

# Interactive Wall Calendar Showcase

A high-performance, interactive wall calendar built with Next.js and Framer Motion. The goal was simple: take a basic calendar and make it feel responsive, intuitive, and visually engaging—without sacrificing performance.

---

## Overview

Most calendar UIs feel static and mechanical. I wanted this to feel smooth and responsive while still being practical to use.

This project focuses on:
- Clean interactions
- Clear visual feedback
- Performance even with animations

---

## Live Demo

[View Live Project](https://wall-calander-tuf.vercel.app/)

---

## Features

- **Range Selection**
  - Smooth multi-day selection using layout animations
  - No layout shifts during interaction

- **Notes System**
  - Add notes to specific dates
  - Stored locally using browser storage
  - Simple and distraction-free

- **Dynamic Month Themes**
  - Background visuals change based on the selected month
  - Subtle enhancement without affecting usability

- **Responsive Layout**
  - Works across desktop and mobile
  - Layout adapts instead of shrinking unusably

---

## Tech Stack

- **Next.js 14** (App Router)
- **Framer Motion**
- **Tailwind CSS**
- **React Context + Custom Hooks**
- **date-fns**

---

## Key Engineering Decisions

### Motion vs Performance

Animations can easily impact performance, especially on lower-end devices.

To handle this:
- Heavy animations are limited to key interactions
- Mobile view reduces visual complexity
- Focus was kept on smooth interaction rather than excessive effects

---

### Separation of Logic and UI

Date logic is separated from UI components.

This helps:
- Keep components clean and reusable
- Reduce unnecessary re-renders
- Make the range selection logic easier to manage

---

### Tooltip Handling

Tooltips adjust automatically based on screen edges.

This prevents:
- Overflow issues
- Broken layouts on smaller devices

---

## Performance Considerations

Some animations (like SVG transitions and backgrounds) can be expensive.

So:
- Mobile devices use simplified rendering
- Priority is given to interaction performance
- UI remains responsive even during rapid interactions

---

## Folder Structure

```text
src/
├── components/     # UI components
├── hooks/          # Custom logic hooks
├── lib/            # Utilities and data
├── store/          # Global state
└── types/          # TypeScript types

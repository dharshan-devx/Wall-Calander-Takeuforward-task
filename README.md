# Interactive Wall Calendar Showcase

A high-performance, interactive wall calendar built with Next.js and Framer Motion. The goal of this project was to take a standard calendar UI and make it feel smooth, responsive, and visually engaging—while maintaining strong performance and clean architecture.

---

## Live Demo

🔗 https://wall-calander-tuf.vercel.app/

---

## Overview

Most calendar interfaces feel static and rigid. This project focuses on improving that experience by introducing fluid interactions, clear visual feedback, and thoughtful UI behavior without overloading the user.

The emphasis was on:
- Smooth user interactions
- Clean and maintainable architecture
- Performance across devices

---

## Features

### 1. Range Selection
- Select multiple days with smooth animations
- No layout shift during interaction
- Visual continuity using layout transitions

### 2. Notes System
- Add notes to specific dates
- Data persists using `localStorage`
- Simple and quick interaction flow

### 3. Dynamic Month Themes
- Visual background changes based on the selected month
- Keeps UI engaging without distracting from usability

### 4. Responsive Design
- Optimized for both desktop and mobile
- Layout adapts instead of shrinking unusably

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Animation:** Framer Motion
- **Styling:** Tailwind CSS
- **State Management:** React Context + Custom Hooks
- **Date Utilities:** date-fns

---

## Key Engineering Decisions

### Motion vs Performance

Animations were carefully controlled to avoid performance issues:
- Heavy animations are limited to key interactions
- Mobile devices use simplified visuals
- Focus remains on smooth interaction (~60fps)

---

### Separation of Logic and UI

Date logic is handled separately from UI components:
- Keeps components reusable and clean
- Reduces unnecessary re-renders
- Makes complex interactions easier to manage

---

### Tooltip Handling

Tooltips dynamically adjust position based on screen boundaries:
- Prevents overflow issues
- Improves usability on smaller screens

---

## Performance Considerations

Animations like SVG transitions and dynamic backgrounds can be expensive.

To handle this:
- Reduced visual complexity on mobile devices
- Prioritized interaction performance
- Ensured consistent responsiveness during rapid interactions

---

## Folder Structure

```text
src/
├── components/     # Reusable UI components
├── hooks/          # Custom hooks (logic abstraction)
├── lib/            # Utilities and static data
├── store/          # Global state management
└── types/          # TypeScript definitions

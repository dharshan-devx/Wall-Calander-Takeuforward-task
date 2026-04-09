# Wall Calendar

Production-minded interactive calendar built with **Next.js 14**, **TypeScript**, **Zustand**, **date-fns**, **Tailwind CSS**, and **Framer Motion**.

This project focuses on practical frontend engineering quality: deterministic calendar logic, predictable state transitions, accessible keyboard interactions, responsive behavior, and polished micro-interactions without over-animating.

## Project Overview

Wall Calendar is a single-page calendar experience with:

- stable month navigation and range selection
- per-date and per-range note taking with persistence
- keyboard + mouse interaction support
- responsive UI tuned for both desktop and touch-first mobile

The codebase is structured as a feature module (`src/features/calendar`) backed by a central store (`src/store/calendarStore.ts`) and reusable utility functions (`src/features/calendar/utils/calendarUtils.ts`).

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Core Features

- **Stable 42-day grid** (6 weeks) for every month, Monday-first.
- **Range selection flow** with hover preview:
  - click start
  - hover to preview
  - click end to finalize
  - click again to restart
- **Range normalization** (selecting end before start auto-swaps).
- **Keyboard navigation**:
  - arrow keys move focus
  - Enter/Space select
  - Shift + arrows selects range
  - Escape clears selection
- **Notes system**:
  - per-date notes
  - per-range notes
  - localStorage persistence
  - note dot indicator in day cells
- **Responsive layout**:
  - desktop: side-by-side notes + grid
  - mobile: stacked with calendar first
- **Theme toggle** persisted in localStorage.
- **Subtle motion design** for month transitions, selection, and hover feedback.

## Engineering Decisions

### 1) Deterministic date keys

Dates are serialized as `yyyy-MM-dd` keys instead of raw ISO timestamps for state/persistence boundaries.  
This avoids timezone drift and off-by-one errors common in client-side date UIs.

### 2) Utility-first calendar domain logic

Calendar math lives in pure utilities:

- `buildCalendarGrid()`
- `normalizeRange()`
- `resolveActiveRange()`
- `toDateKey()` / `fromDateKey()`
- `getRangeKey()`

This keeps rendering components lean and makes behavior easier to reason about and test.

### 3) Explicit state machine for selection

Store uses `phase: 'none' | 'start-selected' | 'range-selected'` to model interaction steps.  
That simplifies edge-case handling and avoids ambiguous transitions.

### 4) Local feature composition over global complexity

Calendar behavior is centralized in `useCalendar`, while notes logic stays in `useNotes`.  
Components receive derived state and handlers, reducing prop ambiguity and duplicated calculations.

### 5) Minimal animation budget

Motion is applied only to high-value interaction points (selection, hover, month transitions) using short durations and transform/opacity properties to preserve smooth performance.

## State Management (Zustand)

`src/store/calendarStore.ts` is the single source of truth for calendar interaction state.

### Primary state

- `currentMonth`: visible month (`yyyy-MM-dd` key at month start)
- `startDate`, `endDate`: selected range bounds
- `hoveredDate`: hover/keyboard preview target
- `phase`: selection lifecycle
- `darkMode`: UI theme mode
- `activeTab`: notes context (`date` or `range`)

### Primary actions

- month navigation: `goToPrevMonth`, `goToNextMonth`, `goToMonth`
- selection: `handleDateClick`, `setHoveredDate`, `clearSelection`
- ui: `setDarkMode`, `setActiveTab`

Persistence uses Zustand `persist` middleware with localStorage and selective partialization.

## Calendar Logic Explanation

### Grid generation

For any month:

1. compute month start
2. snap to week start (Monday)
3. generate exactly 42 consecutive days

Result: fixed-height grid with no layout jumping between months.

### Range resolution

`resolveActiveRange(start, end, hovered)` returns:

- finalized range when `end` exists
- preview range when only `start + hovered` exists
- `null` when no range context exists

`normalizeRange(start, end)` guarantees ascending order, so reverse selections are naturally supported.

### Keyboard behavior

Roving focus model in day cells:

- only one cell is tabbable (`tabIndex=0`)
- arrows move focus by day/week offsets
- Shift + arrows creates/extends range from a keyboard anchor
- Escape clears state

## Notes System

Notes are stored in localStorage as a structured object:

```ts
{
  dates: Record<string, string>,  // key: yyyy-MM-dd
  ranges: Record<string, string>, // key: start_end
}
```

This supports:

- direct date-note lookup for fast dot indicators
- deterministic range-note lookup via normalized range keys
- clean deletion by removing empty-note keys

## Responsiveness and UX

- **Desktop (`md+`)**: split pane with notes and grid visible together.
- **Mobile (`<md`)**: stacked order prioritizes calendar interactions first.
- Touch targets are increased on small screens (day cells, controls, clear actions).
- Supporting sections (legend, selection bar) wrap/stack to avoid cramped UI.

## Trade-offs

- **Chosen:** store dates as day keys (`yyyy-MM-dd`) for stability.  
  **Trade-off:** requires explicit parse/format helpers at boundaries.

- **Chosen:** Zustand for lightweight global state.  
  **Trade-off:** fewer built-in opinionated patterns than larger state frameworks.

- **Chosen:** fixed 42-day grid.  
  **Trade-off:** includes out-of-month days in every view, but yields consistent layout and predictable keyboard navigation.

- **Chosen:** localStorage-only persistence.  
  **Trade-off:** no cross-device sync or conflict resolution; intentionally optimized for single-user local UX.

- **Chosen:** subtle Framer Motion usage.  
  **Trade-off:** extra dependency, but controlled usage keeps UX quality high without noticeable runtime cost.

## Tech Stack

- Next.js 14
- React 18 + TypeScript
- Tailwind CSS
- Zustand
- date-fns
- Framer Motion

## Folder Structure

```text
src/
  app/
  features/
    calendar/
      components/
      hooks/
      utils/
      types.ts
  store/
  hooks/
```

## Future Improvements

- Unit tests for calendar utilities and selection state transitions.
- E2E tests for keyboard and touch interactions.
- Optional remote persistence (user account sync) while preserving local-first UX.

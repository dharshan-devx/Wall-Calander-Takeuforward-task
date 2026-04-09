# Interactive Wall Calendar Showcase

A technical demonstration of a high-performance, immersive wall calendar component. This project explores the intersection of aesthetic motion design and functional utility, built using Next.js and custom Framer Motion orchestration.

## Overview

The goal was to transform a standard calendar utility into a tactile, digital experience. By combining dynamic SVG path-morphing with a robust state management system, the component provides a fluid interface for date selection and planning while maintaining strict performance standards across various device types.

## Live Demo

[View Live Project](https://wall-calander-tuf.vercel.app/)

## Features

- **Fluid Range Selection**: Orchestrated animations for multi-day selection using layout projection to ensure zero-shift experiences.
- **Integrated Note Engine**: A contextual workflow for capturing thoughts on specific dates, featuring local persistence and activity tracking.
- **Adaptive Visual Themes**: Dynamic hero sections that synchronize backgrounds, video overlays, and color palettes based on the selected month.
- **Responsive Stacking**: A layout system that intelligently repositions components to maximize grid visibility on mobile screens.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **State Management**: Custom React Hooks and Context
- **Date Utilities**: Date-fns

## Key Design & Engineering Decisions

### Motion & UX
I prioritized "natural" over "flashy." The 3D bending transitions use hinge-point logic to mimic the physical flipping of a binder. This adds a sense of world-space depth that makes the digital interface feel more familiar and tactile.

### Component Architecture
The calendar is built using a pure functional approach, separating the business logic of date mathematics from the visual representation. This allowed for easier implementation of the range selection logic and ensured that the grid remains highly performant during rapid interactions.

### Intelligent Tooltips
Holiday and note tooltips use edge-detection logic. If a tooltip would overflow the screen boundary on a mobile device or a weekend column, the alignment automatically flips to the safe side, preserving the layout integrity.

## Performance Considerations

Heavy animations like SVG path-morphing and video backgrounds are resource-intensive on low-power mobile devices. To address this, I implemented an environment-aware rendering strategy. On mobile viewports, the application simplifies these background processes to prioritize battery life and interaction speed, ensuring a locked 60fps experience for the core grid interactions.

## Folder Structure

```text
src/
├── components/     # Atomic and composite UI components
├── hooks/          # Abstraction of date logic and persistence
├── lib/            # Shared utilities and holiday datasets
├── store/          # Global state management
└── types/          # TypeScript definitions
```

## Getting Started

Follow these instructions to run the project locally.

1. **Clone the repository**
   ```bash
   git clone https://github.com/dharshan-devx/Wall-Calander-Takeuforward-task
   cd wall-calander-tuf-task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Future Improvements

- **Multi-select Support**: Allowing for non-contiguous date selections for complex scheduling.
- **Cloud Synchronization**: Migrating the local storage persistence to a database to enable cross-device account syncing.
- **Drag-to-Move**: Implementing a drag-and-drop layer to reassign notes between dates in the grid.

## Closing Note

This project was built to demonstrate how small, thoughtful details in code can significantly elevate a user's perception of a digital tool. It focuses on the balance between high-end aesthetics and technical reliability.

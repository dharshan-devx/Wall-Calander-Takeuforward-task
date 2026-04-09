import {
  startOfMonth,
  startOfWeek,
  addDays,
  startOfDay,
  parseISO,
  parse,
  isValid,
  isWithinInterval,
  isAfter,
  format,
} from 'date-fns';
import type { HeroImage } from '@/types/calendar';

export interface DateRange {
  start: Date;
  end: Date;
}

const DATE_KEY_FORMAT = 'yyyy-MM-dd';
const GRID_CELL_COUNT = 42;
const WEEK_STARTS_ON = 1 as const;

export function toDateKey(date: Date): string {
  return format(startOfDay(date), DATE_KEY_FORMAT);
}

export function fromDateKey(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = value.includes('T')
    ? parseISO(value)
    : parse(value, DATE_KEY_FORMAT, new Date());
  return isValid(parsed) ? startOfDay(parsed) : null;
}

export function normalizeRange(start: Date, end: Date): DateRange {
  const normalizedStart = startOfDay(start);
  const normalizedEnd = startOfDay(end);
  return isAfter(normalizedStart, normalizedEnd)
    ? { start: normalizedEnd, end: normalizedStart }
    : { start: normalizedStart, end: normalizedEnd };
}

export function buildCalendarGrid(currentMonth: Date): Date[] {
  const monthStart = startOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: WEEK_STARTS_ON });
  const days: Date[] = [];
  for (let i = 0; i < GRID_CELL_COUNT; i += 1) {
    days.push(addDays(gridStart, i));
  }
  return days;
}

export function resolveActiveRange(
  startDate: Date | null,
  endDate: Date | null,
  hoveredDate: Date | null
): DateRange | null {
  if (!startDate) return null;
  if (endDate) return normalizeRange(startDate, endDate);
  if (hoveredDate) return normalizeRange(startDate, hoveredDate);
  return null;
}

export function isInRange(
  date: Date,
  startDate: Date | null,
  endDate: Date | null,
  hoveredDate: Date | null
): boolean {
  const range = resolveActiveRange(startDate, endDate, hoveredDate);
  return range ? isWithinInterval(date, range) : false;
}

export function getRangeKey(start: Date, end: Date): string {
  const normalized = normalizeRange(start, end);
  return `${toDateKey(normalized.start)}_${toDateKey(normalized.end)}`;
}

export const HERO_IMAGES: HeroImage[] = [
  {
    month: 0,    name: 'January',
    url: 'https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-winter-fashion-cold-snow-forest-wood-5746-large.mp4',
    color: '#1a2b4c',
    accent: '#3b82f6',
    location: 'Swiss Alps, CH',
  },
  {
    month: 1,    name: 'February',
    url: 'https://images.unsplash.com/photo-1473655584501-c529baeee97f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pink-blossom-flowers-on-a-branch-1180-large.mp4',
    color: '#4c1a2b',
    accent: '#ec4899',
    location: 'Kyoto, JP',
  },
  {
    month: 2,    name: 'March',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    color: '#1a4c2b',
    accent: '#10b981',
    location: 'Yosemite, USA',
  },
  {
    month: 3,    name: 'April',
    url: 'https://images.unsplash.com/photo-1482062364825-616fd23b8fc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-1568-large.mp4',
    color: '#2b1a4c',
    accent: '#8b5cf6',
    location: 'Plitvice Lakes, HR',
  },
  {
    month: 4,    name: 'May',
    url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-meadow-surrounded-by-trees-on-a-sunny-afternoon-40647-large.mp4',
    color: '#4c3b1a',
    accent: '#eab308',
    location: 'Tuscany, IT',
  },
  {
    month: 5,    name: 'June',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sea-edge-with-foamy-waves-1165-large.mp4',
    color: '#1a3b4c',
    accent: '#0ea5e9',
    location: 'Santorini, GR',
  },
  {
    month: 6,    name: 'July',
    url: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-setting-or-rising-over-palm-trees-1170-large.mp4',
    color: '#4c2b1a',
    accent: '#f97316',
    location: 'Maui, USA',
  },
  {
    month: 7,    name: 'August',
    url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-country-road-42614-large.mp4',
    color: '#2b4c1a',
    accent: '#14b8a6',
    location: 'Olympic Peninsula, USA',
  },
  {
    month: 8,    name: 'September',
    url: 'https://images.unsplash.com/photo-1444464666168-49b626428ca4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
    color: '#4c1a3b',
    accent: '#d946ef',
    location: 'Banff, CA',
  },
  {
    month: 9,    name: 'October',
    url: 'https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fog-over-the-mountain-1184-large.mp4',
    color: '#4c2b1a',
    accent: '#f59e0b',
    location: 'Vermont, USA',
  },
  {
    month: 10,    name: 'November',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mountain-landscape-with-a-quiet-lake-43180-large.mp4',
    color: '#3b1a4c',
    accent: '#6366f1',
    location: 'Patagonia, AR',
  },
  {
    month: 11,    name: 'December',
    url: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fire-flames-burning-in-a-fireplace-1004-large.mp4',
    color: '#1a4c4c',
    accent: '#06b6d4',
    location: 'Tromsø, NO',
  },
];

export const WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

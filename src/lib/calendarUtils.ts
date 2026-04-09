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

// Curated hero images per month + Dynamic theme tokens
export const HERO_IMAGES: HeroImage[] = [
  {
    month: 0,
    name: 'January',
    url: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-winter-fashion-cold-snow-forest-wood-5746-large.mp4',
    color: '#1a2b4c',
    accent: '#3b82f6',
    location: 'Winter Serenity',
  },
  {
    month: 1,
    name: 'February',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pink-blossom-flowers-on-a-branch-1180-large.mp4',
    color: '#2d3748',
    accent: '#4fd1c5',
    location: 'Modern Horizons',
  },
  {
    month: 2,
    name: 'March',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    color: '#22543d',
    accent: '#48bb78',
    location: 'Alpine Mornings',
  },
  {
    month: 3,
    name: 'April',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-1568-large.mp4',
    color: '#2d3748',
    accent: '#63b3ed',
    location: 'Structural Grace',
  },
  {
    month: 4,
    name: 'May',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-meadow-surrounded-by-trees-on-a-sunny-afternoon-40647-large.mp4',
    color: '#276749',
    accent: '#68d391',
    location: 'Emerald Canopy',
  },
  {
    month: 5,
    name: 'June',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sea-edge-with-foamy-waves-1165-large.mp4',
    color: '#1a365d',
    accent: '#4299e1',
    location: 'Nexus Shift',
  },
  {
    month: 6,
    name: 'July',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-setting-or-rising-over-palm-trees-1170-large.mp4',
    color: '#2a4365',
    accent: '#63b3ed',
    location: 'Summer Tides',
  },
  {
    month: 7,
    name: 'August',
    url: 'https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-country-road-42614-large.mp4',
    color: '#1a202c',
    accent: '#718096',
    location: 'Future Flux',
  },
  {
    month: 8,
    name: 'September',
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
    color: '#2c5282',
    accent: '#4299e1',
    location: 'Crystal Waters',
  },
  {
    month: 9,
    name: 'October',
    url: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fog-over-the-mountain-1184-large.mp4',
    color: '#744210',
    accent: '#d69e2e',
    location: 'Amber Ridge',
  },
  {
    month: 10,
    name: 'November',
    url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mountain-landscape-with-a-quiet-lake-43180-large.mp4',
    color: '#1a202c',
    accent: '#805ad5',
    location: 'Neon Pulse',
  },
  {
    month: 11,
    name: 'December',
    url: 'https://images.unsplash.com/photo-1517210122415-b0c70b2a09bf?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fire-flames-burning-in-a-fireplace-1004-large.mp4',
    color: '#2a4365',
    accent: '#4299e1',
    location: 'Cozy Solstice',
  },
];

export const WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

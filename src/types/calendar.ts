export interface DayCellProps {
  date: Date;
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoveredDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  hasNote: boolean;
  hasRangeNote: boolean;
  isFocused: boolean;
  onDateFocus: (date: Date) => void;
  onDateKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, date: Date) => void;
  onDatePointerDown: (date: Date) => void;
  onDatePointerUp: (date: Date) => void;
}

export interface HeroImage {
  month: number;
  name: string;
  url: string;
  videoUrl?: string;
  credit?: string;
  location: string;
  color: string;
  accent: string;
}

export interface DayCellProps {
  date: Date;
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoveredDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
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

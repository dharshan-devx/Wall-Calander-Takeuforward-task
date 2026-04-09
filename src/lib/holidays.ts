import { format } from 'date-fns';

export interface Holiday {
  name: string;
  emoji: string;
}

const HOLIDAYS: Record<string, Holiday> = {
  '01-01': { name: "New Year's Day", emoji: '🎉' },
  '02-14': { name: "Valentine's Day", emoji: '💝' },
  '03-08': { name: "Women's Day", emoji: '💐' },
  '03-17': { name: "St. Patrick's Day", emoji: '🍀' },
  '04-01': { name: "April Fools'", emoji: '🃏' },
  '04-22': { name: "Earth Day", emoji: '🌍' },
  '05-01': { name: "Labour Day", emoji: '✊' },
  '06-21': { name: "Summer Solstice", emoji: '☀️' },
  '07-04': { name: "Independence Day", emoji: '🇺🇸' },
  '09-22': { name: "Autumn Equinox", emoji: '🍂' },
  '10-31': { name: "Halloween", emoji: '🎃' },
  '12-24': { name: "Christmas Eve", emoji: '🎄' },
  '12-25': { name: "Christmas", emoji: '🎁' },
  '12-31': { name: "New Year's Eve", emoji: '🥂' },
};

export function getHoliday(date: Date): Holiday | null {
  const key = format(date, 'MM-dd');
  return HOLIDAYS[key] || null;
}

import { format } from 'date-fns';

export interface Holiday {
  name: string;
  emoji: string;
}

const HOLIDAYS: Record<string, Holiday> = {
  // --- Fixed Dates (Annual) ---
  '01-01': { name: "New Year's Day", emoji: '🎉' },
  '01-14': { name: "Makar Sankranti / Pongal", emoji: '🪁' },
  '01-26': { name: "Republic Day", emoji: '🇮🇳' },
  '08-15': { name: "Independence Day", emoji: '🇮🇳' },
  '10-02': { name: "Gandhi Jayanti", emoji: '🕊️' },
  '12-25': { name: "Christmas", emoji: '🎄' },

  // --- Dynamic/Lunar Dates mapped accurately for 2024 to 2027 ---
  
  // 2024
  '2024-03-08': { name: "Maha Shivaratri", emoji: '🔱' },
  '2024-03-25': { name: "Holi", emoji: '🎨' },
  '2024-04-10': { name: "Eid al-Fitr", emoji: '🌙' },
  '2024-04-17': { name: "Ram Navami", emoji: '🏹' },
  '2024-08-19': { name: "Raksha Bandhan", emoji: '🪢' },
  '2024-08-26': { name: "Krishna Janmashtami", emoji: '🦚' },
  '2024-09-07': { name: "Ganesh Chaturthi", emoji: '🐘' },
  '2024-10-12': { name: "Dussehra", emoji: '🏹' },
  '2024-10-31': { name: "Diwali", emoji: '🪔' },

  // 2025
  '2025-02-26': { name: "Maha Shivaratri", emoji: '🔱' },
  '2025-03-14': { name: "Holi", emoji: '🎨' },
  '2025-03-31': { name: "Eid al-Fitr", emoji: '🌙' },
  '2025-04-06': { name: "Ram Navami", emoji: '🏹' },
  '2025-08-09': { name: "Raksha Bandhan", emoji: '🪢' },
  '2025-08-16': { name: "Krishna Janmashtami", emoji: '🦚' },
  '2025-08-27': { name: "Ganesh Chaturthi", emoji: '🐘' },
  '2025-10-02': { name: "Dussehra", emoji: '🏹' },
  '2025-10-20': { name: "Diwali", emoji: '🪔' },

  // 2026
  '2026-02-15': { name: "Maha Shivaratri", emoji: '🔱' },
  '2026-03-03': { name: "Holi", emoji: '🎨' },
  '2026-03-20': { name: "Eid al-Fitr", emoji: '🌙' },
  '2026-03-26': { name: "Ram Navami", emoji: '🏹' },
  '2026-08-28': { name: "Raksha Bandhan", emoji: '🪢' },
  '2026-09-04': { name: "Krishna Janmashtami", emoji: '🦚' },
  '2026-09-14': { name: "Ganesh Chaturthi", emoji: '🐘' },
  '2026-10-21': { name: "Dussehra", emoji: '🏹' },
  '2026-11-08': { name: "Diwali", emoji: '🪔' },

  // 2027
  '2027-03-06': { name: "Maha Shivaratri", emoji: '🔱' },
  '2027-03-22': { name: "Holi", emoji: '🎨' },
  '2027-03-10': { name: "Eid al-Fitr", emoji: '🌙' },
  '2027-04-15': { name: "Ram Navami", emoji: '🏹' },
  '2027-08-17': { name: "Raksha Bandhan", emoji: '🪢' },
  '2027-08-25': { name: "Krishna Janmashtami", emoji: '🦚' },
  '2027-09-04': { name: "Ganesh Chaturthi", emoji: '🐘' },
  '2027-10-09': { name: "Dussehra", emoji: '🏹' },
  '2027-10-29': { name: "Diwali", emoji: '🪔' },
};

export function getHoliday(date: Date): Holiday | null {
  const annualKey = format(date, 'MM-dd');
  const exactKey = format(date, 'yyyy-MM-dd');
  return HOLIDAYS[exactKey] || HOLIDAYS[annualKey] || null;
}

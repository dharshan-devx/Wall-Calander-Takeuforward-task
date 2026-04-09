'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { useCalendarStore } from '@/store/calendarStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { fromDateKey, getRangeKey, toDateKey } from '@/lib/calendarUtils';

interface NotesStore {
  dates: Record<string, string>;
  ranges: Record<string, string>;
}

const EMPTY_NOTES: NotesStore = { dates: {}, ranges: {} };

/**
 * Hook for managing calendar notes and tab state.
 * Handles persistence and context-aware note retrieval.
 */
export function useNotes() {
  const { startDate, endDate, activeTab, setActiveTab } = useCalendarStore();

  const dateKey = useMemo(() => {
    const parsedStart = fromDateKey(startDate);
    return parsedStart ? toDateKey(parsedStart) : null;
  }, [startDate]);

  const rangeKey = useMemo(() => {
    if (startDate && endDate) {
      const parsedStart = fromDateKey(startDate);
      const parsedEnd = fromDateKey(endDate);
      if (!parsedStart || !parsedEnd) return null;
      return getRangeKey(parsedStart, parsedEnd);
    }
    return null;
  }, [startDate, endDate]);

  const [allNotes, setAllNotes] = useLocalStorage<NotesStore>('wc-notes-v2', EMPTY_NOTES);
  const [localVal, setLocalVal] = useState('');

  const activeTabResolved = activeTab === 'range' && rangeKey ? 'range' : 'date';
  const activeKey = activeTabResolved === 'range' ? rangeKey : dateKey;

  const hasDateNote = useCallback((date: Date) => {
    const key = toDateKey(date);
    return Boolean(allNotes.dates[key]?.trim());
  }, [allNotes.dates]);

  const hasActiveRangeNote = useMemo(() => {
    if (!rangeKey) return false;
    return Boolean(allNotes.ranges[rangeKey]?.trim());
  }, [allNotes.ranges, rangeKey]);

  const dateLabel = useMemo(() => {
    if (!dateKey) return 'Select a date';
    const parsed = fromDateKey(dateKey);
    return parsed ? format(parsed, 'EEE, MMM d') : dateKey;
  }, [dateKey]);

  const rangeLabel = useMemo(() => {
    if (!rangeKey) return 'Select a range';
    const [rawStart, rawEnd] = rangeKey.split('_');
    const start = fromDateKey(rawStart);
    const end = fromDateKey(rawEnd);
    if (!start || !end) return rangeKey;
    if (rawStart === rawEnd) return format(start, 'MMM d, yyyy');
    return `${format(start, 'MMM d')} -> ${format(end, 'MMM d')}`;
  }, [rangeKey]);

  // Sync state with storage when the active key changes
  useEffect(() => {
    if (!activeKey) {
      setLocalVal('');
      return;
    }
    const value = activeTabResolved === 'range'
      ? allNotes.ranges[activeKey] || ''
      : allNotes.dates[activeKey] || '';
    setLocalVal(value);
  }, [activeKey, activeTabResolved, allNotes]);

  // Auto-switch tabs when a range is selected
  useEffect(() => {
    if (rangeKey) {
      setActiveTab('range');
    } else if (dateKey) {
      setActiveTab('date');
    } else {
      setActiveTab('date');
    }
  }, [rangeKey, dateKey, setActiveTab]);

  const updateNote = useCallback((val: string) => {
    setLocalVal(val);
    if (!activeKey) return;

    setAllNotes((prev) => {
      const next = {
        dates: { ...(prev?.dates ?? {}) },
        ranges: { ...(prev?.ranges ?? {}) },
      };

      if (activeTabResolved === 'range') {
        if (val.trim()) next.ranges[activeKey] = val;
        else delete next.ranges[activeKey];
      } else {
        if (val.trim()) next.dates[activeKey] = val;
        else delete next.dates[activeKey];
      }

      return next;
    });
  }, [activeKey, activeTabResolved, setAllNotes]);

  const clearNote = useCallback(() => {
    updateNote('');
  }, [updateNote]);

  const openRangeNotes = useCallback(() => {
    if (rangeKey) setActiveTab('range');
  }, [rangeKey, setActiveTab]);

  return {
    localVal,
    activeTab: activeTabResolved,
    dateKey,
    rangeKey,
    dateLabel,
    rangeLabel,
    hasActiveRangeNote,
    setActiveTab,
    openRangeNotes,
    hasDateNote,
    updateNote,
    clearNote,
    allNotes,
  };
}

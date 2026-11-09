import { describe, it, expect } from 'vitest';
import { formatNoteDate, formatFullDateTime } from './dateHelpers';

describe('dateHelpers', () => {
  const now = new Date('2026-11-09T12:00:00.000Z');

  it('formats relative dates within a week', () => {
    expect(formatNoteDate('2026-11-09T11:59:30.000Z', now)).toBe('Just now');
    expect(formatNoteDate('2026-11-09T11:45:00.000Z', now)).toBe('15m ago');
    expect(formatNoteDate('2026-11-09T09:00:00.000Z', now)).toBe('3h ago');
    expect(formatNoteDate('2026-11-06T12:00:00.000Z', now)).toBe('3d ago');
  });

  it('formats older dates and handles invalid strings safely', () => {
    expect(formatNoteDate('2026-10-15T12:00:00.000Z', now)).toContain('Oct');
    expect(formatNoteDate('invalid-date', now)).toBe('Unknown date');
    expect(formatNoteDate('', now)).toBe('Unknown date');
    expect(formatFullDateTime('invalid-date')).toBe('');
  });
});


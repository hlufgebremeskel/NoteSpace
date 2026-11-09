/**
 * Formats an ISO 8601 timestamp into a concise, human-readable label
 * (e.g., "Just now", "12m ago", "3h ago", or "Nov 9, 2026").
 * Returns "Unknown date" if the input is missing or invalid.
 */
export function formatNoteDate(isoString, now = new Date()) {
  if (!isoString) return 'Unknown date';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMs >= 0 && diffMinutes < 1) {
    return 'Just now';
  }
  if (diffMs >= 0 && diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  if (diffMs >= 0 && diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffMs >= 0 && diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  });
}

/**
 * Formats an ISO 8601 timestamp into a full localized date & time string
 * for accessible tooltips and metadata displays.
 */
export function formatFullDateTime(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}


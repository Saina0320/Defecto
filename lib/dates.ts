/** `YYYY-MM-DD` in UTC, the format used by date inputs and defect dates. */
export function todayIsoDate(): string {
  return new Date().toISOString().substring(0, 10);
}

/** `YYYY-MM-DD HH:mm` in UTC, the format used for uploads and read receipts. */
export function nowTimestamp(): string {
  return formatTimestamp(new Date());
}

/** Formats a Date the way nowTimestamp() formats the current time, for values read back from the database. */
export function formatTimestamp(date: Date): string {
  return date.toISOString().replace('T', ' ').substring(0, 16);
}

/** "5m ago", "3h ago", "2d ago" — relative age of a past ISO timestamp or Date, for notifications. */
export function formatRelativeTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toISOString().substring(0, 10);
}

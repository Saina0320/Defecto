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

import type { DateRangePreset, TrendBucket } from '@/types/analytics';

export const DATE_RANGE_PRESET_OPTIONS: readonly { value: DateRangePreset; label: string }[] = [
  { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { value: 'THIS_MONTH', label: 'This Month' },
  { value: 'LAST_MONTH', label: 'Last Month' },
  { value: 'LAST_3_MONTHS', label: 'Last 3 Months' },
  { value: 'THIS_YEAR', label: 'This Year' },
  { value: 'ALL_TIME', label: 'All Time' },
  { value: 'CUSTOM', label: 'Custom Range' },
];

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 7–30 days → day, 1–3 months → week, beyond that → month. All Time always buckets by month. */
function computeBucket(from: Date | null, to: Date): TrendBucket {
  if (!from) return 'month';
  const days = (to.getTime() - from.getTime()) / ONE_DAY_MS;
  if (days <= 31) return 'day';
  if (days <= 93) return 'week';
  return 'month';
}

/** A trailing window of the same duration immediately before `from`, for a fair period-over-period comparison. */
function previousWindowBefore(from: Date, to: Date): { from: Date; to: Date } {
  const duration = to.getTime() - from.getTime();
  return { from: new Date(from.getTime() - duration), to: from };
}

export type ResolvedDateRange = {
  from: Date | null;
  to: Date;
  /** Null when there is no well-defined previous window to compare against (All Time). */
  previous: { from: Date; to: Date } | null;
  bucket: TrendBucket;
};

/**
 * Resolves a date-range preset (or a validated custom range) to concrete bounds, a trailing
 * "previous period" window for KPI comparison, and the trend bucket size the span calls for.
 * `to` is always an exclusive upper bound.
 */
export function resolveDateRange(
  preset: DateRangePreset,
  customFrom: string | null,
  customTo: string | null,
  now: Date = new Date()
): ResolvedDateRange {
  const startOfToday = startOfDay(now);
  const defaultTo = new Date(startOfToday.getTime() + ONE_DAY_MS);

  let from: Date | null = null;
  let to: Date = defaultTo;

  switch (preset) {
    case 'LAST_7_DAYS':
      from = new Date(startOfToday.getTime() - 6 * ONE_DAY_MS);
      break;
    case 'LAST_30_DAYS':
      from = new Date(startOfToday.getTime() - 29 * ONE_DAY_MS);
      break;
    case 'THIS_MONTH':
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'LAST_MONTH':
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'LAST_3_MONTHS':
      from = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      break;
    case 'THIS_YEAR':
      from = new Date(now.getFullYear(), 0, 1);
      break;
    case 'ALL_TIME':
      from = null;
      break;
    case 'CUSTOM': {
      const parsedFrom = customFrom ? parseIsoDate(customFrom) : null;
      const parsedTo = customTo ? parseIsoDate(customTo) : null;
      if (parsedFrom && parsedTo && parsedFrom <= parsedTo) {
        from = parsedFrom;
        to = new Date(parsedTo.getTime() + ONE_DAY_MS);
      } else {
        // Incomplete/invalid custom range — fall back rather than query with garbage bounds.
        from = new Date(startOfToday.getTime() - 29 * ONE_DAY_MS);
      }
      break;
    }
  }

  return { from, to, previous: from ? previousWindowBefore(from, to) : null, bucket: computeBucket(from, to) };
}

/** Whether the range spans more than one calendar year — month labels then need a year suffix. */
export function spansMultipleYears(from: Date | null, to: Date): boolean {
  if (!from) return true;
  return from.getFullYear() !== new Date(to.getTime() - 1).getFullYear();
}

export function formatBucketLabel(date: Date, bucket: TrendBucket, includeYear: boolean): string {
  if (bucket === 'month') {
    return date.toLocaleDateString('en-US', includeYear ? { month: 'short', year: '2-digit' } : { month: 'short' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

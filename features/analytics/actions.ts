'use server';

import { isDefectReasonCode } from '@/constants/defectReasons';
import { resolveDateRange } from '@/features/analytics/lib/dateRangePresets';
import { requireUser } from '@/lib/auth/session';
import {
  getAnalystBreakdown,
  getAnalyticsKpis,
  getCategoryBreakdown,
  getDefectTrend,
  getReasonBreakdown,
  getReasonCategoryMatrix,
} from '@/services/analytics';
import type {
  AnalyticsData,
  AnalyticsFilters,
  AnalystBreakdownItem,
  CategoryBreakdownItem,
  DateRangePreset,
  ReasonBreakdownItem,
  ReasonCategoryMatrix,
  ReasonFilterValue,
  ResolvedAnalyticsFilters,
  TrendPoint,
} from '@/types/analytics';

const EMPTY_MATRIX: ReasonCategoryMatrix = { reasons: [], categories: [], cells: [], maxCount: 0 };

/**
 * One secondary chart's query failing (a transient DB hiccup, an edge case in a raw query) must
 * not take down the whole page — it shows that one section as empty instead. KPIs are the one
 * exception: they're load-bearing for the rest of the page, so their failure still fails the call.
 */
async function withFallback<T>(label: string, query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error(`Error loading Analytics ${label}:`, error);
    return fallback;
  }
}

export type GetAnalyticsDataResult = { ok: true; data: AnalyticsData } | { ok: false; reason: 'invalid-input' };

const DATE_RANGE_PRESETS: readonly DateRangePreset[] = [
  'LAST_7_DAYS',
  'LAST_30_DAYS',
  'THIS_MONTH',
  'LAST_MONTH',
  'LAST_3_MONTHS',
  'THIS_YEAR',
  'ALL_TIME',
  'CUSTOM',
];

function isIsoDateString(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isReasonFilterValue(value: unknown): value is ReasonFilterValue {
  return value === null || value === 'NOT_CLASSIFIED' || isDefectReasonCode(value);
}

// Server Functions are reachable with a plain POST request, so the shape of these filters cannot
// be trusted until it is checked here. They only ever narrow a read query — an unrecognized
// category/analyst id just yields zero rows, never a security or data-integrity issue.
function parseFilters(input: unknown): AnalyticsFilters | null {
  if (!input || typeof input !== 'object') return null;
  const { dateRangePreset, customFrom, customTo, analystId, category, reason } = input as Record<string, unknown>;

  if (!DATE_RANGE_PRESETS.includes(dateRangePreset as DateRangePreset)) return null;
  if (customFrom !== null && !isIsoDateString(customFrom)) return null;
  if (customTo !== null && !isIsoDateString(customTo)) return null;
  if (analystId !== null && typeof analystId !== 'string') return null;
  if (category !== null && typeof category !== 'string') return null;
  if (!isReasonFilterValue(reason)) return null;

  return {
    dateRangePreset: dateRangePreset as DateRangePreset,
    customFrom: customFrom as string | null,
    customTo: customTo as string | null,
    analystId: analystId as string | null,
    category: category as string | null,
    reason,
  };
}

/**
 * Every signed-in role — Analyst, Manager, Admin — can call this with full access; Analytics is
 * read-only transparency, not an administrative surface, so there is no role check here beyond
 * requireUser() confirming a real session. Administrative actions (roster changes, etc.) keep
 * their own separate authorization in features/team/actions.ts — unaffected by this file.
 */
export async function getAnalyticsData(input: unknown): Promise<GetAnalyticsDataResult> {
  await requireUser();

  const filters = parseFilters(input);
  if (!filters) return { ok: false, reason: 'invalid-input' };

  const { from, to, previous, bucket } = resolveDateRange(filters.dateRangePreset, filters.customFrom, filters.customTo);
  const resolved: ResolvedAnalyticsFilters = { from, to, analystId: filters.analystId, category: filters.category, reason: filters.reason };

  // KPIs are not wrapped — if the database is unreachable, failing the whole call (and showing
  // the page's one error state) is more honest than silently showing zeroed-out KPI cards.
  const [kpis, trendPoints, reasonBreakdown, categoryBreakdown, analystBreakdown, reasonCategoryMatrix] = await Promise.all([
    getAnalyticsKpis(resolved, previous),
    withFallback<TrendPoint[]>('trend', () => getDefectTrend(resolved, bucket), []),
    withFallback<ReasonBreakdownItem[]>('reason breakdown', () => getReasonBreakdown(resolved), []),
    withFallback<CategoryBreakdownItem[]>('category breakdown', () => getCategoryBreakdown(resolved), []),
    withFallback<AnalystBreakdownItem[]>('analyst breakdown', () => getAnalystBreakdown(resolved), []),
    withFallback<ReasonCategoryMatrix>('reason x category matrix', () => getReasonCategoryMatrix(resolved), EMPTY_MATRIX),
  ]);

  return {
    ok: true,
    data: { kpis, trend: { bucket, points: trendPoints }, reasonBreakdown, categoryBreakdown, analystBreakdown, reasonCategoryMatrix },
  };
}

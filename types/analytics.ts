import type { DefectReasonCode } from '@/types/defect';

export type DateRangePreset =
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'LAST_3_MONTHS'
  | 'THIS_YEAR'
  | 'ALL_TIME'
  | 'CUSTOM';

export type TrendBucket = 'day' | 'week' | 'month';

/** A reason code, the synthetic "no reason recorded" bucket, or "no filter" (null) — never inferred. */
export type ReasonFilterValue = DefectReasonCode | 'NOT_CLASSIFIED' | null;

/** Raw filter selection as the client holds it. Never persisted to storage. */
export type AnalyticsFilters = {
  dateRangePreset: DateRangePreset;
  /** ISO yyyy-mm-dd. Only read when dateRangePreset is 'CUSTOM'. */
  customFrom: string | null;
  customTo: string | null;
  /** Profile id, or null for "All Analysts". */
  analystId: string | null;
  /** Category name (as stored on DefectCategory), or null for "All Categories". */
  category: string | null;
  reason: ReasonFilterValue;
};

/** Filters resolved to concrete date bounds — what the data layer actually queries with. */
export type ResolvedAnalyticsFilters = {
  /** null means unbounded (All Time). */
  from: Date | null;
  /** Exclusive upper bound. */
  to: Date;
  analystId: string | null;
  category: string | null;
  reason: ReasonFilterValue;
};

export type AnalyticsKpis = {
  /** All defects matching Analyst/Category/Reason, regardless of the date range. */
  total: number;
  /** Defects created within the selected date range (plus the other filters). */
  period: number;
  /** Of `total` — status = resolved. */
  resolved: number;
  /** Of `total` — status != resolved. */
  pending: number;
  /** % change of `period` vs. an equal-length trailing window before it. Null when there is no
   * well-defined previous window (All Time) or the previous window had zero defects to compare against. */
  periodChangePercent: number | null;
};

export type TrendPoint = {
  /** ISO timestamp of the bucket's start. */
  bucketStart: string;
  /** Human label, e.g. "May", "Oct 6". */
  label: string;
  count: number;
};

export type DefectTrend = {
  bucket: TrendBucket;
  points: TrendPoint[];
};

export type ReasonBreakdownItem = {
  code: DefectReasonCode | 'NOT_CLASSIFIED';
  label: string;
  count: number;
  /** Of the total defects matching the active filters (date range included). */
  percentage: number;
};

export type CategoryBreakdownItem = {
  name: string;
  count: number;
  percentage: number;
};

export type AnalystBreakdownItem = {
  analystId: string;
  /** Resolved from Profile.firstName/lastName — never a UUID or SOE ID. */
  name: string;
  count: number;
};

export type ReasonCategoryCell = {
  reason: DefectReasonCode | 'NOT_CLASSIFIED';
  category: string;
  count: number;
};

export type ReasonCategoryMatrix = {
  reasons: readonly (DefectReasonCode | 'NOT_CLASSIFIED')[];
  /** Ordered by total count across all reasons, descending. */
  categories: readonly string[];
  cells: ReasonCategoryCell[];
  maxCount: number;
};

export type AnalyticsData = {
  kpis: AnalyticsKpis;
  trend: DefectTrend;
  reasonBreakdown: ReasonBreakdownItem[];
  categoryBreakdown: CategoryBreakdownItem[];
  analystBreakdown: AnalystBreakdownItem[];
  reasonCategoryMatrix: ReasonCategoryMatrix;
};

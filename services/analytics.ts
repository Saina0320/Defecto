import 'server-only';
import { DEFECT_REASON_CODES, DEFECT_REASONS, isDefectReasonCode } from '@/constants/defectReasons';
import { formatBucketLabel, spansMultipleYears } from '@/features/analytics/lib/dateRangePresets';
import { Prisma } from '@/generated/prisma/client';
import { getPrisma } from '@/lib/prisma';
import type {
  AnalystBreakdownItem,
  AnalyticsKpis,
  CategoryBreakdownItem,
  ReasonBreakdownItem,
  ReasonCategoryMatrix,
  ResolvedAnalyticsFilters,
  TrendBucket,
  TrendPoint,
} from '@/types/analytics';

/** Prisma's typed WHERE for a defect-level (no join) query — used by count/groupBy, never raw SQL. */
function buildDefectWhere(
  filters: ResolvedAnalyticsFilters,
  dateRange: { from: Date | null; to: Date } = filters
): Prisma.DefectWhereInput {
  const where: Prisma.DefectWhereInput = {
    createdAt: dateRange.from ? { gte: dateRange.from, lt: dateRange.to } : { lt: dateRange.to },
  };
  if (filters.analystId) where.analystId = filters.analystId;
  if (filters.reason === 'NOT_CLASSIFIED') where.defectReason = null;
  else if (filters.reason) where.defectReason = filters.reason;
  if (filters.category) where.categories = { some: { name: filters.category } };
  return where;
}

/** Same filters, as SQL fragments for the raw queries that need to join defect_categories. Alias `d`. */
function buildRawConditions(filters: ResolvedAnalyticsFilters): Prisma.Sql[] {
  const conditions: Prisma.Sql[] = [Prisma.sql`d.created_at < ${filters.to}`];
  if (filters.from) conditions.push(Prisma.sql`d.created_at >= ${filters.from}`);
  if (filters.analystId) conditions.push(Prisma.sql`d.analyst_id = ${filters.analystId}::uuid`);
  if (filters.reason === 'NOT_CLASSIFIED') conditions.push(Prisma.sql`d.defect_reason is null`);
  else if (filters.reason) conditions.push(Prisma.sql`d.defect_reason = ${filters.reason}`);
  if (filters.category) {
    conditions.push(Prisma.sql`exists (select 1 from public.defect_categories dcf where dcf.defect_id = d.id and dcf.name = ${filters.category})`);
  }
  return conditions;
}

/**
 * Total/Resolved/Pending ignore the date range (they answer "how many do we have", "how many are
 * done" for whatever Analyst/Category/Reason is selected); Period and its % change are the only
 * date-bound numbers.
 */
export async function getAnalyticsKpis(
  filters: ResolvedAnalyticsFilters,
  previous: { from: Date; to: Date } | null
): Promise<AnalyticsKpis> {
  const prisma = getPrisma();
  const allTimeWhere = buildDefectWhere(filters, { from: null, to: filters.to });
  const periodWhere = buildDefectWhere(filters);

  const [total, period, resolved, pending, previousPeriod] = await Promise.all([
    prisma.defect.count({ where: allTimeWhere }),
    prisma.defect.count({ where: periodWhere }),
    prisma.defect.count({ where: { ...allTimeWhere, status: 'resolved' } }),
    prisma.defect.count({ where: { ...allTimeWhere, status: { not: 'resolved' } } }),
    previous ? prisma.defect.count({ where: buildDefectWhere(filters, previous) }) : Promise.resolve(null),
  ]);

  const periodChangePercent =
    previousPeriod !== null && previousPeriod > 0 ? Math.round(((period - previousPeriod) / previousPeriod) * 100) : null;

  return { total, period, resolved, pending, periodChangePercent };
}

export async function getDefectTrend(filters: ResolvedAnalyticsFilters, bucket: TrendBucket): Promise<TrendPoint[]> {
  const prisma = getPrisma();
  const conditions = buildRawConditions(filters);

  const rows = await prisma.$queryRaw<{ bucket_start: Date; count: bigint }[]>`
    select date_trunc(${bucket}, d.created_at) as bucket_start, count(*)::bigint as count
      from public.defects d
     where ${Prisma.join(conditions, ' and ')}
     group by bucket_start
     order by bucket_start asc
  `;

  const includeYear = spansMultipleYears(filters.from, filters.to);
  return rows.map((row) => ({
    bucketStart: row.bucket_start.toISOString(),
    label: formatBucketLabel(row.bucket_start, bucket, includeYear),
    count: Number(row.count),
  }));
}

/** Scalar groupBy on Defect.defectReason — no join needed. Includes "Not Classified" (null) as its own item. */
export async function getReasonBreakdown(filters: ResolvedAnalyticsFilters): Promise<ReasonBreakdownItem[]> {
  const prisma = getPrisma();
  const grouped = await prisma.defect.groupBy({
    by: ['defectReason'],
    where: buildDefectWhere(filters),
    _count: { _all: true },
  });

  const total = grouped.reduce((sum, g) => sum + g._count._all, 0);
  const countByCode = new Map(grouped.map((g) => [g.defectReason, g._count._all]));
  const percentageOf = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

  const items: ReasonBreakdownItem[] = DEFECT_REASONS.map((reason) => {
    const count = countByCode.get(reason.code) ?? 0;
    return { code: reason.code, label: reason.label, count, percentage: percentageOf(count) };
  });

  const notClassifiedCount = countByCode.get(null) ?? 0;
  items.push({ code: 'NOT_CLASSIFIED', label: 'Not Classified', count: notClassifiedCount, percentage: percentageOf(notClassifiedCount) });

  return items;
}

/** Joins defect_categories; count(distinct defect id) avoids double-counting a defect with several categories. */
export async function getCategoryBreakdown(filters: ResolvedAnalyticsFilters): Promise<CategoryBreakdownItem[]> {
  const prisma = getPrisma();
  const conditions = buildRawConditions(filters);

  const rows = await prisma.$queryRaw<{ name: string; count: bigint }[]>`
    select dc.name as name, count(distinct d.id)::bigint as count
      from public.defects d
      join public.defect_categories dc on dc.defect_id = d.id
     where ${Prisma.join(conditions, ' and ')}
     group by dc.name
     order by count desc
  `;

  const total = rows.reduce((sum, row) => sum + Number(row.count), 0);
  return rows.map((row) => ({
    name: row.name,
    count: Number(row.count),
    percentage: total > 0 ? Math.round((Number(row.count) / total) * 100) : 0,
  }));
}

/** One groupBy (by analystId, a plain scalar FK) + one profile lookup — never N+1. */
export async function getAnalystBreakdown(filters: ResolvedAnalyticsFilters): Promise<AnalystBreakdownItem[]> {
  const prisma = getPrisma();
  const grouped = await prisma.defect.groupBy({
    by: ['analystId'],
    where: buildDefectWhere(filters),
    _count: { _all: true },
    orderBy: { _count: { analystId: 'desc' } },
  });

  if (grouped.length === 0) return [];

  const profiles = await prisma.profile.findMany({
    where: { id: { in: grouped.map((g) => g.analystId) } },
    select: { id: true, firstName: true, lastName: true },
  });
  const nameById = new Map(profiles.map((profile) => [profile.id, `${profile.firstName} ${profile.lastName}`]));

  return grouped.map((g) => ({ analystId: g.analystId, name: nameById.get(g.analystId) ?? 'Unknown', count: g._count._all }));
}

export async function getReasonCategoryMatrix(filters: ResolvedAnalyticsFilters): Promise<ReasonCategoryMatrix> {
  const prisma = getPrisma();
  const conditions = buildRawConditions(filters);

  const rows = await prisma.$queryRaw<{ reason: string | null; category: string; count: bigint }[]>`
    select d.defect_reason as reason, dc.name as category, count(distinct d.id)::bigint as count
      from public.defects d
      join public.defect_categories dc on dc.defect_id = d.id
     where ${Prisma.join(conditions, ' and ')}
     group by d.defect_reason, dc.name
  `;

  const cells = rows.map((row) => ({
    reason: isDefectReasonCode(row.reason) ? row.reason : ('NOT_CLASSIFIED' as const),
    category: row.category,
    count: Number(row.count),
  }));

  const totalByCategory = new Map<string, number>();
  for (const cell of cells) {
    totalByCategory.set(cell.category, (totalByCategory.get(cell.category) ?? 0) + cell.count);
  }
  const categories = [...totalByCategory.keys()].sort((a, b) => (totalByCategory.get(b) ?? 0) - (totalByCategory.get(a) ?? 0));

  const reasons = [...DEFECT_REASON_CODES, 'NOT_CLASSIFIED' as const];
  const maxCount = cells.reduce((max, cell) => Math.max(max, cell.count), 0);

  return { reasons, categories, cells, maxCount };
}

'use client';

import { AlertTriangle } from 'lucide-react';
import { AnalyticsFiltersBar } from '@/features/analytics/components/AnalyticsFiltersBar';
import { AnalyticsHeader } from '@/features/analytics/components/AnalyticsHeader';
import { AnalystBreakdownSection } from '@/features/analytics/components/AnalystBreakdownSection';
import { CategoryBreakdownSection } from '@/features/analytics/components/CategoryBreakdownSection';
import { DefectTrendSection } from '@/features/analytics/components/DefectTrendSection';
import { KpiCardsRow } from '@/features/analytics/components/KpiCardsRow';
import { ReasonBreakdownSection } from '@/features/analytics/components/ReasonBreakdownSection';
import { ReasonCategoryMatrixSection } from '@/features/analytics/components/ReasonCategoryMatrixSection';
import { StatusSummaryPanel } from '@/features/analytics/components/StatusSummaryPanel';
import { useAnalyticsData } from '@/features/analytics/hooks/useAnalyticsData';
import { useAnalyticsFilters } from '@/features/analytics/hooks/useAnalyticsFilters';
import { useTheme } from '@/providers/ThemeProvider';

export function AnalyticsView() {
  const { t } = useTheme();
  const { filters, updateFilters, resetFilters } = useAnalyticsFilters();
  const state = useAnalyticsData(filters);

  return (
    <div className="space-y-4">
      <AnalyticsHeader />
      <AnalyticsFiltersBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      {state.status === 'loading' && (
        <div className={`${t.cardBg} p-6 rounded-[14px] border text-center text-xs ${t.mutedText}`}>Loading Analytics…</div>
      )}

      {state.status === 'error' && (
        <div className="p-4 rounded-[14px] border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 flex items-start gap-2 text-red-700 dark:text-red-300 text-xs">
          <AlertTriangle className="w-4 h-4 mt-px flex-shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      {state.status === 'ready' && (
        <>
          <KpiCardsRow kpis={state.data.kpis} />

          {/* Primary row: Defect Trend (7/12) + Defects by Reason (5/12).
              min-w-0 on every grid item: without it, a recharts ResponsiveContainer measures its
              parent's content-driven width instead of the grid track's, and refuses to shrink
              below that on narrow viewports — the classic chart-in-a-grid overflow. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
            <div className="min-w-0 lg:col-span-7">
              <DefectTrendSection trend={state.data.trend} />
            </div>
            <div className="min-w-0 lg:col-span-5">
              <ReasonBreakdownSection items={state.data.reasonBreakdown} onSelect={(reason) => updateFilters({ reason })} />
            </div>
          </div>

          {/* Secondary row: Category (4/12) + Analyst (4/12) + Status Summary (4/12) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
            <div className="min-w-0 lg:col-span-4">
              <CategoryBreakdownSection items={state.data.categoryBreakdown} onSelect={(category) => updateFilters({ category })} />
            </div>
            <div className="min-w-0 lg:col-span-4">
              <AnalystBreakdownSection items={state.data.analystBreakdown} onSelect={(analystId) => updateFilters({ analystId })} />
            </div>
            <div className="min-w-0 md:col-span-2 lg:col-span-4">
              <StatusSummaryPanel kpis={state.data.kpis} />
            </div>
          </div>

          <ReasonCategoryMatrixSection
            matrix={state.data.reasonCategoryMatrix}
            onSelect={(reason, category) => updateFilters({ reason, category })}
          />
        </>
      )}
    </div>
  );
}

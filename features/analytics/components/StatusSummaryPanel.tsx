import { useTheme } from '@/providers/ThemeProvider';
import type { AnalyticsKpis } from '@/types/analytics';

/**
 * Fills the 3rd slot of the secondary row with Resolved/Pending/Resolution Rate — all derived from
 * the AnalyticsKpis already fetched for the KPI strip (resolved/pending/total). No new query: a
 * Resolution Rate query wasn't appropriate to add just for this layout pass, and this number is
 * already fully computable from data the page already has.
 */
export function StatusSummaryPanel({ kpis }: { kpis: AnalyticsKpis }) {
  const { darkMode, t } = useTheme();
  const resolutionRate = kpis.total > 0 ? Math.round((kpis.resolved / kpis.total) * 100) : null;
  const resolvedShare = kpis.total > 0 ? (kpis.resolved / kpis.total) * 100 : 0;
  const pendingShare = kpis.total > 0 ? (kpis.pending / kpis.total) * 100 : 0;

  return (
    <div className={`${t.cardBg} p-3 rounded-[14px] border h-full flex flex-col`}>
      <div>
        <h4 className={`font-bold text-xs ${t.headingText}`}>STATUS SUMMARY</h4>
        <p className={`text-[10px] ${t.mutedText} mt-0.5`}>Resolved vs. pending for the current filters</p>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2 mt-2">
        <div className="flex items-center justify-between text-xs">
          <span className={t.mutedText}>Resolved</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{kpis.resolved}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className={t.mutedText}>Pending</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">{kpis.pending}</span>
        </div>

        <div className={`h-1.5 rounded-full overflow-hidden flex ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
          <div className="bg-emerald-500" style={{ width: `${resolvedShare}%` }} />
          <div className="bg-amber-500" style={{ width: `${pendingShare}%` }} />
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className={t.mutedText}>Resolution Rate</span>
          <span className={`font-bold ${t.headingText}`}>{resolutionRate !== null ? `${resolutionRate}%` : '—'}</span>
        </div>
      </div>
    </div>
  );
}

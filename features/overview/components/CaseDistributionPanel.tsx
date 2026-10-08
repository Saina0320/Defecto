import { Building2, User as UserIcon } from 'lucide-react';
import type { CaseMetrics } from '@/features/overview/lib/metrics';
import { useTheme } from '@/providers/ThemeProvider';

/** Individual vs. Entity split — derived from the same CaseMetrics already computed for the KPI row, no new data source. */
export function CaseDistributionPanel({ metrics }: { metrics: CaseMetrics }) {
  const { darkMode, t } = useTheme();
  const individualShare = metrics.total > 0 ? Math.round((metrics.individualCount / metrics.total) * 100) : 0;
  const entityShare = metrics.total > 0 ? Math.round((metrics.entityCount / metrics.total) * 100) : 0;

  return (
    <div className={`${t.cardBg} p-4 rounded-[14px] border h-full flex flex-col`}>
      <div className="mb-3">
        <h4 className={`font-bold text-xs ${t.headingText}`}>CASE DISTRIBUTION</h4>
        <p className={`text-[10px] ${t.mutedText}`}>Individual vs. Entity KYC reviews</p>
      </div>

      {metrics.total === 0 ? (
        <p className={`text-xs ${t.mutedText} italic`}>No defect data available yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className={`h-2.5 rounded-full overflow-hidden flex ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
            <div className="bg-purple-500" style={{ width: `${individualShare}%` }} />
            <div className="bg-emerald-500" style={{ width: `${entityShare}%` }} />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <span className="p-1 rounded-[8px] bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                <UserIcon className="w-3.5 h-3.5" />
              </span>
              <span className={t.mutedText}>Individual</span>
            </span>
            <span className={`font-bold ${t.headingText}`}>
              {metrics.individualCount} <span className={`font-normal ${t.mutedText}`}>({individualShare}%)</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <span className="p-1 rounded-[8px] bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                <Building2 className="w-3.5 h-3.5" />
              </span>
              <span className={t.mutedText}>Entity</span>
            </span>
            <span className={`font-bold ${t.headingText}`}>
              {metrics.entityCount} <span className={`font-normal ${t.mutedText}`}>({entityShare}%)</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

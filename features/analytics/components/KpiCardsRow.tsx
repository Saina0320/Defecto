import { CalendarRange, CheckCircle2, Clock, Layers, type LucideIcon } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import type { AnalyticsKpis } from '@/types/analytics';

function changeCaption(periodChangePercent: number | null): string {
  if (periodChangePercent === null) return 'vs. previous period: not enough data';
  const sign = periodChangePercent > 0 ? '+' : '';
  return `${sign}${periodChangePercent}% vs. previous period`;
}

type KpiTileProps = {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  value: number;
  valueClassName: string;
  caption: string;
};

/** Compact variant for this dense dashboard — intentionally separate from features/overview's
 * MetricCard (shared with Overview's KPI grid) so that card isn't affected by this layout pass. */
function KpiTile({ label, icon: Icon, iconClassName, value, valueClassName, caption }: KpiTileProps) {
  const { t } = useTheme();

  return (
    <div className={`${t.cardBg} p-3 rounded-[14px] border`}>
      <div className={`flex items-center justify-between ${t.mutedText} text-[11px] font-semibold mb-1`}>
        <span>{label}</span>
        <span className={`p-1 ${iconClassName} rounded`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
      </div>
      <div className={`text-2xl font-bold leading-tight ${valueClassName}`}>{value}</div>
      <div className={`text-[10px] ${t.mutedText} mt-0.5 truncate`}>{caption}</div>
    </div>
  );
}

export function KpiCardsRow({ kpis }: { kpis: AnalyticsKpis }) {
  const { t } = useTheme();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 [&>*]:min-w-0">
      <KpiTile
        label="Total Defects"
        icon={Layers}
        iconClassName="bg-blue-50 dark:bg-blue-900/40 text-[#0757C9] dark:text-blue-300"
        value={kpis.total}
        valueClassName={t.headingText}
        caption="Analyst/Category/Reason filters"
      />
      <KpiTile
        label="This Period"
        icon={CalendarRange}
        iconClassName="bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
        value={kpis.period}
        valueClassName="text-purple-600 dark:text-purple-400"
        caption={changeCaption(kpis.periodChangePercent)}
      />
      <KpiTile
        label="Resolved"
        icon={CheckCircle2}
        iconClassName="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
        value={kpis.resolved}
        valueClassName="text-emerald-600 dark:text-emerald-400"
        caption="Status: resolved"
      />
      <KpiTile
        label="Pending"
        icon={Clock}
        iconClassName="bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
        value={kpis.pending}
        valueClassName="text-amber-600 dark:text-amber-400"
        caption="Draft, submitted or in review"
      />
    </div>
  );
}

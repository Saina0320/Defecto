import { Building2, CalendarRange, Layers, User as UserIcon } from 'lucide-react';
import { MetricCard } from '@/features/overview/components/MetricCard';
import type { CaseMetrics } from '@/features/overview/lib/metrics';
import { useTheme } from '@/providers/ThemeProvider';

export function CaseMetricsGrid({ metrics }: { metrics: CaseMetrics }) {
  const { t } = useTheme();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total Defects"
        icon={Layers}
        iconClassName="bg-blue-50 dark:bg-blue-900/40 text-[#0757C9] dark:text-[#4A9BFF]"
        value={metrics.total}
        valueClassName={t.headingText}
        caption="Total QC defect records in system"
      />
      <MetricCard
        label="Individual Cases"
        icon={UserIcon}
        iconClassName="bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
        value={metrics.individualCount}
        valueClassName="text-purple-600 dark:text-purple-400"
        caption="Individual client KYC reviews"
      />
      <MetricCard
        label="Entity Cases"
        icon={Building2}
        iconClassName="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
        value={metrics.entityCount}
        valueClassName="text-emerald-600 dark:text-emerald-400"
        caption="Corporate & institutional entity reviews"
      />
      <MetricCard
        label="This Period"
        icon={CalendarRange}
        iconClassName="bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
        value={metrics.thisPeriodCount}
        valueClassName="text-amber-600 dark:text-amber-400"
        caption="Logged this calendar month"
      />
    </div>
  );
}

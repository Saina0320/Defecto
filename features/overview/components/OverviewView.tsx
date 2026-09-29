'use client';

import { useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { AnalystActivityPanel } from '@/features/overview/components/AnalystActivityPanel';
import { CaseMetricsGrid } from '@/features/overview/components/CaseMetricsGrid';
import { OverviewHero } from '@/features/overview/components/OverviewHero';
import { RecentDefectsTable } from '@/features/overview/components/RecentDefectsTable';
import { computeCaseMetrics } from '@/features/overview/lib/metrics';
import { useTeam } from '@/features/team/context/TeamProvider';
import { isSupervisorRole } from '@/lib/permissions';
import { useTheme } from '@/providers/ThemeProvider';

export function OverviewView() {
  const { darkMode, t } = useTheme();
  const { defects } = useDefects();
  const { currentUser } = useTeam();
  const metrics = useMemo(() => computeCaseMetrics(defects), [defects]);

  return (
    <div className="space-y-6">
      <OverviewHero defectCount={defects.length} />
      <CaseMetricsGrid metrics={metrics} />

      {isSupervisorRole(currentUser.role) ? (
        <AnalystActivityPanel />
      ) : (
        <div
          className={`${darkMode ? 'bg-blue-950/20 border-blue-900/40' : 'bg-blue-50/50 border-blue-100'} p-4 rounded-lg border text-xs ${t.mutedText} flex items-center gap-2`}
        >
          <ShieldCheck className="w-4 h-4 text-[#003EA4] dark:text-blue-400 flex-shrink-0" />
          <span>
            Analyst view active: Showing case metrics for registered defects. Team workload overview is reserved for management.
          </span>
        </div>
      )}

      <RecentDefectsTable defects={defects} />
    </div>
  );
}

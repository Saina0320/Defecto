'use client';

import { useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { AnalystActivityPanel } from '@/features/overview/components/AnalystActivityPanel';
import { CaseDistributionPanel } from '@/features/overview/components/CaseDistributionPanel';
import { CaseMetricsGrid } from '@/features/overview/components/CaseMetricsGrid';
import { DefectReasonPanel } from '@/features/overview/components/DefectReasonPanel';
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
    <div className="space-y-4">
      <OverviewHero defectCount={defects.length} />
      <CaseMetricsGrid metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DefectReasonPanel />
        <CaseDistributionPanel metrics={metrics} />
      </div>

      {isSupervisorRole(currentUser.role) ? (
        <AnalystActivityPanel />
      ) : (
        <div
          className={`${darkMode ? 'bg-blue-950/20 border-blue-900/40' : 'bg-[#EDF4FD] border-[#D9E2EC]'} p-4 rounded-[14px] border text-xs ${t.mutedText} flex items-center gap-2`}
        >
          <ShieldCheck className="w-4 h-4 text-[#0757C9] dark:text-[#4A9BFF] flex-shrink-0" />
          <span>
            Analyst view active: Showing case metrics for registered defects. Team workload overview is reserved for management.
          </span>
        </div>
      )}

      <RecentDefectsTable defects={defects} />
    </div>
  );
}

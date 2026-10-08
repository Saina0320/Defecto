import { useMemo } from 'react';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { AnalystActivityChart } from '@/features/overview/components/AnalystActivityChart';
import { TeamAcknowledgmentSummary } from '@/features/overview/components/TeamAcknowledgmentSummary';
import { buildAnalystActivity, computeTeamAcknowledgmentRate } from '@/features/overview/lib/metrics';
import { useTeam } from '@/features/team/context/TeamProvider';
import { useTheme } from '@/providers/ThemeProvider';

const MAX_CHART_ANALYSTS = 10;

/** Team workload chart for managers and admins. */
export function AnalystActivityPanel() {
  const { t } = useTheme();
  const { defects } = useDefects();
  const { teamUsers, currentUser } = useTeam();

  const activity = useMemo(() => buildAnalystActivity(defects, teamUsers), [defects, teamUsers]);
  const acknowledgmentRate = useMemo(() => computeTeamAcknowledgmentRate(defects, teamUsers), [defects, teamUsers]);

  return (
    <div className={`${t.cardBg} p-5 rounded-[14px] border space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className={`font-bold text-sm ${t.headingText}`}>ANALYST ACTIVITY BREAKDOWN</h4>
            <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
              {currentUser.role} View
            </span>
          </div>
          <p className={`text-xs ${t.mutedText} mt-0.5`}>Defect recording activity distribution per team analyst</p>
        </div>
      </div>

      <AnalystActivityChart data={activity.slice(0, MAX_CHART_ANALYSTS)} />

      {currentUser.role === 'Admin' && <TeamAcknowledgmentSummary rate={acknowledgmentRate} />}
    </div>
  );
}

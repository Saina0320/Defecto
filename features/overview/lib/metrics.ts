import { getAcknowledgmentAudience } from '@/features/team/lib/roster';
import type { Defect } from '@/types/defect';
import type { TeamMember } from '@/types/team';

export type CaseMetrics = {
  total: number;
  individualCount: number;
  entityCount: number;
};

export type AnalystActivity = {
  /** First name, used as the chart label. */
  name: string;
  fullName: string;
  defectsLogged: number;
};

export function computeCaseMetrics(defects: Defect[]): CaseMetrics {
  return {
    total: defects.length,
    individualCount: defects.filter((defect) => defect.caseType === 'Individual').length,
    entityCount: defects.filter((defect) => defect.caseType === 'Entity').length,
  };
}

/** Defects logged per analyst (matched by analyst name), in roster order. */
export function buildAnalystActivity(defects: Defect[], users: TeamMember[]): AnalystActivity[] {
  const activityByName = new Map<string, AnalystActivity>();

  for (const analyst of users.filter((user) => user.role === 'Analyst')) {
    const shortName = analyst.name ? analyst.name.split(' ')[0] : analyst.id;
    activityByName.set(analyst.name, { name: shortName, fullName: analyst.name, defectsLogged: 0 });
  }

  for (const defect of defects) {
    const activity = activityByName.get(defect.analystName);
    if (activity) activity.defectsLogged++;
  }

  return [...activityByName.values()];
}

/** Percentage of possible read receipts (defects × active non-admin members) that exist. */
export function computeTeamAcknowledgmentRate(defects: Defect[], users: TeamMember[]): number {
  if (defects.length === 0) return 0;

  const audienceSize = getAcknowledgmentAudience(users).length || 1;
  const totalPossibleReads = defects.length * audienceSize;
  const totalReads = defects.reduce((sum, defect) => sum + defect.readReceipts.length, 0);

  return Math.min(100, Math.round((totalReads / totalPossibleReads) * 100));
}

import { DEFECT_REASONS } from '@/constants/defectReasons';
import { getAcknowledgmentAudience } from '@/features/team/lib/roster';
import type { Defect, DefectReasonCode } from '@/types/defect';
import type { TeamMember } from '@/types/team';

export type CaseMetrics = {
  total: number;
  individualCount: number;
  entityCount: number;
  /** Created within the current calendar month, derived from dateCreated already on each Defect. */
  thisPeriodCount: number;
};

export type AnalystActivity = {
  /** First name, used as the chart label. */
  name: string;
  fullName: string;
  defectsLogged: number;
};

export function computeCaseMetrics(defects: Defect[]): CaseMetrics {
  const currentMonthPrefix = new Date().toISOString().substring(0, 7); // "yyyy-mm"
  return {
    total: defects.length,
    individualCount: defects.filter((defect) => defect.caseType === 'Individual').length,
    entityCount: defects.filter((defect) => defect.caseType === 'Entity').length,
    thisPeriodCount: defects.filter((defect) => defect.dateCreated.startsWith(currentMonthPrefix)).length,
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

export type DefectReasonBreakdownItem = {
  code: DefectReasonCode;
  label: string;
  shortLabel: string;
  count: number;
  /** Of classified defects only — see classifiedCount on DefectReasonBreakdown. */
  percentage: number;
};

export type DefectReasonBreakdown = {
  items: DefectReasonBreakdownItem[];
  /** Defects with a defectReason recorded. Percentages are relative to this, not totalCount. */
  classifiedCount: number;
  totalCount: number;
};

/**
 * "Defects by Reason" — real counts/percentages from stored data only, never invented. Defects
 * without a recorded reason (historical, or not yet classified) are excluded from the percentage
 * base so they don't get silently folded into any one category.
 */
export function computeDefectReasonBreakdown(defects: Defect[]): DefectReasonBreakdown {
  const classified = defects.filter((defect) => defect.defectReason !== null);
  const classifiedCount = classified.length;

  const items = DEFECT_REASONS.map((reason) => {
    const count = classified.filter((defect) => defect.defectReason === reason.code).length;
    return {
      code: reason.code,
      label: reason.label,
      shortLabel: reason.shortLabel,
      count,
      percentage: classifiedCount > 0 ? Math.round((count / classifiedCount) * 100) : 0,
    };
  });

  return { items, classifiedCount, totalCount: defects.length };
}

/** Percentage of possible read receipts (defects × active non-admin members) that exist. */
export function computeTeamAcknowledgmentRate(defects: Defect[], users: TeamMember[]): number {
  if (defects.length === 0) return 0;

  const audienceSize = getAcknowledgmentAudience(users).length || 1;
  const totalPossibleReads = defects.length * audienceSize;
  const totalReads = defects.reduce((sum, defect) => sum + defect.readReceipts.length, 0);

  return Math.min(100, Math.round((totalReads / totalPossibleReads) * 100));
}

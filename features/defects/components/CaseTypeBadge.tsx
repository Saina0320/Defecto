import { getCaseTypeBadgeClass } from '@/lib/theme';
import { useTheme } from '@/providers/ThemeProvider';
import type { CaseType } from '@/types/defect';

type CaseTypeBadgeProps = {
  caseType: CaseType;
  /** Size and layout classes for the placement. */
  className: string;
};

export function CaseTypeBadge({ caseType, className }: CaseTypeBadgeProps) {
  const { darkMode } = useTheme();
  return <span className={`${className} ${getCaseTypeBadgeClass(caseType, darkMode)}`}>{caseType}</span>;
}

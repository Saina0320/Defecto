import { getDefectReasonDefinition } from '@/constants/defectReasons';
import { getDefectReasonBadgeClass } from '@/lib/theme';
import { useTheme } from '@/providers/ThemeProvider';
import type { DefectReasonCode } from '@/types/defect';

type DefectReasonBadgeProps = {
  code: DefectReasonCode | null;
  /** Size and layout classes for the placement. */
  className: string;
};

/** Compact reason tag for the registry table; "Not classified" for defects without one. */
export function DefectReasonBadge({ code, className }: DefectReasonBadgeProps) {
  const { darkMode } = useTheme();
  const definition = getDefectReasonDefinition(code);

  return (
    <span className={`${className} ${getDefectReasonBadgeClass(code, darkMode)}`}>{definition ? definition.shortLabel : 'Not classified'}</span>
  );
}

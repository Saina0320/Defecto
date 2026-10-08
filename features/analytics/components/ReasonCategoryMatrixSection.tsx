import type { CSSProperties } from 'react';
import { getDefectReasonDefinition } from '@/constants/defectReasons';
import { EmptyChartState } from '@/features/analytics/components/EmptyChartState';
import { useTheme } from '@/providers/ThemeProvider';
import type { ReasonCategoryMatrix } from '@/types/analytics';
import type { DefectReasonCode } from '@/types/defect';

function reasonLabel(code: DefectReasonCode | 'NOT_CLASSIFIED'): string {
  if (code === 'NOT_CLASSIFIED') return 'Not Classified';
  return getDefectReasonDefinition(code)?.shortLabel ?? code;
}

type ReasonCategoryMatrixSectionProps = {
  matrix: ReasonCategoryMatrix;
  onSelect: (reason: DefectReasonCode | 'NOT_CLASSIFIED', category: string) => void;
};

/** A reason × category heatmap: color intensity is the count, so patterns ("most SOW defects are
 * procedural") jump out visually without the component asserting any insight itself. */
export function ReasonCategoryMatrixSection({ matrix, onSelect }: ReasonCategoryMatrixSectionProps) {
  const { darkMode, t } = useTheme();
  const cellByKey = new Map(matrix.cells.map((cell) => [`${cell.reason}::${cell.category}`, cell.count]));

  const cellStyle = (count: number): CSSProperties => {
    if (count === 0 || matrix.maxCount === 0) return {};
    const intensity = count / matrix.maxCount;
    return darkMode
      ? { backgroundColor: `rgba(59, 130, 246, ${0.12 + intensity * 0.55})` }
      : { backgroundColor: `rgba(0, 62, 164, ${0.08 + intensity * 0.45})` };
  };

  return (
    <div className={`${t.cardBg} p-3 rounded-[14px] border`}>
      <div className="mb-1.5">
        <h4 className={`font-bold text-xs ${t.headingText}`}>REASON × CATEGORY</h4>
        <p className={`text-[10px] ${t.mutedText}`}>Darker = more defects. Click a cell to filter by both.</p>
      </div>

      {matrix.categories.length === 0 ? (
        <EmptyChartState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-separate border-spacing-0.5">
            <thead>
              <tr>
                <th className={`text-left p-1 ${t.mutedText} font-semibold`}>Reason \ Category</th>
                {matrix.categories.map((category) => (
                  <th key={category} className={`p-1 ${t.mutedText} font-semibold whitespace-nowrap`}>
                    {category}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.reasons.map((reason) => (
                <tr key={reason}>
                  <td className={`p-1 font-semibold ${t.headingText} whitespace-nowrap`}>{reasonLabel(reason)}</td>
                  {matrix.categories.map((category) => {
                    const count = cellByKey.get(`${reason}::${category}`) ?? 0;
                    return (
                      <td
                        key={category}
                        role={count > 0 ? 'button' : undefined}
                        onClick={count > 0 ? () => onSelect(reason, category) : undefined}
                        style={cellStyle(count)}
                        className={`text-center p-1 rounded font-bold ${t.headingText} ${count > 0 ? 'cursor-pointer hover:ring-2 hover:ring-[#0757C9]' : t.mutedText}`}
                      >
                        {count > 0 ? count : '–'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useMemo } from 'react';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { DefectReasonChart } from '@/features/overview/components/DefectReasonChart';
import { computeDefectReasonBreakdown } from '@/features/overview/lib/metrics';
import { useTheme } from '@/providers/ThemeProvider';

/** "Defects by Reason" — real counts/percentages from stored defects, visible to every role. */
export function DefectReasonPanel() {
  const { t } = useTheme();
  const { defects } = useDefects();
  const breakdown = useMemo(() => computeDefectReasonBreakdown(defects), [defects]);

  return (
    <div className={`${t.cardBg} p-4 rounded-[14px] border h-full flex flex-col`}>
      <div className="mb-3">
        <h4 className={`font-bold text-xs ${t.headingText}`}>DEFECTS BY REASON</h4>
        <p className={`text-[10px] ${t.mutedText}`}>
          {breakdown.classifiedCount > 0
            ? `Primary reason/contributing factor across ${breakdown.classifiedCount} of ${breakdown.totalCount} recorded defects`
            : 'No defects have a recorded reason yet'}
        </p>
      </div>

      {breakdown.classifiedCount > 0 ? (
        <>
          <DefectReasonChart data={breakdown.items} />
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t ${t.dividerSoft} text-[11px]`}>
            {breakdown.items.map((item) => (
              <div key={item.code} className="flex items-center justify-between">
                <span className={t.mutedText}>{item.label}</span>
                <span className={`font-bold ${t.headingText}`}>
                  {item.percentage}% <span className={`font-normal ${t.mutedText}`}>({item.count})</span>
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className={`text-xs ${t.mutedText} italic`}>
          Reasons are recorded in Step 3 of the New Defect flow. Once defects are classified, their breakdown appears here.
        </p>
      )}
    </div>
  );
}

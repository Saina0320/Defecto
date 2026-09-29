import { CheckCheck } from 'lucide-react';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { getCategoryBadgeClass } from '@/lib/theme';
import { useTheme } from '@/providers/ThemeProvider';

/** Read-only recap of the draft shown before submission. */
export function FinalReviewSummary() {
  const { darkMode, t } = useTheme();
  const { draft, analyst } = useNewDefectDraft();

  const sectionBorder = darkMode ? 'border-[#1E2E4A]' : 'border-blue-200/60';
  const summaryItems = [
    { label: 'Case Type:', value: draft.caseType, truncate: false },
    { label: 'Analyst:', value: analyst, truncate: false },
    { label: 'QC File:', value: draft.qcFile?.name || 'Attached', truncate: true },
    { label: 'Final ZIP:', value: draft.finalZip?.name || 'None (Optional)', truncate: true },
  ];

  return (
    <div
      className={`p-4 rounded-lg border space-y-3 ${darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-bold text-xs ${t.cyanTagText} uppercase tracking-wider flex items-center gap-1.5`}>
          <CheckCheck className="w-4 h-4" /> Final Review & Confirmation
        </span>
        <span className={`text-[11px] font-mono ${t.mutedText}`}>
          CCID: <strong className={t.headingText}>{draft.ccid || 'N/A'}</strong> | KYCID: <strong className={t.headingText}>{draft.kycid || 'N/A'}</strong>
        </span>
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] pt-2 border-t ${sectionBorder}`}>
        {summaryItems.map((item) => (
          <div key={item.label}>
            <span className={`${t.mutedText} block`}>{item.label}</span>
            <span className={`font-bold ${t.headingText}${item.truncate ? ' truncate block' : ''}`}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className={`pt-2 border-t ${sectionBorder} text-[11px]`}>
        <span className={`${t.mutedText} block mb-1`}>Selected Categories ({draft.categories.length}):</span>
        <div className="flex flex-wrap gap-1">
          {draft.categories.map((category, index) => (
            <span key={index} className={`px-1.5 py-0.5 rounded text-[10px] ${getCategoryBadgeClass(category.section, darkMode)}`}>
              {category.section}: {category.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

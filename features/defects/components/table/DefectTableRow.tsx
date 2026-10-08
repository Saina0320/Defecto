import type { MouseEvent } from 'react';
import { CaseTypeBadge } from '@/features/defects/components/CaseTypeBadge';
import { CategoryBadge } from '@/features/defects/components/CategoryBadge';
import { DefectReasonBadge } from '@/features/defects/components/DefectReasonBadge';
import { AttachmentBadge } from '@/features/defects/components/table/AttachmentBadge';
import { CopyableValue } from '@/features/defects/components/table/CopyableValue';
import { DefectRowActions } from '@/features/defects/components/table/DefectRowActions';
import { ReadStatusButton } from '@/features/defects/components/table/ReadStatusButton';
import { useDefectDialogs } from '@/features/defects/context/DefectDialogsProvider';
import { formatCcidDisplay } from '@/features/defects/lib/identifiers';
import { useTeam } from '@/features/team/context/TeamProvider';
import { useTheme } from '@/providers/ThemeProvider';
import type { Defect } from '@/types/defect';

type DefectTableRowProps = {
  defect: Defect;
  /** Registry rows show the creation date and open the detail drawer when clicked. */
  variant: 'recent' | 'registry';
};

const stopPropagation = (e: MouseEvent) => e.stopPropagation();

export function DefectTableRow({ defect, variant }: DefectTableRowProps) {
  const { darkMode, t } = useTheme();
  const { currentUser } = useTeam();
  const { openDetails } = useDefectDialogs();
  const isRegistry = variant === 'registry';
  const isOwner = defect.ownerId === currentUser.id;

  return (
    <tr
      onClick={isRegistry ? () => openDetails(defect) : undefined}
      className={`${t.tableRowHover} ${isRegistry ? 'cursor-pointer ' : ''}transition`}
    >
      <td className="p-3">
        <CopyableValue
          value={defect.ccid}
          display={formatCcidDisplay(defect.ccid)}
          label="CCID"
          copyTitle="Copy 16-digit CCID"
          className="flex items-center gap-1 font-mono font-bold text-[#0757C9] dark:text-blue-400 text-xs"
        />
      </td>
      <td className="p-3">
        <CopyableValue
          value={defect.kycid}
          label="KYCID"
          copyTitle="Copy KYCID (including KYC-)"
          className={`flex items-center gap-1 font-mono ${t.headingText} font-semibold text-xs`}
        />
      </td>
      <td className="p-3">
        <CaseTypeBadge caseType={defect.caseType} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] tracking-wide" />
      </td>
      <td className={`p-3 ${t.headingText} font-medium`}>
        <span>{defect.analystName}</span>
        {isOwner && (
          <span className={`ml-1 text-[9px] px-1.5 py-0.2 rounded font-bold ${darkMode ? 'bg-blue-900/60 text-blue-300' : 'bg-blue-100 text-[#063B82]'}`}>
            YOU
          </span>
        )}
      </td>
      {isRegistry && <td className={`p-3 font-mono ${t.mutedText}`}>{defect.dateCreated}</td>}
      <td className="p-3">
        <div className="flex flex-wrap gap-1 max-w-xs">
          {defect.selectedCategories.map((category, index) => (
            <CategoryBadge
              key={index}
              category={category}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] tracking-tight"
            />
          ))}
        </div>
      </td>
      <td className="p-3">
        <DefectReasonBadge code={defect.defectReason} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] whitespace-nowrap" />
      </td>
      <td className="p-3">
        <AttachmentBadge kind="qc" fileName={defect.qcFile?.name} />
      </td>
      <td className="p-3">
        {defect.finalZipFile ? (
          <AttachmentBadge kind="zip" fileName={defect.finalZipFile.name} />
        ) : (
          <span className={`text-[11px] ${t.mutedText} italic`}>None attached</span>
        )}
      </td>
      <td className="p-3" onClick={stopPropagation}>
        <ReadStatusButton defect={defect} />
      </td>
      <td className="p-3 text-right" onClick={stopPropagation}>
        <DefectRowActions defect={defect} />
      </td>
    </tr>
  );
}

import Link from 'next/link';
import { ChevronRight, FileSearch, ShieldAlert } from 'lucide-react';
import { DataTableHead, type DataTableColumn } from '@/components/ui/DataTableHead';
import { ROUTES } from '@/constants/routes';
import { DefectTableRow } from '@/features/defects/components/table/DefectTableRow';
import { getDefectRowKey } from '@/features/defects/lib/identifiers';
import { useTheme } from '@/providers/ThemeProvider';
import type { Defect } from '@/types/defect';

const RECENT_LIMIT = 5;

const RECENT_COLUMNS: readonly DataTableColumn[] = [
  { label: 'CCID' },
  { label: 'KYCID' },
  { label: 'Case Type' },
  { label: 'Analyst' },
  { label: 'Core / Appendix Areas' },
  { label: 'QC Findings' },
  { label: 'Final ZIP' },
  { label: 'Read Status' },
  { label: 'Actions', align: 'right' },
];

export function RecentDefectsTable({ defects }: { defects: Defect[] }) {
  const { t } = useTheme();

  return (
    <div className={`${t.cardBg} rounded-lg border overflow-hidden`}>
      <div className={`p-4 ${t.tableHeaderBg} border-b flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#003EA4] dark:text-blue-400" />
          <h4 className={`font-bold text-xs uppercase tracking-wider ${t.headingText}`}>Recent Completed KYC Defects</h4>
        </div>
        <Link
          href={ROUTES.defects}
          className={`text-xs font-semibold ${t.cyanTagText} hover:underline flex items-center gap-1 cursor-pointer text-center`}
        >
          <span>View all {defects.length} in registry</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <DataTableHead columns={RECENT_COLUMNS} />
          <tbody className={t.tableBorder}>
            {defects.length === 0 ? (
              <tr>
                <td colSpan={RECENT_COLUMNS.length} className={`text-center py-10 ${t.mutedText}`}>
                  <FileSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-xs">No defects found in registry.</p>
                  <Link
                    href={ROUTES.newDefect}
                    className="inline-block text-center mt-2 px-3.5 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white text-[11px] rounded font-semibold cursor-pointer shadow-xs"
                  >
                    Log First Defect
                  </Link>
                </td>
              </tr>
            ) : (
              defects
                .slice(0, RECENT_LIMIT)
                .map((defect, index) => <DefectTableRow key={getDefectRowKey(defect, index)} defect={defect} variant="recent" />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

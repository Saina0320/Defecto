import Link from 'next/link';
import { FileSearch } from 'lucide-react';
import { DataTableHead, type DataTableColumn } from '@/components/ui/DataTableHead';
import { ROUTES } from '@/constants/routes';
import { DefectTableRow } from '@/features/defects/components/table/DefectTableRow';
import { getDefectRowKey } from '@/features/defects/lib/identifiers';
import { useTheme } from '@/providers/ThemeProvider';
import type { Defect } from '@/types/defect';

const REGISTRY_COLUMNS: readonly DataTableColumn[] = [
  { label: 'CCID' },
  { label: 'KYCID' },
  { label: 'Case Type' },
  { label: 'Analyst' },
  { label: 'Date' },
  { label: 'Involved Categories' },
  { label: 'QC Findings' },
  { label: 'Final Case ZIP' },
  { label: 'Read Status' },
  { label: 'Actions', align: 'right' },
];

type RegistryTableProps = {
  defects: Defect[];
  totalCount: number;
};

export function RegistryTable({ defects, totalCount }: RegistryTableProps) {
  const { t } = useTheme();

  return (
    <div className={`${t.cardBg} rounded-lg border overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <DataTableHead columns={REGISTRY_COLUMNS} />
          <tbody className={t.tableBorder}>
            {defects.length === 0 ? (
              <tr>
                <td colSpan={REGISTRY_COLUMNS.length} className={`text-center py-14 ${t.mutedText}`}>
                  <FileSearch className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#003EA4] dark:text-blue-400" />
                  <p className={`font-bold text-sm ${t.headingText}`}>No defects found in registry</p>
                  <p className="text-xs mt-1">There are currently no recorded defects matching this view.</p>
                  <Link
                    href={ROUTES.newDefect}
                    className="inline-block text-center mt-3 px-4 py-2 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs rounded-md font-semibold cursor-pointer shadow-xs"
                  >
                    + Enter New Defect
                  </Link>
                </td>
              </tr>
            ) : (
              defects.map((defect, index) => (
                <DefectTableRow key={getDefectRowKey(defect, index)} defect={defect} variant="registry" />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={`p-3 ${t.tableHeaderBg} border-t flex items-center justify-between text-xs ${t.mutedText}`}>
        <span>
          Displaying {defects.length} of {totalCount} defect records
        </span>
        <span className="font-mono text-[11px]">CCID (16 Digits) & KYCID (with KYC-)</span>
      </div>
    </div>
  );
}

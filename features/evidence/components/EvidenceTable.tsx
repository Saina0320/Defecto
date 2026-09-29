import { Download, FileText, FolderArchive } from 'lucide-react';
import { DataTableHead, type DataTableColumn } from '@/components/ui/DataTableHead';
import { formatCcidDisplay } from '@/features/defects/lib/identifiers';
import { getDocTypeBadgeClass } from '@/lib/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';
import type { EvidenceItem } from '@/types/evidence';

const EVIDENCE_COLUMNS: readonly DataTableColumn[] = [
  { label: 'File ID' },
  { label: 'File Name' },
  { label: 'Document Type' },
  { label: 'Linked CCID' },
  { label: 'Uploaded By' },
  { label: 'Date' },
  { label: 'Actions', align: 'right' },
];

export function EvidenceTable({ files }: { files: EvidenceItem[] }) {
  const { darkMode, t } = useTheme();
  const { showToast } = useToast();

  return (
    <div className={`${t.cardBg} rounded-lg border overflow-hidden`}>
      <table className="w-full text-left text-xs">
        <DataTableHead columns={EVIDENCE_COLUMNS} />
        <tbody className={t.tableBorder}>
          {files.length === 0 ? (
            <tr>
              <td colSpan={EVIDENCE_COLUMNS.length} className={`text-center py-12 ${t.mutedText}`}>
                <FolderArchive className="w-8 h-8 mx-auto mb-2 opacity-40 text-neutral-400" />
                <p className="font-semibold text-xs">No evidence documents currently stored in vault.</p>
              </td>
            </tr>
          ) : (
            files.map((file, index) => (
              <tr key={index} className={`${t.tableRowHover} transition`}>
                <td className="p-3 font-mono font-bold text-[#003EA4] dark:text-blue-400">{file.id}</td>
                <td className="p-3">
                  <div className={`font-semibold ${t.headingText} flex items-center gap-1.5`}>
                    <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    {file.fileName}
                  </div>
                  <div className={`text-[10px] ${t.mutedText}`}>{file.size}</div>
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] ${getDocTypeBadgeClass(file.tag, darkMode)}`}>
                    {file.fileType}
                  </span>
                </td>
                <td className="p-3 font-mono font-semibold text-xs text-[#003EA4] dark:text-blue-400">{formatCcidDisplay(file.ccid)}</td>
                <td className={`p-3 ${t.headingText}`}>{file.uploadedBy}</td>
                <td className={`p-3 ${t.mutedText} font-mono text-[11px]`}>{file.date}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => showToast(`Downloading ${file.fileName}`)}
                    className="p-1 text-neutral-500 hover:text-[#003EA4] dark:hover:text-blue-300 rounded cursor-pointer"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

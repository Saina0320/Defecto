import { useState } from 'react';
import { Download, FileText, FolderArchive, Loader2 } from 'lucide-react';
import { DataTableHead, type DataTableColumn } from '@/components/ui/DataTableHead';
import { formatCcidDisplay } from '@/features/defects/lib/identifiers';
import { getEvidenceDownloadUrl } from '@/features/evidence/actions';
import { getDocTypeBadgeClass } from '@/lib/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';
import type { EvidenceItem } from '@/types/evidence';

// Temporary client-side ids (features/new-defect/lib/attachmentPreview.ts) look like
// "qc-<base36>"; a real Evidence.id is a UUID and never starts with one of those prefixes.
const PENDING_ID_PATTERN = /^(qc|zip|res)-/;

const EVIDENCE_COLUMNS: readonly DataTableColumn[] = [
  { label: 'Uploaded By' },
  { label: 'File Name' },
  { label: 'Document Type' },
  { label: 'Linked CCID' },
  { label: 'Date' },
  { label: 'Actions', align: 'right' },
];

export function EvidenceTable({ files }: { files: EvidenceItem[] }) {
  const { darkMode, t } = useTheme();
  const { showToast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (file: EvidenceItem) => {
    if (downloadingId) return;
    setDownloadingId(file.id);
    const result = await getEvidenceDownloadUrl(file.id);
    setDownloadingId(null);

    if (!result.ok) {
      showToast('Could not generate a download link. Try again.');
      return;
    }
    window.open(result.url, '_blank', 'noopener,noreferrer');
  };

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
  <td className={`p-3 ${t.headingText}`}>
    {file.uploadedBy}
  </td>

  <td className="p-3">
    <div className={`font-semibold ${t.headingText} flex items-center gap-1.5`}>
      <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
      {file.fileName}
    </div>
    <div className={`text-[10px] ${t.mutedText}`}>{file.size}</div>
  </td>

  <td className="p-3">
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] ${getDocTypeBadgeClass(file.tag, darkMode)}`}
    >
      {file.fileType}
    </span>
  </td>

  <td className="p-3 font-mono font-semibold text-xs text-[#003EA4] dark:text-blue-400">
    {formatCcidDisplay(file.ccid)}
  </td>

  <td className={`p-3 ${t.mutedText} font-mono text-[11px]`}>
    {file.date}
  </td>

  <td className="p-3 text-right">
    <button
      onClick={() => handleDownload(file)}
      disabled={PENDING_ID_PATTERN.test(file.id) || downloadingId === file.id}
      className="p-1 text-neutral-500 hover:text-[#003EA4] dark:hover:text-blue-300 rounded cursor-pointer disabled:cursor-wait disabled:opacity-50"
      title={
        PENDING_ID_PATTERN.test(file.id)
          ? 'Still uploading — refresh once saved'
          : 'Download File'
      }
    >
      {downloadingId === file.id ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
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

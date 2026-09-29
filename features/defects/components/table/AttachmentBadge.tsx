import { FileText, FolderArchive } from 'lucide-react';
import { getDocTypeBadgeClass } from '@/lib/theme';
import { useTheme } from '@/providers/ThemeProvider';

const ATTACHMENT_ICONS = {
  qc: { Icon: FileText, className: 'w-3 h-3 text-red-600 dark:text-red-400 flex-shrink-0' },
  zip: { Icon: FolderArchive, className: 'w-3 h-3 text-amber-700 dark:text-amber-400 flex-shrink-0' },
} as const;

type AttachmentBadgeProps = {
  kind: keyof typeof ATTACHMENT_ICONS;
  fileName: string | undefined;
};

/** Truncated file-name tag used in the defect tables for the QC findings file and final ZIP. */
export function AttachmentBadge({ kind, fileName }: AttachmentBadgeProps) {
  const { darkMode } = useTheme();
  const { Icon, className } = ATTACHMENT_ICONS[kind];

  return (
    <div className="inline-flex items-center gap-1 max-w-[140px]" title={fileName}>
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate ${getDocTypeBadgeClass(kind, darkMode)}`}>
        <Icon className={className} />
        <span className="truncate">{fileName}</span>
      </span>
    </div>
  );
}

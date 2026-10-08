import { FileArchive, FileCheck2, FileStack, FileText } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import type { EvidenceItem } from '@/types/evidence';

type EvidenceMetricsRowProps = { files: EvidenceItem[] };

/** Compact counts derived from the already-loaded evidence list — no new query. */
export function EvidenceMetricsRow({ files }: EvidenceMetricsRowProps) {
  const { t } = useTheme();
  const qcCount = files.filter((file) => file.tag === 'qc').length;
  const zipCount = files.filter((file) => file.tag === 'zip').length;
  const resCount = files.filter((file) => file.tag === 'res').length;

  const tiles = [
    { label: 'Documents', value: files.length, icon: FileStack, className: 'bg-blue-50 dark:bg-blue-900/40 text-[#0757C9] dark:text-[#4A9BFF]' },
    { label: 'QC Findings', value: qcCount, icon: FileText, className: 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300' },
    { label: 'Case ZIPs', value: zipCount, icon: FileArchive, className: 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' },
    { label: 'Resolution Evidence', value: resCount, icon: FileCheck2, className: 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {tiles.map((tile) => (
        <div key={tile.label} className={`${t.cardBg} p-3 rounded-[14px] border flex items-center gap-2.5`}>
          <span className={`p-1.5 rounded-[8px] flex-shrink-0 ${tile.className}`}>
            <tile.icon className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className={`text-lg font-bold leading-tight ${t.headingText}`}>{tile.value}</div>
            <div className={`text-[10px] ${t.mutedText} truncate`}>{tile.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

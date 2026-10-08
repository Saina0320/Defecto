import { useState, type ReactNode } from 'react';
import { Download, Loader2, type LucideIcon } from 'lucide-react';
import { getEvidenceDownloadUrl } from '@/features/evidence/actions';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

type DrawerFileCardProps = {
  icon: LucideIcon;
  iconClassName: string;
  /** Evidence.id — a temporary client-side id (not yet persisted) disables the download button. */
  evidenceId: string;
  fileName: string;
  meta: ReactNode;
  downloadTitle: string;
};

/** Attached file row; downloads through a short-lived signed URL from the private Storage bucket. */
export function DrawerFileCard({ icon: Icon, iconClassName, evidenceId, fileName, meta, downloadTitle }: DrawerFileCardProps) {
  const { t } = useTheme();
  const { showToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  // Temporary client-side ids (attachmentPreview.ts) look like "qc-<base36>"; a real Evidence.id
  // is a UUID and never starts with one of those prefixes.
  const isPersisted = !/^(qc|zip|res)-/.test(evidenceId);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    const result = await getEvidenceDownloadUrl(evidenceId);
    setIsDownloading(false);

    if (!result.ok) {
      showToast('Could not generate a download link. Try again.');
      return;
    }
    window.open(result.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`p-3 rounded border ${t.innerBoxBg} flex items-center justify-between`}>
      <div className="flex items-center gap-2">
        <Icon className={iconClassName} />
        <div>
          <span className={`font-bold text-xs ${t.headingText} block`}>{fileName}</span>
          <span className={`text-[10px] ${t.mutedText}`}>{meta}</span>
        </div>
      </div>
      <button
        onClick={handleDownload}
        disabled={!isPersisted || isDownloading}
        className="p-1.5 text-neutral-500 hover:text-[#0757C9] rounded cursor-pointer disabled:cursor-wait disabled:opacity-50"
        title={isPersisted ? downloadTitle : 'Still uploading — refresh the page once the defect is saved'}
      >
        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      </button>
    </div>
  );
}

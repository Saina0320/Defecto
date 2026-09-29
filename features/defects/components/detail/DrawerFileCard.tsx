import type { ReactNode } from 'react';
import { Download, type LucideIcon } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

type DrawerFileCardProps = {
  icon: LucideIcon;
  iconClassName: string;
  fileName: string;
  meta: ReactNode;
  downloadTitle: string;
};

/** Attached file row with a (simulated) download action. */
export function DrawerFileCard({ icon: Icon, iconClassName, fileName, meta, downloadTitle }: DrawerFileCardProps) {
  const { t } = useTheme();
  const { showToast } = useToast();

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
        onClick={() => showToast(`Downloading ${fileName}`)}
        className="p-1.5 text-neutral-500 hover:text-[#003EA4] rounded cursor-pointer"
        title={downloadTitle}
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}

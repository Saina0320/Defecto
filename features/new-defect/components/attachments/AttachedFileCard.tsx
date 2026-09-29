import type { ReactNode } from 'react';
import { X, type LucideIcon } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

type AttachedFileCardProps = {
  icon: LucideIcon;
  iconClassName: string;
  fileName: string;
  meta: ReactNode;
  removeTitle: string;
  onRemove: () => void;
};

export function AttachedFileCard({ icon: Icon, iconClassName, fileName, meta, removeTitle, onRemove }: AttachedFileCardProps) {
  const { t } = useTheme();

  return (
    <div className={`p-3 ${t.cardBg} rounded border border-emerald-300 shadow-xs mb-3 flex items-center justify-between`}>
      <div className="flex items-center gap-2">
        <Icon className={iconClassName} />
        <div>
          <span className={`font-bold ${t.headingText} block truncate max-w-[180px]`}>{fileName}</span>
          <span className={`text-[10px] ${t.mutedText}`}>{meta}</span>
        </div>
      </div>
      <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700 p-1 cursor-pointer" title={removeTitle}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

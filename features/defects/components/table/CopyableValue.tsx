import { Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

type CopyableValueProps = {
  value: string;
  /** Text shown in the cell; defaults to the raw value. */
  display?: string;
  /** Name used in the "Copied ..." toast. */
  label: string;
  copyTitle: string;
  className: string;
};

export function CopyableValue({ value, display, label, copyTitle, className }: CopyableValueProps) {
  const copyToClipboard = useCopyToClipboard();

  return (
    <div className={className}>
      <span>{display ?? value}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          copyToClipboard(value, label);
        }}
        className="p-0.5 text-neutral-400 hover:text-[#0757C9] dark:hover:text-blue-300 rounded cursor-pointer"
        title={copyTitle}
      >
        <Copy className="w-3 h-3" />
      </button>
    </div>
  );
}

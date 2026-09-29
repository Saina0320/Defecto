import { UploadCloud } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

type UploadDropzoneProps = {
  /** Border and background classes of the dashed area. */
  className: string;
  iconClassName: string;
  title: string;
  subtitle: string;
  placeholder: string;
  fileName: string;
  onFileNameChange: (value: string) => void;
  onAttach: () => void;
  attachButtonClassName: string;
};

/** Simulated upload: the user types a file name and attaches it. */
export function UploadDropzone({
  className,
  iconClassName,
  title,
  subtitle,
  placeholder,
  fileName,
  onFileNameChange,
  onAttach,
  attachButtonClassName,
}: UploadDropzoneProps) {
  const { t } = useTheme();

  return (
    <div className={`border-2 border-dashed ${className} p-4 rounded-lg text-center space-y-2 mb-3`}>
      <UploadCloud className={iconClassName} />
      <p className={`font-semibold ${t.headingText} text-xs`}>{title}</p>
      <p className={`text-[10px] ${t.mutedText}`}>{subtitle}</p>

      <div className="pt-2 flex gap-1.5">
        <input
          type="text"
          placeholder={placeholder}
          value={fileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          className={`flex-1 p-1.5 ${t.inputBg} rounded text-xs focus:outline-none`}
        />
        <button type="button" onClick={onAttach} className={attachButtonClassName}>
          Attach
        </button>
      </div>
    </div>
  );
}

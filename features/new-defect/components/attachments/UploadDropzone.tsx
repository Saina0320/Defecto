import { UploadCloud } from 'lucide-react';
import { formatFileSize } from '@/lib/fileSize';
import { useTheme } from '@/providers/ThemeProvider';

type UploadDropzoneProps = {
  /** Border and background classes of the dashed area. */
  className: string;
  iconClassName: string;
  title: string;
  subtitle: string;
  /** Unique id for the hidden file input / its label. */
  inputId: string;
  accept?: string;
  /** File picked but not yet confirmed with "Attach". */
  pendingFile: File | null;
  onPendingFileChange: (file: File | null) => void;
  onAttach: () => void;
  attachButtonClassName: string;
};

/** Real file picker: choosing a file previews it here, "Attach" confirms it into the draft. */
export function UploadDropzone({
  className,
  iconClassName,
  title,
  subtitle,
  inputId,
  accept,
  pendingFile,
  onPendingFileChange,
  onAttach,
  attachButtonClassName,
}: UploadDropzoneProps) {
  const { t } = useTheme();

  return (
    <div className={`border-2 border-dashed ${className} p-4 rounded-lg text-center space-y-2 mb-3`}>
      <UploadCloud className={iconClassName} />
      <p className={`font-semibold ${t.headingText} text-xs`}>{title}</p>
      <p className={`text-[10px] ${t.mutedText}`}>{subtitle}</p>

      <div className="pt-2 space-y-1.5">
        <input
          id={inputId}
          type="file"
          accept={accept}
          onChange={(e) => onPendingFileChange(e.target.files?.[0] ?? null)}
          className="hidden"
        />
        <label
          htmlFor={inputId}
          className={`block w-full p-1.5 ${t.inputBg} rounded text-xs cursor-pointer truncate`}
        >
          {pendingFile ? `${pendingFile.name} (${formatFileSize(pendingFile.size)})` : 'Choose a file…'}
        </label>
        <button
          type="button"
          onClick={onAttach}
          disabled={!pendingFile}
          className={`${attachButtonClassName} w-full disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Attach
        </button>
      </div>
    </div>
  );
}

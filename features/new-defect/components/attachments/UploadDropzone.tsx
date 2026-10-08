import { UploadCloud } from 'lucide-react';
import { useFileDropzone } from '@/features/new-defect/components/attachments/useFileDropzone';
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
  /** Called instead of onPendingFileChange when a drop is rejected (wrong type, or more than one file). */
  onRejected: (message: string) => void;
  attachLabel?: string;
};

/** Real file picker: choosing a file (by click or drag & drop) previews it here, "Attach" confirms it into the draft. */
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
  onRejected,
  attachLabel = 'Attach',
}: UploadDropzoneProps) {
  const { t, darkMode } = useTheme();

  const { isDragOver, handleDragEnter, handleDragOver, handleDragLeave, handleDrop } = useFileDropzone({
    accept,
    onFile: onPendingFileChange,
    onRejected,
  });

  const dragOverClassName = darkMode ? 'border-blue-500 bg-blue-950/40' : 'border-blue-400 bg-blue-50';
  const dragOverIconClassName = `w-6 h-6 mx-auto ${darkMode ? 'text-blue-400' : 'text-blue-600'}`;

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed ${isDragOver ? dragOverClassName : className} p-4 rounded-[14px] text-center space-y-2 mb-3 transition-colors`}
    >
      <UploadCloud className={isDragOver ? dragOverIconClassName : iconClassName} />
      <p className={`font-semibold ${t.headingText} text-xs`}>{isDragOver ? 'Drop file here' : title}</p>
      <p className={`text-[10px] ${t.mutedText}`}>{isDragOver ? 'Release to upload' : subtitle}</p>

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
          {pendingFile ? `${pendingFile.name} (${formatFileSize(pendingFile.size)})` : 'Choose a file or drag it here…'}
        </label>
        <button
          type="button"
          onClick={onAttach}
          disabled={!pendingFile}
          className={`${attachButtonClassName} w-full disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {attachLabel}
        </button>
      </div>
    </div>
  );
}

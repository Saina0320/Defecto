import { useCallback, useRef, useState, type DragEvent } from 'react';
import { matchesAccept } from '@/features/new-defect/lib/fileAccept';

type UseFileDropzoneOptions = {
  accept?: string;
  /** Receives the dropped File exactly as picked — fed into the same pending-file slot the input uses. */
  onFile: (file: File) => void;
  onRejected: (message: string) => void;
};

/**
 * Drag & drop for a single-file dropzone. Only tracks hover state and validates the drop against
 * the same `accept` rule the input already enforces — the resulting File goes through the exact
 * same onFile callback as a click-picked one, so there is no second upload path.
 */
export function useFileDropzone({ accept, onFile, onRejected }: UseFileDropzoneOptions) {
  const [isDragOver, setIsDragOver] = useState(false);
  // Counts nested enter/leave pairs so a dragleave fired while crossing a child element (the
  // label, the icon, the text) doesn't clear the drag-over state prematurely.
  const dragDepth = useRef(0);

  const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer.types).includes('Files');

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (!hasFiles(e)) return;
    dragDepth.current += 1;
    setIsDragOver(true);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      dragDepth.current = 0;
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      if (files.length > 1) {
        onRejected('Only one file can be uploaded here. Please drop a single file.');
        return;
      }

      const [file] = files;
      if (!matchesAccept(file, accept)) {
        onRejected(`"${file.name}" is not an accepted file type for this field.`);
        return;
      }

      onFile(file);
    },
    [accept, onFile, onRejected]
  );

  return { isDragOver, handleDragEnter, handleDragOver, handleDragLeave, handleDrop };
}

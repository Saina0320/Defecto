import { useCallback } from 'react';
import { useToast } from '@/providers/ToastProvider';

export function useCopyToClipboard() {
  const { showToast } = useToast();

  return useCallback(
    (text: string, label?: string) => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        void navigator.clipboard.writeText(text);
      }
      showToast(`Copied ${label || 'value'}: ${text}`);
    },
    [showToast]
  );
}

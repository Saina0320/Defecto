import type { ReactNode } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

type ModalProps = {
  /** Width, padding and layout classes for the panel. */
  className: string;
  children: ReactNode;
};

/** Centered dialog over a blurred backdrop, styled for the active theme. */
export function Modal({ className, children }: ModalProps) {
  const { t } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div role="dialog" aria-modal="true" className={`w-full ${t.cardBg} rounded-lg shadow-2xl border ${t.divider} ${className}`}>
        {children}
      </div>
    </div>
  );
}

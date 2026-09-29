'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

// Keeps the sidebar and header usable when a page fails to render.
export default function DashboardError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { t } = useTheme();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={`${t.cardBg} p-5 rounded-lg border space-y-3 max-w-xl`}>
      <div className="flex items-center gap-2 text-red-600">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <h3 className={`font-bold text-sm ${t.headingText}`}>Something went wrong while rendering this view.</h3>
      </div>
      <p className={`text-xs ${t.mutedText}`}>{error.message}</p>
      <button
        onClick={retry}
        className="px-3.5 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-semibold rounded shadow-sm cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}

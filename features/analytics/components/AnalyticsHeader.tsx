import { LineChart } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

export function AnalyticsHeader() {
  const { t } = useTheme();

  return (
    <div className={`${t.cardBg} px-4 py-2.5 rounded-[14px] border flex items-center gap-2.5`}>
      <span className="p-1.5 bg-[#0757C9] text-white rounded flex-shrink-0">
        <LineChart className="w-4 h-4" />
      </span>
      <h3 className={`text-sm font-bold ${t.headingText}`}>Analytics</h3>
      <span className="text-neutral-300 dark:text-neutral-700">|</span>
      <p className={`text-xs ${t.mutedText}`}>Defect analysis, trends and team insights</p>
    </div>
  );
}

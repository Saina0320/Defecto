import { useTheme } from '@/providers/ThemeProvider';

/** Shown instead of a broken/blank chart when a filter combination has no matching defects. */
export function EmptyChartState({ message = 'No defect data available for the selected filters.' }: { message?: string }) {
  const { t } = useTheme();
  return (
    <div className={`h-40 flex items-center justify-center text-center text-xs ${t.mutedText} italic px-4`}>
      <span>{message}</span>
    </div>
  );
}

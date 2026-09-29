import { Percent } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

/** Admin-only team-wide read percentage. */
export function TeamAcknowledgmentSummary({ rate }: { rate: number }) {
  const { darkMode, t } = useTheme();

  return (
    <div
      className={`pt-3 border-t ${darkMode ? 'border-[#1E2E4A] bg-[#0B1426]/60' : 'border-[#E9ECEF] bg-blue-50/40'} p-3 rounded-md flex items-center justify-between`}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#003EA4] text-white flex items-center justify-center font-bold text-xs">
          <Percent className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <span className={`text-[11px] font-bold ${t.cyanTagText} tracking-wider uppercase block`}>TEAM ACKNOWLEDGMENT</span>
          <span className={`text-[10px] ${t.mutedText}`}>Overall percentage of team members who have acknowledged/read defects</span>
        </div>
      </div>
      <div
        className={`flex items-baseline gap-1 ${darkMode ? 'bg-[#111E38] border-[#1E2E4A]' : 'bg-white border-blue-200'} px-3 py-1 rounded border shadow-2xs`}
      >
        <span className={`text-lg font-bold ${t.cyanTagText} font-mono`}>{rate}%</span>
        <span className={`text-[10px] font-semibold ${t.mutedText}`}>Acknowledged</span>
      </div>
    </div>
  );
}

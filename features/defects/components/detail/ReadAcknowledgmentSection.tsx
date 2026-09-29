import { CheckCircle2, Clock } from 'lucide-react';
import { ACKNOWLEDGMENT_TARGET } from '@/constants/team';
import { useDefectDialogs } from '@/features/defects/context/DefectDialogsProvider';
import { useToggleRead } from '@/features/defects/hooks/useToggleRead';
import { hasUserRead } from '@/features/defects/lib/readReceipts';
import { useTeam } from '@/features/team/context/TeamProvider';
import { isSupervisorRole } from '@/lib/permissions';
import { getReadButtonClass } from '@/lib/theme';
import { useTheme } from '@/providers/ThemeProvider';
import type { Defect } from '@/types/defect';

/** Analysts see and toggle their own status; supervisors see the team's receipts. */
export function ReadAcknowledgmentSection({ defect }: { defect: Defect }) {
  const { darkMode, t } = useTheme();
  const { currentUser } = useTeam();
  const { openReadMatrix } = useDefectDialogs();
  const toggleRead = useToggleRead();

  if (isSupervisorRole(currentUser.role)) {
    return (
      <div className={`p-3 rounded border space-y-2 ${t.innerBoxBg}`}>
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-semibold ${t.headingText}`}>
            Team Acknowledged: <strong className="text-[#003EA4] dark:text-blue-400">{defect.readReceipts.length}{` of ${ACKNOWLEDGMENT_TARGET}`}</strong>
          </span>
          <button onClick={openReadMatrix} className="text-[11px] text-[#003EA4] dark:text-blue-400 font-bold hover:underline cursor-pointer">
            View Full Matrix
          </button>
        </div>

        <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
          {defect.readReceipts.map((receipt, index) => (
            <div key={index} className={`flex items-center justify-between text-[10px] p-1.5 rounded ${darkMode ? 'bg-[#111E38]' : 'bg-white'}`}>
              <span className={`font-semibold ${t.headingText}`}>
                {receipt.userName} ({receipt.role})
              </span>
              <span className={`${t.mutedText} font-mono`}>{receipt.readAt}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isReadByMe = hasUserRead(defect, currentUser.id);

  return (
    <div className={`p-3 rounded border flex items-center justify-between ${t.innerBoxBg}`}>
      <div>
        <span className={`text-[10px] ${t.mutedText} block`}>Your Status</span>
        <span className="font-bold text-xs">
          {isReadByMe ? (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged by You
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Unread / Pending Your Review
            </span>
          )}
        </span>
      </div>
      <button
        onClick={() => toggleRead(defect)}
        className={`px-3 py-1.5 rounded text-xs cursor-pointer ${getReadButtonClass(isReadByMe, darkMode)}`}
      >
        {isReadByMe ? 'Mark Unread' : 'Mark as Read'}
      </button>
    </div>
  );
}

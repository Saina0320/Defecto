import { CheckCheck, Eye } from 'lucide-react';
import { ACKNOWLEDGMENT_TARGET } from '@/constants/team';
import { useToggleRead } from '@/features/defects/hooks/useToggleRead';
import { hasUserRead } from '@/features/defects/lib/readReceipts';
import { useTeam } from '@/features/team/context/TeamProvider';
import { isSupervisorRole } from '@/lib/permissions';
import { getReadButtonClass } from '@/lib/theme';
import { useTheme } from '@/providers/ThemeProvider';
import type { Defect } from '@/types/defect';

export function ReadStatusButton({ defect }: { defect: Defect }) {
  const { darkMode } = useTheme();
  const { currentUser } = useTeam();
  const toggleRead = useToggleRead();
  const isReadByMe = hasUserRead(defect, currentUser.id);

  return (
    <button
      onClick={() => toggleRead(defect)}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] transition cursor-pointer ${getReadButtonClass(isReadByMe, darkMode)}`}
      title={isReadByMe ? 'Click to mark Unread' : 'Click to mark Read'}
    >
      {isReadByMe ? (
        <CheckCheck className="w-3.5 h-3.5 text-white dark:text-emerald-400" />
      ) : (
        <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-neutral-400" />
      )}
      <span>{isReadByMe ? 'Acknowledged' : 'Mark Read'}</span>
      {isSupervisorRole(currentUser.role) && (
        <span className={`text-[9px] font-mono ${isReadByMe ? 'text-emerald-100 dark:text-emerald-300' : 'text-slate-500 dark:text-neutral-400'}`}>
          ({defect.readReceipts.length}{`/${ACKNOWLEDGMENT_TARGET})`}
        </span>
      )}
    </button>
  );
}

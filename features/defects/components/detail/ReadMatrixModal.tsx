import { CheckCheck, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useDefectDialogs } from '@/features/defects/context/DefectDialogsProvider';
import { formatCcidDisplay } from '@/features/defects/lib/identifiers';
import { useTeam } from '@/features/team/context/TeamProvider';
import { getAcknowledgmentAudience } from '@/features/team/lib/roster';
import { useTheme } from '@/providers/ThemeProvider';
import type { Defect } from '@/types/defect';

/** Per-member read status for a defect (supervisors only). */
export function ReadMatrixModal({ defect }: { defect: Defect }) {
  const { darkMode, t } = useTheme();
  const { teamUsers } = useTeam();
  const { closeReadMatrix } = useDefectDialogs();

  return (
    <Modal className="max-w-xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
        <h4 className={`font-bold text-sm ${t.headingText}`}>Team Acknowledgment Matrix: CCID {formatCcidDisplay(defect.ccid)}</h4>
        <button onClick={closeReadMatrix} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 text-xs">
        {getAcknowledgmentAudience(teamUsers).map((user) => {
          const receipt = defect.readReceipts.find((r) => r.userId === user.id);
          return (
            <div key={user.id} className={`flex items-center justify-between p-2 rounded ${darkMode ? 'bg-[#0B1426]' : 'bg-neutral-50'}`}>
              <div>
                <span className={`font-semibold ${t.headingText}`}>{user.name}</span>
              </div>
              {receipt ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] flex items-center gap-1 font-semibold">
                  <CheckCheck className="w-3.5 h-3.5" /> {receipt.readAt}
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-mono text-[10px]">Unread / Pending</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2 border-t border-neutral-200 dark:border-neutral-700">
        <button type="button" onClick={closeReadMatrix} className="px-4 py-1.5 bg-[#0757C9] text-white rounded text-xs font-semibold cursor-pointer">
          Done
        </button>
      </div>
    </Modal>
  );
}

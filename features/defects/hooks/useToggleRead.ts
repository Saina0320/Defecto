import { useCallback } from 'react';
import { toggleDefectRead } from '@/features/defects/actions';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { useTeam } from '@/features/team/context/TeamProvider';
import { useToast } from '@/providers/ToastProvider';
import type { Defect } from '@/types/defect';

/**
 * Marks a defect as read/unread for the signed-in user. Persisted in PostgreSQL first — the local
 * registry only reflects it once the server confirms the write, and reports a toast either way.
 */
export function useToggleRead() {
  const { toggleRead } = useDefects();
  const { currentUser } = useTeam();
  const { showToast } = useToast();

  return useCallback(
    async (defect: Defect) => {
      if (!defect.id) return;

      const result = await toggleDefectRead(defect.id);
      if (!result.ok) {
        showToast('Could not update the read status. Try again.');
        return;
      }

      toggleRead(defect.ccid, currentUser, result.action === 'added' ? result.readAt : '');
      showToast(
        result.action === 'removed'
          ? `Defect (${defect.ccid}) marked as Unread for ${currentUser.name}`
          : `Defect (${defect.ccid}) marked as Read by ${currentUser.name}`
      );
    },
    [currentUser, toggleRead, showToast]
  );
}

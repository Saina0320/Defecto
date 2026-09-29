import { useCallback } from 'react';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { hasUserRead } from '@/features/defects/lib/readReceipts';
import { useTeam } from '@/features/team/context/TeamProvider';
import { nowTimestamp } from '@/lib/dates';
import { useToast } from '@/providers/ToastProvider';
import type { Defect } from '@/types/defect';

/** Marks a defect as read/unread for the active persona and confirms it with a toast. */
export function useToggleRead() {
  const { toggleRead } = useDefects();
  const { currentUser } = useTeam();
  const { showToast } = useToast();

  return useCallback(
    (defect: Defect) => {
      const wasRead = hasUserRead(defect, currentUser.id);
      toggleRead(defect.ccid, currentUser, nowTimestamp());
      showToast(
        wasRead
          ? `Defect (${defect.ccid}) marked as Unread for ${currentUser.name}`
          : `Defect (${defect.ccid}) marked as Read by ${currentUser.name}`
      );
    },
    [currentUser, toggleRead, showToast]
  );
}

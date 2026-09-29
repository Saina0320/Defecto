import { useCallback } from 'react';
import { useDefectDialogs } from '@/features/defects/context/DefectDialogsProvider';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { useTeam } from '@/features/team/context/TeamProvider';
import { useToast } from '@/providers/ToastProvider';

/** Restores the demo defects and roster after confirmation (local state only). */
export function useResetDemoData() {
  const { resetDefects } = useDefects();
  const { resetTeam } = useTeam();
  const { closeDetails } = useDefectDialogs();
  const { showToast } = useToast();

  return useCallback(() => {
    const confirmed = window.confirm('Reset defect registry and team roster back to initial prototype defaults?');
    if (!confirmed) return;

    resetDefects();
    resetTeam();
    closeDetails();
    showToast('Reset to default prototype dataset.');
  }, [resetDefects, resetTeam, closeDetails, showToast]);
}

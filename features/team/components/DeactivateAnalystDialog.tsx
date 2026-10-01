import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useTheme } from '@/providers/ThemeProvider';
import type { TeamMember } from '@/types/team';

type DeactivateAnalystDialogProps = {
  member: TeamMember;
  isDeactivating: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeactivateAnalystDialog({ member, isDeactivating, error, onCancel, onConfirm }: DeactivateAnalystDialogProps) {
  const { darkMode, t } = useTheme();

  return (
    <Modal className="max-w-md p-5 space-y-4">
      <div className="flex items-center gap-3 text-red-600">
        <AlertTriangle className="w-6 h-6 flex-shrink-0" />
        <h4 className={`font-bold text-sm ${t.headingText}`}>Deactivate Analyst Profile?</h4>
      </div>

      <p className={`text-xs ${t.mutedText}`}>
        You are about to deactivate <strong className={t.headingText}>{member.name}</strong>. This user will no longer appear in
        the active team roster or be able to use the system as an active analyst.
      </p>
      <p className={`text-xs ${t.mutedText}`}>
        All existing defects and historical activity created by this analyst will be preserved.
      </p>

      {error && (
        <p className="p-2 rounded border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
          <AlertTriangle className="w-3.5 h-3.5 mt-px flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeactivating}
          className={`px-3 py-1.5 border ${darkMode ? 'border-neutral-700 text-neutral-300' : 'border-neutral-300 text-neutral-700'} rounded text-xs font-semibold cursor-pointer disabled:cursor-wait disabled:opacity-60`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeactivating}
          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs disabled:cursor-wait disabled:bg-red-600/75 disabled:hover:bg-red-600/75"
        >
          {isDeactivating ? 'Deactivating...' : 'Deactivate Profile'}
        </button>
      </div>
    </Modal>
  );
}

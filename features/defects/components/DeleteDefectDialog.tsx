import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useDefectDialogs } from '@/features/defects/context/DefectDialogsProvider';
import { useTheme } from '@/providers/ThemeProvider';
import type { Defect } from '@/types/defect';

export function DeleteDefectDialog({ defect }: { defect: Defect }) {
  const { darkMode, t } = useTheme();
  const { cancelDelete, confirmDelete } = useDefectDialogs();

  return (
    <Modal className="max-w-md p-5 space-y-4">
      <div className="flex items-center gap-3 text-red-600">
        <AlertTriangle className="w-6 h-6 flex-shrink-0" />
        <h4 className={`font-bold text-sm ${t.headingText}`}>Confirm Defect Deletion</h4>
      </div>
      <p className={`text-xs ${t.mutedText}`}>
        Are you sure you want to delete defect <strong className={t.headingText}>{defect.ccid}</strong> ({defect.kycid})? This
        action will permanently remove it from the shared registry.
      </p>
      <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
        <button
          type="button"
          onClick={cancelDelete}
          className={`px-3 py-1.5 border ${darkMode ? 'border-neutral-700 text-neutral-300' : 'border-neutral-300 text-neutral-700'} rounded text-xs font-semibold cursor-pointer`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={confirmDelete}
          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs"
        >
          Confirm Delete
        </button>
      </div>
    </Modal>
  );
}

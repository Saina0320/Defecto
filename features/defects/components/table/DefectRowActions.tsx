import { Edit3, Trash2 } from 'lucide-react';
import { useDefectDialogs } from '@/features/defects/context/DefectDialogsProvider';
import { useTeam } from '@/features/team/context/TeamProvider';
import { canManageDefect } from '@/lib/permissions';
import type { Defect } from '@/types/defect';

/** Edit / Delete (when permitted) and Open buttons for a defect table row. */
export function DefectRowActions({ defect }: { defect: Defect }) {
  const { currentUser } = useTeam();
  const { openDetails, openEdit, requestDelete } = useDefectDialogs();
  const canManage = canManageDefect(currentUser, defect);

  return (
    <div className="flex items-center justify-end gap-1">
      {canManage && (
        <button
          onClick={() => openEdit(defect)}
          className="p-1 text-neutral-500 hover:text-[#0757C9] dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded cursor-pointer"
          title="Edit Defect Record"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#0757C9] dark:text-blue-400" />
        </button>
      )}
      {canManage && (
        <button
          onClick={() => requestDelete(defect)}
          className="p-1 text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded cursor-pointer"
          title="Delete Defect"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      )}
      <button
        onClick={() => openDetails(defect)}
        className="px-2 py-1 bg-[#0757C9] hover:bg-[#063B82] text-white text-[11px] font-semibold rounded shadow-2xs ml-1 cursor-pointer"
      >
        Open
      </button>
    </div>
  );
}

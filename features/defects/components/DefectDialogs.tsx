import { DeleteDefectDialog } from '@/features/defects/components/DeleteDefectDialog';
import { DefectDetailDrawer } from '@/features/defects/components/detail/DefectDetailDrawer';
import { ReadMatrixModal } from '@/features/defects/components/detail/ReadMatrixModal';
import { EditDefectModal } from '@/features/defects/components/edit/EditDefectModal';
import { useDefectDialogs } from '@/features/defects/context/DefectDialogsProvider';

/** Renders the defect drawer and modals; later siblings stack above earlier ones. */
export function DefectDialogs() {
  const { selectedDefect, isReadMatrixOpen, editingDefect, deleteCandidate } = useDefectDialogs();

  return (
    <>
      {selectedDefect && <DefectDetailDrawer defect={selectedDefect} />}
      {editingDefect && <EditDefectModal defect={editingDefect} />}
      {deleteCandidate && <DeleteDefectDialog defect={deleteCandidate} />}
      {isReadMatrixOpen && selectedDefect && <ReadMatrixModal defect={selectedDefect} />}
    </>
  );
}

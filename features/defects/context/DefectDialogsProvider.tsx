import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { getDefectKey } from '@/features/defects/lib/identifiers';
import { useTeam } from '@/features/team/context/TeamProvider';
import { canManageDefect } from '@/lib/permissions';
import { useToast } from '@/providers/ToastProvider';
import type { Defect } from '@/types/defect';

type DefectDialogsContextValue = {
  /** Defect shown in the detail drawer, always read from the live registry. */
  selectedDefect: Defect | null;
  openDetails: (defect: Defect) => void;
  closeDetails: () => void;

  isReadMatrixOpen: boolean;
  openReadMatrix: () => void;
  closeReadMatrix: () => void;

  editingDefect: Defect | null;
  openEdit: (defect: Defect) => void;
  closeEdit: () => void;
  saveEdit: (originalCcid: string, updated: Defect) => void;

  deleteCandidate: Defect | null;
  requestDelete: (defect: Defect) => void;
  cancelDelete: () => void;
  confirmDelete: () => void;
};

const DefectDialogsContext = createContext<DefectDialogsContextValue | null>(null);

// Drawer and modals are opened from several pages (overview, registry) and from the drawer itself,
// so their state lives at dashboard level and they are rendered once by <DefectDialogs />.
export function DefectDialogsProvider({ children }: { children: ReactNode }) {
  const { defects, replaceDefect, removeDefect } = useDefects();
  const { currentUser } = useTeam();
  const { showToast } = useToast();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isReadMatrixOpen, setIsReadMatrixOpen] = useState(false);
  const [editingDefect, setEditingDefect] = useState<Defect | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Defect | null>(null);

  const selectedDefect = useMemo(
    () => (selectedKey === null ? null : (defects.find((defect) => getDefectKey(defect) === selectedKey) ?? null)),
    [defects, selectedKey]
  );

  const openDetails = useCallback((defect: Defect) => setSelectedKey(getDefectKey(defect)), []);
  const closeDetails = useCallback(() => setSelectedKey(null), []);

  const openReadMatrix = useCallback(() => setIsReadMatrixOpen(true), []);
  const closeReadMatrix = useCallback(() => setIsReadMatrixOpen(false), []);

  const openEdit = useCallback(
    (defect: Defect) => {
      if (!canManageDefect(currentUser, defect)) {
        alert('Permission Denied: You can only edit defects created by yourself.');
        return;
      }
      setEditingDefect(defect);
    },
    [currentUser]
  );

  const closeEdit = useCallback(() => setEditingDefect(null), []);

  const saveEdit = useCallback(
    (originalCcid: string, updated: Defect) => {
      replaceDefect(originalCcid, updated);
      // Keep the drawer on the edited record even if its CCID changed.
      if (selectedDefect?.ccid === originalCcid) {
        setSelectedKey(getDefectKey(updated));
      }
      setEditingDefect(null);
      showToast('Defect updated successfully.');
    },
    [replaceDefect, selectedDefect, showToast]
  );

  const requestDelete = useCallback(
    (defect: Defect) => {
      if (!canManageDefect(currentUser, defect)) {
        alert('Permission Denied: You can only delete defects created by yourself.');
        return;
      }
      setDeleteCandidate(defect);
    },
    [currentUser]
  );

  const cancelDelete = useCallback(() => setDeleteCandidate(null), []);

  const confirmDelete = useCallback(() => {
    if (!deleteCandidate) return;
    const targetCcid = deleteCandidate.ccid;
    removeDefect(targetCcid);
    if (selectedDefect?.ccid === targetCcid) {
      setSelectedKey(null);
    }
    setDeleteCandidate(null);
    showToast(`Defect (${targetCcid}) deleted from registry.`);
  }, [deleteCandidate, removeDefect, selectedDefect, showToast]);

  const value = useMemo(
    () => ({
      selectedDefect,
      openDetails,
      closeDetails,
      isReadMatrixOpen,
      openReadMatrix,
      closeReadMatrix,
      editingDefect,
      openEdit,
      closeEdit,
      saveEdit,
      deleteCandidate,
      requestDelete,
      cancelDelete,
      confirmDelete,
    }),
    [
      selectedDefect,
      openDetails,
      closeDetails,
      isReadMatrixOpen,
      openReadMatrix,
      closeReadMatrix,
      editingDefect,
      openEdit,
      closeEdit,
      saveEdit,
      deleteCandidate,
      requestDelete,
      cancelDelete,
      confirmDelete,
    ]
  );

  return <DefectDialogsContext.Provider value={value}>{children}</DefectDialogsContext.Provider>;
}

export function useDefectDialogs(): DefectDialogsContextValue {
  const context = useContext(DefectDialogsContext);
  if (!context) throw new Error('useDefectDialogs must be used within DefectDialogsProvider');
  return context;
}

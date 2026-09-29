import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { toggleReadReceipt } from '@/features/defects/lib/readReceipts';
import { useStreamedData } from '@/hooks/useStreamedData';
import type { Defect } from '@/types/defect';
import type { TeamMember } from '@/types/team';

// Edits, deletions and read receipts are kept in memory only; the database is the source on reload.
type DefectsContextValue = {
  defects: Defect[];
  addDefect: (defect: Defect) => void;
  replaceDefect: (ccid: string, updated: Defect) => void;
  removeDefect: (ccid: string) => void;
  toggleRead: (ccid: string, reader: TeamMember, readAt: string) => void;
};

const DefectsContext = createContext<DefectsContextValue | null>(null);

type DefectsProviderProps = {
  /** Registry read started on the server by the dashboard layout. */
  defectsPromise: Promise<Defect[]>;
  children: ReactNode;
};

export function DefectsProvider({ defectsPromise, children }: DefectsProviderProps) {
  const [defects, setDefects] = useState<Defect[]>([]);

  useStreamedData(defectsPromise, setDefects, 'Error loading defects:');

  const addDefect = useCallback((defect: Defect) => setDefects((prev) => [defect, ...prev]), []);

  const replaceDefect = useCallback(
    (ccid: string, updated: Defect) =>
      setDefects((prev) => prev.map((defect) => (defect.ccid === ccid ? updated : defect))),
    []
  );

  const removeDefect = useCallback(
    (ccid: string) => setDefects((prev) => prev.filter((defect) => defect.ccid !== ccid)),
    []
  );

  const toggleRead = useCallback(
    (ccid: string, reader: TeamMember, readAt: string) =>
      setDefects((prev) =>
        prev.map((defect) => (defect.ccid === ccid ? toggleReadReceipt(defect, reader, readAt) : defect))
      ),
    []
  );

  const value = useMemo(
    () => ({ defects, addDefect, replaceDefect, removeDefect, toggleRead }),
    [defects, addDefect, replaceDefect, removeDefect, toggleRead]
  );

  return <DefectsContext.Provider value={value}>{children}</DefectsContext.Provider>;
}

export function useDefects(): DefectsContextValue {
  const context = useContext(DefectsContext);
  if (!context) throw new Error('useDefects must be used within DefectsProvider');
  return context;
}

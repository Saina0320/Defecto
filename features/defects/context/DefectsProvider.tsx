import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEMO_DEFECTS } from '@/data/demo-defects';
import { toggleReadReceipt } from '@/features/defects/lib/readReceipts';
import { getDefects } from '@/services/defects';
import type { Defect } from '@/types/defect';
import type { TeamMember } from '@/types/team';

// Edits, deletions and read receipts are kept in memory only; Supabase is the source on reload.
type DefectsContextValue = {
  defects: Defect[];
  addDefect: (defect: Defect) => void;
  replaceDefect: (ccid: string, updated: Defect) => void;
  removeDefect: (ccid: string) => void;
  toggleRead: (ccid: string, reader: TeamMember, readAt: string) => void;
  resetDefects: () => void;
};

const DefectsContext = createContext<DefectsContextValue | null>(null);

export function DefectsProvider({ children }: { children: ReactNode }) {
  const [defects, setDefects] = useState<Defect[]>([]);

  useEffect(() => {
    let cancelled = false;

    getDefects()
      .then((data) => {
        if (!cancelled) setDefects(data);
      })
      .catch((error: unknown) => {
        console.error('Error loading defects:', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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

  const resetDefects = useCallback(() => setDefects(DEMO_DEFECTS), []);

  const value = useMemo(
    () => ({ defects, addDefect, replaceDefect, removeDefect, toggleRead, resetDefects }),
    [defects, addDefect, replaceDefect, removeDefect, toggleRead, resetDefects]
  );

  return <DefectsContext.Provider value={value}>{children}</DefectsContext.Provider>;
}

export function useDefects(): DefectsContextValue {
  const context = useContext(DefectsContext);
  if (!context) throw new Error('useDefects must be used within DefectsProvider');
  return context;
}

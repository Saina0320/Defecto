import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { toggleCategory } from '@/features/defects/lib/categories';
import {
  createInitialDraft,
  resolvePersonaChoice,
  SUBMITTED_FIELDS_RESET,
  type NewDefectDraft,
} from '@/features/new-defect/lib/draft';
import { useTeam } from '@/features/team/context/TeamProvider';
import type { CaseType, CategorySection } from '@/types/defect';

type NewDefectDraftContextValue = {
  draft: NewDefectDraft;
  updateDraft: (patch: Partial<NewDefectDraft>) => void;
  selectCaseType: (caseType: CaseType) => void;
  toggleDraftCategory: (section: CategorySection, name: string) => void;
  resetSubmittedFields: () => void;
};

const NewDefectDraftContext = createContext<NewDefectDraftContextValue | null>(null);

// Lives at dashboard level so a half-completed defect survives navigating to other pages.
export function NewDefectDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<NewDefectDraft>(createInitialDraft);

  const updateDraft = useCallback(
    (patch: Partial<NewDefectDraft>) => setDraft((prev) => ({ ...prev, ...patch })),
    []
  );

  // Categories depend on the case type, so switching type clears the selection.
  const selectCaseType = useCallback(
    (caseType: CaseType) => setDraft((prev) => ({ ...prev, caseType, categories: [] })),
    []
  );

  const toggleDraftCategory = useCallback(
    (section: CategorySection, name: string) =>
      setDraft((prev) => ({ ...prev, categories: toggleCategory(prev.categories, section, name) })),
    []
  );

  const resetSubmittedFields = useCallback(() => updateDraft(SUBMITTED_FIELDS_RESET), [updateDraft]);

  const value = useMemo(
    () => ({ draft, updateDraft, selectCaseType, toggleDraftCategory, resetSubmittedFields }),
    [draft, updateDraft, selectCaseType, toggleDraftCategory, resetSubmittedFields]
  );

  return <NewDefectDraftContext.Provider value={value}>{children}</NewDefectDraftContext.Provider>;
}

export function useNewDefectDraft() {
  const context = useContext(NewDefectDraftContext);
  if (!context) throw new Error('useNewDefectDraft must be used within NewDefectDraftProvider');

  const { currentUser } = useTeam();
  const { draft } = context;

  return {
    ...context,
    /** Selected analyst name (defaults to the active persona). */
    analyst: resolvePersonaChoice(draft.analystChoice, currentUser),
    /** Selected resolver name (defaults to the active persona). */
    resolvedBy: resolvePersonaChoice(draft.resolvedByChoice, currentUser),
    setAnalyst: (value: string) => context.updateDraft({ analystChoice: { userId: currentUser.id, value } }),
    setResolvedBy: (value: string) => context.updateDraft({ resolvedByChoice: { userId: currentUser.id, value } }),
  };
}

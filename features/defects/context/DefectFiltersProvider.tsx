import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_DEFECT_FILTERS, type DefectFilters } from '@/features/defects/lib/filterDefects';

type DefectFiltersContextValue = {
  filters: DefectFilters;
  /** Updates one or more filters. The search query is edited from the global header. */
  updateFilters: (patch: Partial<DefectFilters>) => void;
  resetFilters: () => void;
};

const DefectFiltersContext = createContext<DefectFiltersContextValue | null>(null);

// Lives at dashboard level so the header search and the registry filters survive navigation.
export function DefectFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DefectFilters>(DEFAULT_DEFECT_FILTERS);

  const updateFilters = useCallback(
    (patch: Partial<DefectFilters>) => setFilters((prev) => ({ ...prev, ...patch })),
    []
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_DEFECT_FILTERS), []);

  const value = useMemo(() => ({ filters, updateFilters, resetFilters }), [filters, updateFilters, resetFilters]);

  return <DefectFiltersContext.Provider value={value}>{children}</DefectFiltersContext.Provider>;
}

export function useDefectFilters(): DefectFiltersContextValue {
  const context = useContext(DefectFiltersContext);
  if (!context) throw new Error('useDefectFilters must be used within DefectFiltersProvider');
  return context;
}

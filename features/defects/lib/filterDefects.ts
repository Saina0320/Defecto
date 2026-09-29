import type { CaseType, Defect } from '@/types/defect';

export const ALL = 'ALL';

export type DefectFilters = {
  searchQuery: string;
  caseType: CaseType | typeof ALL;
  /** Analyst name, or ALL. */
  analyst: string;
  /** Category name, or ALL. */
  category: string;
};

export const DEFAULT_DEFECT_FILTERS: DefectFilters = {
  searchQuery: '',
  caseType: ALL,
  analyst: ALL,
  category: ALL,
};

function matchesSearch(defect: Defect, rawQuery: string): boolean {
  const query = rawQuery.toLowerCase().trim();
  if (!query) return true;

  return (
    defect.ccid.toLowerCase().includes(query) ||
    defect.kycid.toLowerCase().includes(query) ||
    defect.analystName.toLowerCase().includes(query) ||
    defect.explanation.toLowerCase().includes(query) ||
    defect.selectedCategories.some((category) => category.name.toLowerCase().includes(query))
  );
}

export function filterDefects(defects: Defect[], filters: DefectFilters): Defect[] {
  return defects.filter(
    (defect) =>
      matchesSearch(defect, filters.searchQuery) &&
      (filters.caseType === ALL || defect.caseType === filters.caseType) &&
      (filters.analyst === ALL || defect.analystName === filters.analyst) &&
      (filters.category === ALL || defect.selectedCategories.some((category) => category.name === filters.category))
  );
}

import type { CaseType, CategorySection } from '@/types/defect';

export const CASE_TYPES: readonly CaseType[] = ['Individual', 'Entity'];

export const CATEGORY_SECTIONS: readonly CategorySection[] = ['CORE', 'APPENDIX'];

// Categories available per case type. Periodic Review exists in both CORE and APPENDIX for individuals.
export const CATEGORY_DEFINITIONS: Record<CaseType, Record<CategorySection, readonly string[]>> = {
  Individual: {
    CORE: ['CIP', 'Client Profile', 'Risk', 'SOW', 'Periodic Review', 'Members', 'AML & Sanctions Screening'],
    APPENDIX: ['US Tab', 'Product Profile', 'Periodic Review', 'Transaction Review', 'HRAC', 'HRPU'],
  },
  Entity: {
    CORE: ['CIP', 'Client Profile', 'Risk', 'SOW', 'Members', 'AML & Sanctions Screening'],
    APPENDIX: ['US Tab', 'Product Profile', 'Periodic Review', 'Transaction Review', 'HRAC', 'HRPU'],
  },
};

type CategoryFilterGroup = {
  label: string;
  options: string[];
};

// The registry filter matches by category name only, so each name appears once
// (in the first section that defines it) across both case types.
export const CATEGORY_FILTER_GROUPS: readonly CategoryFilterGroup[] = (() => {
  const seen = new Set<string>();
  return CATEGORY_SECTIONS.map((section) => {
    const options: string[] = [];
    for (const caseType of CASE_TYPES) {
      for (const name of CATEGORY_DEFINITIONS[caseType][section]) {
        if (!seen.has(name)) {
          seen.add(name);
          options.push(name);
        }
      }
    }
    return { label: `${section} Categories`, options };
  });
})();

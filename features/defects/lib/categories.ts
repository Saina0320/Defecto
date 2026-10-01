import { CATEGORY_DEFINITIONS } from '@/constants/categories';
import type { CaseType, CategorySection, DefectCategory } from '@/types/defect';

export function isCategorySelected(categories: DefectCategory[], section: CategorySection, name: string): boolean {
  return categories.some((category) => category.section === section && category.name === name);
}

export function toggleCategory(categories: DefectCategory[], section: CategorySection, name: string): DefectCategory[] {
  if (isCategorySelected(categories, section, name)) {
    return categories.filter((category) => !(category.section === section && category.name === name));
  }
  return [...categories, { section, name }];
}

/**
 * Whether a category really exists for this case type. Server Functions are reachable with a
 * plain POST request, so a submitted category list is not trusted to match CATEGORY_DEFINITIONS
 * until it is checked against it.
 */
export function isKnownCategory(caseType: CaseType, category: unknown): category is DefectCategory {
  if (!category || typeof category !== 'object') return false;
  const { section, name } = category as Record<string, unknown>;
  if (section !== 'CORE' && section !== 'APPENDIX') return false;
  if (typeof name !== 'string') return false;

  return (CATEGORY_DEFINITIONS[caseType][section] as readonly string[]).includes(name);
}

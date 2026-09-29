import type { CategorySection, DefectCategory } from '@/types/defect';

export function isCategorySelected(categories: DefectCategory[], section: CategorySection, name: string): boolean {
  return categories.some((category) => category.section === section && category.name === name);
}

export function toggleCategory(categories: DefectCategory[], section: CategorySection, name: string): DefectCategory[] {
  if (isCategorySelected(categories, section, name)) {
    return categories.filter((category) => !(category.section === section && category.name === name));
  }
  return [...categories, { section, name }];
}

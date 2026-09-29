import { getCategoryBadgeClass } from '@/lib/theme';
import { useTheme } from '@/providers/ThemeProvider';
import type { DefectCategory } from '@/types/defect';

type CategoryBadgeProps = {
  category: DefectCategory;
  /** Size and layout classes for the placement. */
  className: string;
};

/** "CORE: CIP" style tag for a defect category. */
export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const { darkMode } = useTheme();

  return (
    <span className={`${className} ${getCategoryBadgeClass(category.section, darkMode)}`}>
      <span className="opacity-75 font-semibold mr-1">{category.section}:</span>
      {category.name}
    </span>
  );
}

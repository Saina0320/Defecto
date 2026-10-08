import { Check } from 'lucide-react';
import { CATEGORY_DEFINITIONS, CATEGORY_SECTIONS } from '@/constants/categories';
import { isCategorySelected } from '@/features/defects/lib/categories';
import { useTheme } from '@/providers/ThemeProvider';
import type { CaseType, CategorySection, DefectCategory } from '@/types/defect';

const SECTION_STYLES: Record<CategorySection, { badgeClass: string; selectedClass: string }> = {
  CORE: { badgeClass: 'bg-[#0757C9]', selectedClass: 'bg-[#0757C9] text-white border-[#0757C9] font-bold' },
  APPENDIX: { badgeClass: 'bg-neutral-700', selectedClass: 'bg-neutral-800 dark:bg-neutral-700 text-white border-neutral-800 font-bold' },
};

type EditCategoryGridProps = {
  caseType: CaseType;
  selected: DefectCategory[];
  onToggle: (section: CategorySection, name: string) => void;
};

/**
 * Sectioned CORE/APPENDIX multi-select for the edit modal — same section-by-section structure
 * as the New Defect wizard's CategorySelector, just sized for a compact modal.
 */
export function EditCategoryGrid({ caseType, selected, onToggle }: EditCategoryGridProps) {
  const { darkMode, t } = useTheme();
  const unselectedClass = darkMode ? 'bg-[#111E38] text-neutral-300 border-neutral-700' : 'bg-white text-neutral-700 border-neutral-300';

  return (
    <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
      {CATEGORY_SECTIONS.map((section) => {
        const style = SECTION_STYLES[section];
        return (
          <div key={section} className={`p-2.5 rounded border ${t.innerBoxBg}`}>
            <div className={`flex items-center gap-2 mb-1.5 pb-1 border-b ${t.divider}`}>
              <span className={`${style.badgeClass} text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase`}>{section}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {CATEGORY_DEFINITIONS[caseType][section].map((name) => {
                const isSelected = isCategorySelected(selected, section, name);
                return (
                  <button
                    key={`${section}-${name}`}
                    type="button"
                    onClick={() => onToggle(section, name)}
                    className={`p-1.5 rounded text-left text-[11px] border flex items-center justify-between cursor-pointer ${isSelected ? style.selectedClass : unselectedClass}`}
                  >
                    <span className="truncate">{name}</span>
                    {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

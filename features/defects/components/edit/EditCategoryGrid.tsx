import { Check } from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '@/constants/categories';
import { isCategorySelected } from '@/features/defects/lib/categories';
import { useTheme } from '@/providers/ThemeProvider';
import type { CaseType, CategorySection, DefectCategory } from '@/types/defect';

const SECTION_STYLES: Record<CategorySection, { keyPrefix: string; label: string; selectedClass: string }> = {
  CORE: { keyPrefix: 'core', label: 'CORE', selectedClass: 'bg-[#003EA4] text-white border-[#003EA4] font-bold' },
  APPENDIX: { keyPrefix: 'app', label: 'APP', selectedClass: 'bg-neutral-800 text-white border-neutral-800 font-bold' },
};

type EditCategoryGridProps = {
  caseType: CaseType;
  selected: DefectCategory[];
  onToggle: (section: CategorySection, name: string) => void;
};

/** Compact multi-select of CORE and APPENDIX categories used by the edit modal. */
export function EditCategoryGrid({ caseType, selected, onToggle }: EditCategoryGridProps) {
  const { darkMode, t } = useTheme();
  const unselectedClass = darkMode ? 'bg-[#111E38] text-neutral-300 border-neutral-700' : 'bg-white text-neutral-700 border-neutral-300';

  return (
    <div className={`p-2.5 rounded border max-h-32 overflow-y-auto space-y-2 ${t.innerBoxBg}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {(['CORE', 'APPENDIX'] as const).map((section) =>
          CATEGORY_DEFINITIONS[caseType][section].map((name) => {
            const style = SECTION_STYLES[section];
            const isSelected = isCategorySelected(selected, section, name);
            return (
              <button
                key={`${style.keyPrefix}-${name}`}
                type="button"
                onClick={() => onToggle(section, name)}
                className={`p-1.5 rounded text-left text-[11px] border flex items-center justify-between cursor-pointer ${isSelected ? style.selectedClass : unselectedClass}`}
              >
                <span className="truncate">
                  {style.label}: {name}
                </span>
                {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

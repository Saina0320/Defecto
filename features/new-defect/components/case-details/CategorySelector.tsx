import { Check } from 'lucide-react';
import { CATEGORY_DEFINITIONS, CATEGORY_SECTIONS } from '@/constants/categories';
import { isCategorySelected } from '@/features/defects/lib/categories';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { useTheme } from '@/providers/ThemeProvider';
import type { CategorySection } from '@/types/defect';

const SECTION_CONFIG: Record<
  CategorySection,
  { title: string; badgeClass: string; keyPrefix: string; selectedClass: string; lightHoverClass: string }
> = {
  CORE: {
    title: 'Core Case KYC Areas',
    badgeClass: 'bg-[#003EA4]',
    keyPrefix: 'core',
    selectedClass: 'bg-[#003EA4] text-white border-[#003EA4] font-bold shadow-xs',
    lightHoverClass: 'hover:bg-blue-50/50',
  },
  APPENDIX: {
    title: 'Appendix & Supplemental Areas',
    badgeClass: 'bg-neutral-700',
    keyPrefix: 'appendix',
    selectedClass: 'bg-neutral-800 dark:bg-neutral-700 text-white border-neutral-800 font-bold shadow-xs',
    lightHoverClass: 'hover:bg-neutral-100',
  },
};

function CategorySectionBox({ section }: { section: CategorySection }) {
  const { darkMode, t } = useTheme();
  const { draft, toggleDraftCategory } = useNewDefectDraft();
  const config = SECTION_CONFIG[section];
  const unselectedClass = darkMode
    ? 'bg-[#111E38] text-neutral-300 border-neutral-700 hover:bg-[#1E2E4A]'
    : `bg-white text-neutral-700 border-neutral-200 ${config.lightHoverClass}`;

  return (
    <div className={`p-3.5 ${t.innerBoxBg} rounded-lg border`}>
      <div className={`flex items-center gap-2 mb-2 pb-1.5 border-b ${t.divider}`}>
        <span className={`${config.badgeClass} text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase`}>{section}</span>
        <span className={`text-[11px] font-semibold ${t.headingText}`}>{config.title}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {CATEGORY_DEFINITIONS[draft.caseType][section].map((name) => {
          const isSelected = isCategorySelected(draft.categories, section, name);
          return (
            <button
              key={`${config.keyPrefix}-${name}`}
              type="button"
              onClick={() => toggleDraftCategory(section, name)}
              className={`p-2 rounded text-left text-xs border transition flex items-center justify-between cursor-pointer ${isSelected ? config.selectedClass : unselectedClass}`}
            >
              <span className="truncate">{name}</span>
              {isSelected ? (
                <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
              ) : (
                <div className={`w-3.5 h-3.5 border ${darkMode ? 'border-neutral-600' : 'border-neutral-300'} rounded flex-shrink-0`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Case-type specific multi-select of CORE and APPENDIX categories. */
export function CategorySelector() {
  const { darkMode, t } = useTheme();
  const { draft } = useNewDefectDraft();

  return (
    <div className={`pt-2 border-t ${t.dividerSoft} space-y-3`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className={`font-bold uppercase tracking-wider text-[11px] ${t.cyanTagText}`}>
            Categories / Areas Involved ({draft.caseType} Specific)
          </h4>
          <p className={`text-[11px] ${t.mutedText}`}>
            Multi-select options. Periodic Review is maintained distinctly in CORE and APPENDIX.
          </p>
        </div>
        <span
          className={`text-[11px] font-semibold ${darkMode ? 'bg-blue-950/60 text-blue-300 border-blue-800' : 'bg-[#EBF3FC] text-[#002D72] border-[#B9D5F7]'} px-2 py-0.5 rounded border`}
        >
          {draft.categories.length} areas selected
        </span>
      </div>

      {CATEGORY_SECTIONS.map((section) => (
        <CategorySectionBox key={section} section={section} />
      ))}
    </div>
  );
}

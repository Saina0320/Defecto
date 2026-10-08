import { Check } from 'lucide-react';
import { WIZARD_STEPS } from '@/features/new-defect/constants';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { useTheme } from '@/providers/ThemeProvider';

/** Step indicator; each tab also jumps directly to its step. Completed steps get a subtle check. */
export function WizardStepTabs() {
  const { darkMode, t } = useTheme();
  const { draft, updateDraft } = useNewDefectDraft();

  const activeClass = darkMode
    ? 'bg-[#122238] text-[#4A9BFF] border-b-2 border-b-[#4A9BFF]'
    : 'bg-white border-b-2 border-b-[#0757C9] text-[#0757C9]';

  return (
    <div className={`grid grid-cols-3 ${t.tableHeaderBg} border-b text-xs font-semibold ${t.mutedText}`}>
      {WIZARD_STEPS.map((item) => {
        const isActive = draft.step === item.step;
        const isCompleted = item.step < draft.step;
        return (
          <button
            key={item.step}
            type="button"
            onClick={() => updateDraft({ step: item.step })}
            className={`p-3.5 text-left border-r cursor-pointer ${darkMode ? 'border-[#20344D]' : 'border-[#E8EEF5]'} transition ${
              isActive ? `${activeClass} shadow-xs font-bold` : `hover:bg-neutral-100 dark:hover:bg-white/5 font-medium ${t.mutedText}`
            }`}
          >
            <div className="flex items-center gap-1.5 text-[12px]">
              {isCompleted && (
                <span className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                </span>
              )}
              <span>{item.label}</span>
            </div>
            <div className={`text-[10px] ${t.mutedText} font-normal truncate`}>{item.description}</div>
          </button>
        );
      })}
    </div>
  );
}

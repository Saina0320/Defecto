import { WIZARD_STEPS } from '@/features/new-defect/constants';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { useTheme } from '@/providers/ThemeProvider';

/** Step indicator; each tab also jumps directly to its step. */
export function WizardStepTabs() {
  const { darkMode, t } = useTheme();
  const { draft, updateDraft } = useNewDefectDraft();

  const activeClass = darkMode
    ? 'bg-[#162746] text-blue-300 border-b-2 border-b-[#38BDF8]'
    : 'bg-white border-b-2 border-b-[#003EA4] text-[#003EA4]';

  return (
    <div className={`grid grid-cols-3 ${t.tableHeaderBg} border-b text-xs font-semibold ${t.mutedText}`}>
      {WIZARD_STEPS.map((item) => (
        <button
          key={item.step}
          type="button"
          onClick={() => updateDraft({ step: item.step })}
          className={`p-3.5 text-left border-r cursor-pointer ${darkMode ? 'border-[#1E2E4A]' : 'border-[#E9ECEF]'} transition ${
            draft.step === item.step
              ? `${activeClass} shadow-xs font-bold`
              : `hover:bg-neutral-100 dark:hover:bg-white/5 font-medium ${t.mutedText}`
          }`}
        >
          <div className="text-[12px]">{item.label}</div>
          <div className={`text-[10px] ${t.mutedText} font-normal truncate`}>{item.description}</div>
        </button>
      ))}
    </div>
  );
}

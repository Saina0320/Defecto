import { Check } from 'lucide-react';
import { DEFECT_REASONS } from '@/constants/defectReasons';
import { DEFECT_REASON_ICONS } from '@/features/defects/lib/defectReasonIcons';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { useTheme } from '@/providers/ThemeProvider';

/**
 * Single-select classification of WHY the defect occurred (distinct from the categories selected
 * in Step 1, which capture WHAT was affected). The reason is always an explicit choice made here
 * by the analyst/reviewer — never inferred from the explanation, QC finding or analyst name.
 */
export function DefectReasonSelector() {
  const { darkMode, t } = useTheme();
  const { draft, updateDraft } = useNewDefectDraft();

  const unselectedClass = darkMode
    ? 'bg-[#0B1426] border-neutral-700 hover:bg-[#1E2E4A]'
    : 'bg-white border-neutral-200 hover:bg-blue-50/50';
  const selectedClass = 'bg-[#0757C9] text-white border-[#0757C9] shadow-xs';
  const fieldClass = `w-full p-2.5 ${t.inputBg} rounded focus:border-[#0757C9] focus:outline-none text-xs`;

  return (
    <div className={`p-4 ${t.innerBoxBg} rounded-[14px] border space-y-3`}>
      <div>
        <h4 className={`font-bold uppercase tracking-wider text-[11px] ${t.cyanTagText}`}>Reason for Defect *</h4>
        <p className={`text-[11px] ${t.mutedText} mt-0.5`}>What was the primary reason or contributing factor for this defect?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Reason for Defect">
        {DEFECT_REASONS.map((reason) => {
          const Icon = DEFECT_REASON_ICONS[reason.code];
          const isSelected = draft.defectReason === reason.code;
          return (
            <button
              key={reason.code}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => updateDraft({ defectReason: reason.code })}
              className={`flex items-start gap-2.5 p-3 rounded-[14px] border text-left transition cursor-pointer ${isSelected ? selectedClass : unselectedClass}`}
            >
              <span className={`p-1.5 rounded flex-shrink-0 ${isSelected ? 'bg-white/15' : darkMode ? 'bg-[#1E2E4A]' : 'bg-blue-50'}`}>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#0757C9] dark:text-blue-400'}`} />
              </span>
              <span className="flex-1 min-w-0">
                <span className={`flex items-center justify-between gap-1 font-bold text-xs ${isSelected ? 'text-white' : t.headingText}`}>
                  {reason.label}
                  {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                </span>
                <span className={`block text-[11px] mt-0.5 ${isSelected ? 'text-blue-100' : t.mutedText}`}>{reason.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div>
        <label htmlFor="new-defect-reason-details" className={`block font-semibold ${t.headingText} mb-1 text-xs`}>
          Reason Details <span className={`${t.mutedText} font-normal`}>(optional)</span>
        </label>
        <textarea
          id="new-defect-reason-details"
          rows={2}
          placeholder="Briefly explain why this category applies..."
          value={draft.defectReasonDetails}
          onChange={(e) => updateDraft({ defectReasonDetails: e.target.value })}
          className={fieldClass}
        />
      </div>
    </div>
  );
}

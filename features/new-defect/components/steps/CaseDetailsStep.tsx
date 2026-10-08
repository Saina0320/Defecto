import { CaseClassificationFields } from '@/features/new-defect/components/case-details/CaseClassificationFields';
import { CaseIdentifierFields } from '@/features/new-defect/components/case-details/CaseIdentifierFields';
import { CategorySelector } from '@/features/new-defect/components/case-details/CategorySelector';
import { WizardFooter, WizardProceedButton } from '@/features/new-defect/components/WizardFooter';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { getCaseDetailsIssue } from '@/features/new-defect/lib/validation';
import { useTheme } from '@/providers/ThemeProvider';

/** Step 1 — Enter Defect. */
export function CaseDetailsStep() {
  const { t } = useTheme();
  const { draft, updateDraft } = useNewDefectDraft();

  const proceed = () => {
    const issue = getCaseDetailsIssue(draft);
    if (issue) {
      alert(issue);
      return;
    }
    updateDraft({ step: 2 });
  };

  return (
    <div className="space-y-5">
      <CaseIdentifierFields />
      <CaseClassificationFields />

      <div className={`pt-2 border-t ${t.dividerSoft}`}>
        <label htmlFor="new-defect-explanation" className={`block font-semibold ${t.headingText} mb-1`}>
          Defect Explanation / Case Context *
        </label>
        <textarea
          id="new-defect-explanation"
          rows={3}
          required
          placeholder="Provide clear background context of the case and the identified deficiency..."
          value={draft.explanation}
          onChange={(e) => updateDraft({ explanation: e.target.value })}
          className={`w-full p-2.5 ${t.inputBg} rounded focus:border-[#0757C9] focus:outline-none text-xs`}
        />
      </div>

      <CategorySelector />

      <WizardFooter>
        <WizardProceedButton label="Proceed to Step 2 (QC Findings & Final ZIP)" onClick={proceed} />
      </WizardFooter>
    </div>
  );
}

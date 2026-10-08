import { CheckCircle2 } from 'lucide-react';
import { DefectReasonSelector } from '@/features/new-defect/components/resolution/DefectReasonSelector';
import { FinalReviewSummary } from '@/features/new-defect/components/resolution/FinalReviewSummary';
import { ResolutionFields } from '@/features/new-defect/components/resolution/ResolutionFields';
import { StepIntro } from '@/features/new-defect/components/StepIntro';
import { WizardFooter } from '@/features/new-defect/components/WizardFooter';
import { useSubmitNewDefect } from '@/features/new-defect/hooks/useSubmitNewDefect';

/** Step 3 — Resolution & Review. */
export function ResolutionStep() {
  const submitNewDefect = useSubmitNewDefect();

  return (
    <div className="space-y-6">
      <StepIntro
        icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        title="Step 3: Resolution Information & Final Review"
        description="Record corrective remediation action taken and verify defect details before adding to the permanent registry."
      />

      <DefectReasonSelector />
      <ResolutionFields />
      <FinalReviewSummary />

      <WizardFooter backStep={2}>
        <button
          type="button"
          onClick={submitNewDefect}
          className="px-6 py-2.5 bg-[#0757C9] hover:bg-[#063B82] text-white font-bold rounded flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Complete & Submit Defect Record</span>
        </button>
      </WizardFooter>
    </div>
  );
}

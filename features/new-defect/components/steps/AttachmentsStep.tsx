import { FileCheck } from 'lucide-react';
import { FinalZipUpload } from '@/features/new-defect/components/attachments/FinalZipUpload';
import { QcFindingsUpload } from '@/features/new-defect/components/attachments/QcFindingsUpload';
import { StepIntro } from '@/features/new-defect/components/StepIntro';
import { WizardFooter, WizardProceedButton } from '@/features/new-defect/components/WizardFooter';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { getAttachmentsIssue } from '@/features/new-defect/lib/validation';

/** Step 2 — QC Findings & Final ZIP. */
export function AttachmentsStep() {
  const { draft, updateDraft } = useNewDefectDraft();

  const proceed = () => {
    const issue = getAttachmentsIssue(draft);
    if (issue) {
      alert(issue);
      return;
    }
    updateDraft({ step: 3 });
  };

  return (
    <div className="space-y-6">
      <StepIntro
        icon={<FileCheck className="w-4 h-4" />}
        title="Step 2: Checker QC Findings & Final Case ZIP"
        description="Upload the findings file provided by the Checker. The final case ZIP attachment is optional."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QcFindingsUpload />
        <FinalZipUpload />
      </div>

      <WizardFooter backStep={1}>
        <WizardProceedButton label="Proceed to Step 3 (Resolution & Review)" onClick={proceed} />
      </WizardFooter>
    </div>
  );
}

'use client';

import { AttachmentsStep } from '@/features/new-defect/components/steps/AttachmentsStep';
import { CaseDetailsStep } from '@/features/new-defect/components/steps/CaseDetailsStep';
import { ResolutionStep } from '@/features/new-defect/components/steps/ResolutionStep';
import { WizardHeader } from '@/features/new-defect/components/WizardHeader';
import { WizardStepTabs } from '@/features/new-defect/components/WizardStepTabs';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { useTheme } from '@/providers/ThemeProvider';

/** Three-step defect intake: case details → QC findings & ZIP → resolution & review. */
export function NewDefectWizard() {
  const { t } = useTheme();
  const { draft } = useNewDefectDraft();

  return (
    <div className={`max-w-4xl mx-auto ${t.cardBg} rounded-lg border overflow-hidden`}>
      <WizardHeader step={draft.step} />
      <WizardStepTabs />

      <div className="p-6 space-y-6 text-xs">
        {draft.step === 1 && <CaseDetailsStep />}
        {draft.step === 2 && <AttachmentsStep />}
        {draft.step === 3 && <ResolutionStep />}
      </div>
    </div>
  );
}

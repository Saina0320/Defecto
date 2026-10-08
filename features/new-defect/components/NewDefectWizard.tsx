'use client';

import { useEffect } from 'react';
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

  // Without this, dropping a file outside one of the wizard's dropzones (but still inside the
  // page) makes the browser navigate to/open that file instead of ignoring the drop.
  useEffect(() => {
    const preventStrayDrop = (e: DragEvent) => {
      if (Array.from(e.dataTransfer?.types ?? []).includes('Files')) e.preventDefault();
    };
    window.addEventListener('dragover', preventStrayDrop);
    window.addEventListener('drop', preventStrayDrop);
    return () => {
      window.removeEventListener('dragover', preventStrayDrop);
      window.removeEventListener('drop', preventStrayDrop);
    };
  }, []);

  return (
    <div className={`max-w-4xl mx-auto ${t.cardBg} rounded-[16px] border overflow-hidden`}>
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

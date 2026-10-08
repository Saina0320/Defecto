import type { NewDefectDraft, WizardStep } from '@/features/new-defect/lib/draft';

type DraftIssue = {
  message: string;
  /** Step the user is sent back to. */
  step: WizardStep;
};

/** Checked when leaving step 1. */
export function getCaseDetailsIssue(draft: NewDefectDraft): string | null {
  if (draft.ccid.length !== 16) return 'Please enter a full 16-digit CCID numeric identifier.';
  if (!draft.kycid) return 'Please enter the KYCID with its KYC- prefix.';
  if (!draft.explanation) return 'Please provide a defect explanation/context.';
  return null;
}

/** Checked when leaving step 2. */
export function getAttachmentsIssue(draft: NewDefectDraft): string | null {
  if (!draft.qcFile) return 'Please upload the QC Findings file before proceeding.';
  return null;
}

/** Checked on final submission. */
export function getSubmissionIssue(draft: NewDefectDraft): DraftIssue | null {
  if (draft.ccid.length !== 16) return { message: 'Please enter a valid 16-digit CCID numeric identifier.', step: 1 };
  if (!draft.kycid) return { message: 'Please provide the KYCID as it appears in KIWI.', step: 1 };
  if (!draft.explanation) return { message: 'Please provide the defect explanation/context.', step: 1 };
  if (!draft.qcFile) return { message: 'Please attach the QC Findings File from the Checker in Step 2.', step: 2 };
  if (!draft.defectReason) {
    return { message: 'Please select the primary reason or contributing factor for this defect.', step: 3 };
  }
  return null;
}

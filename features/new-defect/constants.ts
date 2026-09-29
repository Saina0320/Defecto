import type { WizardStep } from '@/features/new-defect/lib/draft';

export const WIZARD_STEPS: readonly { step: WizardStep; label: string; description: string }[] = [
  { step: 1, label: 'Step 1 — Enter Defect', description: 'CCID (16 Digits), KYCID, Case Type & Categories' },
  { step: 2, label: 'Step 2 — QC Findings & Final ZIP', description: 'Checker findings file & optional ZIP attachment' },
  { step: 3, label: 'Step 3 — Resolution & Review', description: 'Corrective action, comments & final review' },
];

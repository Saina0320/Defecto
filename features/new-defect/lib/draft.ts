import { todayIsoDate } from '@/lib/dates';
import type { AttachedFile, CaseType, DefectCategory, EvidenceFile } from '@/types/defect';
import type { TeamMember } from '@/types/team';

export type WizardStep = 1 | 2 | 3;

/**
 * A select value chosen while a given persona was active. When the persona changes the choice
 * no longer applies and the field falls back to the new persona's name.
 */
type PersonaScopedChoice = {
  userId: string;
  value: string;
};

export type NewDefectDraft = {
  step: WizardStep;

  // Step 1: case details
  caseType: CaseType;
  ccid: string;
  kycid: string;
  analystChoice: PersonaScopedChoice | null;
  date: string;
  explanation: string;
  categories: DefectCategory[];

  // Step 2: attachments (the *Name fields hold the text typed before clicking "Attach")
  qcFileName: string;
  qcFile: AttachedFile | null;
  finalZipName: string;
  finalZip: AttachedFile | null;

  // Step 3: resolution
  correctiveAction: string;
  resolvedByChoice: PersonaScopedChoice | null;
  resolutionDate: string;
  resolutionComment: string;
  evidenceName: string;
  evidenceFiles: EvidenceFile[];
};

export function createInitialDraft(): NewDefectDraft {
  const today = todayIsoDate();
  return {
    step: 1,
    caseType: 'Individual',
    ccid: '',
    kycid: '',
    analystChoice: null,
    date: today,
    explanation: '',
    categories: [],
    qcFileName: '',
    qcFile: null,
    finalZipName: '',
    finalZip: null,
    correctiveAction: '',
    resolvedByChoice: null,
    resolutionDate: today,
    resolutionComment: '',
    evidenceName: '',
    evidenceFiles: [],
  };
}

/** Value of a persona-scoped select: the explicit choice, or the active persona's name. */
export function resolvePersonaChoice(choice: PersonaScopedChoice | null, currentUser: TeamMember): string {
  if (choice && choice.userId === currentUser.id) return choice.value;
  return currentUser.id ? currentUser.name : '';
}

/** Fields cleared after a successful submission. Case type, analyst, dates and resolver are kept. */
export const SUBMITTED_FIELDS_RESET: Partial<NewDefectDraft> = {
  step: 1,
  ccid: '',
  kycid: '',
  explanation: '',
  categories: [],
  qcFile: null,
  finalZip: null,
  resolutionComment: '',
  correctiveAction: '',
  evidenceFiles: [],
};

import type { DefectReasonCode } from '@/types/defect';

export const DEFECT_REASON_CODES: readonly DefectReasonCode[] = [
  'PROCEDURAL_ERROR',
  'KNOWLEDGE_TRAINING_GAP',
  'SYSTEM_MAPPING_ISSUE',
  'PROCESS_PROCEDURE_ISSUE',
  'OTHER_EXTERNAL_FACTOR',
];

export type DefectReasonDefinition = {
  code: DefectReasonCode;
  /** Full label shown in the wizard and defect detail. */
  label: string;
  /** Compact label for the registry table badge. */
  shortLabel: string;
  description: string;
};

// Exact wording required by the business: do not reword without checking with the business owner.
export const DEFECT_REASONS: readonly DefectReasonDefinition[] = [
  {
    code: 'PROCEDURAL_ERROR',
    label: 'Procedural Error',
    shortLabel: 'Procedural Error',
    description: 'The analyst was expected to know the procedure, but the required steps were not followed correctly.',
  },
  {
    code: 'KNOWLEDGE_TRAINING_GAP',
    label: 'Knowledge / Training Gap',
    shortLabel: 'Knowledge Gap',
    description: 'The analyst did not have sufficient knowledge or understanding of the procedure or requirement.',
  },
  {
    code: 'SYSTEM_MAPPING_ISSUE',
    label: 'System / Mapping Issue',
    shortLabel: 'System Issue',
    description: 'The defect was caused or materially contributed to by a system, mapping, integration, or technical issue.',
  },
  {
    code: 'PROCESS_PROCEDURE_ISSUE',
    label: 'Process / Procedure Issue',
    shortLabel: 'Process Issue',
    description:
      'The analyst followed the available process, but the process or procedure was incomplete, unclear, outdated, or did not adequately address the scenario.',
  },
  {
    code: 'OTHER_EXTERNAL_FACTOR',
    label: 'Other / External Factor',
    shortLabel: 'Other',
    description: 'The defect was influenced by a factor that does not fit the other categories.',
  },
];

export function isDefectReasonCode(value: unknown): value is DefectReasonCode {
  return typeof value === 'string' && DEFECT_REASON_CODES.includes(value as DefectReasonCode);
}

export function getDefectReasonDefinition(code: DefectReasonCode | null | undefined): DefectReasonDefinition | null {
  if (!code) return null;
  return DEFECT_REASONS.find((reason) => reason.code === code) ?? null;
}

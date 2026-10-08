import type { DefectReasonCode } from '@/types/defect';

/** Hex fills for recharts bars — mirrors the Tailwind hues lib/theme.ts already uses for reason badges. */
export const REASON_COLORS: Record<DefectReasonCode | 'NOT_CLASSIFIED', string> = {
  PROCEDURAL_ERROR: '#DC2626',
  KNOWLEDGE_TRAINING_GAP: '#D97706',
  SYSTEM_MAPPING_ISSUE: '#9333EA',
  PROCESS_PROCEDURE_ISSUE: '#003EA4',
  OTHER_EXTERNAL_FACTOR: '#64748B',
  NOT_CLASSIFIED: '#94A3B8',
};

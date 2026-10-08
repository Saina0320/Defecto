import { ClipboardX, Cpu, FileWarning, GraduationCap, HelpCircle, type LucideIcon } from 'lucide-react';
import type { DefectReasonCode } from '@/types/defect';

/** Presentation-only icon per reason code — kept out of constants/defectReasons.ts, which is plain data. */
export const DEFECT_REASON_ICONS: Record<DefectReasonCode, LucideIcon> = {
  PROCEDURAL_ERROR: ClipboardX,
  KNOWLEDGE_TRAINING_GAP: GraduationCap,
  SYSTEM_MAPPING_ISSUE: Cpu,
  PROCESS_PROCEDURE_ISSUE: FileWarning,
  OTHER_EXTERNAL_FACTOR: HelpCircle,
};

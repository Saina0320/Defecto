import type { UserRole } from '@/types/team';

export type CaseType = 'Individual' | 'Entity';

export type CategorySection = 'CORE' | 'APPENDIX';

/**
 * The primary reason/contributing factor a defect occurred — distinct from WHAT the defect was
 * (selectedCategories). Selected explicitly by the analyst/QC reviewer; never inferred from other
 * fields. See constants/defectReasons.ts for the display label/description of each code.
 */
export type DefectReasonCode =
  | 'PROCEDURAL_ERROR'
  | 'KNOWLEDGE_TRAINING_GAP'
  | 'SYSTEM_MAPPING_ISSUE'
  | 'PROCESS_PROCEDURE_ISSUE'
  | 'OTHER_EXTERNAL_FACTOR';

export type DefectCategory = {
  section: CategorySection;
  name: string;
};

/** QC findings file or final case ZIP attached to a defect. */
export type AttachedFile = {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  /** Full name of the profile that uploaded it, resolved server-side from Evidence.uploadedById. */
  uploadedBy: string;
};

export type EvidenceFile = {
  id: string;
  name: string;
  size: string;
  /** Full name of the profile that uploaded it, resolved server-side from Evidence.uploadedById. */
  uploadedBy: string;
};

export type DefectResolution = {
  comment: string;
  correctiveAction: string;
  resolvedBy: string;
  resolutionDate: string;
  evidenceFiles: EvidenceFile[];
};

export type ReadReceipt = {
  userId: string;
  userName: string;
  role: UserRole;
  readAt: string;
};

export type Defect = {
  /** Technical database id. Demo records do not have one. Never shown as the defect id. */
  id?: string;
  ccid: string;
  kycid: string;
  caseType: CaseType;
  ownerId: string;
  analystName: string;
  dateCreated: string;
  explanation: string;
  selectedCategories: DefectCategory[];
  qcFile: AttachedFile | null;
  finalZipFile: AttachedFile | null;
  resolution: DefectResolution | null;
  readReceipts: ReadReceipt[];
  status?: string;
  /** null for defects recorded before this field existed, or when no reason has been selected yet. */
  defectReason: DefectReasonCode | null;
  /** Optional free-text context for defectReason. Empty string, never null, when absent. */
  defectReasonDetails: string;
};

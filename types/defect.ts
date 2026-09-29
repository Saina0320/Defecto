import type { UserRole } from '@/types/team';

export type CaseType = 'Individual' | 'Entity';

export type CategorySection = 'CORE' | 'APPENDIX';

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
};

export type EvidenceFile = {
  id: string;
  name: string;
  size: string;
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
  /** Technical Supabase id. Demo records do not have one. Never shown as the defect id. */
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
};

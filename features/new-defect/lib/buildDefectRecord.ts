import type { NewDefectDraft } from '@/features/new-defect/lib/draft';
import type { Defect } from '@/types/defect';
import type { TeamMember } from '@/types/team';

const DEFAULT_RESOLUTION_COMMENT = 'Resolution verified and recorded post QC approval.';
const DEFAULT_CORRECTIVE_ACTION = 'Corrective file updates completed.';

type BuildDefectRecordInput = {
  draft: NewDefectDraft;
  /** Active persona: owner of the record and first reader. */
  owner: TeamMember;
  analystName: string;
  resolvedBy: string;
  createdAt: string;
};

export function buildDefectRecord({ draft, owner, analystName, resolvedBy, createdAt }: BuildDefectRecordInput): Defect {
  return {
    ccid: draft.ccid,
    kycid: draft.kycid,
    caseType: draft.caseType,
    ownerId: owner.id,
    analystName,
    dateCreated: draft.date,
    explanation: draft.explanation,
    selectedCategories: draft.categories,
    qcFile: draft.qcFile,
    finalZipFile: draft.finalZip,
    resolution: {
      comment: draft.resolutionComment || DEFAULT_RESOLUTION_COMMENT,
      correctiveAction: draft.correctiveAction || DEFAULT_CORRECTIVE_ACTION,
      resolvedBy: resolvedBy || analystName,
      resolutionDate: draft.resolutionDate,
      evidenceFiles: draft.evidenceFiles,
    },
    readReceipts: [{ userId: owner.id, userName: owner.name, role: owner.role, readAt: createdAt }],
  };
}

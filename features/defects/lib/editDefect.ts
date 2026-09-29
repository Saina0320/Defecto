import { sanitizeCcid } from '@/features/defects/lib/identifiers';
import type { Defect, DefectResolution } from '@/types/defect';

const EMPTY_RESOLUTION: DefectResolution = {
  comment: '',
  correctiveAction: '',
  resolvedBy: '',
  resolutionDate: '',
  evidenceFiles: [],
};

/** Editable copy of a defect; the resolution always exists so its fields can be filled in. */
export type DefectEditDraft = Omit<Defect, 'resolution'> & { resolution: DefectResolution };

export function createEditDraft(defect: Defect): DefectEditDraft {
  const resolution = defect.resolution ?? EMPTY_RESOLUTION;
  return {
    ...defect,
    resolution: { ...resolution, evidenceFiles: [...resolution.evidenceFiles] },
    selectedCategories: [...defect.selectedCategories],
  };
}

/** Normalizes the edited values before saving them to the registry. */
export function finalizeEditedDefect(draft: DefectEditDraft): Defect {
  return {
    ...draft,
    ccid: sanitizeCcid(draft.ccid) || draft.ccid,
    kycid: draft.kycid.trim(),
    explanation: draft.explanation.trim(),
    resolution: {
      ...draft.resolution,
      correctiveAction: draft.resolution.correctiveAction.trim(),
      comment: draft.resolution.comment.trim(),
    },
  };
}

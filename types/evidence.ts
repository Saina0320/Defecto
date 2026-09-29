export type EvidenceTag = 'qc' | 'zip' | 'res';

/** A document listed in the Evidence Vault, derived from the defects registry. */
export type EvidenceItem = {
  id: string;
  ccid: string;
  fileName: string;
  fileType: string;
  size: string;
  uploadedBy: string;
  date: string;
  tag: EvidenceTag;
};

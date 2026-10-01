import type { Defect } from '@/types/defect';
import type { EvidenceItem } from '@/types/evidence';

/** Builds the Evidence Vault listing from the files attached to each defect. */
export function collectEvidenceFiles(defects: Defect[]): EvidenceItem[] {
  const items: EvidenceItem[] = [];

  for (const defect of defects) {
    if (defect.qcFile?.name) {
      items.push({
        id: defect.qcFile.id || `QC-${defect.ccid}`,
        ccid: defect.ccid,
        fileName: defect.qcFile.name,
        fileType: 'QC Findings File',
        size: defect.qcFile.size || '1.4 MB',
        uploadedBy: defect.qcFile.uploadedBy,
        date: defect.qcFile.uploadDate || defect.dateCreated || '2026-09-22',
        tag: 'qc',
      });
    }

    if (defect.finalZipFile?.name) {
      items.push({
        id: defect.finalZipFile.id || `ZIP-${defect.ccid}`,
        ccid: defect.ccid,
        fileName: defect.finalZipFile.name,
        fileType: 'Final Case ZIP',
        size: defect.finalZipFile.size || '6.5 MB',
        uploadedBy: defect.finalZipFile.uploadedBy,
        date: defect.finalZipFile.uploadDate || defect.dateCreated || '2026-09-22',
        tag: 'zip',
      });
    }

    const { resolution } = defect;
    resolution?.evidenceFiles.forEach((file, index) => {
      if (!file.name) return;
      items.push({
        id: file.id || `RES-${defect.ccid}-${index}`,
        ccid: defect.ccid,
        fileName: file.name,
        fileType: 'Resolution Evidence',
        size: file.size || '2.0 MB',
        uploadedBy: file.uploadedBy,
        date: resolution.resolutionDate || defect.dateCreated || '2026-09-23',
        tag: 'res',
      });
    });
  }

  return items;
}

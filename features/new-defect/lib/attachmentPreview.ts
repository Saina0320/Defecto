import { formatFileSize } from '@/lib/fileSize';
import { nowTimestamp } from '@/lib/dates';
import type { AttachedFile, EvidenceFile } from '@/types/defect';

// Preview records for a real File picked in the wizard. The id is a temporary client-side
// placeholder; once submitDefect + uploadDefectEvidence persist the file, the next getDefects()
// read replaces it with the real Evidence.id (services/defects.ts).
function tempId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}

// uploaderName is only for this optimistic, pre-persistence preview. The real Evidence.uploadedById
// (and the name shown after the next reload) always comes from the server session, never from here.

export function previewQcFindingsFile(file: File, uploaderName: string): AttachedFile {
  return { id: tempId('qc'), name: file.name, size: formatFileSize(file.size), uploadDate: nowTimestamp(), uploadedBy: uploaderName };
}

export function previewFinalZipFile(file: File, uploaderName: string): AttachedFile {
  return { id: tempId('zip'), name: file.name, size: formatFileSize(file.size), uploadDate: nowTimestamp(), uploadedBy: uploaderName };
}

export function previewEvidenceFile(file: File, uploaderName: string): EvidenceFile {
  return { id: tempId('res'), name: file.name, size: formatFileSize(file.size), uploadedBy: uploaderName };
}

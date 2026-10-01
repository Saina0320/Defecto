'use server';

import { requireUser } from '@/lib/auth/session';
import { isSupervisorRole } from '@/lib/permissions';
import { createEvidenceDownloadUrl, uploadEvidenceFile } from '@/lib/supabaseStorage';
import { getDefectAnalystId } from '@/services/defects';
import { buildEvidencePath, createEvidenceRecord, getEvidencePath, type EvidenceCategory, type EvidenceFolder } from '@/services/evidence';

export type UploadedEvidence = {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string | null;
  uploadedAt: string;
};

export type UploadEvidenceResult =
  | { ok: true; evidence: UploadedEvidence }
  | { ok: false; reason: 'invalid-file' | 'forbidden' | 'not-found' | 'storage-error' | 'database-error' };

async function uploadOneEvidenceFile(
  defectId: string,
  uploadedById: string,
  file: File,
  category: EvidenceCategory,
  folder: EvidenceFolder
): Promise<UploadEvidenceResult> {
  const path = buildEvidencePath(defectId, folder, file.name);

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    await uploadEvidenceFile(path, bytes, file.type || null);
  } catch (error) {
    console.error('Error uploading evidence file to Storage:', error);
    return { ok: false, reason: 'storage-error' };
  }

  try {
    const record = await createEvidenceRecord({
      defectId,
      uploadedById,
      fileName: file.name,
      filePath: path,
      fileType: file.type || null,
      fileSize: file.size,
      category,
    });
    return {
      ok: true,
      evidence: {
        id: record.id,
        fileName: record.fileName,
        fileSize: record.fileSize,
        fileType: record.fileType,
        uploadedAt: record.uploadedAt.toISOString(),
      },
    };
  } catch (error) {
    // The uploaded bytes stay in Storage even if the metadata write fails; they're simply
    // unreferenced until someone re-attaches the same file, which uploads them again under a
    // fresh unique path. Not cleaning them up here keeps this action's error handling simple.
    console.error('Error saving evidence metadata:', error);
    return { ok: false, reason: 'database-error' };
  }
}

export type UploadDefectEvidenceResult = {
  qcFile: UploadEvidenceResult | null;
  finalZip: UploadEvidenceResult | null;
  resolutionEvidence: UploadEvidenceResult[];
};

/**
 * Uploads every file attached while building a defect (QC Findings, Final ZIP, Resolution
 * Evidence) once the defect itself exists and its id is known. Same ownership rule as
 * deleteDefect/setCategories: the creator, or a manager/admin (lib/permissions.ts).
 *
 * Expected FormData keys: "qcFile" (single), "finalZip" (single), "evidence" (zero or more,
 * appended under the same key).
 */
export async function uploadDefectEvidence(defectId: string, formData: FormData): Promise<UploadDefectEvidenceResult> {
  const user = await requireUser();

  const analystId = await getDefectAnalystId(defectId);
  if (!analystId || (!isSupervisorRole(user.role) && analystId !== user.id)) {
    const denied: UploadEvidenceResult = { ok: false, reason: analystId ? 'forbidden' : 'not-found' };
    return { qcFile: denied, finalZip: denied, resolutionEvidence: [] };
  }

  const qcFile = formData.get('qcFile');
  const finalZip = formData.get('finalZip');
  const evidenceFiles = formData.getAll('evidence').filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const [qcResult, finalZipResult] = await Promise.all([
    qcFile instanceof File && qcFile.size > 0 ? uploadOneEvidenceFile(defectId, user.id, qcFile, 'qc', 'qc') : Promise.resolve(null),
    finalZip instanceof File && finalZip.size > 0
      ? uploadOneEvidenceFile(defectId, user.id, finalZip, 'supporting', 'final')
      : Promise.resolve(null),
  ]);

  const resolutionEvidence = await Promise.all(
    evidenceFiles.map((file) => uploadOneEvidenceFile(defectId, user.id, file, 'resolution', 'resolution'))
  );

  return { qcFile: qcResult, finalZip: finalZipResult, resolutionEvidence };
}

export type DownloadUrlResult = { ok: true; url: string } | { ok: false; reason: 'not-found' | 'storage-error' };

/**
 * A short-lived signed URL to download one evidence file from the private bucket. Any signed-in
 * user may request one — Evidence Vault and the defect detail drawer are shared across the team.
 */
export async function getEvidenceDownloadUrl(evidenceId: string): Promise<DownloadUrlResult> {
  if (typeof evidenceId !== 'string' || !evidenceId) return { ok: false, reason: 'not-found' };

  await requireUser();

  const path = await getEvidencePath(evidenceId);
  if (!path) return { ok: false, reason: 'not-found' };

  try {
    const url = await createEvidenceDownloadUrl(path);
    return { ok: true, url };
  } catch (error) {
    console.error('Error creating evidence download URL:', error);
    return { ok: false, reason: 'storage-error' };
  }
}

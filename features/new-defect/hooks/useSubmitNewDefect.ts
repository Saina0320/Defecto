import { useRouter } from 'next/navigation';
import { LOGIN_ROUTE } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { uploadDefectEvidence, type UploadEvidenceResult } from '@/features/evidence/actions';
import { submitDefect, type SubmitDefectResult } from '@/features/new-defect/actions';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { buildDefectRecord } from '@/features/new-defect/lib/buildDefectRecord';
import { getSubmissionIssue } from '@/features/new-defect/lib/validation';
import { useTeam } from '@/features/team/context/TeamProvider';
import { nowTimestamp } from '@/lib/dates';
import { getErrorMessage } from '@/lib/errors';
import { formatFileSize } from '@/lib/fileSize';
import { useToast } from '@/providers/ToastProvider';
import type { AttachedFile, EvidenceFile } from '@/types/defect';

/** The real, persisted file — never the pre-upload preview — as it should appear in the registry. */
function toConfirmedFile(result: UploadEvidenceResult): AttachedFile | null {
  if (!result.ok) return null;
  const { evidence } = result;
  return {
    id: evidence.id,
    name: evidence.fileName,
    size: formatFileSize(evidence.fileSize),
    uploadDate: evidence.uploadedAt.substring(0, 10),
    uploadedBy: evidence.uploadedBy,
  };
}

function toConfirmedEvidenceFile(result: UploadEvidenceResult): EvidenceFile | null {
  if (!result.ok) return null;
  const { evidence } = result;
  return { id: evidence.id, name: evidence.fileName, size: formatFileSize(evidence.fileSize), uploadedBy: evidence.uploadedBy };
}

/** Validates the draft, stores the defect in the database and adds it to the registry. */
export function useSubmitNewDefect() {
  const router = useRouter();
  const { currentUser } = useTeam();
  const { addDefect, replaceDefect } = useDefects();
  const { showToast } = useToast();
  const { draft, analyst, resolvedBy, updateDraft, resetSubmittedFields } = useNewDefectDraft();

  return async function submitNewDefect() {
    const issue = getSubmissionIssue(draft);
    if (issue) {
      alert(issue.message);
      updateDraft({ step: issue.step });
      return;
    }

    const analystName = analyst || currentUser.name || '';
    const record = buildDefectRecord({ draft, owner: currentUser, analystName, resolvedBy, createdAt: nowTimestamp() });

    let result: SubmitDefectResult;
    try {
      result = await submitDefect({
        ccid: draft.ccid,
        kycid: draft.kycid,
        caseType: draft.caseType,
        analystName,
        explanation: draft.explanation,
        categories: draft.categories,
      });
    } catch (error) {
      // The request itself failed (network or server unavailable).
      console.error('Error creating defect:', error);
      alert(`Error guardando el defecto:\n${getErrorMessage(error)}`);
      return;
    }

    if (!result.ok) {
      if (result.reason === 'not-signed-in') {
        alert('Tu sesión ha terminado. Inicia sesión de nuevo para registrar el defecto.');
        // A full page load, so nothing of the ended session stays in memory.
        window.location.assign(LOGIN_ROUTE);
      } else if (result.reason === 'analyst-not-found') {
        alert(`No se encontró el analista "${analystName}" en Supabase.`);
      } else {
        alert(`Error guardando el defecto:\n${result.message}`);
      }
      return;
    }

    // The defect record is added WITHOUT its files: none of them are confirmed persisted yet, and
    // the registry must never show a file as attached before Storage + the database both confirm
    // it. The qcFile/finalZip/evidenceFiles previews built from the picked Files were only ever a
    // pre-submit UI preview — they are discarded here, not carried into the shared registry.
    const unconfirmedRecord = {
      ...record,
      id: result.id,
      status: result.status,
      qcFile: null,
      finalZipFile: null,
      resolution: record.resolution ? { ...record.resolution, evidenceFiles: [] } : null,
    };
    addDefect(unconfirmedRecord);

    // A single final toast, decided once every outcome is known — the ToastProvider only ever
    // holds one message, so firing several in sequence would just overwrite each other and the
    // file-upload failure (the important part) could be hidden by a later "success" toast.
    let finalMessage = `Defect (${record.ccid} / ${record.kycid}) successfully logged into registry!`;

    const formData = new FormData();
    if (draft.qcFileRaw) formData.set('qcFile', draft.qcFileRaw);
    if (draft.finalZipRaw) formData.set('finalZip', draft.finalZipRaw);
    for (const file of draft.evidenceFilesRaw) formData.append('evidence', file);

    if (draft.qcFileRaw || draft.finalZipRaw || draft.evidenceFilesRaw.length > 0) {
      try {
        const uploadResult = await uploadDefectEvidence(result.id, formData);

        // Only a result the server actually confirmed (ok: true) is written into the registry —
        // a failed one leaves the corresponding slot null/empty, exactly as it already was above.
        const confirmedDefect = {
          ...unconfirmedRecord,
          qcFile: toConfirmedFile(uploadResult.qcFile ?? { ok: false, reason: 'invalid-file' }) ?? null,
          finalZipFile: toConfirmedFile(uploadResult.finalZip ?? { ok: false, reason: 'invalid-file' }) ?? null,
          resolution: unconfirmedRecord.resolution
            ? {
                ...unconfirmedRecord.resolution,
                evidenceFiles: uploadResult.resolutionEvidence.map(toConfirmedEvidenceFile).filter((file) => file !== null),
              }
            : null,
        };
        replaceDefect(unconfirmedRecord.ccid, confirmedDefect);

        const attempted = [
          draft.qcFileRaw ? uploadResult.qcFile : null,
          draft.finalZipRaw ? uploadResult.finalZip : null,
          ...uploadResult.resolutionEvidence,
        ].filter((entry): entry is NonNullable<typeof entry> => entry !== null);
        const failures = attempted.filter((entry) => !entry.ok);
        if (failures.length > 0) {
          finalMessage = `Defect saved, but ${failures.length} of ${attempted.length} file(s) were NOT uploaded and are not attached. Open the defect to retry.`;
        }
      } catch (error) {
        // The request itself failed — nothing was confirmed, so nothing is added to the registry.
        console.error('Error uploading defect evidence:', error);
        finalMessage = 'Defect saved, but its files were NOT uploaded. Open the defect to retry.';
      }
    }

    showToast(finalMessage);
    resetSubmittedFields();
    router.push(ROUTES.defects);
  };
}

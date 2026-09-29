import { useRouter } from 'next/navigation';
import { LOGIN_ROUTE } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { submitDefect, type SubmitDefectResult } from '@/features/new-defect/actions';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { buildDefectRecord } from '@/features/new-defect/lib/buildDefectRecord';
import { getSubmissionIssue } from '@/features/new-defect/lib/validation';
import { useTeam } from '@/features/team/context/TeamProvider';
import { nowTimestamp } from '@/lib/dates';
import { getErrorMessage } from '@/lib/errors';
import { useToast } from '@/providers/ToastProvider';

/** Validates the draft, stores the defect in the database and adds it to the registry. */
export function useSubmitNewDefect() {
  const router = useRouter();
  const { currentUser } = useTeam();
  const { addDefect } = useDefects();
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

    addDefect({ ...record, id: result.id, status: result.status });
    showToast(`Defect (${record.ccid} / ${record.kycid}) successfully logged into registry!`);
    resetSubmittedFields();
    router.push(ROUTES.defects);
  };
}

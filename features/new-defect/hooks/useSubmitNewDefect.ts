import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { buildDefectRecord } from '@/features/new-defect/lib/buildDefectRecord';
import { getSubmissionIssue } from '@/features/new-defect/lib/validation';
import { useTeam } from '@/features/team/context/TeamProvider';
import { nowTimestamp } from '@/lib/dates';
import { getErrorMessage } from '@/lib/errors';
import { useToast } from '@/providers/ToastProvider';
import { insertDefect } from '@/services/defects';
import { findProfileIdByFullName } from '@/services/profiles';

/** Validates the draft, stores the defect in Supabase and adds it to the registry. */
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

    const analystId = await findProfileIdByFullName(analystName);
    if (!analystId) {
      alert(`No se encontró el analista "${analystName}" en Supabase.`);
      return;
    }

    let inserted;
    try {
      inserted = await insertDefect({
        ccid: draft.ccid,
        kycid: draft.kycid,
        case_type: draft.caseType.toLowerCase(),
        analyst_id: analystId,
        analyst_context: draft.explanation,
        status: 'draft',
      });
    } catch (error) {
      console.error('Error creating defect:', error);
      alert(`Error guardando el defecto:\n${getErrorMessage(error)}`);
      return;
    }

    addDefect({ ...record, id: inserted.id, status: inserted.status });
    showToast(`Defect (${record.ccid} / ${record.kycid}) successfully logged into registry!`);
    resetSubmittedFields();
    router.push(ROUTES.defects);
  };
}

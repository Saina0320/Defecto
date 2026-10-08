'use server';

import { CASE_TYPES } from '@/constants/categories';
import { isDefectReasonCode } from '@/constants/defectReasons';
import { isKnownCategory } from '@/features/defects/lib/categories';
import { formatCcidDisplay } from '@/features/defects/lib/identifiers';
import { getCurrentUser } from '@/lib/auth/session';
import { createDefect } from '@/services/defects';
import { createNotifications } from '@/services/notifications';
import { findProfileIdByFullName, getSupervisorRecipientIds } from '@/services/profiles';
import type { CaseType, DefectCategory, DefectReasonCode } from '@/types/defect';

export type SubmitDefectInput = {
  ccid: string;
  kycid: string;
  caseType: CaseType;
  analystName: string;
  explanation: string;
  categories: DefectCategory[];
  defectReason: DefectReasonCode;
  defectReasonDetails: string;
};

export type SubmitDefectResult =
  | { ok: true; id: string; status: string }
  | { ok: false; reason: 'not-signed-in' }
  | { ok: false; reason: 'analyst-not-found' }
  | { ok: false; reason: 'invalid-input' | 'database-error'; message: string };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

// Server Functions are reachable with a plain POST request, so the arguments cannot be trusted
// to match their TypeScript type or to have passed the wizard's validation.
function parseInput(input: unknown): SubmitDefectInput | null {
  if (!input || typeof input !== 'object') return null;
  const { ccid, kycid, caseType, analystName, explanation, categories, defectReason, defectReasonDetails } = input as Record<
    string,
    unknown
  >;

  if (typeof ccid !== 'string' || !/^\d{16}$/.test(ccid)) return null;
  if (!isNonEmptyString(kycid) || !isNonEmptyString(explanation) || !isNonEmptyString(analystName)) return null;
  if (!isDefectReasonCode(defectReason)) return null;
  if (defectReasonDetails !== undefined && typeof defectReasonDetails !== 'string') return null;

  const knownCaseType = CASE_TYPES.find((type) => type === caseType);
  if (!knownCaseType) return null;

  const isKnownForThisCaseType = (category: unknown): category is DefectCategory => isKnownCategory(knownCaseType, category);
  if (!Array.isArray(categories) || !categories.every(isKnownForThisCaseType)) return null;

  return {
    ccid,
    kycid,
    caseType: knownCaseType,
    analystName,
    explanation,
    categories,
    defectReason,
    defectReasonDetails: defectReasonDetails ?? '',
  };
}

/** Stores a defect for the named analyst. Failures are returned, not thrown, so the wizard can report them. */
export async function submitDefect(input: SubmitDefectInput): Promise<SubmitDefectResult> {
  const values = parseInput(input);
  if (!values) {
    return { ok: false, reason: 'invalid-input', message: 'Los datos del defecto no son válidos.' };
  }

  try {
    // A Server Function can be called without opening any page, so the session is checked here too.
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: 'not-signed-in' };

    const analystId = await findProfileIdByFullName(values.analystName);
    if (!analystId) return { ok: false, reason: 'analyst-not-found' };

    const created = await createDefect({
      ccid: values.ccid,
      kycid: values.kycid,
      caseType: values.caseType,
      analystId,
      explanation: values.explanation,
      categories: values.categories,
      defectReason: values.defectReason,
      defectReasonDetails: values.defectReasonDetails,
    });

    // The defect exists now, so notifying is safe. Its own failure must never turn this into an
    // error response — the defect was already saved successfully at this point. The actor is the
    // signed-in session user, not values.analystName (which the browser sends and this wizard
    // lets a Manager override to someone else's name), so the notification always credits — and
    // excludes from recipients — whoever actually submitted the request.
    try {
      const recipientIds = await getSupervisorRecipientIds(user.id);
      if (recipientIds.length > 0) {
        await createNotifications(
          recipientIds.map((recipientId) => ({
            recipientId,
            defectId: created.id,
            title: 'New defect registered',
            message: `${user.name} added a new defect.\nCCID: ${formatCcidDisplay(values.ccid)}\nKYCID: ${values.kycid}`,
          }))
        );
      }
    } catch (error) {
      console.error('Error creating new-defect notifications:', error);
    }

    return { ok: true, id: created.id, status: created.status };
  } catch (error) {
    // The full error stays in the server log; database details are not sent to the browser.
    console.error('Error creating defect:', error);
    return { ok: false, reason: 'database-error', message: 'No se pudo guardar el defecto en la base de datos.' };
  }
}

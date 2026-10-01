'use server';

import { CASE_TYPES } from '@/constants/categories';
import { isKnownCategory } from '@/features/defects/lib/categories';
import { getCurrentUser } from '@/lib/auth/session';
import { createDefect } from '@/services/defects';
import { findProfileIdByFullName } from '@/services/profiles';
import type { CaseType, DefectCategory } from '@/types/defect';

export type SubmitDefectInput = {
  ccid: string;
  kycid: string;
  caseType: CaseType;
  analystName: string;
  explanation: string;
  categories: DefectCategory[];
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
  const { ccid, kycid, caseType, analystName, explanation, categories } = input as Record<string, unknown>;

  if (typeof ccid !== 'string' || !/^\d{16}$/.test(ccid)) return null;
  if (!isNonEmptyString(kycid) || !isNonEmptyString(explanation) || !isNonEmptyString(analystName)) return null;

  const knownCaseType = CASE_TYPES.find((type) => type === caseType);
  if (!knownCaseType) return null;

  const isKnownForThisCaseType = (category: unknown): category is DefectCategory => isKnownCategory(knownCaseType, category);
  if (!Array.isArray(categories) || !categories.every(isKnownForThisCaseType)) return null;

  return { ccid, kycid, caseType: knownCaseType, analystName, explanation, categories };
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
    });

    return { ok: true, id: created.id, status: created.status };
  } catch (error) {
    // The full error stays in the server log; database details are not sent to the browser.
    console.error('Error creating defect:', error);
    return { ok: false, reason: 'database-error', message: 'No se pudo guardar el defecto en la base de datos.' };
  }
}

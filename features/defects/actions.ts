'use server';

import { isDefectReasonCode } from '@/constants/defectReasons';
import { isKnownCategory } from '@/features/defects/lib/categories';
import { requireUser } from '@/lib/auth/session';
import { formatTimestamp } from '@/lib/dates';
import { isSupervisorRole } from '@/lib/permissions';
import {
  createDefectRead,
  deleteDefectById,
  deleteDefectReadById,
  findDefectReadId,
  getDefectAnalystId,
  getDefectOwnerAndCaseType,
  setDefectCategories,
  setDefectReason as setDefectReasonInDb,
} from '@/services/defects';
import type { DefectCategory, DefectReasonCode } from '@/types/defect';

export type DeleteDefectResult = { ok: true } | { ok: false; reason: 'not-found' | 'forbidden' | 'database-error' };

/**
 * Deletes a defect after checking, against the database, that the signed-in user created it.
 * Managers and admins may delete any defect too, matching the existing supervisor override in
 * lib/permissions.ts (canManageDefect) — this is not a new rule, just enforced here as well.
 *
 * Server Functions are reachable with a plain POST request, so the id is not trusted to belong
 * to a defect the caller may act on until it is checked here.
 */
export async function deleteDefect(defectId: string): Promise<DeleteDefectResult> {
  if (typeof defectId !== 'string' || !defectId) return { ok: false, reason: 'not-found' };

  const user = await requireUser();

  const analystId = await getDefectAnalystId(defectId);
  if (!analystId) return { ok: false, reason: 'not-found' };

  if (!isSupervisorRole(user.role) && analystId !== user.id) {
    return { ok: false, reason: 'forbidden' };
  }

  try {
    await deleteDefectById(defectId);
    return { ok: true };
  } catch (error) {
    // The full error stays in the server log; database details are not sent to the browser.
    console.error('Error deleting defect:', error);
    return { ok: false, reason: 'database-error' };
  }
}

export type ToggleReadResult =
  | { ok: true; action: 'added'; readAt: string }
  | { ok: true; action: 'removed' }
  | { ok: false; reason: 'not-found' | 'database-error' };

/**
 * Acknowledges the defect for the signed-in user, or un-acknowledges it if they already had.
 * Identity comes from the server-side session (requireUser), never from an id the browser sends.
 */
export async function toggleDefectRead(defectId: string): Promise<ToggleReadResult> {
  if (typeof defectId !== 'string' || !defectId) return { ok: false, reason: 'not-found' };

  const user = await requireUser();

  try {
    const existingReadId = await findDefectReadId(defectId, user.id);
    if (existingReadId) {
      await deleteDefectReadById(existingReadId);
      return { ok: true, action: 'removed' };
    }

    const readAt = await createDefectRead(defectId, user.id);
    return { ok: true, action: 'added', readAt: formatTimestamp(readAt) };
  } catch (error) {
    console.error('Error toggling the defect read receipt:', error);
    return { ok: false, reason: 'database-error' };
  }
}

export type SetCategoriesResult =
  | { ok: true; categories: DefectCategory[] }
  | { ok: false; reason: 'not-found' | 'forbidden' | 'invalid-categories' | 'database-error' };

/**
 * Replaces a defect's selected categories. Same ownership rule as deleteDefect: the creator, or
 * a manager/admin, per the existing supervisor override in lib/permissions.ts.
 */
export async function setCategories(defectId: string, categories: unknown): Promise<SetCategoriesResult> {
  if (typeof defectId !== 'string' || !defectId) return { ok: false, reason: 'not-found' };

  const user = await requireUser();

  const defect = await getDefectOwnerAndCaseType(defectId);
  if (!defect) return { ok: false, reason: 'not-found' };
  if (!isSupervisorRole(user.role) && defect.analystId !== user.id) {
    return { ok: false, reason: 'forbidden' };
  }

  const isKnownForThisDefect = (category: unknown): category is DefectCategory => isKnownCategory(defect.caseType, category);
  if (!Array.isArray(categories) || !categories.every(isKnownForThisDefect)) {
    return { ok: false, reason: 'invalid-categories' };
  }

  try {
    await setDefectCategories(defectId, categories);
    return { ok: true, categories };
  } catch (error) {
    console.error('Error saving defect categories:', error);
    return { ok: false, reason: 'database-error' };
  }
}

export type SetDefectReasonResult =
  | { ok: true; defectReason: DefectReasonCode; defectReasonDetails: string }
  | { ok: false; reason: 'not-found' | 'forbidden' | 'invalid-reason' | 'database-error' };

/**
 * Replaces a defect's stored reason/contributing factor and its optional details. Same ownership
 * rule as setCategories: the creator, or a manager/admin, per lib/permissions.ts.
 */
export async function setDefectReason(defectId: string, defectReason: unknown, defectReasonDetails: unknown): Promise<SetDefectReasonResult> {
  if (typeof defectId !== 'string' || !defectId) return { ok: false, reason: 'not-found' };
  if (!isDefectReasonCode(defectReason)) return { ok: false, reason: 'invalid-reason' };
  if (defectReasonDetails !== undefined && typeof defectReasonDetails !== 'string') return { ok: false, reason: 'invalid-reason' };

  const user = await requireUser();

  const analystId = await getDefectAnalystId(defectId);
  if (!analystId) return { ok: false, reason: 'not-found' };
  if (!isSupervisorRole(user.role) && analystId !== user.id) {
    return { ok: false, reason: 'forbidden' };
  }

  const details = defectReasonDetails ?? '';
  try {
    await setDefectReasonInDb(defectId, defectReason, details);
    return { ok: true, defectReason, defectReasonDetails: details };
  } catch (error) {
    console.error('Error saving defect reason:', error);
    return { ok: false, reason: 'database-error' };
  }
}

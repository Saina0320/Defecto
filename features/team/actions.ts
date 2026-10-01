'use server';

import { parseSoeId } from '@/features/auth/lib/soeId';
import { requireUser } from '@/lib/auth/session';
import { isSupervisorRole } from '@/lib/permissions';
import {
  createAnalystProfile,
  findProfileById,
  findProfileBySoeIdIncludingInactive,
  setProfileActive,
} from '@/services/profiles';
import type { TeamMember } from '@/types/team';

type AddAnalystInput = { fullName: string; soeId: string };

export type AddAnalystResult =
  | { ok: true; member: TeamMember }
  | { ok: false; reason: 'forbidden' | 'invalid-name' | 'invalid-soeid' | 'duplicate-active' | 'database-error' }
  | { ok: false; reason: 'duplicate-inactive'; profileId: string; name: string };

// Server Functions are reachable with a plain POST request, so the shape of `input` is not
// trusted to match AddAnalystInput until it is checked here.
function parseAddAnalystInput(input: unknown): AddAnalystInput | null {
  if (!input || typeof input !== 'object') return null;
  const { fullName, soeId } = input as Record<string, unknown>;
  if (typeof fullName !== 'string' || typeof soeId !== 'string') return null;
  return { fullName, soeId };
}

/** A first and a last word, at minimum: "firstName"/"lastName" both need something to store. */
function isFullName(value: string): boolean {
  return value.trim().split(/\s+/).length >= 2;
}

/** Creates a new active Analyst profile. Only Managers and Admins may call this. */
export async function addAnalystToRoster(input: unknown): Promise<AddAnalystResult> {
  const user = await requireUser();
  if (!isSupervisorRole(user.role)) return { ok: false, reason: 'forbidden' };

  const values = parseAddAnalystInput(input);
  if (!values || !isFullName(values.fullName)) return { ok: false, reason: 'invalid-name' };

  const parsedSoeId = parseSoeId(values.soeId);
  if (!parsedSoeId.ok) return { ok: false, reason: 'invalid-soeid' };

  const existing = await findProfileBySoeIdIncludingInactive(parsedSoeId.soeId);
  if (existing) {
    return existing.status === 'Active'
      ? { ok: false, reason: 'duplicate-active' }
      : { ok: false, reason: 'duplicate-inactive', profileId: existing.id, name: existing.name };
  }

  try {
    const member = await createAnalystProfile({ fullName: values.fullName.trim(), soeId: parsedSoeId.soeId });
    return { ok: true, member };
  } catch (error) {
    // The full error stays in the server log; database details are not sent to the browser.
    console.error('Error creating analyst profile:', error);
    return { ok: false, reason: 'database-error' };
  }
}

export type RosterActionResult =
  | { ok: true; member: TeamMember }
  | { ok: false; reason: 'forbidden' | 'not-found' | 'self' | 'not-an-analyst' | 'already-active' | 'database-error' };

/**
 * Re-enables a previously deactivated profile found by SOEID during Add Analyst, instead of
 * creating a duplicate row: same id, same soeId, same historical relationships.
 */
export async function reactivateAnalyst(profileId: string): Promise<RosterActionResult> {
  if (typeof profileId !== 'string' || !profileId) return { ok: false, reason: 'not-found' };

  const user = await requireUser();
  if (!isSupervisorRole(user.role)) return { ok: false, reason: 'forbidden' };

  const target = await findProfileById(profileId);
  if (!target) return { ok: false, reason: 'not-found' };
  if (target.status === 'Active') return { ok: false, reason: 'already-active' };

  try {
    const member = await setProfileActive(profileId, true);
    return { ok: true, member };
  } catch (error) {
    console.error('Error reactivating profile:', error);
    return { ok: false, reason: 'database-error' };
  }
}

/**
 * Removes an Analyst from the active roster by setting Profile.active = false. The row and its
 * historical relationships (defects, reads, audit log, ...) stay untouched — getDefects() in
 * services/defects.ts reads the analyst's name off the Profile relation regardless of active
 * status, so past defects keep showing the real name after this.
 */
export async function deactivateAnalyst(profileId: string): Promise<RosterActionResult> {
  if (typeof profileId !== 'string' || !profileId) return { ok: false, reason: 'not-found' };

  const user = await requireUser();
  if (!isSupervisorRole(user.role)) return { ok: false, reason: 'forbidden' };
  if (profileId === user.id) return { ok: false, reason: 'self' };

  const target = await findProfileById(profileId);
  if (!target) return { ok: false, reason: 'not-found' };
  if (target.role !== 'Analyst') return { ok: false, reason: 'not-an-analyst' };

  try {
    const member = await setProfileActive(profileId, false);
    return { ok: true, member };
  } catch (error) {
    console.error('Error deactivating profile:', error);
    return { ok: false, reason: 'database-error' };
  }
}

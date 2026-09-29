'use server';

import { redirect } from 'next/navigation';
import { HOME_ROUTE, LOGIN_ROUTE } from '@/constants/auth';
import { parseSoeId, type SoeIdIssue } from '@/features/auth/lib/soeId';
import { endSession, startSession } from '@/lib/auth/session';
import { findActiveProfileBySoeId } from '@/services/profiles';

export type LoginIssue = SoeIdIssue | 'not-found' | 'server-error';

export type LoginFormState = {
  issue: LoginIssue | null;
};

/**
 * Signs in the profile that owns the submitted SOE ID. Failures are returned, not thrown,
 * so the form can report them.
 */
export async function login(_previousState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  // Server Functions are reachable with a plain POST request, so the form's own validation
  // cannot be trusted to have run.
  const parsed = parseSoeId(formData.get('soeId'));
  if (!parsed.ok) return { issue: parsed.issue };

  try {
    const profile = await findActiveProfileBySoeId(parsed.soeId);
    if (!profile) return { issue: 'not-found' };

    await startSession(profile.id);
  } catch (error) {
    // The full error stays in the server log; database details are not sent to the browser.
    console.error('Error signing in:', error);
    return { issue: 'server-error' };
  }

  redirect(HOME_ROUTE);
}

export async function logout(): Promise<void> {
  await endSession();
  redirect(LOGIN_ROUTE);
}

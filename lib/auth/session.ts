import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LOGIN_ROUTE, SESSION_COOKIE_NAME, SESSION_DURATION_HOURS } from '@/constants/auth';
import { createSessionToken, hashSessionToken, isSessionToken } from '@/lib/auth/session-token';
import { createSession, deleteSession, findSessionUser } from '@/services/sessions';
import type { TeamMember } from '@/types/team';

async function readSessionToken(): Promise<string | null> {
  const value = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return isSessionToken(value) ? value : null;
}

/**
 * Opens a session for the profile and hands its token to the browser.
 * Cookies can only be written from a Server Function or a Route Handler.
 */
export async function startSession(profileId: string): Promise<void> {
  const replacedToken = await readSessionToken();
  if (replacedToken) await deleteSession(hashSessionToken(replacedToken));

  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000);
  await createSession({ tokenHash: hashSessionToken(token), profileId, expiresAt });

  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/** Ends the session of this browser: the database forgets it and the cookie is removed. */
export async function endSession(): Promise<void> {
  const token = await readSessionToken();
  (await cookies()).delete(SESSION_COOKIE_NAME);

  if (!token) return;

  try {
    await deleteSession(hashSessionToken(token));
  } catch (error) {
    // The browser no longer has the token, so the user is signed out either way.
    // The row stays until it expires.
    console.error('Error deleting the session:', error);
  }
}

/**
 * The signed-in user, or null. Decided on the server from the session cookie and the database,
 * never from anything else the browser sends. Reads the database once per render, however many
 * times it is called.
 */
export const getCurrentUser = cache(async (): Promise<TeamMember | null> => {
  const token = await readSessionToken();
  if (!token) return null;

  return findSessionUser(hashSessionToken(token));
});

/** The signed-in user. Sends the browser to the login page when there is no valid session. */
export async function requireUser(): Promise<TeamMember> {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN_ROUTE);

  return user;
}

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { HOME_ROUTE } from '@/constants/auth';
import { LoginView } from '@/features/auth/components/LoginView';
import { getCurrentUser } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Sign in',
};

async function isSignedIn(): Promise<boolean> {
  try {
    return (await getCurrentUser()) !== null;
  } catch (error) {
    // The database cannot be reached. The form is shown anyway: signing in reports the failure.
    console.error('Error checking the session:', error);
    return false;
  }
}

export default async function LoginPage() {
  // The session is checked on every request, never while building.
  await connection();

  if (await isSignedIn()) redirect(HOME_ROUTE);

  return <LoginView />;
}

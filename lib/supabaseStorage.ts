import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The private bucket that holds every evidence file. PostgreSQL only ever stores its metadata
// (see services/evidence.ts) — the binary content lives here, never in a database column.
const EVIDENCE_BUCKET = 'defect-evidence';

const globalForSupabase = globalThis as unknown as { supabaseStorage?: SupabaseClient };

/**
 * A Supabase client authenticated with the service_role key, used only on the server to read and
 * write the private Storage bucket. This bypasses the bucket's Row Level Security the same way
 * Prisma's database role already bypasses RLS on Postgres (see prisma/sql/post-db-push.sql) — the
 * app has its own SOE ID session system, not Supabase Auth, so every access check happens in our
 * own server actions (requireUser() + ownership/role) before this client is ever touched.
 *
 * NEXT_PUBLIC_SUPABASE_URL is public (it's just the project's API host), but
 * SUPABASE_SERVICE_ROLE_KEY is a secret: this file is 'server-only' and must never be imported
 * from a Client Component.
 */
function getSupabaseStorage(): SupabaseClient {
  if (!globalForSupabase.supabaseStorage) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Copy .env.example to .env.local and fill them in.'
      );
    }

    globalForSupabase.supabaseStorage = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return globalForSupabase.supabaseStorage;
}

/** Uploads a file's bytes to the private bucket at this exact path. Fails if the path already exists. */
export async function uploadEvidenceFile(path: string, bytes: Buffer, contentType: string | null): Promise<void> {
  const { data, error } = await getSupabaseStorage()
    .storage.from(EVIDENCE_BUCKET)
    .upload(path, bytes, { contentType: contentType ?? undefined, upsert: false });

  // Supabase-js can resolve with neither `error` nor `data` on some transport failures; treat
  // that the same as an explicit error instead of silently reporting success.
  if (error || !data) {
    throw error ?? new Error(`Supabase Storage upload to "${EVIDENCE_BUCKET}/${path}" returned no data and no error.`);
  }
}

/** Removes a file from the private bucket — used to roll back an upload whose DB write then failed. */
export async function deleteEvidenceFile(path: string): Promise<void> {
  const { error } = await getSupabaseStorage().storage.from(EVIDENCE_BUCKET).remove([path]);
  if (error) throw error;
}

/** A short-lived URL to download one file from the private bucket. */
export async function createEvidenceDownloadUrl(path: string, expiresInSeconds = 120): Promise<string> {
  const { data, error } = await getSupabaseStorage().storage.from(EVIDENCE_BUCKET).createSignedUrl(path, expiresInSeconds);

  if (error || !data) throw error ?? new Error('Supabase did not return a signed URL.');
  return data.signedUrl;
}

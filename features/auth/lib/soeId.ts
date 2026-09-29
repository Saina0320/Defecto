export const SOE_ID_LENGTH = 7;

// Two letters followed by five digits, the form of every profiles.soe_id.
// Keep in sync with profiles_soe_id_format_check (prisma/sql/post-db-push.sql).
const SOE_ID_PATTERN = /^[a-z]{2}\d{5}$/;

export type SoeIdIssue = 'empty' | 'invalid-format';

export type ParsedSoeId = { ok: true; soeId: string } | { ok: false; issue: SoeIdIssue };

/** Keeps what can be part of an SOE ID while typing or pasting: no spaces, no more than its length. */
export function sanitizeSoeIdInput(input: string): string {
  return input.replace(/\s/g, '').slice(0, SOE_ID_LENGTH);
}

export function parseSoeId(input: unknown): ParsedSoeId {
  // Profiles store the SOE ID in lowercase; users may type it in either case.
  const soeId = typeof input === 'string' ? input.trim().toLowerCase() : '';

  if (!soeId) return { ok: false, issue: 'empty' };
  if (!SOE_ID_PATTERN.test(soeId)) return { ok: false, issue: 'invalid-format' };

  return { ok: true, soeId };
}

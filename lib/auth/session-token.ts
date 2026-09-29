import { createHash, randomBytes } from 'node:crypto';

const TOKEN_BYTES = 32;

// 32 bytes written in base64url take 43 characters.
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

/** A random value that cannot be guessed. It is the only thing the browser holds. */
export function createSessionToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url');
}

/** What the database stores in place of the token. */
export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Whether the value has the shape of a session token. It says nothing about the session being valid. */
export function isSessionToken(value: unknown): value is string {
  return typeof value === 'string' && TOKEN_PATTERN.test(value);
}

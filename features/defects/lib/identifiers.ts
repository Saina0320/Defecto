import type { Defect } from '@/types/defect';

/** Formats a 16-digit CCID with visual spacing without mutating the stored value. */
export function formatCcidDisplay(rawCcid: string): string {
  if (!rawCcid) return '';
  const clean = String(rawCcid).replace(/\D/g, '');
  if (clean.length === 16) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)} ${clean.slice(12, 16)}`;
  }
  return String(rawCcid);
}

/** CCIDs are stored numeric-only, max 16 digits, with no prefix. */
export function sanitizeCcid(value: string): string {
  return value.replace(/\D/g, '').slice(0, 16);
}

/** Keeps the KYCID exactly as provided in KIWI, collapsing an accidental double prefix. */
export function normalizeKycidInput(value: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith('KYC-KYC-') ? trimmed.replace(/^KYC-KYC-/, 'KYC-') : trimmed;
}

/** Stable identity used to track the selected defect: the Supabase id, or the CCID for demo records. */
export function getDefectKey(defect: Defect): string {
  return defect.id ?? defect.ccid;
}

/** React list key; falls back to position because demo CCIDs are not guaranteed unique. */
export function getDefectRowKey(defect: Defect, index: number): string {
  return defect.id || `${defect.ccid}-${defect.kycid}-${index}`;
}

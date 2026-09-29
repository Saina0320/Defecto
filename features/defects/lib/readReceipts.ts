import type { Defect, ReadReceipt } from '@/types/defect';
import type { TeamMember } from '@/types/team';

export function hasUserRead(defect: Defect, userId: string): boolean {
  return defect.readReceipts.some((receipt) => receipt.userId === userId);
}

/** Adds the reader's receipt, or removes it when it already exists. */
export function toggleReadReceipt(defect: Defect, reader: TeamMember, readAt: string): Defect {
  const readReceipts: ReadReceipt[] = hasUserRead(defect, reader.id)
    ? defect.readReceipts.filter((receipt) => receipt.userId !== reader.id)
    : [...defect.readReceipts, { userId: reader.id, userName: reader.name, role: reader.role, readAt }];

  return { ...defect, readReceipts };
}

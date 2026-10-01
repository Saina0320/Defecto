import 'server-only';
import { getPrisma } from '@/lib/prisma';

/** Matches notifications_type_check in prisma/sql/post-db-push.sql. */
export type NotificationType = 'new_defect';

export type NotificationRecord = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  defectId: string | null;
  isRead: boolean;
  createdAt: Date;
};

const notificationSelect = {
  id: true,
  type: true,
  title: true,
  message: true,
  defectId: true,
  isRead: true,
  createdAt: true,
} as const;

/** The most recent notifications for this user — always scoped by userId, never by a client-supplied id. */
export async function getNotificationsForUser(userId: string, limit = 20): Promise<NotificationRecord[]> {
  const rows = await getPrisma().notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: notificationSelect,
  });
  return rows.map((row) => ({ ...row, type: row.type as NotificationType }));
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return getPrisma().notification.count({ where: { userId, isRead: false } });
}

/**
 * Marks one notification read, scoped to its owner. Returns false (no error) if it belongs to
 * someone else or doesn't exist — the WHERE clause is the authorization check itself.
 */
export async function markNotificationRead(notificationId: string, userId: string): Promise<boolean> {
  const result = await getPrisma().notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true, readAt: new Date() },
  });
  return result.count > 0;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await getPrisma().notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}

export type NewDefectNotificationInput = {
  recipientId: string;
  defectId: string;
  title: string;
  message: string;
};

/** Bulk-creates "new defect" notifications. The title/message are a fixed snapshot at creation time. */
export async function createNotifications(inputs: NewDefectNotificationInput[]): Promise<void> {
  if (inputs.length === 0) return;

  await getPrisma().notification.createMany({
    data: inputs.map((input) => ({
      userId: input.recipientId,
      type: 'new_defect',
      title: input.title,
      message: input.message,
      defectId: input.defectId,
    })),
  });
}

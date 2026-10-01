'use server';

import { requireUser } from '@/lib/auth/session';
import {
  getNotificationsForUser,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationType,
} from '@/services/notifications';

export type NotificationDTO = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  defectId: string | null;
  isRead: boolean;
  createdAt: string;
};

export type MyNotifications = {
  notifications: NotificationDTO[];
  unreadCount: number;
};

/** The signed-in user's own notifications — identity comes from the session, never the browser. */
export async function getMyNotifications(): Promise<MyNotifications> {
  const user = await requireUser();

  const [rows, unreadCount] = await Promise.all([getNotificationsForUser(user.id), getUnreadNotificationCount(user.id)]);

  return {
    notifications: rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })),
    unreadCount,
  };
}

/** Marks one notification read. Scoped to the signed-in user, so it can't touch anyone else's. */
export async function markNotificationAsRead(notificationId: string): Promise<{ ok: boolean }> {
  if (typeof notificationId !== 'string' || !notificationId) return { ok: false };

  const user = await requireUser();
  const ok = await markNotificationRead(notificationId, user.id);
  return { ok };
}

export async function markAllNotificationsAsRead(): Promise<{ ok: true }> {
  const user = await requireUser();
  await markAllNotificationsRead(user.id);
  return { ok: true };
}

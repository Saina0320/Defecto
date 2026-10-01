'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, FileWarning } from 'lucide-react';
import { useDefectDialogs } from '@/features/defects/context/DefectDialogsProvider';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { getMyNotifications, markAllNotificationsAsRead, markNotificationAsRead, type NotificationDTO } from '@/features/notifications/actions';
import { formatRelativeTime } from '@/lib/dates';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

// Loose enough to feel live without hammering the server — see services/notifications.ts.
const POLL_INTERVAL_MS = 20000;

export function NotificationsMenu() {
  const { darkMode, t } = useTheme();
  const { defects } = useDefects();
  const { openDetails } = useDefectDialogs();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    getMyNotifications()
      .then(({ notifications: rows, unreadCount: count }) => {
        setNotifications(rows);
        setUnreadCount(count);
      })
      .catch((error) => console.error('Error loading notifications:', error));
  }, []);

  // Polls while the app is open, so the bell updates without a manual reload.
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleOpenNotification = (notification: NotificationDTO) => {
    if (!notification.isRead) {
      setNotifications((prev) => prev.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      markNotificationAsRead(notification.id).catch((error) => console.error('Error marking notification read:', error));
    }

    if (!notification.defectId) return;

    const defect = defects.find((item) => item.id === notification.defectId);
    if (defect) {
      openDetails(defect);
      setIsOpen(false);
    } else {
      // Not in this browser's cached registry yet (created by someone else, no reload since).
      showToast('Open the Defects Registry and refresh to view this defect.');
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
    markAllNotificationsAsRead().catch((error) => console.error('Error marking all notifications read:', error));
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-2 ${t.mutedText} hover:text-neutral-800 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-white/5 relative cursor-pointer`}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-[3px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full ring-2 ring-white dark:ring-neutral-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-[#111E38] border-[#1E2E4A] text-white' : 'bg-white border-neutral-200 text-[#1E293B] shadow-2xl'} rounded-lg p-3 z-50 text-xs border`}
        >
          <div className={`flex justify-between items-center pb-2 border-b ${t.dividerNeutral} font-bold`}>
            <span className={darkMode ? 'text-white' : 'text-[#002D72]'}>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className={`text-[10px] font-semibold cursor-pointer ${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-[#003EA4] hover:text-[#002D72]'}`}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1.5 py-2">
            {notifications.length === 0 ? (
              <p className={`text-center py-6 ${t.mutedText}`}>No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleOpenNotification(notification)}
                  className={`w-full text-left p-2.5 rounded border-l-4 transition cursor-pointer ${
                    notification.isRead
                      ? `border-transparent ${darkMode ? 'bg-[#0B1426]/60 hover:bg-[#0B1426]' : 'bg-neutral-50 hover:bg-neutral-100'}`
                      : `border-[#003EA4] ${darkMode ? 'bg-blue-950/30 hover:bg-blue-950/50' : 'bg-[#F0F7FF] hover:bg-blue-50'}`
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <FileWarning
                      className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${notification.isRead ? t.mutedText : 'text-[#003EA4] dark:text-blue-400'}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`font-bold text-[11px] ${notification.isRead ? t.mutedText : darkMode ? 'text-blue-200' : 'text-[#002D72]'}`}
                        >
                          {notification.title}
                        </p>
                        {!notification.isRead && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                      </div>
                      <p className={`text-[11px] mt-0.5 whitespace-pre-line ${darkMode ? 'text-slate-300' : 'text-[#334155]'}`}>
                        {notification.message}
                      </p>
                      <p className={`text-[10px] mt-1 ${t.mutedText}`}>{formatRelativeTime(notification.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className={`w-full text-center text-[10px] font-semibold pt-1 border-t cursor-pointer ${darkMode ? 'border-neutral-700 text-neutral-400 hover:text-white' : 'border-neutral-200 text-neutral-600 hover:text-neutral-900'}`}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

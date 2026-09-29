import { useTeam } from '@/features/team/context/TeamProvider';
import { getRoleBadgeClass } from '@/lib/theme';
import { useTheme } from '@/providers/ThemeProvider';

export function PersonaBadge() {
  const { darkMode, t } = useTheme();
  const { currentUser } = useTeam();

  return (
    <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200 dark:border-neutral-700 text-xs">
      <span className={t.mutedText}>User:</span>
      <span className={`font-bold px-2 py-0.5 rounded border ${getRoleBadgeClass(currentUser.role, darkMode)}`}>
        {currentUser.name} ({currentUser.role})
      </span>
    </div>
  );
}

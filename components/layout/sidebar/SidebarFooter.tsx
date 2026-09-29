import { LogoutButton } from "@/components/layout/sidebar/LogoutButton";
import { ROLE_DESCRIPTIONS } from "@/constants/team";
import { useTeam } from "@/features/team/context/TeamProvider";
import { useTheme } from "@/providers/ThemeProvider";

/** Sidebar footer: current user card and sign-out. */
export function SidebarFooter() {
  const { t } = useTheme();
  const { currentUser } = useTeam();

  return (
    <div className={`p-3 border-t ${t.sidebarHeader}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#003EA4] border border-blue-300 flex items-center justify-center font-bold text-xs text-white shadow-xs">
          {currentUser.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">
            {currentUser.name}
          </p>
          <p className="text-[10px] text-blue-300 truncate">
            {ROLE_DESCRIPTIONS[currentUser.role]}
          </p>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}

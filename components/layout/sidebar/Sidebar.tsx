import { X } from "lucide-react";
import { CitiLogo } from "@/components/brand/CitiLogo";
import { PersonaBanner } from "@/components/layout/sidebar/PersonaBanner";
import { SidebarNav } from "@/components/layout/sidebar/SidebarNav";
import { useTheme } from "@/providers/ThemeProvider";
import { SidebarFooter } from "./SidebarFooter";

type SidebarProps = {
  /** Open as a mobile overlay drawer below the lg breakpoint; always visible at lg+. */
  isMobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const { t } = useTheme();

  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onCloseMobile} aria-hidden="true" />}

      <aside
        className={`w-60 ${t.sidebarBg} text-white flex flex-col justify-between flex-shrink-0 transition-transform duration-200 fixed inset-y-0 left-0 z-40 lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className={`px-4 py-4 border-b ${t.sidebarHeader} flex items-center gap-2.5`}>
            <div className="bg-white p-1.5 rounded-[8px] shadow-sm flex items-center justify-center flex-shrink-0">
              <CitiLogo className="h-5 w-auto" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-[13px] tracking-wide text-white leading-tight truncate">KYC DEFECT HUB</h1>
              <p className="text-[9px] text-blue-200/80 tracking-[0.1em] uppercase font-semibold">Quality Management</p>
            </div>
            <button onClick={onCloseMobile} className="p-1 text-blue-200 hover:text-white lg:hidden flex-shrink-0" aria-label="Close navigation">
              <X className="w-4 h-4" />
            </button>
          </div>

          <PersonaBanner />
          <SidebarNav />
        </div>

        <SidebarFooter />
      </aside>
    </>
  );
}

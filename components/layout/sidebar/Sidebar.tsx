import { CitiLogo } from "@/components/brand/CitiLogo";
import { PersonaBanner } from "@/components/layout/sidebar/PersonaBanner";
import { SidebarNav } from "@/components/layout/sidebar/SidebarNav";
import { useTheme } from "@/providers/ThemeProvider";
import { SidebarFooter } from "./SidebarFooter";

export function Sidebar() {
  const { t } = useTheme();

  return (
    <aside
      className={`w-64 ${t.sidebarBg} text-white flex flex-col justify-between z-20 flex-shrink-0 transition-all duration-200`}
    >
      <div>
        <div
          className={`p-5 border-b ${t.sidebarHeader} flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded shadow-sm flex items-center justify-center">
              <CitiLogo className="h-6 w-auto" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white leading-tight">
                KYC DEFECT HUB
              </h1>
              <p className="text-[10px] text-blue-200 tracking-wider uppercase font-semibold">
                Quality Management
              </p>
            </div>
          </div>
        </div>

        <PersonaBanner />
        <SidebarNav />
      </div>

      <SidebarFooter />
    </aside>
  );
}

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/providers/ThemeProvider';

export function OverviewHero({ defectCount }: { defectCount: number }) {
  const { darkMode, t } = useTheme();

  return (
    <div className={`${t.cardBg} p-5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#003EA4] text-white text-[10px] font-bold px-2 py-0.5 rounded">KYC Defect Management</span>
          <span className={`text-xs ${t.mutedText} font-medium`}>Post-QC Approved Case Defect Repository</span>
        </div>
        <h3 className={`text-lg font-bold ${t.headingText}`}>Quality Defect Overview & Case Volume</h3>
        <p className={`text-xs ${t.mutedText} mt-0.5 max-w-3xl`}>
          Defects logged after analyst completion and QC approval across Individual and Entity KYC client portfolios.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={ROUTES.newDefect}
          className="px-3.5 py-2 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-bold rounded shadow transition flex items-center gap-1.5 cursor-pointer text-center"
        >
          <Plus className="w-4 h-4" />
          <span>Enter New Defect</span>
        </Link>
        <Link
          href={ROUTES.defects}
          className={`px-3.5 py-2 border ${darkMode ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'} text-xs font-semibold rounded transition cursor-pointer text-center`}
        >
          Defects Registry ({defectCount})
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/providers/ThemeProvider';

export function OverviewHero({ defectCount }: { defectCount: number }) {
  const { darkMode, t } = useTheme();

  return (
    <div className={`${t.cardBg} p-5 rounded-[14px] border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
      <div>
        <h3 className={`text-xl font-bold ${t.headingText}`}>Quality Defect Overview</h3>
        <p className={`text-xs ${t.mutedText} mt-0.5 max-w-3xl`}>Defect activity and quality status across the KYC team.</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={ROUTES.newDefect}
          className="px-3.5 py-2 bg-[#0757C9] hover:bg-[#063B82] text-white text-xs font-bold rounded-[10px] shadow-sm transition flex items-center gap-1.5 cursor-pointer text-center"
        >
          <Plus className="w-4 h-4" />
          <span>Enter New Defect</span>
        </Link>
        <Link
          href={ROUTES.defects}
          className={`px-3.5 py-2 border ${darkMode ? 'border-[#20344D] text-[#AFC0D4] hover:bg-white/5' : 'border-[#D9E2EC] text-[#5B6B7A] hover:bg-[#F8FAFD]'} text-xs font-semibold rounded-[10px] transition cursor-pointer text-center`}
        >
          Defects Registry ({defectCount})
        </Link>
      </div>
    </div>
  );
}

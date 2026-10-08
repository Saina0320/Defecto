import { ShieldAlert } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

export function RegistryHeader() {
  const { t } = useTheme();

  return (
    <div className={`${t.cardBg} px-4 py-2.5 rounded-[14px] border flex items-center gap-2.5`}>
      <span className="p-1.5 bg-[#0757C9] text-white rounded-[8px] flex-shrink-0">
        <ShieldAlert className="w-4 h-4" />
      </span>
      <h3 className={`text-sm font-bold ${t.headingText}`}>Defects Registry</h3>
      <span className="text-[#D9E2EC] dark:text-[#20344D]">|</span>
      <p className={`text-xs ${t.mutedText}`}>Track, review and manage recorded KYC quality defects.</p>
    </div>
  );
}

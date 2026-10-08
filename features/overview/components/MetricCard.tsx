import type { LucideIcon } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

type MetricCardProps = {
  label: string;
  icon: LucideIcon;
  /** Background and color classes of the icon chip. */
  iconClassName: string;
  value: number;
  valueClassName: string;
  caption: string;
};

export function MetricCard({ label, icon: Icon, iconClassName, value, valueClassName, caption }: MetricCardProps) {
  const { t } = useTheme();

  return (
    <div className={`${t.cardBg} p-4 rounded-[14px] border hover:shadow transition`}>
      <div className={`flex items-center justify-between ${t.mutedText} text-xs font-semibold mb-1.5`}>
        <span>{label}</span>
        <span className={`p-1.5 ${iconClassName} rounded-[8px]`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <div className={`text-[26px] font-bold leading-tight ${valueClassName}`}>{value}</div>
      <div className={`text-[11px] ${t.mutedText} mt-1`}>{caption}</div>
    </div>
  );
}

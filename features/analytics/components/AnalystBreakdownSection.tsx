import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyChartState } from '@/features/analytics/components/EmptyChartState';
import { useTheme } from '@/providers/ThemeProvider';
import type { AnalystBreakdownItem } from '@/types/analytics';

const MAX_BARS = 10;

type AnalystBreakdownSectionProps = {
  items: AnalystBreakdownItem[];
  onSelect: (analystId: string) => void;
};

/** A workload distribution across the team — not a ranking of who performs better or worse. */
export function AnalystBreakdownSection({ items, onSelect }: AnalystBreakdownSectionProps) {
  const { darkMode, t } = useTheme();
  const tickColor = darkMode ? '#94A3B8' : '#64748B';
  const visible = items.slice(0, MAX_BARS).map((item) => ({ ...item, shortName: item.name.split(' ')[0] }));

  return (
    <div className={`${t.cardBg} p-3 rounded-[14px] border h-full flex flex-col`}>
      <div className="mb-1.5">
        <h4 className={`font-bold text-xs ${t.headingText}`}>DEFECTS BY ANALYST</h4>
        <p className={`text-[10px] ${t.mutedText}`}>Team distribution — click to filter</p>
      </div>

      {visible.length === 0 ? (
        <EmptyChartState />
      ) : (
        <div className="h-52 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visible} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1E2E4A' : '#F1F3F5'} />
              <XAxis dataKey="shortName" tick={{ fontSize: 10, fill: tickColor }} angle={-20} textAnchor="end" interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: tickColor }} />
              <Tooltip
                formatter={(value, _name, item) => [`${value} defects`, item.payload.name]}
                contentStyle={{
                  backgroundColor: darkMode ? '#0F1A30' : '#FFFFFF',
                  borderColor: darkMode ? '#1E2E4A' : '#E9ECEF',
                  color: darkMode ? '#FFF' : '#000',
                  fontSize: '11px',
                  borderRadius: '4px',
                }}
              />
              <Bar dataKey="count" fill="#0757C9" radius={[4, 4, 0, 0]} cursor="pointer" onClick={(data) => onSelect(data.payload.analystId)} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyChartState } from '@/features/analytics/components/EmptyChartState';
import { REASON_COLORS } from '@/features/analytics/lib/reasonColors';
import { useTheme } from '@/providers/ThemeProvider';
import type { ReasonBreakdownItem } from '@/types/analytics';

type ReasonBreakdownSectionProps = {
  items: ReasonBreakdownItem[];
  /** Clicking a bar applies it as the Reason filter — a quick drill-down, not a new navigation flow. */
  onSelect: (code: ReasonBreakdownItem['code']) => void;
};

export function ReasonBreakdownSection({ items, onSelect }: ReasonBreakdownSectionProps) {
  const { darkMode, t } = useTheme();
  const tickColor = darkMode ? '#94A3B8' : '#64748B';
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className={`${t.cardBg} p-3 rounded-[14px] border h-full flex flex-col`}>
      <div className="mb-1.5">
        <h4 className={`font-bold text-xs ${t.headingText}`}>DEFECTS BY REASON</h4>
        <p className={`text-[10px] ${t.mutedText}`}>Click a bar to filter</p>
      </div>

      {total === 0 ? (
        <EmptyChartState />
      ) : (
        <div className="h-60 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={items} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: tickColor }} />
              <YAxis type="category" dataKey="label" width={115} tick={{ fontSize: 10, fill: tickColor }} />
              <Tooltip
                formatter={(value, _name, item) => [`${value} (${item.payload.percentage}%)`, 'Defects']}
                contentStyle={{
                  backgroundColor: darkMode ? '#0F1A30' : '#FFFFFF',
                  borderColor: darkMode ? '#1E2E4A' : '#E9ECEF',
                  color: darkMode ? '#FFF' : '#000',
                  fontSize: '11px',
                  borderRadius: '4px',
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} cursor="pointer" onClick={(data) => onSelect(data.payload.code)}>
                {items.map((item) => (
                  <Cell key={item.code} fill={REASON_COLORS[item.code]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

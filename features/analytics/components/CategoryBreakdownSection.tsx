import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyChartState } from '@/features/analytics/components/EmptyChartState';
import { useTheme } from '@/providers/ThemeProvider';
import type { CategoryBreakdownItem } from '@/types/analytics';

const MAX_BARS = 12;

type CategoryBreakdownSectionProps = {
  items: CategoryBreakdownItem[];
  onSelect: (name: string) => void;
};

export function CategoryBreakdownSection({ items, onSelect }: CategoryBreakdownSectionProps) {
  const { darkMode, t } = useTheme();
  const tickColor = darkMode ? '#94A3B8' : '#64748B';
  const visible = items.slice(0, MAX_BARS);

  return (
    <div className={`${t.cardBg} p-3 rounded-[14px] border h-full flex flex-col`}>
      <div className="mb-1.5">
        <h4 className={`font-bold text-xs ${t.headingText}`}>DEFECTS BY CATEGORY</h4>
        <p className={`text-[10px] ${t.mutedText}`}>Click a bar to filter</p>
      </div>

      {visible.length === 0 ? (
        <EmptyChartState />
      ) : (
        <div className="h-52 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visible} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: tickColor }} />
              <YAxis type="category" dataKey="name" width={95} tick={{ fontSize: 10, fill: tickColor }} />
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
              <Bar dataKey="count" fill="#0757C9" radius={[0, 4, 4, 0]} cursor="pointer" onClick={(data) => onSelect(data.payload.name)} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

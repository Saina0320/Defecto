import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DefectReasonBreakdownItem } from '@/features/overview/lib/metrics';
import { useTheme } from '@/providers/ThemeProvider';

export function DefectReasonChart({ data }: { data: DefectReasonBreakdownItem[] }) {
  const { darkMode } = useTheme();
  const tickColor = darkMode ? '#94A3B8' : '#64748B';

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1E2E4A' : '#F1F3F5'} horizontal={false} />
          <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: tickColor }} />
          <YAxis
            type="category"
            dataKey="shortLabel"
            width={110}
            tick={{ fontSize: 10, fill: tickColor }}
          />
          <Tooltip
            formatter={(value, _name, item) => [`${value}% (${item.payload.count} defects)`, item.payload.label]}
            contentStyle={{
              backgroundColor: darkMode ? '#0F1A30' : '#FFFFFF',
              borderColor: darkMode ? '#1E2E4A' : '#E9ECEF',
              color: darkMode ? '#FFF' : '#000',
              fontSize: '11px',
              borderRadius: '4px',
            }}
          />
          <Bar dataKey="percentage" name="% of classified defects" fill="#0757C9" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

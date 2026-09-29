import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AnalystActivity } from '@/features/overview/lib/metrics';
import { useTheme } from '@/providers/ThemeProvider';

export function AnalystActivityChart({ data }: { data: AnalystActivity[] }) {
  const { darkMode } = useTheme();
  const tickColor = darkMode ? '#94A3B8' : '#64748B';

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1E2E4A' : '#F1F3F5'} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: tickColor }} angle={-20} textAnchor="end" interval={0} />
          <YAxis tick={{ fontSize: 11, fill: tickColor }} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#0F1A30' : '#FFFFFF',
              borderColor: darkMode ? '#1E2E4A' : '#E9ECEF',
              color: darkMode ? '#FFF' : '#000',
              fontSize: '11px',
              borderRadius: '4px',
            }}
          />
          <Bar dataKey="defectsLogged" name="Defects Handled" fill="#003EA4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

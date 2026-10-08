import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyChartState } from '@/features/analytics/components/EmptyChartState';
import { useTheme } from '@/providers/ThemeProvider';
import type { DefectTrend } from '@/types/analytics';

const BUCKET_LABEL: Record<DefectTrend['bucket'], string> = { day: 'day', week: 'week', month: 'month' };

export function DefectTrendSection({ trend }: { trend: DefectTrend }) {
  const { darkMode, t } = useTheme();
  const tickColor = darkMode ? '#94A3B8' : '#64748B';

  return (
    <div className={`${t.cardBg} p-3 rounded-[14px] border h-full flex flex-col`}>
      <div className="mb-1.5">
        <h4 className={`font-bold text-xs ${t.headingText}`}>DEFECT TREND</h4>
        <p className={`text-[10px] ${t.mutedText}`}>Logged over time, by {BUCKET_LABEL[trend.bucket]}</p>
      </div>

      {trend.points.length === 0 ? (
        <EmptyChartState />
      ) : (
        <div className="h-60 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="defectTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0757C9" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0757C9" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1E2E4A' : '#F1F3F5'} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: tickColor }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: tickColor }} />
              <Tooltip
                formatter={(value) => [`${value} defect${value === 1 ? '' : 's'}`, 'Logged']}
                contentStyle={{
                  backgroundColor: darkMode ? '#0F1A30' : '#FFFFFF',
                  borderColor: darkMode ? '#1E2E4A' : '#E9ECEF',
                  color: darkMode ? '#FFF' : '#000',
                  fontSize: '11px',
                  borderRadius: '4px',
                }}
              />
              <Area type="monotone" dataKey="count" stroke="#0757C9" strokeWidth={2} fill="url(#defectTrendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

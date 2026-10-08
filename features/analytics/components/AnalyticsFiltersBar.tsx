import { RefreshCw } from 'lucide-react';
import { CATEGORY_FILTER_GROUPS } from '@/constants/categories';
import { DEFECT_REASONS, isDefectReasonCode } from '@/constants/defectReasons';
import { DATE_RANGE_PRESET_OPTIONS } from '@/features/analytics/lib/dateRangePresets';
import { useTeam } from '@/features/team/context/TeamProvider';
import { getActiveAnalysts } from '@/features/team/lib/roster';
import { useTheme } from '@/providers/ThemeProvider';
import type { AnalyticsFilters, DateRangePreset, ReasonFilterValue } from '@/types/analytics';

type AnalyticsFiltersBarProps = {
  filters: AnalyticsFilters;
  onChange: (patch: Partial<AnalyticsFilters>) => void;
  onReset: () => void;
};

function parseReasonFilterValue(value: string): ReasonFilterValue {
  if (value === 'NOT_CLASSIFIED') return 'NOT_CLASSIFIED';
  return isDefectReasonCode(value) ? value : null;
}

export function AnalyticsFiltersBar({ filters, onChange, onReset }: AnalyticsFiltersBarProps) {
  const { t } = useTheme();
  const { teamUsers } = useTeam();

  const labelClass = `block text-[10px] font-semibold ${t.cyanTagText} mb-0.5 whitespace-nowrap`;
  const selectClass = `w-full p-1.5 text-xs ${t.inputBg} rounded focus:border-[#0757C9] focus:outline-none cursor-pointer`;
  const dateInputClass = `w-full p-1.5 text-xs ${t.inputBg} rounded focus:border-[#0757C9] focus:outline-none font-mono cursor-pointer`;

  return (
    <div className={`${t.cardBg} p-3 rounded-[14px] border flex flex-wrap items-end gap-2`}>
      <div className="flex-1 min-w-[140px]">
        <label htmlFor="analytics-date-range" className={labelClass}>
          Date Range
        </label>
        <select
          id="analytics-date-range"
          value={filters.dateRangePreset}
          onChange={(e) => onChange({ dateRangePreset: e.target.value as DateRangePreset })}
          className={selectClass}
        >
          {DATE_RANGE_PRESET_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filters.dateRangePreset === 'CUSTOM' && (
        <>
          <div className="flex-1 min-w-[120px]">
            <label htmlFor="analytics-custom-from" className={labelClass}>
              From
            </label>
            <input
              id="analytics-custom-from"
              type="date"
              value={filters.customFrom ?? ''}
              onChange={(e) => onChange({ customFrom: e.target.value || null })}
              className={dateInputClass}
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label htmlFor="analytics-custom-to" className={labelClass}>
              To
            </label>
            <input
              id="analytics-custom-to"
              type="date"
              value={filters.customTo ?? ''}
              onChange={(e) => onChange({ customTo: e.target.value || null })}
              className={dateInputClass}
            />
          </div>
        </>
      )}

      <div className="flex-1 min-w-[140px]">
        <label htmlFor="analytics-analyst" className={labelClass}>
          Analyst
        </label>
        <select
          id="analytics-analyst"
          value={filters.analystId ?? ''}
          onChange={(e) => onChange({ analystId: e.target.value || null })}
          className={selectClass}
        >
          <option value="">All Analysts</option>
          {getActiveAnalysts(teamUsers).map((analyst) => (
            <option key={analyst.id} value={analyst.id}>
              {analyst.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[140px]">
        <label htmlFor="analytics-category" className={labelClass}>
          Category
        </label>
        <select
          id="analytics-category"
          value={filters.category ?? ''}
          onChange={(e) => onChange({ category: e.target.value || null })}
          className={selectClass}
        >
          <option value="">All Categories</option>
          {CATEGORY_FILTER_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[140px]">
        <label htmlFor="analytics-reason" className={labelClass}>
          Reason
        </label>
        <select
          id="analytics-reason"
          value={filters.reason ?? ''}
          onChange={(e) => onChange({ reason: parseReasonFilterValue(e.target.value) })}
          className={selectClass}
        >
          <option value="">All Reasons</option>
          {DEFECT_REASONS.map((reason) => (
            <option key={reason.code} value={reason.code}>
              {reason.label}
            </option>
          ))}
          <option value="NOT_CLASSIFIED">Not Classified</option>
        </select>
      </div>

      <button
        onClick={onReset}
        className={`h-[30px] px-2.5 text-xs ${t.mutedText} hover:text-neutral-900 dark:hover:text-white rounded flex items-center gap-1 border cursor-pointer border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex-shrink-0`}
      >
        <RefreshCw className="w-3 h-3" /> Reset
      </button>
    </div>
  );
}

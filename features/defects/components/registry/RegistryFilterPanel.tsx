import { Download, Filter, RefreshCw } from 'lucide-react';
import { CASE_TYPES, CATEGORY_FILTER_GROUPS } from '@/constants/categories';
import { DEFECT_REASONS, isDefectReasonCode } from '@/constants/defectReasons';
import { useDefectFilters } from '@/features/defects/context/DefectFiltersProvider';
import { ALL } from '@/features/defects/lib/filterDefects';
import { useTeam } from '@/features/team/context/TeamProvider';
import { getAnalysts } from '@/features/team/lib/roster';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

type RegistryFilterPanelProps = {
  filteredCount: number;
  totalCount: number;
};

export function RegistryFilterPanel({ filteredCount, totalCount }: RegistryFilterPanelProps) {
  const { darkMode, t } = useTheme();
  const { teamUsers } = useTeam();
  const { filters, updateFilters, resetFilters } = useDefectFilters();
  const { showToast } = useToast();

  const labelClass = `block text-[11px] font-semibold ${t.cyanTagText} mb-1`;
  const selectClass = `w-full p-2 ${t.inputBg} rounded-[10px] focus:border-[#0757C9] dark:focus:border-[#4A9BFF] focus:outline-none cursor-pointer`;

  return (
    <div className={`${t.cardBg} p-4 rounded-[14px] border space-y-3`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className={`flex items-center gap-2 text-xs font-bold ${t.headingText} uppercase tracking-wider`}>
          <Filter className="w-3.5 h-3.5 text-[#0757C9] dark:text-[#4A9BFF]" />
          <span>Filters</span>
          <span className={`${t.mutedText} font-normal normal-case`}>
            {filteredCount} of {totalCount} records
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className={`px-2.5 py-1 text-xs ${t.mutedText} hover:text-[#102A43] dark:hover:text-[#E8F0FA] rounded-[10px] flex items-center gap-1 border cursor-pointer ${darkMode ? 'border-[#20344D] bg-[#122238]' : 'border-[#D9E2EC] bg-white'}`}
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={() => showToast('Exported filtered defects registry to CSV')}
            className={`px-2.5 py-1 text-xs ${darkMode ? 'bg-blue-950/40 border-[#2563a8] text-[#4A9BFF]' : 'bg-white border-[#0757C9] text-[#0757C9]'} border hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-[10px] font-semibold flex items-center gap-1 cursor-pointer`}
          >
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t ${t.dividerSoft} text-xs`}>
        <div>
          <label htmlFor="filter-case-type" className={labelClass}>
            Case Type
          </label>
          <select
            id="filter-case-type"
            value={filters.caseType}
            onChange={(e) => updateFilters({ caseType: CASE_TYPES.find((type) => type === e.target.value) ?? ALL })}
            className={selectClass}
          >
            <option value={ALL}>All Case Types (Individual & Entity)</option>
            {CASE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-analyst" className={labelClass}>
            Assigned Analyst
          </label>
          <select
            id="filter-analyst"
            value={filters.analyst}
            onChange={(e) => updateFilters({ analyst: e.target.value })}
            className={selectClass}
          >
            <option value={ALL}>All Analysts</option>
            {getAnalysts(teamUsers).map((analyst) => (
              <option key={analyst.id} value={analyst.name}>
                {analyst.name} ({analyst.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-category" className={labelClass}>
            Category Area
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value })}
            className={selectClass}
          >
            <option value={ALL}>All Categories</option>
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

        <div>
          <label htmlFor="filter-reason" className={labelClass}>
            Reason for Defect
          </label>
          <select
            id="filter-reason"
            value={filters.reason}
            onChange={(e) => updateFilters({ reason: isDefectReasonCode(e.target.value) ? e.target.value : ALL })}
            className={selectClass}
          >
            <option value={ALL}>All Reasons</option>
            {DEFECT_REASONS.map((reason) => (
              <option key={reason.code} value={reason.code}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

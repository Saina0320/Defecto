import { Download, Filter, RefreshCw } from 'lucide-react';
import { CASE_TYPES, CATEGORY_FILTER_GROUPS } from '@/constants/categories';
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
  const selectClass = `w-full p-2 ${t.inputBg} rounded focus:border-[#003EA4] focus:outline-none cursor-pointer`;

  return (
    <div className={`${t.cardBg} p-4 rounded-lg border space-y-3`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className={`flex items-center gap-2 text-xs font-bold ${t.headingText} uppercase tracking-wider`}>
          <Filter className="w-4 h-4 text-[#003EA4] dark:text-blue-400" />
          <span>Filter KYC Defects Registry</span>
          <span className={`${t.mutedText} font-normal`}>
            ({filteredCount} of {totalCount} records matching)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className={`px-2.5 py-1 text-xs ${t.mutedText} hover:text-neutral-900 dark:hover:text-white rounded flex items-center gap-1 border cursor-pointer ${darkMode ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-white'}`}
          >
            <RefreshCw className="w-3 h-3" /> Reset Filters
          </button>
          <button
            onClick={() => showToast('Exported filtered defects registry to CSV')}
            className={`px-2.5 py-1 text-xs ${darkMode ? 'bg-blue-950/40 border-blue-800 text-blue-300' : 'bg-white border-[#003EA4] text-[#003EA4]'} border hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded font-semibold flex items-center gap-1 cursor-pointer`}
          >
            <Download className="w-3 h-3" /> Export View
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t ${t.dividerSoft} text-xs`}>
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
      </div>
    </div>
  );
}

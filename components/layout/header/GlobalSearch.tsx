import { Search, X } from 'lucide-react';
import { useDefectFilters } from '@/features/defects/context/DefectFiltersProvider';
import { useTheme } from '@/providers/ThemeProvider';

/** Header search box; filters the Defects Registry. */
export function GlobalSearch() {
  const { t } = useTheme();
  const { filters, updateFilters } = useDefectFilters();

  return (
    <div className="relative hidden md:block w-52 lg:w-64">
      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8794] dark:text-[#7D91A8]" />
      <input
        type="text"
        aria-label="Search defects"
        value={filters.searchQuery}
        onChange={(e) => updateFilters({ searchQuery: e.target.value })}
        placeholder="Search CCID, KYCID, Analyst..."
        className={`w-full pl-8 pr-7 py-1.5 text-xs ${t.inputBg} rounded-[10px] focus:outline-none focus:border-[#0757C9] dark:focus:border-[#4A9BFF]`}
      />
      {filters.searchQuery && (
        <button
          onClick={() => updateFilters({ searchQuery: '' })}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7B8794] dark:text-[#7D91A8] hover:text-[#102A43] dark:hover:text-[#E8F0FA]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

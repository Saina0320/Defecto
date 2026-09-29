import { Search, X } from 'lucide-react';
import { useDefectFilters } from '@/features/defects/context/DefectFiltersProvider';
import { useTheme } from '@/providers/ThemeProvider';

/** Header search box; filters the Defects Registry. */
export function GlobalSearch() {
  const { t } = useTheme();
  const { filters, updateFilters } = useDefectFilters();

  return (
    <div className="relative w-56 lg:w-64">
      <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
      <input
        type="text"
        aria-label="Search defects"
        value={filters.searchQuery}
        onChange={(e) => updateFilters({ searchQuery: e.target.value })}
        placeholder="Search CCID, KYCID, Analyst, Category..."
        className={`w-full pl-9 pr-3 py-1.5 text-xs ${t.inputBg} rounded-md focus:outline-none focus:border-[#003EA4]`}
      />
      {filters.searchQuery && (
        <button onClick={() => updateFilters({ searchQuery: '' })} className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

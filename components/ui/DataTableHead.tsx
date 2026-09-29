import { useTheme } from '@/providers/ThemeProvider';

export type DataTableColumn = {
  label: string;
  align?: 'right';
};

export function DataTableHead({ columns }: { columns: readonly DataTableColumn[] }) {
  const { t } = useTheme();

  return (
    <thead className={`${t.tableHeaderBg} border-b`}>
      <tr>
        {columns.map((column) => (
          <th
            key={column.label}
            className={`p-3 ${column.align === 'right' ? 'text-right ' : ''}${t.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useMemo, type ComponentPropsWithRef, type ReactElement, type ReactNode } from 'react';
import { cn, useControllableState } from '../utils';

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  accessor?: keyof T | ((row: T) => ReactNode);
  cell?(row: T, rowIndex: number): ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  sortable?: boolean;
  sortValue?(row: T): string | number;
  mono?: boolean;
}

export type TableSort = { key: string; direction: 'asc' | 'desc' } | null;

export interface TableProps<T> extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  columns: readonly TableColumn<T>[];
  data: readonly T[];
  getRowKey?(row: T, index: number): string | number;
  sort?: TableSort;
  defaultSort?: TableSort;
  onSortChange?(sort: TableSort): void;
  density?: 'compact' | 'normal';
  striped?: boolean;
  stickyHeader?: boolean;
  caption?: ReactNode;
  emptyState?: ReactNode;
  onRowClick?(row: T, index: number): void;
  selectedKeys?: readonly (string | number)[];
}

function getCellRawValue<T>(col: TableColumn<T>, row: T): unknown {
  if (typeof col.accessor === 'function') return col.accessor(row);
  if (col.accessor !== undefined) return row[col.accessor];
  return (row as Record<string, unknown>)[col.key];
}

function getComparableValue<T>(col: TableColumn<T>, row: T): string | number {
  if (col.sortValue) return col.sortValue(row);
  const raw = getCellRawValue(col, row);
  if (typeof raw === 'number' || typeof raw === 'string') return raw;
  if (raw === null || raw === undefined) return '';
  return String(raw);
}

export function Table<T>({
  columns,
  data,
  getRowKey,
  sort,
  defaultSort = null,
  onSortChange,
  density = 'normal',
  striped = false,
  stickyHeader = false,
  caption,
  emptyState = 'No data available.',
  onRowClick,
  selectedKeys,
  className,
  ref,
  ...rest
}: TableProps<T>): ReactElement {
  const isControlledSort = sort !== undefined;
  const [activeSort, setActiveSort] = useControllableState<TableSort>({
    value: sort,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });

  const sortedData = useMemo(() => {
    if (isControlledSort || !activeSort) return data;
    const col = columns.find((c) => c.key === activeSort.key);
    if (!col) return data;

    const factor = activeSort.direction === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = getComparableValue(col, a);
      const vb = getComparableValue(col, b);
      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * factor;
      }
      return String(va).localeCompare(String(vb), undefined, { numeric: true }) * factor;
    });
  }, [columns, data, activeSort, isControlledSort]);

  const handleSortToggle = (key: string) => {
    let next: TableSort;
    if (!activeSort || activeSort.key !== key) {
      next = { key, direction: 'asc' };
    } else if (activeSort.direction === 'asc') {
      next = { key, direction: 'desc' };
    } else {
      next = null;
    }
    setActiveSort(next);
  };

  return (
    <div
      ref={ref}
      className={cn('omai-table', className)}
      data-density={density}
      data-striped={striped ? '' : undefined}
      data-sticky-header={stickyHeader ? '' : undefined}
      {...rest}
    >
      <table className="omai-table__table">
        {caption ? <caption className="omai-table__caption">{caption}</caption> : null}
        <thead className="omai-table__head">
          <tr className="omai-table__row">
            {columns.map((col) => {
              const isSorted = activeSort?.key === col.key;
              const ariaSort = col.sortable
                ? isSorted
                  ? activeSort.direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
                : undefined;

              return (
                <th
                  key={col.key}
                  scope="col"
                  className="omai-table__th"
                  aria-sort={ariaSort}
                  data-align={col.align ?? 'left'}
                  style={col.width !== undefined ? { width: col.width } : undefined}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="omai-table__sort-btn"
                      data-sorted={isSorted ? activeSort.direction : undefined}
                      onClick={() => handleSortToggle(col.key)}
                    >
                      <span>{col.header}</span>
                      <span className="omai-table__sort-icon" aria-hidden="true">
                        {isSorted ? (
                          activeSort.direction === 'asc' ? (
                            <ArrowUp size={14} strokeWidth={1.75} aria-hidden />
                          ) : (
                            <ArrowDown size={14} strokeWidth={1.75} aria-hidden />
                          )
                        ) : (
                          <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
                        )}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="omai-table__body">
          {sortedData.length === 0 ? (
            <tr className="omai-table__empty-row">
              <td colSpan={columns.length} className="omai-table__empty">
                {emptyState}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => {
              const rowKey = getRowKey ? getRowKey(row, rowIndex) : rowIndex;
              const isSelected = selectedKeys ? selectedKeys.includes(rowKey) : false;

              return (
                <tr
                  key={rowKey}
                  className="omai-table__row"
                  data-state={isSelected ? 'selected' : undefined}
                  data-interactive={onRowClick ? '' : undefined}
                  aria-selected={selectedKeys ? isSelected : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick(row, rowIndex);
                          }
                        }
                      : undefined
                  }
                >
                  {columns.map((col) => {
                    const rawValue = getCellRawValue(col, row);
                    const content = col.cell
                      ? col.cell(row, rowIndex)
                      : (rawValue as ReactNode);
                    const isMono =
                      col.mono !== undefined ? col.mono : typeof rawValue === 'number';

                    return (
                      <td
                        key={col.key}
                        className="omai-table__td"
                        data-align={col.align ?? 'left'}
                        data-mono={isMono ? 'true' : undefined}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

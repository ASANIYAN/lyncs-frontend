/* eslint-disable react-refresh/only-export-components */
"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Table as TanstackTable,
  type Row,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LyncsEmpty } from "@/components/custom-components/custom-empty";
import { CustomButton } from "./custom-button";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  className?: string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  toolbar?: (table: TanstackTable<TData>) => React.ReactNode;
  footer?: React.ReactNode;
  hidePagination?: boolean;
  onRowClick?: (row: Row<TData>) => void;
  highlightOnClick?: boolean;
};

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc")
    return <ArrowUp className="size-3 text-lyncs-accent" />;
  if (sorted === "desc")
    return <ArrowDown className="size-3 text-lyncs-accent" />;
  return (
    <ArrowUpDown className="size-3 text-lyncs-text-muted opacity-0 group-hover/head:opacity-100 transition-opacity" />
  );
}

function TableSkeleton({
  columns,
  rows = 5,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow
          key={rowIdx}
          className="border-b border-lyncs-border hover:bg-transparent"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx} className="px-5 py-3.5">
              <div
                className="h-3.5 rounded-xs bg-lyncs-elevated animate-pulse"
                style={{ width: `${55 + Math.random() * 35}%` }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function DataTablePagination<TData>({
  table,
}: {
  table: TanstackTable<TData>;
}) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-lyncs-border">
      {/* Row count */}
      <span className="text-xii text-lyncs-text-muted tabular-nums select-none">
        {totalRows === 0 ? "0 results" : `${from}–${to} of ${totalRows}`}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* First page */}
        <CustomButton
          variant="ghost"
          size="sm"
          className="size-7 p-0"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label="First page"
        >
          <ChevronsLeft className="size-3.5" />
        </CustomButton>

        {/* Prev page */}
        <CustomButton
          variant="ghost"
          size="sm"
          className="size-7 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-3.5" />
        </CustomButton>

        {/* Page indicator */}
        <span className="text-xii text-lyncs-text-muted px-2 tabular-nums select-none min-w-16 text-center">
          {table.getPageCount() === 0
            ? "—"
            : `${pageIndex + 1} / ${table.getPageCount()}`}
        </span>

        {/* Next page */}
        <CustomButton
          variant="ghost"
          size="sm"
          className="size-7 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          <ChevronRight className="size-3.5" />
        </CustomButton>

        {/* Last page */}
        <CustomButton
          variant="ghost"
          size="sm"
          className="size-7 p-0"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          aria-label="Last page"
        >
          <ChevronsRight className="size-3.5" />
        </CustomButton>
      </div>
    </div>
  );
}

export function DataTable<TData, TValue>({
  data,
  columns,
  className,
  pageSize = 10,
  loading = false,
  emptyTitle = "No results",
  emptyDescription = "Nothing to show here yet.",
  emptyIcon,
  emptyAction,
  toolbar,
  footer,
  hidePagination = false,
  onRowClick,
  highlightOnClick = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [activeRowId, setActiveRowId] = React.useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: { pageSize },
    },
  });

  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const hasRows = table.getRowModel().rows.length > 0;
  const isClickable = !!onRowClick;

  return (
    <section
      data-slot="lyncs-data-table"
      className={cn(
        "w-full overflow-auto rounded-xl border border-lyncs-border bg-lyncs-card",
        className,
      )}
    >
      {/* Optional toolbar slot */}
      {toolbar && (
        <div className="px-5 py-3.5 border-b border-lyncs-border">
          {toolbar(table)}
        </div>
      )}

      <div className="relative w-full overflow-x-auto">
        {/* Loading overlay */}
        {loading && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-lyncs-card/70 backdrop-blur-[1px] rounded-xl"
            aria-label="Loading"
          >
            <div className="flex flex-col items-center gap-2.5">
              <Loader2 className="size-5 animate-spin text-lyncs-accent" />
              <span className="text-xii text-lyncs-text-muted">
                Loading…
              </span>
            </div>
          </div>
        )}

        <Table className="w-full">
          {/* Header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-lyncs-border hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "group/head px-5 py-2.5 text-left text-xi font-medium text-lyncs-text-muted uppercase tracking-[0.5px] whitespace-nowrap select-none",
                        canSort &&
                          "cursor-pointer hover:text-lyncs-text transition-colors",
                      )}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <span className="inline-flex items-center gap-1.5">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {canSort && <SortIcon sorted={sorted} />}
                        </span>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* Body */}
          <TableBody>
            {loading ? (
              <TableSkeleton
                columns={columns.length}
                rows={pageSize > 8 ? 8 : pageSize}
              />
            ) : hasRows ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  data-active={
                    highlightOnClick && activeRowId === row.id
                      ? "true"
                      : undefined
                  }
                  onClick={
                    isClickable
                      ? () => {
                          setActiveRowId(row.id);
                          onRowClick(row);
                        }
                      : undefined
                  }
                  className={cn(
                    "border-b border-lyncs-border transition-colors last:border-0",
                    "hover:bg-lyncs-card-hover",
                    isClickable && "cursor-pointer",
                    highlightOnClick &&
                      activeRowId === row.id &&
                      "bg-lyncs-accent-dim",
                    row.getIsSelected() && "bg-lyncs-elevated",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-5 py-3.5 text-xiii text-lyncs-text align-middle whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={columns.length} className="h-60 p-0">
                  <LyncsEmpty
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!hidePagination && !loading && <DataTablePagination table={table} />}

      {/* Optional footer slot */}
      {footer && (
        <div className="px-5 py-3.5 border-t border-lyncs-border">
          {footer}
        </div>
      )}
    </section>
  );
}

export default DataTable;

export type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Row,
};
export {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
};

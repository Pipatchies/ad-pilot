"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  flexRender,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import SvgSmallDown from "@/components/icons/SmallDown";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  globalFilter?: string;
  defaultSort?: { id: string; desc: boolean };
  emptyMessage?: string;
  headerClassName?: string;
}

// Composant pour afficher l'icône de tri dans les headers
function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  if (!isSorted) return <SvgSmallDown className="w-4 h-4 opacity-40" />;

  return (
    <SvgSmallDown
      className={cn(
        "w-4 h-4 transition-transform duration-200 block mx-auto",
        isSorted === "asc" ? "rotate-0" : "rotate-180"
      )}
    />
  );
}

// Helper pour créer un header triable facilement
export function sortableHeader(label: string) {
  function Header({ column }: { column: any }) {
    return (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 text-lg font-bold text-primary"
      >
        {label}
        <SortIcon isSorted={column.getIsSorted()} />
      </button>
    );
  }
  Header.displayName = `SortableHeader(${label})`;
  return Header;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  globalFilter = "",
  defaultSort,
  emptyMessage = "Aucune donnée disponible.",
  headerClassName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    if (defaultSort) {
      setSorting([{ id: defaultSort.id, desc: defaultSort.desc }]);
    }
  }, [defaultSort]);

  return (
    <div
      className={
        table.getRowModel().rows.length > 0
          ? "overflow-x-auto"
          : "overflow-x-hidden"
      }
    >
      <Table className="min-w-[700px]">
        {/* HEADER */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className={cn("border-none", headerClassName)}
            >
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="text-lg h-15 border-[#A5A4BF]"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import SvgEyeIcon from "@/components/icons/EyeIcon";
import SvgUploder from "@/components/icons/Uploder";
import SvgSmallDown from "@/components/icons/SmallDown";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

type DocumentItem = {
  title: string;
  type: string;
  date: number;
};

interface DocumentsTableProps {
  documents: DocumentItem[];
  globalFilter?: string;
  dateSort?: "asc" | "desc";
}

function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  if (!isSorted) return <SvgSmallDown className="w-4 h-4 opacity-40" />;
  return (
    <SvgSmallDown
      className={`w-4 h-4 transition-transform duration-200 block mx-auto ${
        isSorted === "asc" ? "rotate-0" : "rotate-180"
      }`}
    />
  );
}


export default function DocumentsTable({
  documents,
  globalFilter = "",
  dateSort,
}: DocumentsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<DocumentItem>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Titre du document <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => row.getValue("title"),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Type de fichier <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => row.getValue("type"),
    },
    {
      id: "date",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Date d&apos;import <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        const ts = row.getValue("startDate") as number;
        return ts ? new Date(ts).toLocaleDateString("fr-FR") : "-";
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: () => (
        <div className="flex justify-end gap-4">
          <SvgEyeIcon />
          <SvgUploder />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (dateSort) {
      setSorting([{ id: "dateTs", desc: dateSort === "desc" }]);
    }
  }, [dateSort]);

  const table = useReactTable({
    data: documents ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: () => {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[700px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="text-lg h-15 border-[#A5A4BF]">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                Aucun document trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

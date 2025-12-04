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
import { cn } from "@/lib/utils";
import { Invoice } from "@/types/invoices";
import SvgEyeIcon from "../icons/EyeIcon";
import SvgUploder from "../icons/Uploder";

interface InvoicesTableProps {
  invoices: Invoice[];
  variant: "agency" | "vendor";
  showCampaign?: boolean;
  globalFilter?: string;
  dateSort?: "asc" | "desc";
  headerClassName?: string;
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

function sortableHeader(label: string) {
  function Header({ column }: { column: any }) {
    return (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 text-base font-bold text-primary"
      >
        {label} <SortIcon isSorted={column.getIsSorted()} />
      </button>
    );
  }
  Header.displayName = `SortableHeader(${label})`;
  return Header;
}


export default function InvoicesTable({
  invoices,
  variant,
  showCampaign = false,
  globalFilter,
  dateSort,
  headerClassName,
}: InvoicesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  

  const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "title",
    header: sortableHeader("N° de facture"),
    cell: ({ row }) => row.getValue("title"),
  },
  ...(variant === "vendor"
    ? [
        {
          accessorKey: "agencyInvoice",
          header: sortableHeader("Facture agence rattachée"),
          cell: ({ row }: any) => row.getValue("agencyInvoice") ?? "-",
        },
        {
          accessorKey: "vendorName",
          header: sortableHeader("Régie"),
          cell: ({ row }: any) => (
            <span className=" font-bold underline">
              {row.getValue("vendorName")}
            </span>
          ),
        },
      ]
    : []),
  ...(showCampaign
    ? [
        {
          accessorKey: "campaign",
          header: sortableHeader("Campagne"),
          cell: ({ row }: any) => (
            <span className="font-bold underline pr-10">
              {row.getValue("campaign")}
            </span>
          ),
        },
      ]
    : []),
  {
    accessorKey: "htprice",
    header: sortableHeader("Montant HT"),
    cell: ({ row }) =>
      `${(row.getValue("htprice") as number).toLocaleString("fr-FR")} €`,
  },
  {
    accessorKey: "ttcprice",
    header: sortableHeader("Montant TTC"),
    cell: ({ row }) =>
      `${(row.getValue("ttcprice") as number).toLocaleString("fr-FR")} €`,
  },
  {
    accessorKey: "startDate",
    header: sortableHeader("Date de facturation"),
    cell: ({ row }) => {
      const ts = row.getValue("startDate") as number;
      return ts ? new Date(ts).toLocaleDateString("fr-FR") : "-";
    },
  },
  {
    accessorKey: "dueDate",
    header: sortableHeader("Date d'échéance"),
    cell: ({ row }) => {
      const ts = row.getValue("dueDate") as number;
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


  const table = useReactTable({
    data: invoices,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
  if (dateSort) {
    setSorting([{ id: "startDate", desc: dateSort === "desc" }]);
  }
}, [dateSort]);

  return (
    <div className={table.getRowModel().rows.length > 0 ? "overflow-x-auto" : "overflow-x-hidden"}>
      <Table
        className="min-w-[700px]"
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={cn("border-none", headerClassName)}>
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
                Aucune facture pour le moment.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


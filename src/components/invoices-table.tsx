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
import SvgEyeIcon from "./icons/EyeIcon";
import SvgUploder from "./icons/Uploder";

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

type Invoice = {
  title: string;
  agencyInvoice?: string;
  vendorName?: string;
  campaign?: string;
  htprice: number;
  ttcprice: number;
  startDate: number;
  dueDate: number;
};

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
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          N° de facture <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => row.getValue("title"),
    },
    ...(variant === "vendor"
      ? [
          {
            accessorKey: "agencyInvoice",
            header: () => (
              <span className="text-base font-bold text-primary">
                Facture agence rattachée
              </span>
            ),
            cell: ({ row }: any) => row.getValue("agencyInvoice") ?? "-",
          },
          {
            accessorKey: "vendorName",
            header: () => (
              <span className="text-base font-bold text-primary px-10">
                Régie
              </span>
            ),
            cell: ({ row }: any) => (
              <span className="px-10 font-bold underline">
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
            header: () => (
              <span className="text-base font-bold text-primary">Campagne</span>
            ),
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
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Montant HT <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) =>
        `${(row.getValue("htprice") as number).toLocaleString("fr-FR")} €`,
    },
    {
      accessorKey: "ttcprice",
      header: () => (
        <span className="text-base font-bold text-primary px-5">
          Montant TTC
        </span>
      ),
      cell: ({ row }) =>
        `${(row.getValue("ttcprice") as number).toLocaleString("fr-FR")} €`,
    },
    {
      accessorKey: "startDate",
      header: () => (
        <span className="text-base font-bold text-primary">
          Date de facturation
        </span>
      ),
      cell: ({ row }) => {
        const ts = row.getValue("startDate") as number;
        return ts ? new Date(ts).toLocaleDateString("fr-FR") : "-";
      },
    },
    {
      accessorKey: "dueDate",
      header: () => (
        <span className="text-base font-bold text-primary">
          Date d&apos;échéance
        </span>
      ),
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
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[700px]">
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
                Aucune facture trouvée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


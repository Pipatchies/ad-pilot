"use client";

import React, { useState } from "react";
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
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DeleteModal from "../modal/delete-modal";
import UpdateClientModal from "@/app/admin/clients/components/update-client-modal";

type ClientAccount = {
  organizationId: Id<"organizations">;
  organizationName: string;
  logo: string;
  step: string;
  createdAt: number;
  lastConnectionTime: number;
};

interface ClientAccountsProps {
  clientAccounts: ClientAccount[];
  globalFilter?: string;
}

function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  if (!isSorted) return <SvgSmallDown className="w-4 h-4 opacity-40" />;
  return (
    <SvgSmallDown
      className={`w-4 h-4 transition-transform duration-200 block mx-auto" ${
        isSorted === "asc" ? "rotate-0" : "rotate-180"
      }`}
    />
  );
}

export default function ClientAccountsTable({
  clientAccounts,
  globalFilter = "",
}: ClientAccountsProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const deleteOrganization = useMutation(api.mutations.organizations.deleteOrganization);

  const columns: ColumnDef<ClientAccount>[] = [
    {
      accessorKey: "organizationName",
      header: ({ column }) => (
        <button
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Nom du client <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        const { logo, organizationName } = row.original;
    return (
      <div className="flex items-center gap-3">
        {logo && (
          <img
            src={logo}
            alt={organizationName}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <span>{organizationName}</span>
      </div>
    );
  },
},
    {
      accessorKey: "step",
      header: ({ column }) => (
        <button
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Etat <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => row.getValue("step"),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Date de création <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
    const ts = row.getValue("createdAt") as number;
    return ts ? new Date(ts).toLocaleDateString("fr-FR") : "-";
  },
},
    {
      accessorKey: "lastConnectionTime",
      header: ({ column }) => (
        <button
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Dernière connexion <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
    const ts = row.getValue("lastConnectionTime") as number;
    return ts ? new Date(ts).toLocaleDateString("fr-FR") : "Jamais";
  },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex justify-end gap-4">
        <UpdateClientModal
          organizationId={data.organizationId}
          organizationName={data.organizationName}
          logo={data.logo}
        />
        <DeleteModal 
            onConfirm={() => deleteOrganization({ organizationId: row.original.organizationId })}/>
      </div>
        );
      },
    },
  ];


  const table = useReactTable({
    data: clientAccounts,
    columns,
    state: {
      sorting,
      globalFilter,
    },
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
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
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
              <TableCell
                colSpan={columns.length}
                className="text-center py-4"
              >
                Aucun résultat
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

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
import DeleteModal from "@/components/modal/delete-modal";
import { useMutation } from "convex/react";
import { Id } from "@/../convex/_generated/dataModel";
import { api } from "@/../convex/_generated/api";
import UpdateAccountModal from "@/components/modal/update/update-account-modal";

type AdminAccount = {
  userId: Id<"users">;
  name: string;
  lastname: string;
  email: string;
  role: string;
  id: string;
};

interface AdminAccountsProps {
  adminAccounts: AdminAccount[];
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

export default function AdminAccountsTable({
  adminAccounts,
  globalFilter = "",
}: AdminAccountsProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const deleteAccount = useMutation(api.mutations.users.deleteUser);

  const columns: ColumnDef<AdminAccount>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Prénom <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "lastname",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Nom <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => row.getValue("lastname"),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Email <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Rôle <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => row.getValue("role"),
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-base font-bold text-primary"
        >
          Identifiant <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => row.getValue("id"),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex justify-end gap-4">
            <UpdateAccountModal
              userId={data.userId}
              firstname={data.name}
              lastname={data.lastname}
              email={data.email}
            />
            <DeleteModal
              onConfirm={() => deleteAccount({ userId: data.userId })}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: adminAccounts,
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
                Aucun résultat
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

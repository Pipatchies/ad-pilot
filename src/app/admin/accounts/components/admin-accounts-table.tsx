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
import SvgCorbeille from "@/components/icons/Corbeille";
import SvgCrayonBig from "@/components/icons/CrayonBig";
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
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

type adminAccount = {
  userId: Id<"users">;
  name: string;
  lastname: string;
  email: string;
  role: string;
  id: string;
};

interface AdminAccountsProps {
  adminAccounts: adminAccount[];
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

  const updateUser = useMutation(api.mutations.users.updateUser);
  const deleteUser = useMutation(api.mutations.users.deleteUser);

  const handleEdit = async (row: adminAccount) => {
    // TODO: open your modal and collect new values; example below uses a quick patch:
    await updateUser({
      userId: row.userId,
      patch: {
        // put whatever fields the modal returns; this is a placeholder example:
        // name: "New name",
        // lastname: "New lastname",
        // email: "new@email.com",
      },
    });
  };

  const handleDelete = async (row: adminAccount) => {
    if (!confirm(`Delete account "${row.name} ${row.lastname}" ?`)) return;
    await deleteUser({ userId: row.userId });
  };

  const columns: ColumnDef<adminAccount>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
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
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
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
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
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
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
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
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
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
            <button onClick={() => handleEdit(data)} aria-label="Edit">
              <SvgCrayonBig className="cursor-pointer" />
            </button>
            <button onClick={() => handleDelete(data)} aria-label="Delete">
              <SvgCorbeille className="cursor-pointer" />
            </button>
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

"use client";

import React from "react";
import { DataTable, sortableHeader } from "@/components/table/data-table";
import { ColumnDef } from "@tanstack/react-table";
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

export default function ClientAccountsTable({
  clientAccounts,
  globalFilter = "",
}: ClientAccountsProps) {
  const deleteOrganization = useMutation(
    api.mutations.organizations.deleteOrganization
  );

  const columns: ColumnDef<ClientAccount>[] = [
    {
      accessorKey: "organizationName",
      header: sortableHeader("Nom du client"),
      cell: ({ row }) => {
        const { logo, organizationName } = row.original;
        return (
          <div className="flex items-center gap-3">
            {logo && (
              <img
                src={
                  logo.includes("cloudinary.com")
                    ? logo.replace(
                        "/upload/",
                        "/upload/c_pad,h_64,w_80,b_auto/"
                      )
                    : logo
                }
                alt={organizationName}
                className="w-14 h-14 object-contain"
              />
            )}
            <span className="text-lg font-bold text-primary">
              {organizationName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "step",
      header: sortableHeader("Etat"),
      cell: ({ row }) => row.getValue("step"),
    },
    {
      accessorKey: "createdAt",
      header: sortableHeader("Date de création"),
      cell: ({ row }) => {
        const ts = row.getValue("createdAt") as number;
        return ts ? new Date(ts).toLocaleDateString("fr-FR") : "-";
      },
    },
    {
      accessorKey: "lastConnectionTime",
      header: sortableHeader("Dernière connexion"),
      cell: ({ row }) => {
        const ts = row.getValue("lastConnectionTime") as number;
        return ts ? new Date(ts).toLocaleDateString("fr-FR") : "Jamais";
      },
    },
    {
      id: "actions",
      header: "",
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
              onConfirm={() =>
                deleteOrganization({
                  organizationId: row.original.organizationId,
                })
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      data={clientAccounts}
      columns={columns}
      globalFilter={globalFilter}
      emptyMessage="Aucun client trouvé"
    />
  );
}

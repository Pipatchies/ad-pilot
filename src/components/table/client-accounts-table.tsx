"use client";

import React from "react";
import { CldImage } from "next-cloudinary";
import { DataTable, sortableHeader } from "@/components/table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DeleteModal from "../modal/delete-modal";
import UpdateClientModal from "@/components/modal/update/update-client-modal";
import { useRouter } from "next/navigation";
import EyeIcon from "@/components/icons/EyeIcon";

type ClientAccount = {
  organizationId: Id<"organizations">;
  organizationName: string;
  logo: string;
  step: string;
  createdAt: number;
  lastConnectionTime: number;
  userId?: Id<"users">;
};

interface ClientAccountsProps {
  clientAccounts: ClientAccount[];
  globalFilter?: string;
}

export default function ClientAccountsTable({
  clientAccounts,
  globalFilter = "",
}: ClientAccountsProps) {
  const router = useRouter();
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
              <CldImage
                src={logo}
                width={56}
                height={56}
                alt={organizationName}
                className="object-contain"
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
          <div
            className="flex justify-end gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (data.userId) {
                  localStorage.setItem(
                    "convex_impersonating_user",
                    data.userId
                  );
                  window.dispatchEvent(new Event("impersonation-change"));
                  router.push("/dashboard");
                }
              }}
              className="hover:bg-gray-100 rounded-full transition-colors"
              title="Voir en tant que ce client"
              disabled={!data.userId}
            >
              <EyeIcon />
            </button>
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
      onRowClick={(row) =>
        router.push(`/admin/clients/${row.original.organizationId}`)
      }
    />
  );
}

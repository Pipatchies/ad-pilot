"use client";

import { DataTable, sortableHeader } from "@/components/table/data-table";
import { Campaign } from "@/types/campaigns";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

interface CampaignTableProps {
  campaigns: Campaign[];
  headerClassName?: string;
  showArchived?: boolean;
}

export default function CampaignTable({
  campaigns,
  headerClassName,
}: CampaignTableProps) {
  
  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: "title",
      header: sortableHeader("Nom de la campagne"),
      cell: ({ row }) => (
        <Link
          href={`/campaigns/${row.original._id}`}
          className="font-bold underline"
        >
          {row.getValue("title")}
        </Link>
      ),
    },
    {
      accessorKey: "organizationId",
      header: sortableHeader("Client"),
      cell: ({ row }) =>
        row.original.subtitle || "—",
    },
    {
      accessorKey: "status",
      header: sortableHeader("Étape"),
      cell: ({ row }) => {
        const s = row.original.status.at(-1);
        return s ? s.label : "—";
      },
    },
    {
      accessorKey: "mediaTypes",
      header: sortableHeader("Type"),
      cell: ({ row }) =>
        row.original.mediaTypes.join(", ").toUpperCase(),
    },
    {
      accessorKey: "totalBudget",
      header: sortableHeader("Budget"),
      cell: ({ row }) =>
        `${row.original.totalBudget.toLocaleString("fr-FR")} €`,
    },
    {
      accessorKey: "startDate",
      header: sortableHeader("Date lancement"),
      cell: ({ row }) =>
        new Date(row.original.startDate).toLocaleDateString("fr-FR"),
    },
    {
      accessorKey: "endDate",
      header: sortableHeader("Date fin"),
      cell: ({ row }) =>
        new Date(row.original.endDate).toLocaleDateString("fr-FR"),
    },
  ];

  return (
    <DataTable
      data={campaigns}
      columns={columns}
      emptyMessage="Aucune campagne trouvée."
      headerClassName={headerClassName}
      defaultSort={{ id: "startDate", desc: false }}
    />
  );
}

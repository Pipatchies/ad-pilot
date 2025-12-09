"use client";

import { DataTable, sortableHeader } from "@/components/table/data-table";
import { Campaign } from "@/types/campaigns";
import { MEDIA_TYPE_LABELS } from "@/types/medias";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import SvgDupliquer from "../icons/Dupliquer";
import SvgCrayonBig from "../icons/CrayonBig";
import DeleteModal from "../modal/delete-modal";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";

interface CampaignTableProps {
  campaigns: Campaign[];
  headerClassName?: string;
  showArchived?: boolean;
  globalFilter?: string;
}

export default function CampaignTable({
  campaigns,
  headerClassName,
  globalFilter = "",
}: CampaignTableProps) {

  const deleteCampaign = useMutation(api.mutations.campaigns.deleteCampaign);
  const duplicateCampaign = useMutation(api.mutations.campaigns.duplicateCampaign);

  async function handleDuplicate(campaignId: Id<"campaigns">) {
    try {
      await duplicateCampaign({ campaignId });
      toast.success("Campagne dupliquée avec succès");
    } catch {
      toast.error("Échec de la duplication de la campagne");
    }
  }

  
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
        row.original.organizationName || "—",
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
        row.original.mediaTypes.map((t) => MEDIA_TYPE_LABELS[t])
      .join(", "),
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
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-4">
          <SvgCrayonBig />
          <button onClick={() => handleDuplicate(row.original._id)} className="cursor-pointer">
          <SvgDupliquer />
          </button>
          <DeleteModal 
          onConfirm={() => deleteCampaign({ campaignId: row.original._id })}/>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={campaigns}
      columns={columns}
      globalFilter={globalFilter}
      emptyMessage="Aucune campagne trouvée."
      headerClassName={headerClassName}
      defaultSort={{ id: "startDate", desc: false }}
    />
  );
}

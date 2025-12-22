"use client";

import { DataTable, sortableHeader } from "@/components/table/data-table";
import SvgEyeIcon from "@/components/icons/EyeIcon";
import SvgUploder from "@/components/icons/Uploder";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Invoice } from "@/types/invoices";

interface Props {
  invoices: Invoice[];
  variant: "agency" | "vendor";
  showCampaign?: boolean;
  globalFilter?: string;
  headerClassName?: string;
  dateSort?: "asc" | "desc";
}

export default function InvoicesTable({
  invoices,
  variant,
  showCampaign = false,
  globalFilter,
  headerClassName,
  dateSort,
}: Props) {
  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "title",
      header: sortableHeader("N° de facture"),
    },

    ...(variant === "vendor"
      ? [
          {
            accessorKey: "agencyInvoice",
            header: sortableHeader("Facture agence rattachée"),
          },
          {
            accessorKey: "vendorName",
            header: sortableHeader("Régie"),
            cell: ({ row }: { row: Row<Invoice> }) => (
              <span className="font-bold underline">
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
            cell: ({ row }: { row: Row<Invoice> }) => (
              <span className="font-bold underline">
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
      header: sortableHeader("Échéance"),
      cell: ({ row }) => {
        const ts = row.getValue("dueDate") as number;
        return ts ? new Date(ts).toLocaleDateString("fr-FR") : "-";
      },
    },

    {
      id: "actions",
      header: "",
      cell: () => (
        <div className="flex justify-end gap-4">
          <SvgEyeIcon />
          <SvgUploder />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={invoices}
      columns={columns}
      globalFilter={globalFilter}
      headerClassName={headerClassName}
      emptyMessage="Aucune facture pour le moment."
      defaultSort={
        dateSort ? { id: "startDate", desc: dateSort === "desc" } : undefined
      }
    />
  );
}

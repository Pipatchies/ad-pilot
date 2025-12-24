"use client";

import { useState } from "react";
import { DataTable, sortableHeader } from "@/components/table/data-table";
import SvgEyeIcon from "@/components/icons/EyeIcon";
import SvgUploder from "@/components/icons/Uploder";
import UpdateInvoiceModal from "@/components/modal/update/update-invoice-modal";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Invoice } from "@/types/invoices";
import SvgCorbeille from "../icons/Corbeille";
import DeleteModal from "../modal/delete-modal";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import MediaViewerModal from "@/components/modal/media-viewer-modal";

interface Props {
  invoices: Invoice[];
  variant: "agency" | "vendor";
  showCampaign?: boolean;
  globalFilter?: string;
  headerClassName?: string;
  dateSort?: "asc" | "desc";
  readOnly?: boolean;
}

export default function InvoicesTable({
  invoices,
  variant,
  showCampaign = false,
  globalFilter,
  headerClassName,
  dateSort,
  readOnly,
}: Props) {
  const deleteInvoice = useMutation(api.mutations.invoices.deleteInvoice);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

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
      cell: ({ row }: { row: Row<Invoice> }) => (
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setViewingInvoice(row.original)}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <SvgEyeIcon />
          </button>

          {!readOnly && row.original._id && (
            <UpdateInvoiceModal
              invoiceId={row.original._id}
              defaultValues={{
                title: row.original.title,
                htprice: row.original.htprice,
                ttcprice: row.original.ttcprice,
                startDate: row.original.startDate,
                dueDate: row.original.dueDate,
              }}
            />
          )}
          {row.original.url && (
            <a
              href={
                row.original.url.includes("/upload/")
                  ? row.original.url.replace(
                      "/upload/",
                      "/upload/fl_attachment/"
                    )
                  : row.original.url
              }
              download
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <SvgUploder />
            </a>
          )}
          {!readOnly && row.original._id && (
            <DeleteModal
              onConfirm={() =>
                deleteInvoice({
                  invoiceId: row.original._id!,
                })
              }
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
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
      {viewingInvoice && viewingInvoice.url && (
        <MediaViewerModal
          isOpen={true}
          mediaItem={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          onNext={() => {
            const idx = invoices.findIndex((i) => i._id === viewingInvoice._id);
            if (idx < invoices.length - 1) setViewingInvoice(invoices[idx + 1]);
          }}
          onPrev={() => {
            const idx = invoices.findIndex((i) => i._id === viewingInvoice._id);
            if (idx > 0) setViewingInvoice(invoices[idx - 1]);
          }}
          hasNext={
            invoices.findIndex((i) => i._id === viewingInvoice._id) <
            invoices.length - 1
          }
          hasPrev={invoices.findIndex((i) => i._id === viewingInvoice._id) > 0}
        />
      )}
    </>
  );
}

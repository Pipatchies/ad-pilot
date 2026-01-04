"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, sortableHeader } from "@/components/table/data-table";
import SvgEyeIcon from "@/components/icons/EyeIcon";
import SvgUploder from "@/components/icons/Uploder";
import UpdateInvoiceModal from "@/components/modal/update/update-invoice-modal";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Invoice, InvoiceWithVendor } from "@/types/invoices";
import SvgCorbeille from "../icons/Corbeille";
import DeleteModal from "../modal/delete-modal";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import MediaViewerModal from "@/components/modal/media-viewer-modal";
import VendorDetailsModal from "@/components/modal/vendor-details-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Props {
  invoices: InvoiceWithVendor[];
  variant: "agency" | "vendor";
  showCampaign?: boolean;
  showClient?: boolean;
  globalFilter?: string;
  headerClassName?: string;
  dateSort?: "asc" | "desc";
  readOnly?: boolean;
  isAdmin?: boolean;
}

export default function InvoicesTable({
  invoices,
  variant,
  showCampaign = false,
  showClient = false,
  globalFilter,
  headerClassName,
  dateSort,
  readOnly,
  isAdmin = false,
}: Props) {
  const router = useRouter();
  const deleteInvoice = useMutation(api.mutations.invoices.deleteInvoice);
  const updateInvoice = useMutation(api.mutations.invoices.updateInvoice);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // State for Vendor Details Modal
  const [selectedVendorForModal, setSelectedVendorForModal] =
    useState<InvoiceWithVendor | null>(null);

  const columns: ColumnDef<InvoiceWithVendor>[] = [
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
            cell: ({ row }: { row: Row<InvoiceWithVendor> }) => (
              <span
                className="font-bold underline cursor-pointer hover:text-primary/80"
                onClick={() => setSelectedVendorForModal(row.original)}
              >
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
            cell: ({ row }: { row: Row<InvoiceWithVendor> }) => (
              <span
                className="font-bold underline cursor-pointer hover:text-primary/80"
                onClick={() => {
                  const campaignId = row.original.campaignId;
                  if (isAdmin) {
                    router.push(`/admin/campaigns/${campaignId}`);
                  } else {
                    router.push(`/campaign/${campaignId}`);
                  }
                }}
              >
                {row.original.campaign || row.getValue("campaign") || "-"}
              </span>
            ),
          },
        ]
      : []),

    ...(showClient
      ? [
          {
            accessorKey: "organizationName",
            header: sortableHeader("Client"),
            cell: ({ row }: { row: Row<InvoiceWithVendor> }) => (
              <span
                className="font-bold cursor-pointer hover:text-primary/80 underline"
                onClick={() => {
                  const orgId = row.original.organizationId;
                  router.push(`/admin/clients/${orgId}`);
                }}
              >
                {row.getValue("organizationName")}
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
      accessorKey: "status",
      header: sortableHeader("Etat"),
      cell: ({ row }) => {
        const invoice = row.original;
        const currentStatus = invoice.status || "pending";

        if (isAdmin && !readOnly) {
          return (
            <Select
              defaultValue={currentStatus}
              onValueChange={async (value) => {
                try {
                  await updateInvoice({
                    invoiceId: invoice._id!,
                    patch: {
                      status: value as "paid" | "pending",
                    },
                  });
                  toast.success("Statut mis à jour");
                } catch (error) {
                  toast.error("Erreur lors de la mise à jour");
                }
              }}
            >
              <SelectTrigger
                className={`w-[130px] h-8 border-none font-medium ${
                  currentStatus === "paid"
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending" className="text-amber-700">
                  En attente
                </SelectItem>
                <SelectItem value="paid" className="text-emerald-700">
                  Réglée
                </SelectItem>
              </SelectContent>
            </Select>
          );
        }

        return (
          <Badge
            variant="secondary"
            className={`${
              currentStatus === "paid"
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                : "bg-amber-100 text-amber-700 hover:bg-amber-100"
            }`}
          >
            {currentStatus === "paid" ? "Réglée" : "En attente"}
          </Badge>
        );
      },
    },

    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: Row<InvoiceWithVendor> }) => (
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

      {selectedVendorForModal && (
        <VendorDetailsModal
          isOpen={!!selectedVendorForModal}
          onClose={() => setSelectedVendorForModal(null)}
          vendorName={selectedVendorForModal.vendorName || "Régie inconnue"}
          vendorContact={selectedVendorForModal.vendorContact}
          vendorEmail={selectedVendorForModal.vendorEmail}
          vendorPhone={selectedVendorForModal.vendorPhone}
        />
      )}
    </>
  );
}

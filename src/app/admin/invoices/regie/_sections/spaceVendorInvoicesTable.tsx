"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import InvoicesTable from "@/components/table/invoices-table";

const organizationId: Id<"organizations"> =
  "kx7ee0k4v7v16x8b28adt9dr7n7kefs4" as Id<"organizations">;

type VendorInvoicesTableProps = {
  globalFilter: string;
  dateSort: "asc" | "desc";
};

export default function SpaceVendorInvoicesTable({
  globalFilter,
  dateSort,
}: VendorInvoicesTableProps) {
  const invoices = useQuery(api.queries.invoices.getAllVendorInvoices);

  const invoicesData =
    invoices?.map((invoice) => ({
      ...invoice,
      campaign: invoice.campaignTitle,
    })) ?? [];

  return (
    <section>
      <div className="overflow-x-auto">
        <InvoicesTable
          invoices={invoicesData}
          variant="vendor"
          showCampaign={true}
          showClient={true}
          globalFilter={globalFilter}
          dateSort={dateSort}
          isAdmin={true}
        />
      </div>
    </section>
  );
}

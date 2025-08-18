"use client"
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import InvoicesTable from "@/components/invoices-table";
import { Id } from "../../../../../../convex/_generated/dataModel";

const organizationId: Id<"organizations"> = "kx7ee0k4v7v16x8b28adt9dr7n7kefs4" as Id<"organizations">;

type VendorInvoicesTableProps = {
  globalFilter: string;
  dateSort: "asc" | "desc";
};

export default function SpaceVendorInvoicesTable({
    globalFilter,
    dateSort
}: VendorInvoicesTableProps
) {

  const invoices = useQuery(api.queries.invoices.getVendorInvoicesByOrganization, {
  organizationId,
});

const invoicesData = invoices?.map((invoice) => ({
  title: invoice.title,
  campaign: invoice.campaignTitle,
  htprice: invoice.htprice,
  ttcprice: invoice.ttcprice,
  startDate: invoice.startDate,
  dueDate: invoice.dueDate,
})) ?? [];


  return (
    <section><div className="overflow-x-auto">
            <InvoicesTable 
            invoices={invoicesData}
            variant="vendor"
            showCampaign={true}
            globalFilter={globalFilter}
            dateSort={dateSort}
            />
          </div>
          </section>
  )
}
"use client"
import { useQuery } from "convex/react";
import InvoicesTable from "@/components/invoices-table";
import { Id } from "../../../../../../../../convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { api } from "../../../../../../../../convex/_generated/api";

type VendorInvoicesTableProps = {
  globalFilter: string;
  dateSort: "asc" | "desc";
};

export default function SpaceVendorInvoicesByCampTable({
    globalFilter,
    dateSort
}: VendorInvoicesTableProps
) {

  const params = useParams();
      const campaignId = params?.id as Id<"campaigns">;
  
      const invoices = useQuery(api.queries.invoices.getVendorInvoicesByCampaign, {
        campaignId,
      });
      
      const invoicesData = invoices?.map((invoice) => ({
        title: invoice.title,
        agencyInvoice: invoice.agencyInvoice,
        vendorName: invoice.vendorName,
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
            showCampaign={false}
            globalFilter={globalFilter}
            dateSort={dateSort}
            />
          </div>
          </section>
  )
}
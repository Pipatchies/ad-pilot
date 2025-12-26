"use client";
import { useQuery } from "convex/react";
import { Id } from "../../../../../../../../convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { api } from "../../../../../../../../convex/_generated/api";
import InvoicesTable from "@/components/table/invoices-table";

type AgencyInvoicesTableProps = {
  globalFilter: string;
  dateSort: "asc" | "desc";
};

export default function SpaceAgencyInvoicesByCampTable({
  globalFilter,
  dateSort,
}: AgencyInvoicesTableProps) {
  const params = useParams();
  const campaignId = params?.id as Id<"campaigns">;

  const invoices = useQuery(api.queries.invoices.getAgencyInvoicesByCampaign, {
    campaignId,
  });

  const invoicesData = invoices ?? [];

  return (
    <section>
      <div className="overflow-x-auto">
        <InvoicesTable
          invoices={invoicesData}
          variant="agency"
          showCampaign={false}
          globalFilter={globalFilter}
          dateSort={dateSort}
          readOnly={true}
        />
      </div>
    </section>
  );
}

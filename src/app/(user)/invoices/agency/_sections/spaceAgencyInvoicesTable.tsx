"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import InvoicesTable from "@/components/table/invoices-table";
import { useUser } from "@/app/providers/user-provider";

type AgencyInvoicesTableProps = {
  globalFilter: string;
  dateSort: "asc" | "desc";
};

export default function SpaceAgencyInvoicesTable({
  globalFilter,
  dateSort,
}: AgencyInvoicesTableProps) {
  const { user } = useUser();
  const organizationId = user?.organizationId as Id<"organizations">;

  const invoices = useQuery(
    api.queries.invoices.getAgencyInvoicesByOrganization,
    organizationId ? { organizationId } : "skip"
  );

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
          variant="agency"
          showCampaign={true}
          globalFilter={globalFilter}
          dateSort={dateSort}
          readOnly={true}
        />
      </div>
    </section>
  );
}

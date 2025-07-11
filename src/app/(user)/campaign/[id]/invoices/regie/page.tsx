"use client";
import InvoicesTable from "@/components/invoices-table";
import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useParams } from "next/navigation";

export default function CampaignRegieInvoice() {

  const params = useParams();
    const campaignId = params?.id as Id<"campaigns">;

    const invoices = useQuery(api.queries.invoices.readVendorInvoicesByCampaign, {
      campaignId,
    });
    
    const invoicesData = invoices?.map((invoice) => ({
      title: invoice.title,
      agencyInvoice: invoice.agencyInvoice,
      vendorName: invoice.vendorName,
      htprice: invoice.htprice,
      ttcprice: invoice.ttcprice,
      startDate: new Date(invoice.startDate),
      dueDate: new Date(invoice.dueDate),
    })) ?? [];
    
  
  return (
    <div>
      <Typography variant="h1">Titre de la campagne</Typography>
      <Typography variant="h1" className="font-bold">
        Les factures
      </Typography>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Typography variant="h2" className="mb-0 font-[800] text-[28px]">
          Factures régies
        </Typography>
        <SearchBar />
      </div>

      <div className="overflow-x-auto">
        <InvoicesTable
          invoices={invoicesData}
          variant="vendor"
          showCampaign={false}
        />
      </div>
    </div>
  );
}

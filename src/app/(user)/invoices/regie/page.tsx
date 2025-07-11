"use client";
import InvoicesTable from "@/components/invoices-table";
import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const organizationId: Id<"organizations"> = "kx7ee0k4v7v16x8b28adt9dr7n7kefs4" as Id<"organizations">;

export default function RegieInvoice() {

  const invoices = useQuery(api.queries.users.readVendorInvoices, {
  organizationId,
});

const invoicesData = invoices?.map((invoice) => ({
  title: invoice.title,
  agencyInvoice: invoice.agencyInvoice,
  vendorName: invoice.vendorName,
  campaign: invoice.campaignTitle,
  htprice: invoice.htprice,
  ttcprice: invoice.ttcprice,
  startDate: new Date(invoice.startDate),
  dueDate: new Date(invoice.dueDate),
})) ?? [];

  return (
    <div>
      <Typography variant="h1" className="mb-6">
        Les factures
      </Typography>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Typography variant="h2" className="mb-0">
          Factures régie
        </Typography>
        <SearchBar />
      </div>

      <div className="overflow-x-auto">
        <InvoicesTable
          invoices={invoicesData}
          variant="vendor"
          showCampaign={true}
        />
      </div>
    </div>
  );
}

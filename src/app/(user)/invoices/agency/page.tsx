"use client";
import InvoicesTable from '@/components/invoices-table';
import SearchBar from '@/components/search-bar';
import Typography from '@/components/typography'
import React from 'react'
import { useQuery } from "convex/react";
import { api } from '../../../../../convex/_generated/api'; 
import { Id } from '../../../../../convex/_generated/dataModel';

const clientBusinessId: Id<"clientBusinesses"> = "k979mgpmypy7r4nrnbgpfmyep17jtkqc" as Id<"clientBusinesses">;

export default function AgencyInvoice() {

  const invoices = useQuery(api.queries.users.readAgencyInvoices, {
  clientBusinessId,
});

const invoicesData = invoices?.map((invoice) => ({
  title: invoice.title,
  campaign: invoice.campaignTitle,
  htprice: invoice.htprice,
  ttcprice: invoice.ttcprice,
  date: new Date(invoice.date),
  dueDate: new Date(invoice.dueDate),
})) ?? [];

  return (
    <div>
      <Typography variant="h1" className="mb-6">
        Les factures
      </Typography>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Typography variant="h2" className="mb-0">
          Factures agence
        </Typography>
        <SearchBar />
      </div>
      
      <div className="overflow-x-auto">
        <InvoicesTable 
        invoices={invoicesData}
        variant="agency"
        showCampaign={true}/>
      </div>
    </div>
  );
}
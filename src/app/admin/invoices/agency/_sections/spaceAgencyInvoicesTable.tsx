'use client';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import InvoicesTable from '@/components/table/invoices-table';

type AgencyInvoicesTableProps = {
  globalFilter: string;
  dateSort: 'asc' | 'desc';
};

export default function SpaceAgencyInvoicesTable({
  globalFilter,
  dateSort,
}: AgencyInvoicesTableProps) {
  const invoices = useQuery(api.queries.invoices.getAllAgencyInvoices);

  const invoicesData =
    invoices?.map((invoice) => ({
      ...invoice,
      campaign: invoice.campaignTitle,
    })) ?? [];

  return (
    <section>
      <div className='overflow-x-auto'>
        <InvoicesTable
          invoices={invoicesData}
          variant='agency'
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

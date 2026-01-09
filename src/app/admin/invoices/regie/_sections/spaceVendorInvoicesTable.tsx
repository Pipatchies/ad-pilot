'use client';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import InvoicesTable from '@/components/table/invoices-table';

type VendorInvoicesTableProps = {
  globalFilter: string;
  dateSort: 'asc' | 'desc';
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
      <div className='overflow-x-auto'>
        <InvoicesTable
          invoices={invoicesData}
          variant='vendor'
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

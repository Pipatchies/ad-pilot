'use client';
import { useQuery } from 'convex/react';
import { Id } from '../../../../../../../../convex/_generated/dataModel';
import { useParams } from 'next/navigation';
import { api } from '../../../../../../../../convex/_generated/api';
import InvoicesTable from '@/components/table/invoices-table';

type VendorInvoicesTableProps = {
  globalFilter: string;
  dateSort: 'asc' | 'desc';
};

export default function SpaceVendorInvoicesByCampTable({
  globalFilter,
  dateSort,
}: VendorInvoicesTableProps) {
  const params = useParams();
  const campaignId = params?.id as Id<'campaigns'>;

  const invoices = useQuery(api.queries.invoices.getVendorInvoicesByCampaign, {
    campaignId,
  });

  const invoicesData = invoices ?? [];

  return (
    <section>
      <InvoicesTable
        invoices={invoicesData}
        variant='vendor'
        showCampaign={false}
        globalFilter={globalFilter}
        dateSort={dateSort}
        readOnly={true}
      />
    </section>
  );
}

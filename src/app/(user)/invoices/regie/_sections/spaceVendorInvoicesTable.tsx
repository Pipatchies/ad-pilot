'use client';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import InvoicesTable from '@/components/table/invoices-table';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { useUser } from '@/app/providers/user-provider';

type VendorInvoicesTableProps = {
  globalFilter: string;
  dateSort: 'asc' | 'desc';
};

export default function SpaceVendorInvoicesTable({
  globalFilter,
  dateSort,
}: VendorInvoicesTableProps) {
  const { user } = useUser();
  const organizationId = user?.organizationId as Id<'organizations'>;

  const invoices = useQuery(
    api.queries.invoices.getVendorInvoicesByOrganization,
    organizationId ? { organizationId } : 'skip',
  );

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
          globalFilter={globalFilter}
          dateSort={dateSort}
          readOnly={true}
        />
      </div>
    </section>
  );
}

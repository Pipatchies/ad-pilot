'use client';

import InvoicesModal from '@/components/modal/invoices-modal';
import SearchBar from '@/components/search-bar';
import Typography from '@/components/typography';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';

type AccountsHeaderProps = {
  onQueryChange: (q: string) => void;
  onDateSortChange: (dir: 'desc' | 'asc') => void;
  defaultDateSort?: 'desc' | 'asc';
};

export default function SpaceAgencyInvoicesHeader({
  onQueryChange,
  onDateSortChange,
  defaultDateSort = 'desc',
}: AccountsHeaderProps) {
  const agencyInvoices = useQuery(api.queries.invoices.getAllAgencyInvoices) ?? [];
  const count = agencyInvoices.length;
  return (
    <section>
      <div className='flex flex-wrap items-center justify-between'>
        <Typography variant='h1' className='mb-0'>
          Factures agence
        </Typography>
        <InvoicesModal />
      </div>
      <p className='text-primary/80'>{`${count} factures`}</p>
      <div className='flex justify-end mb-6'>
        <SearchBar
          variant='full'
          onQueryChange={onQueryChange}
          onDateSortChange={onDateSortChange}
          defaultDateSort={defaultDateSort}
        />
      </div>
    </section>
  );
}

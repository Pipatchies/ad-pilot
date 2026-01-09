'use client';
import React, { useState } from 'react';
import SpaceAgencyInvoicesByCampTable from './spaceAgencyInvoicesTable';
import SpaceAgencyInvoicesByCampHeader from './spaceAgencyInvoicesHeader';

export default function SpaceAgencyInvoicesByCamp() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc');

  return (
    <section className='flex flex-col gap-2'>
      <SpaceAgencyInvoicesByCampHeader
        onQueryChange={setGlobalFilter}
        onDateSortChange={setDateSort}
        defaultDateSort='desc'
      />
      <SpaceAgencyInvoicesByCampTable globalFilter={globalFilter} dateSort={dateSort} />
    </section>
  );
}

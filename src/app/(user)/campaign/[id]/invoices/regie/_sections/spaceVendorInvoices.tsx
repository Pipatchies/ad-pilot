'use client';
import React, { useState } from 'react';
import SpaceVendorInvoicesByCampHeader from './spaceVendorInvoicesHeader';
import SpaceVendorInvoicesByCampTable from './spaceVendorInvoicesTable';

export default function SpaceVendorInvoicesByCamp() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc');

  return (
    <section className='flex flex-col gap-2'>
      <SpaceVendorInvoicesByCampHeader
        onQueryChange={setGlobalFilter}
        onDateSortChange={setDateSort}
        defaultDateSort='desc'
      />
      <SpaceVendorInvoicesByCampTable globalFilter={globalFilter} dateSort={dateSort} />
    </section>
  );
}

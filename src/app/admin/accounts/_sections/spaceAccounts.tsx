'use client';
import React, { useState } from 'react';
import SpaceAccountsHeader from './spaceAccountsHeader';
import SpaceAccountsTable from './spaceAccountsTable';

export default function SpaceAccounts() {
  const [globalFilter, setGlobalFilter] = useState('');

  return (
    <section className='flex flex-col gap-2'>
      <SpaceAccountsHeader onQueryChange={setGlobalFilter} />
      <SpaceAccountsTable globalFilter={globalFilter} />
    </section>
  );
}

import React from 'react'
import InvoicesCard from '../../../components/invoices-card'
import Typography from '@/components/typography'
import SvgVerywell from '@/components/icons/Verywell';
import { url } from 'inspector';

const invoicesCardData = [
  {
    title: "Facture agence",
    icon: <SvgVerywell />,
    url: "/invoices/agency"
  },
  {
    title: "Facture régie",
    url: "/invoices/regie"
  },
];

export default function page() {
  return (
    <section>
        <Typography variant="h1" className='lg:mb-20'> Les factures</Typography>
    <div className="flex flex-wrap sm:items-center sm:justify-between gap-6 mb-6">
        {invoicesCardData.map((data, index) => (
        <InvoicesCard
          key={index}
          title={data.title}
          icon={data.icon}
          url={data.url}
        />
      ))}
      </div>
    </section>
  )
}

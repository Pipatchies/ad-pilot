import React from 'react'
import InvoiceCarousel from '../../components/invoice-carousel'
import Typography from '@/components/typography'

export default function SpaceInvoices() {
  return (
    <section className='space-y-6'>
      <div>
      <Typography variant="h2" className="mb-0">
          Les factures
        </Typography>
        </div>
      <InvoiceCarousel/>
    </section>
  )
}

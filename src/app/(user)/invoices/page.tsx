"use client";
import InvoicesTable from '@/components/invoices-table';
import SearchBar from '@/components/search-bar';
import Typography from '@/components/typography'
import React from 'react'

const invoicesData = [
  {
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
{
  name: "Facture N°123456789",
  campagne: "Titre de la campagne",
  htprice: 20000,
  ttcprice: 24000,
  date: new Date("2025-01-13"),
  dueDate: new Date("2025-03-30"),
},
]

export default function Invoice() {
  return (
    <div>
      <Typography variant="h1">
        Les factures
      </Typography>
      <div className="flex flex-wrap items-center gap-10 justify-between">
      <Typography variant = "h2" className='mb-0'>
        Factures agence
      </Typography>
      <SearchBar/>

      <InvoicesTable invoices={invoicesData}/>
      </div>
    </div>
  )
}
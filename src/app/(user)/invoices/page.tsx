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
    <div className="px-4 md:px-8">
      <Typography variant="h1" className="mb-6">
        Les factures
      </Typography>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Typography variant="h2" className="mb-0">
          Factures agence
        </Typography>
        <SearchBar />
      </div>
      
      <div className="overflow-x-auto">
        <InvoicesTable invoices={invoicesData} />
      </div>
    </div>
  );
}
import SearchBar from '@/components/search-bar'
import Typography from '@/components/typography'
import React from 'react'
import DocumentsTable from './components/documents-table'

const documentsData = [
  {
    name: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13"),
  },
  {
    name: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13"),
  },
  {
    name: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13"),
  },
  {
    name: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13"),
  },
  {
    name: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13"),
  },
  {
    name: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13"),
  },
  {
    name: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13"),
  },
  {
    name: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13"),
  },
  {
    name: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13"),
  },
  {
    name: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13"),
  },
  {
    name: "Justificatif de diffusion",
    type: "PDF",
    date: new Date("2025-01-13"),
  },
];

export default function Documents() {
  return (
    <section>
      <Typography variant="h1">Titre de la campagne</Typography>
      <Typography variant="h1" className="font-bold">
        Les documents
      </Typography>
      <div className="flex flex-col justify-end sm:flex-row sm:items-center gap-4 mb-6">
        <SearchBar />
      </div>
      <DocumentsTable documents={documentsData} />
    </section>
  )
}

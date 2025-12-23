"use client"
import React from 'react'
import FolderCard from '@/components/card/folder-card';
import Typography from '@/components/typography';
import SvgVerywell from '@/components/icons/Verywell';
import { useParams } from 'next/navigation';
import { Id } from '../../../../../../convex/_generated/dataModel';


export default function CampaignInvoices() {
  const params = useParams();
  const campaignId = params?.id
  ? (params.id as Id<"campaigns">)
  : undefined;

const folderCardData = [
  {
    title: "Facture agence",
    icon: <SvgVerywell />,
    url: `/campaign/${campaignId}/invoices/agency`,
  },
  {
    title: "Facture régie",
    url: `/campaign/${campaignId}/invoices/regie`,
  },
];

  return (
    <section>
        <Typography variant="h1">Titre de la campagne</Typography>
      <Typography variant="h1" className="font-bold mb-15">
        Les factures
      </Typography>
    <div className="flex flex-wrap sm:items-center sm:justify-between gap-6 mb-6">
        {folderCardData.map((data, index) => (
        <FolderCard
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

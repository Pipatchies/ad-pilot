"use client"
import React from 'react'
import FolderCard from '../../../../../components/folder-card'
import Typography from '@/components/typography'
import { useParams } from 'next/navigation';
import { Id } from '../../../../../../convex/_generated/dataModel';

export default function Web() {

   const params = useParams();
    const campaignId = params?.id
    ? (params.id as Id<"campaigns">)
    : undefined;

    const folderCardData = [
  {
    title: "Visuels Affiches",
    url: `/campaign/${campaignId}/librairy/posters`
  },
  {
    title: "Visuels TV",
    url: `/campaign/${campaignId}/librairy/tv`
  },
  {
    title: "Visuels Web",
    url: `/campaign/${campaignId}/librairy/web`
  },
  {
    title: "Visuels Panneaux",
    url: `/campaign/${campaignId}/librairy/billboard`
  },
];

  return (
    <section>
        <Typography variant="h1"> Titre de la campagne </Typography>
        <Typography variant="h1" className='mb-10 font-bold'> La bibliothèque de médias </Typography>
    <div className="grid grid-cols-3 sm:items-center sm:justify-between gap-8 mb-6">
        {folderCardData.map((data, index) => (
        <FolderCard
          key={index}
          title={data.title}
          url={data.url}
        />
      ))}
      </div>
    </section>
  )
}
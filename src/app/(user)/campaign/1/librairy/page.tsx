import React from 'react'
import FolderCard from '../../../../../components/folder-card'
import Typography from '@/components/typography'

const folderCardData = [
  {
    title: "Visuels Affiches",
    url: "/librairy/posters"
  },
  {
    title: "Visuels TV",
    url: "/librairy/tv"
  },
  {
    title: "Visuels Web",
    url: "/librairy/web"
  },
  {
    title: "Visuels Panneaux",
    url: "/librairy/billboard"
  },
];

export default function Web() {
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
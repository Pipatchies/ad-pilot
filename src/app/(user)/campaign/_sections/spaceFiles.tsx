import DetailsCard from '@/components/details-card'
import Typography from '@/components/typography'
import React from 'react'

const mediaData = [
    {
        title: "Titre du média",
        description: "Type de média",
        startDate: new Date("2025-01-13"),
    },
    {
        title: "Titre du média",
        description: "Type de média",
        startDate: new Date("2025-01-13"),
    },
    {
        title: "Titre du média",
        description: "Type de média",
        startDate: new Date("2025-01-13"),
    },
]

export default function SpaceFiles() {
  return (
    <div className='mt-26'>
      <Typography variant="h2">Les dernières ressources médias</Typography>
      <div className="flex gap-x-10">
      {mediaData.map((data, index) => (
        <DetailsCard variant="media" key={index} {...data} />
      ))}
      </div>
    </div>
  )
}

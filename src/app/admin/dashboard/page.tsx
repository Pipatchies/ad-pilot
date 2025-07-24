import LatestFiles from '@/components/latest-files'
import Typography from '@/components/typography'
import React from 'react'

const campaignData = [
  {
  title: "Titre lorem ipsum",
  description: "Nom du client",
  startDate: new Date("2025-01-13"),
  endDate: new Date("2025-03-30"),
  status: "Brief",
  icons: [ {
    name: "panneau",
    url: "/icons/panneau-daffichage.svg",
    width: 15,
    height: 26,
  },
  {
    name: "radio",
    url: "/icons/radio.svg",
      width: 28,
      height: 27,
  },
  {
    name: "television",
    url: "/icons/television.svg",
      width: 26,
      height: 20,
  },
],
},
{
  title: "Titre lorem ipsum",
  description: "Nom du client",
  startDate: new Date("2025-01-13"),
  endDate: new Date("2025-03-30"),
  status: "Brief",
  icons: [ {
    name: "panneau",
    url: "/icons/panneau-daffichage.svg",
    width: 15,
    height: 26,
  },
  {
    name: "radio",
    url: "/icons/radio.svg",
      width: 28,
      height: 27,
  },
  {
    name: "television",
    url: "/icons/television.svg",
      width: 26,
      height: 20,
  },
],
},
{
  title: "Titre lorem ipsum",
  description: "Nom du client",
  startDate: new Date("2025-01-13"),
  endDate: new Date("2025-03-30"),
  status: "Brief",
  icons: [ {
    name: "panneau",
    url: "/icons/panneau-daffichage.svg",
    width: 15,
    height: 26,
  },
  {
    name: "radio",
    url: "/icons/radio.svg",
      width: 28,
      height: 27,
  },
  {
    name: "television",
    url: "/icons/television.svg",
      width: 26,
      height: 20,
  },
],
},
]

export default function AdminDashboard() {
  return (
    <section className="flex flex-col gap-10">
      <Typography variant="h1">
        Tableau de bord
      </Typography>
      <LatestFiles
        title="Campagnes en cours"
        data={campaignData}
        variant="campaign"
      />
    </section>
  )
}

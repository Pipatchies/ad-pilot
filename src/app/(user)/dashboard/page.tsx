import DetailsCard from "@/components/details-card";
import Typography from "@/components/typography";
import React from "react";

const campaignData = [
  {
  title: "Titre lorem ipsum",
  description: "Campagne digitale",
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
  description: "Campagne digitale",
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
  description: "Campagne digitale",
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

const docData = [
  {
    title: "Document lorem ipsum",
    description: "Type de document",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",
    },
  {
    title: "Document lorem ipsum",
    description: "Type de document",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",
    },    
  {
    title: "Document lorem ipsum",
    description: "Type de document",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",
    },
]

const invoiceData = [
  {
    title: "Facture N°123456789",
    description: "Facture d'acompte",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",
    },
  {
    title: "Facture N°123456789",
    description: "Facture d'acompte",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",
    },    
  {
    title: "Facture N°123456789",
    description: "Facture d'acompte",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",    
    },
]

export default function Dashboard() {
  return (
    <div>
      <Typography variant="h1" className="mb-10">Tableau de bord</Typography>
      <Typography variant="h2">Campagnes en cours</Typography>
      <div className="flex gap-x-10">
      {campaignData.map((data, index) => (
        <DetailsCard variant="campaign" key={index} {...data} />
      ))}
      </div>
      <Typography variant="h2" className="mt-20">Les derniers documents</Typography>
      <div className="flex flex-raw gap-x-10">
      {docData.map((data, index) => (
        <DetailsCard variant="default" key={index} {...data} />
      ))}
      </div>
      <Typography variant="h2" className="mt-20">Les dernières factures</Typography>
      <div className="flex flex-raw gap-x-10">
      {invoiceData.map((data, index) => (
        <DetailsCard variant="default" key={index} {...data} />
      ))}
      </div>
    </div>
  );
}                               

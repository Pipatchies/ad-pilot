import Typography from "@/components/typography";
import React from "react";
import LatestFiles from "@/components/latest-files";

const campaignData = [
  {
    title: "Titre lorem ipsum",
    description: "Campagne digitale",
    startDate: new Date("2025-01-13"),
    endDate: new Date("2025-03-30"),
    status: "Brief",
    icons: [
      {
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
    icons: [
      {
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
    icons: [
      {
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
];

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
];

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
];

export default function Dashboard() {
  return (
    <section className="flex flex-col gap-10">
      <Typography variant="h1" className="mb-10">
        Tableau de bord
      </Typography>
      <LatestFiles
        title="Les dernières ressources médias"
        // cta={ctaProps[0]}
        data={campaignData}
        variant="campaign"
      />
      <LatestFiles
        title="Les derniers documents"
        // cta={ctaProps[1]}
        data={docData}
        variant="default"
      />
      <LatestFiles
        title="Les dernières factures"
        // cta={ctaProps[2]}
        data={invoiceData}
        variant="default"
        className="mb-10"
      />
    </section>
  );
}

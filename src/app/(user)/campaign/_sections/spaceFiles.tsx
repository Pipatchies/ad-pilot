import CtaButton from "@/components/cta-button";
import DetailsCard from "@/components/details-card";
import Typography from "@/components/typography";
import React from "react";

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
];

const docData = [
  {
    title: "Document lorem ipsum",
    description: "Type de document",
    startDate: new Date("2025-01-13"),
  },
  {
    title: "Document lorem ipsum",
    description: "Type de document",
    startDate: new Date("2025-01-13"),
  },
  {
    title: "Document lorem ipsum",
    description: "Type de document",
    startDate: new Date("2025-01-13"),
  },
];

const invoiceData = [
  {
    title: "Facture N°123456789",
    description: "Facture d'acompte",
    startDate: new Date("2025-01-13"),
  },
  {
    title: "Facture N°123456789",
    description: "Facture d'acompte",
    startDate: new Date("2025-01-13"),
  },
  {
    title: "Facture N°123456789",
    description: "Facture d'acompte",
    startDate: new Date("2025-01-13"),
  },
];

const ctaProps = [
   {
  text: "Voir la bibliothèque",
  url: "#",
  target: "self",
},
{
  text: "Voir tous les documents",
  url: "#",
  target: "self",
},
{
  text: "Voir toutes les factures",
  url: "#",
  target: "self",
}
];

export default function SpaceFiles() {
  return (
    <div className="mt-26 mr-60 flex flex-col gap-y-6">
      <div className="flex flex-wrap items-center justify-between">
      <Typography variant="h2" className="mb-0">Les dernières ressources médias</Typography>
      <CtaButton
        props={ctaProps[0]}
        className="border transition h-10"
        variant="noIcon"
      ></CtaButton>
      </div>
      <div className="flex gap-x-10">
        {mediaData.map((data, index) => (
          <DetailsCard variant="media" key={index} {...data} />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between mt-10">
      <Typography variant="h2" className="mb-0">Les derniers documents</Typography>
      <CtaButton
        props={ctaProps[1]}
        className="border transition h-10"
        variant="noIcon"
      ></CtaButton>
      </div>
      <div className="flex flex-raw gap-x-10">
      {docData.map((data, index) => (
        <DetailsCard variant="default" key={index} {...data} />
      ))}
      </div>
      <div className="flex flex-wrap items-center justify-between mt-10">
      <Typography variant="h2" className="mb-0">Les dernières factures</Typography>
      <CtaButton
        props={ctaProps[2]}
        className="border transition h-10"
        variant="noIcon"
      ></CtaButton>
      </div>
      <div className="flex flex-raw gap-x-10 mb-10">
      {invoiceData.map((data, index) => (
        <DetailsCard variant="default" key={index} {...data} />
      ))}
      </div>
    </div>
  );
}

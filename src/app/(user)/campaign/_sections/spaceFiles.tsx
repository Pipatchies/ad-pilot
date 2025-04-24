import React from "react";
import LatestFiles from "../../../../components/latest-files";

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
  { text: "Voir la bibliothèque", url: "#", target: "self" },
  { text: "Voir tous les documents", url: "#", target: "self" },
  { text: "Voir toutes les factures", url: "#", target: "self" },
];

export default function SpaceFiles() {
  return (
    <section className="flex flex-col gap-10">
      <LatestFiles
        title="Les dernières ressources médias"
        cta={ctaProps[0]}
        data={mediaData}
        variant="media"
      />
      <LatestFiles
        title="Les derniers documents"
        cta={ctaProps[1]}
        data={docData}
        variant="default"
      />
      <LatestFiles
        title="Les dernières factures"
        cta={ctaProps[2]}
        data={invoiceData}
        variant="default"
        className="mb-10"
      />
    </section>
  );
}

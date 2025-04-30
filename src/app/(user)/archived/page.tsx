import Typography from "@/components/typography";
import React from "react";
import ArchivedCards from "./components/archived-card";

const archivedData = [
  {
    title: "Titre lorem ipsum",
    description: "Campagne digitale",
    startDate: new Date("2025-01-13"),
    archivedDate: new Date("2025-04-30"),
    slug: "1",
  },
  {
    title: "Titre lorem ipsum",
    description: "Campagne digitale",
    startDate: new Date("2025-01-13"),
    archivedDate: new Date("2025-04-30"),
    slug: "1",
    },
  {
    title: "Titre lorem ipsum",
    description: "Campagne digitale",
    startDate: new Date("2025-01-13"),
    archivedDate: new Date("2025-04-30"),
    slug: "1",
  },
  {
    title: "Titre lorem ipsum",
    description: "Campagne digitale",
    startDate: new Date("2025-01-13"),
    archivedDate: new Date("2025-04-30"),
    slug: "1",
  },
  {
    title: "Titre lorem ipsum",
    description: "Campagne digitale",
    startDate: new Date("2025-01-13"),
    archivedDate: new Date("2025-04-30"),
    slug: "1",
  },
  {
    title: "Titre lorem ipsum",
    description: "Campagne digitale",
    startDate: new Date("2025-01-13"),
    archivedDate: new Date("2025-04-30"),
    slug: "1",
  },
  {
    title: "Titre lorem ipsum",
    description: "Campagne digitale",
    startDate: new Date("2025-01-13"),
    archivedDate: new Date("2025-04-30"),
    slug: "1",
  },
  {
    title: "Titre lorem ipsum",
    description: "Campagne digitale",
    startDate: new Date("2025-01-13"),
    archivedDate: new Date("2025-04-30"),
    slug: "1",
  },
  {
    title: "Titre lorem ipsum",
    description: "Campagne digitale",
    startDate: new Date("2025-01-13"),
    archivedDate: new Date("2025-04-30"),
    slug: "1",
  },
];

export default function Archived() {
  return (
    <section>
      <Typography variant="h1">Campagnes archivées</Typography>
      <div className="flex gap-5 flex-wrap w-full">
        <ArchivedCards data={archivedData} variant="archived" />
      </div>
    </section>
  );
}

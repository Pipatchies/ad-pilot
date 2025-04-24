import LatestFiles from "@/components/latest-files";
import Typography from "@/components/typography";
import React from "react";

const targetData = [
  {
    title: "Titre de la cible",
    age: "15 - 20 ans",
    subject: "Lorem ipsum",
  },
  {
    title: "Titre de la cible",
    age: "30 - 50 ans",
    subject: "Lorem ipsum",
  },
  {
    title: "Titre de la cible",
    age: "50 - 60 ans",
    subject: "Lorem ipsum",
  },
];

export default function Target() {
  return (
    <section>
      <Typography variant="h1">
        Titre de la campagne
      </Typography>
      <LatestFiles title="Les cibles" data={targetData} variant="target" />
    </section>
  );
}

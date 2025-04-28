import Typography from "@/components/typography";
import React from "react";
import TargetCards from "./components/target-cards";

const targetData = [
  {
    title: "Titre de la cible",
    age: "15 - 20 ans",
    subject: "Lorem ipsum",
    slug: "1",
  },
  {
    title: "Titre de la cible",
    age: "30 - 50 ans",
    subject: "Lorem ipsum",
    slug: "2",
  },
  {
    title: "Titre de la cible",
    age: "50 - 60 ans",
    subject: "Lorem ipsum",
    slug: "3",
  },
];

export default function Target() {
  return (
    <section>
      <Typography variant="h1">
        Titre de la campagne
      </Typography>
      <TargetCards title="Les cibles" data={targetData} variant="target" />
    </section>
  );
}

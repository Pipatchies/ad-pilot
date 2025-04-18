import CtaButton from "@/components/ctaButton";
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

const ctaProps = {
  text: "Voir la bibliothèque",
  url: "#",
  target: "self",
};

export default function SpaceFiles() {
  return (
    <div className="mt-26 mr-60">
      <div className="flex flex-wrap items-center justify-between mb-4">
      <Typography variant="h2" className="mb-0">Les dernières ressources médias</Typography>
      <CtaButton
        props={ctaProps}
        className="border transition h-10"
        variant="noIcon"
      ></CtaButton>
      </div>
      <div className="flex gap-x-10">
        {mediaData.map((data, index) => (
          <DetailsCard variant="media" key={index} {...data} />
        ))}
      </div>
    </div>
  );
}

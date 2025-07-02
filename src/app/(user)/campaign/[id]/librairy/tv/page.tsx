import SvgGroupe6 from "@/components/icons/Groupe6";
import SvgImageSmall from "@/components/icons/ImageSmall";
import SvgSliderVideo from "@/components/icons/SliderVideo";
import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import React from "react";
import VisualsCard, { DetailsCardProps } from "../components/visuals-card";

const visualsCardData: DetailsCardProps[] = [
  {
    title: "Titre du média",
    type: "PNG",
    date: new Date("2025-01-13"),
    icon: <SvgImageSmall />,
    variant: "landscape",
  },
  {
    title: "Titre du média",
    type: "JPG",
    date: new Date("2025-01-13"),
    icon: <SvgImageSmall />,
    variant: "portrait",
  },
  {
    title: "Titre du média",
    type: "MP3",
    date: new Date("2025-01-13"),
    icon: <SvgGroupe6 />,
    variant: "default",
  },
  {
    title: "Titre du média",
    type: "MP4",
    date: new Date("2025-01-13"),
    icon: <SvgSliderVideo />,
    variant: "landscape",
  },
  {
    title: "Titre du média",
    type: "PDF",
    date: new Date("2025-01-13"),
    icon: <SvgImageSmall />,
    variant: "portrait",
  },
  {
    title: "Titre du média",
    type: "Type de média",
    date: new Date("2025-01-13"),
    icon: <SvgImageSmall />,
    variant: "default",
  },
];

export default function TV() {
  return (
    <section>
      <Typography variant="h1">Titre de la campagne</Typography>
      <Typography variant="h1" className="font-bold">
        La bibliothèque de médias
      </Typography>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Typography variant="h2" className="mb-0 font-[800] text-[28px]">
          Visuels TV
        </Typography>
        <SearchBar />
      </div>
      <div className="flex flex-wrap gap-10">
        {visualsCardData.map((item, index) => (
          <div key={index} className="w-full xl:basis-1/4 grow">
            <VisualsCard
              key={index}
              title={item.title}
              type={item.type}
              date={item.date}
              icon={item.icon}
              variant={item.variant}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

"use client"
import SvgImageSmall from "@/components/icons/ImageSmall";
import SearchBar from "@/components/search-bar";
import Typography from "@/components/typography";
import React from "react";
import VisualsCard from "../components/visuals-card";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";


export default function Web() {

  const params = useParams();
  const campaignId = params?.id as Id<"campaigns">;

  const medias = useQuery(api.queries.medias.readMediaFiles, {
    campaignId,
  });

  const visualsCardData =
    medias?.map((media) => ({
      title: media.title,
      type: media.type,
      date: new Date(media._creationTime),
      icon: <SvgImageSmall  />,
      variant: media.variant
    })) ?? [];

  return (
    <section>
      <Typography variant="h1">Titre de la campagne</Typography>
      <Typography variant="h1" className="font-bold">
        La bibliothèque de médias
      </Typography>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Typography variant="h2" className="mb-0 font-[800] text-[28px]">
          Visuels Web
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

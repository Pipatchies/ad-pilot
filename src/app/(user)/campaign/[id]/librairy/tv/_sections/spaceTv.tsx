"use client";
import React, { useState, useMemo } from "react";
import VisualsCard from "../../components/visuals-card";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../../convex/_generated/dataModel";
import SvgImageSmall from "@/components/icons/ImageSmall";
import SpaceTvHeader from "./spaceTvHeader";

export default function SpaceTv() {
  const params = useParams();
  const campaignId = params?.id as Id<"campaigns">;

  const medias = useQuery(api.queries.medias.getMediaFilesByCampaign, {
    campaignId,
  });

const visualsCardData = useMemo(
  () =>
    medias?.map((media) => ({
      title: media.title,
      type: media.type,
      date: new Date(media._creationTime),
      icon: <SvgImageSmall />,
    })) ?? [],
  [medias]
);

  const [globalFilter, setGlobalFilter] = useState("");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");

  const filteredAndSorted = useMemo(() => {
    return visualsCardData
      .filter((item) =>
        item.title.toLowerCase().includes(globalFilter.toLowerCase())
      )
      .sort((a, b) =>
        dateSort === "asc"
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime()
      );
  }, [visualsCardData, globalFilter, dateSort]);

  return (
    <section>
      <SpaceTvHeader
        onQueryChange={setGlobalFilter}
        onDateSortChange={setDateSort}
        defaultDateSort="desc"
      />

      <div className="flex flex-wrap gap-10">
        {filteredAndSorted.map((item, index) => (
          <div key={index} className="w-full xl:basis-1/4 grow">
            <VisualsCard
              title={item.title}
              type={item.type}
              date={item.date}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

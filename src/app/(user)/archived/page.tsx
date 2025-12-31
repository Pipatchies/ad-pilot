"use client";

import Typography from "@/components/typography";
import React from "react";
import ArchivedCards from "./components/archived-card";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function Archived() {
  const archivedCampaigns = useQuery(
    api.queries.campaigns.getArchivedCampaigns
  );

  const archivedData =
    archivedCampaigns?.map((c) => ({
      title: c.title,
      description: c.subtitle,
      startDate: new Date(c.startDate),
      archivedDate: new Date(c.endDate),
      slug: c._id,
    })) || [];

  return (
    <section>
      <Typography variant="h1">Campagnes archivées</Typography>
      <div className="flex gap-5 flex-wrap w-full">
        <ArchivedCards data={archivedData} variant="archived" />
      </div>
    </section>
  );
}

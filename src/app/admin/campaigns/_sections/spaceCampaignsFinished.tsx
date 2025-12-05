"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import CampaignTable from "@/components/table/campaign-table";
import Typography from "@/components/typography";

type Props = {
  globalFilter: string;
};

export default function SpaceCampaignsActive({ globalFilter }: Props) {
  const campaignsFinished = useQuery(
    api.queries.campaigns.getFinishedCampaigns
  );

  if (!campaignsFinished) {
    return <p>Chargement...</p>;
  }

  return (
    <section>
      <Typography variant="h2">Campagnes terminées</Typography>
      <CampaignTable
        campaigns={campaignsFinished}
        globalFilter={globalFilter}
      />
    </section>
  );
}

"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import CampaignTable from "@/components/table/campaign-table";
import Typography from "@/components/typography";
import { Campaign } from "@/types/campaigns";

type Props = {
  globalFilter: string;
};

export default function SpaceCampaignsActive({ globalFilter }: Props) {
  const campaignsActive = useQuery(
    api.queries.campaigns.getActiveCampaigns
  ) as Campaign[];

  if (!campaignsActive) {
    return <p>Chargement...</p>;
  }

  return (
    <section>
      <Typography variant="h2">Campagnes en cours</Typography>
      <CampaignTable campaigns={campaignsActive} globalFilter={globalFilter} />
    </section>
  );
}

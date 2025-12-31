"use client";
import LatestFiles from "@/components/latest-files";
import Typography from "@/components/typography";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { getIconFromType } from "@/lib/utils";

export default function AdminDashboard() {
  const campaigns = useQuery(api.queries.campaigns.getActiveCampaigns) ?? [];

  const campaignData = campaigns.map((campaign) => {
    // Map mediaTypes (e.g., 'tv', 'radio') to icons using the utility function
    const icons =
      campaign.mediaTypes
        ?.map((type) => {
          const icon = getIconFromType(type);
          if (icon) {
            return {
              name: icon.name,
              url: icon.url,
              width: icon.width,
              height: icon.height,
            };
          }
          return null;
        })
        .filter((icon): icon is NonNullable<typeof icon> => icon !== null) ||
      [];

    // Determine status label based on next upcoming step or general state
    // If there's a current step, use that. Otherwise 'Brief' or similar.
    // For now, let's look for a "current" step or default to the first one.
    const currentStep =
      campaign.status?.find((s) => s.state === "current")?.label ||
      campaign.status?.[0]?.label ||
      "En cours";

    return {
      title: campaign.title,
      description: campaign.organizationName, // Added by the query enrichment
      startDate: new Date(campaign.startDate),
      endDate: new Date(campaign.endDate),
      status: currentStep,
      icons: icons,
    };
  });

  return (
    <section className="flex flex-col gap-10">
      <Typography variant="h1">Tableau de bord</Typography>
      <LatestFiles
        title="Campagnes en cours"
        data={campaignData}
        variant="campaign"
        emptyMessage={
          campaigns === undefined
            ? "Chargement..."
            : "Aucune campagne en cours."
        }
      />
    </section>
  );
}

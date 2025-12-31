"use client";
import CtaButton from "@/components/cta-button";
import Typography from "@/components/typography";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

const ctaProps = {
  text: "Enregistrer les modifications",
};

export default function SpaceCampaignHeader({
  campaignId,
}: {
  campaignId: Id<"campaigns">;
}) {
  const campaign = useQuery(
    api.queries.campaigns.getCampaignById,
    campaignId ? { campaignId } : "skip"
  );

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-col">
        <Typography variant="h1">Campagne</Typography>
        <Typography variant="h2">{campaign?.title ?? "..."}</Typography>
      </div>
      <CtaButton props={ctaProps} variant="submit" />
    </div>
  );
}

"use client";
import React from "react";
import Typography from "@/components/typography";
import StepCard from "@/components/card/step-card";
import BudgetCard from "@/components/card/budget-card";
import ChartCard from "@/components/card/chart-card";
import BroadcastCard from "@/components/card/broadcast-card";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { calculateBroadcastProgress } from "@/lib/utils";
import { useParams } from "next/navigation";
import { getIconFromType } from "@/lib/utils";
import Image from "next/image";
import { MEDIA_TYPE_LABELS } from "@/types/medias";

export default function SpaceRecap() {
  const params = useParams();
  const campaignId = params?.id as Id<"campaigns">;

  const campaign = useQuery(api.queries.campaigns.getCampaignById, {
    campaignId,
  });

  if (!campaign) {
    return <div>Chargement...</div>;
  }

  const stepCardData =
    campaign.status?.map((step) => ({
      id: step.id,
      label: step.label,
      status: step.state,
    })) ?? [];

  const budgetCardData = campaign.totalBudget;

  const mediaData =
    campaign.budgetMedia?.map((media) => ({
      type: MEDIA_TYPE_LABELS[media.type],
      amount: media.amount,
    })) ?? [];

  const { progress, daysRemaining } = calculateBroadcastProgress(
    campaign.startDate,
    campaign.endDate
  );

  const broadcastData = {
    daysRemaining,
    startDate: new Date(campaign.startDate).toLocaleDateString("fr-FR"),
    endDate: new Date(campaign.endDate).toLocaleDateString("fr-FR"),
    progress,
  };

  return (
    <section className="space-y-15">
      <Typography variant="h1">{campaign.title}</Typography>

      <div className="flex flex-wrap gap-x-3 items-center">
        {campaign.mediaTypes?.map((type, index) => {
          const icon = getIconFromType(type);
          return (
            icon && (
              <Image
                key={index}
                src={icon.url}
                alt={icon.name}
                width={icon.width}
                height={icon.height}
              />
            )
          );
        })}
        <Typography className="m-0" variant="h4">
          {campaign.subtitle}
        </Typography>
      </div>

      <Typography variant="h2">Récap de la campagne</Typography>

      <div className="flex flex-col space-y-6">
        {/* Étapes + Budget */}
        <div className="flex flex-wrap gap-3 w-full">
          <div className="grow">
            <StepCard steps={stepCardData} />
          </div>
          <div className="basis-1/3 grow max-w-fit">
            <BudgetCard totalBudget={budgetCardData} />
          </div>
        </div>

        {/* Graphique + Diffusion */}
        <div className="flex flex-wrap gap-3 w-full">
          <div className="basis-1/3 grow max-w-fit">
            <ChartCard mediaData={mediaData} />
          </div>
          <div className="grow">
            <BroadcastCard broadcastData={broadcastData} />
          </div>
        </div>
      </div>
    </section>
  );
}

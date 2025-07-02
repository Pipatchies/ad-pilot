"use client"
import React from "react";
import { Domaine, Television } from "@/components/icons";
import Typography from "@/components/typography";
import StepCard from "@/components/step-card";
import BudgetCard from "@/components//budget-card";
import ChartCard from "@/components/chart-card";
import BroadcastCard from "@/components/broadcast-card";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { calculateBroadcastProgress } from "@/lib/utils";

const campaignId: Id<"campaigns"> = "jn7cedad56bmbav5fnk28ys6zn7jtrgf" as Id<"campaigns">;

// const stepCardData: Step[] = [
//   {
//     id: 1,
//     label: "Brief",
//     status: "completed",
//   },
//   {
//     id: 2,
//     label: "Création",
//     status: "completed",
//   },
//   {
//     id: 3,
//     label: "Validation",
//     status: "completed",
//   },
//   {
//     id: 4,
//     label: "Diffusion en cours",
//     status: "current",
//   },
//   {
//     id: 5,
//     label: "Bilan",
//     status: "upcoming",
//   },
// ];

// const budgetCardData = {
//   totalBudget: 1550,
// };

// const MediaData = [
//   { name: "Affichage", budget: 550, color: "#5ECEF9" },
//   { name: "TV", budget: 300, color: "#FF7A6B" },
//   { name: "Radio", budget: 200, color: "#FFD572" },
//   { name: "Digital", budget: 500, color: "#A78BFA" },
// ];

// const BroadcastData = {
//   daysRemaining: 10,
//   startDate: "13/01/2025",
//   endDate: "30/03/2025",
//   progress: 50,
// };

export default function SpaceRecap() {

  const campaign = useQuery(api.queries.users.readDetailsCampaign, {
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
      type: media.type,
      amount: media.amount,
    })) ?? [];

    const { progress, daysRemaining } = calculateBroadcastProgress(campaign.startDate, campaign.endDate);

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
        <Domaine />
        <Television />
        <Typography className="m-0" variant="h4">{campaign.subtitle}</Typography>
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

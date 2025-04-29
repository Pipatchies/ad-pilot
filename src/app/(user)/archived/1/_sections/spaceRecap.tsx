import React from "react";
import Typography from "@/components/typography";
import StepCard, { Step } from "@/components/step-card";
import BudgetCard from "@/components//budget-card";
import ChartCard from "@/components/chart-card";
import BroadcastCard from "@/components/broadcast-card";

const stepCardData: Step[] = [
  {
    id: 1,
    label: "Brief",
    status: "completed",
  },
  {
    id: 2,
    label: "Création",
    status: "completed",
  },
  {
    id: 3,
    label: "Validation",
    status: "completed",
  },
  {
    id: 4,
    label: "Diffusion en cours",
    status: "completed",
  },
  {
    id: 5,
    label: "Bilan",
    status: "completed",
  },
];

const budgetCardData = {
  price: 1550,
};

const MediaData = [
  { name: "Affichage", budget: 550, color: "#5ECEF9" },
  { name: "TV", budget: 300, color: "#FF7A6B" },
  { name: "Radio", budget: 200, color: "#FFD572" },
  { name: "Digital", budget: 500, color: "#A78BFA" },
];

const BroadcastData = {
  daysRemaining: 0,
  startDate: "13/01/2025",
  endDate: "30/03/2025",
  progress: 100,
};

export default function SpaceRecap() {
  return (
    <section className="space-y-15">
      <Typography variant="h2">Récap de la campagne</Typography>

      <div className="flex flex-col space-y-6">
        {/* Étapes + Budget */}
        <div className="flex flex-wrap gap-3 w-full">
          <div className="grow">
            <StepCard steps={stepCardData} />
          </div>
          <div className="basis-1/3 grow max-w-fit">
            <BudgetCard price={budgetCardData.price} />
          </div>
        </div>

        {/* Graphique + Diffusion */}
        <div className="flex flex-wrap gap-3 w-full">
          <div className="basis-1/3 grow max-w-fit">
            <ChartCard mediaData={MediaData} />
          </div>
          <div className="grow">
            <BroadcastCard {...BroadcastData} />
          </div>
        </div>
      </div>
    </section>
  );
}

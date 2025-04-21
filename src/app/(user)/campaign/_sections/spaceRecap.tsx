import React from "react";
import { Domaine, Television } from "@/components/icons";
import Typography from "@/components/typography";
import StepCard, { Step } from "../components/step-card";
import BudgetCard from "../components/budget-card";
import ChartCard from "../components/chart-card";
import BroadcastCard from "../components/broadcast-card";

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
    status: "current",
  },
  {
    id: 5,
    label: "Bilan",
    status: "upcoming",
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
  daysRemaining: 10,
  startDate: "13/01/2025",
  endDate: "30/03/2025",
  progress: 50,
};

export default function SpaceRecap() {
  return (
    <section>
      <Typography variant="h1">Titre de la campagne</Typography>
      <div className="flex flex-wrap gap-x-3 mt-0 mb-10">
        <Domaine />
        <Television />
        <Typography variant="h4">Campagne digitale et télé</Typography>
      </div>
      <Typography variant="h2">Récap de la campagne</Typography>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-10 mr-50">
        <div className="md:col-span-5">
          <StepCard steps={stepCardData} />
        </div>
        <div className="md:col-span-2">
          <BudgetCard price={budgetCardData.price} />
        </div>
        <div className="md:col-span-3">
          <ChartCard mediaData={MediaData} />
        </div>
        <div className="md:col-span-4">
          <BroadcastCard {...BroadcastData} />
        </div>
      </div>
    </section>
  );
}

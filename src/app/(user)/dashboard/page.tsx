"use client"
import Typography from "@/components/typography";
import React from "react";
import LatestFiles from "@/components/latest-files";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

const clientBusinessId: Id<"clientBusinesses"> = "k979mgpmypy7r4nrnbgpfmyep17jtkqc" as Id<"clientBusinesses">;

const docData = [
  {
    title: "Document lorem ipsum",
    description: "Type de document",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",
  },
  {
    title: "Document lorem ipsum",
    description: "Type de document",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",
  },
  {
    title: "Document lorem ipsum",
    description: "Type de document",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",
  },
];

const invoiceData = [
  {
    title: "Facture N°123456789",
    description: "Facture d'acompte",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",
  },
  {
    title: "Facture N°123456789",
    description: "Facture d'acompte",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",
  },
  {
    title: "Facture N°123456789",
    description: "Facture d'acompte",
    startDate: new Date("2025-01-13"),
    campaignTitle: "Titre lorem ipsumne",
  },
];

export default function Dashboard() {
  const campaigns = useQuery(api.queries.users.readCampaigns, {
    clientBusinessId,
  });

  const campaignData =
    campaigns?.map((campaign: Doc<"campaigns">) => ({
      title: campaign.title,
      description: campaign.subtitle,
      startDate: new Date(campaign.startDate),
      endDate: new Date(campaign.endDate),
      status: campaign.status?.[0]?.label || "Inconnue",
      mediaTypes: campaign.mediaTypes,
    })) ?? [];

    return (
    <section className="flex flex-col gap-10">
      <Typography variant="h1">
        Tableau de bord
      </Typography>
      <LatestFiles
        title="Campagnes en cours"
        // cta={ctaProps[0]}
        data={campaignData}
        variant="campaign"
      />
      <LatestFiles
        title="Les derniers documents"
        // cta={ctaProps[1]}
        data={docData}
        variant="default"
      />
      <LatestFiles
        title="Les dernières factures"
        // cta={ctaProps[2]}
        data={invoiceData}
        variant="default"
        className="mb-10"
      />
    </section>
    )
}

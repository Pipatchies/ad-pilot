"use client"
import Typography from "@/components/typography";
import React from "react";
import LatestFiles from "@/components/latest-files";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

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


export default function Dashboard() {
  const campaigns = useQuery(api.queries.users.readCampaigns, {
    clientBusinessId,
  });

  const invoices = useQuery(api.queries.users.readInvoices, {
    clientBusinessId,
  });

  const campaignData =
    campaigns?.map((campaign) => ({
      title: campaign.title,
      description: campaign.subtitle,
      startDate: new Date(campaign.startDate),
      endDate: new Date(campaign.endDate),
      status: campaign.status?.[0]?.label || "Inconnue",
      mediaTypes: campaign.mediaTypes,
    })).sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
    .slice(0, 3) ?? [];

    const invoicesData = invoices?.map((invoice) => ({
      title: invoice.title,
      description: invoice.description,
      startDate: new Date(invoice.startDate),
      campaignTitle: invoice.campaignTitle,
    })).sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
    .slice(0, 3) ?? [];

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
        data={invoicesData.slice(0, 3)}
        variant="default"
        className="mb-10"
      />
    </section>
    )
}

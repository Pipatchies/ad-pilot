"use client";
import Typography from "@/components/typography";
import React from "react";
import LatestFiles from "@/components/latest-files";
import CampaignGantt from "@/components/dashboard/CampaignGantt";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useParams } from "next/navigation";

const organizationId: Id<"organizations"> =
  "kx7ee0k4v7v16x8b28adt9dr7n7kefs4" as Id<"organizations">;

export default function Dashboard() {
  const params = useParams();
  const campaignId = params?.id as Id<"campaigns">;

  const campaigns = useQuery(api.queries.campaigns.getCampaignsByOrganization, {
    organizationId,
  });

  const documents =
    useQuery(api.queries.documents.getDocumentsByOrganization, {
      organizationId,
    }) || [];

  const invoices = useQuery(api.queries.invoices.getInvoicesByOrganization, {
    organizationId,
  });

  const campaignData =
    campaigns
      ?.filter((c) => !c.archived && new Date(c.endDate) >= new Date())
      .map((campaign) => ({
        title: campaign.title,
        description: campaign.subtitle,
        startDate: new Date(campaign.startDate),
        endDate: new Date(campaign.endDate),
        status: campaign.status?.[0]?.label || "Inconnue",
        mediaTypes: campaign.mediaTypes,
        url: `/campaign/${campaign._id}/campaign-details`,
      }))
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      .slice(0, 3) ?? [];

  const documentsData = Array.isArray(documents)
    ? documents
        .map((doc) => ({
          title: doc.title,
          description: "Type : " + doc.type.toUpperCase(),
          startDate: new Date(doc._creationTime),
          campaignTitle: doc.campaignTitle,
          type: doc.type,
        }))
        .slice(0, 3)
    : [];

  const invoicesData =
    invoices
      ?.map((invoice) => ({
        title: invoice.title,
        description:
          invoice.invoiceType === "agency"
            ? "Agence"
            : invoice.invoiceType === "vendor"
            ? "Régie"
            : invoice.invoiceType,
        startDate: new Date(invoice.startDate),
        campaignTitle: invoice.campaignTitle,
      }))
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      .slice(0, 3) ?? [];

  const ctaData = [
    {
      text: "Voir tous les documents",
      url: "documents",
      target: "self",
    },
    {
      text: "Voir toutes les factures",
      url: "invoices",
      target: "self",
    },
  ];

  return (
    <section className="flex flex-col gap-10">
      <Typography variant="h1">Tableau de bord</Typography>
      <CampaignGantt
        campaigns={
          campaigns?.filter(
            (c) => !c.archived && new Date(c.endDate) >= new Date()
          ) || []
        }
      />
      <LatestFiles
        title="Campagnes en cours"
        // cta={ctaProps[0]}
        data={campaignData}
        variant="campaign"
        emptyMessage={campaigns ? "Aucune campagne en cours." : undefined}
      />
      <LatestFiles
        title="Les derniers documents"
        cta={{
          ...ctaData[0],
          url: `/campaign/${campaignId}/${ctaData[0].url}`,
        }}

        data={documentsData}
        variant="default"
      />
      <LatestFiles
        title="Les dernières factures"
        cta={{
          ...ctaData[1],
          url: `/campaign/${campaignId}/${ctaData[1].url}`,
        }} 
        data={invoicesData.slice(0, 3)}
        variant="default"
        className="mb-10"
      />
    </section>
  );
}

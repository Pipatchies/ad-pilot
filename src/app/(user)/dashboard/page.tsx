"use client";
import Typography from "@/components/typography";
import React from "react";
import LatestFiles from "@/components/latest-files";
import CampaignGantt from "@/app/(user)/dashboard/components/CampaignGantt";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@/app/providers/user-provider";
export default function Dashboard() {
  const { user } = useUser();
  const organizationId = user?.organizationId;

  const campaigns = useQuery(
    api.queries.campaigns.getCampaignsByOrganization,
    organizationId ? { organizationId } : "skip"
  );

  const documents =
    useQuery(
      api.queries.documents.getDocumentsByOrganization,
      organizationId ? { organizationId } : "skip"
    ) || [];

  const invoices = useQuery(
    api.queries.invoices.getInvoicesByOrganization,
    organizationId ? { organizationId } : "skip"
  );

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
          fileData: {
            url: doc.url,
            type: doc.type,
            publicId: doc.publicId,
            title: doc.title,
          },
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
        fileData: {
          url: invoice.url,
          type: "pdf",
          publicId: invoice.publicId,
          title: invoice.title,
        },
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
          url: `/${ctaData[0].url}`,
        }}
        data={documentsData}
        variant="default"
      />
      <LatestFiles
        title="Les dernières factures"
        cta={{
          ...ctaData[1],
          url: `/${ctaData[1].url}`,
        }}
        data={invoicesData.slice(0, 3)}
        variant="default"
        className="mb-10"
      />
    </section>
  );
}

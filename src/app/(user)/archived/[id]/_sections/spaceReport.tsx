"use client";
import CtaButton from "@/components/cta-button";
import Typography from "@/components/typography";
import React from "react";
import ReportCard from "../../components/report-card";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

const ctaButtonData = {
  text: "Télécharger le bilan de la campagne",
};

export default function SpaceReport() {
  const params = useParams();
  const campaignId = params?.id as Id<"campaigns">;

  const campaign = useQuery(
    api.queries.campaigns.getCampaignById,
    campaignId ? { campaignId } : "skip"
  );

  if (!campaign || !campaign.report || !campaign.report.kpi) {
    return null;
  }

  return (
    <section className="space-y-6 flex flex-col">
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant="h2" className="mb-0">
          Bilan
        </Typography>
        <CtaButton
          props={ctaButtonData}
          className="border transition h-10 hover:border-primary hover:bg-white hover:text-primary bg-primary text-white"
          variant="openModal"
        />
      </div>
      <ReportCard items={campaign.report.kpi} />
    </section>
  );
}

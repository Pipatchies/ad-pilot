import CtaButton from "@/components/cta-button";
import Typography from "@/components/typography";
import React from "react";
import CampaignForm from "../../../components/campaign-form";

const ctaProps = {
  text: "Enregistrer la campagne",
};

export default function Newcampaign() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <Typography variant="h1">Campagne</Typography>
        <CtaButton props={ctaProps} variant="submit" />
      </div>
      <CampaignForm />
    </section>
  );
}

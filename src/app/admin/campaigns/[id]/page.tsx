import React from "react";
import CampaignForm from "../../new-campaign/components/campaign-form";
import { Id } from "../../../../../convex/_generated/dataModel";
import Typography from "@/components/typography";
import CtaButton from "@/components/cta-button";

const ctaProps = {
  text: "Enregistrer les modifications",
};



export default function EditCampaignPage({ params }: { params: { id: Id<"campaigns"> } }) {
  return (
  <section className="space-y-6">
        <div className='flex flex-wrap items-center justify-between'>
        <div className="flex flex-col">
          <Typography variant="h1">Campagne</Typography>
          <Typography variant="h2">Titre de la campagne</Typography>
        </div>
        <CtaButton
            props={ctaProps}
            variant="submit"
              />
        </div>
        <CampaignForm campaignId={params.id} />
    </section>
  )
}

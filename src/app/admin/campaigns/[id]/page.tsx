import React from "react";
import CampaignForm from "../../new-campaign/components/campaign-form";
import { Id } from "../../../../../convex/_generated/dataModel";
import SpaceCampaignHeader from "./_sections/spaceCampaignHeader";

const ctaProps = {
  text: "Enregistrer les modifications",
};



export default function EditCampaignPage({ params }: { params: { id: Id<"campaigns"> } }) {
  return (
  <section className="space-y-6">
    <SpaceCampaignHeader campaignId={params.id} />
    <CampaignForm campaignId={params.id} />
    </section>
  )
}

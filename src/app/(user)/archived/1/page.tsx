import React from "react";
import SpaceRecap from "./_sections/spaceRecap";
import Typography from "@/components/typography";
import SpaceReport from "./_sections/spaceReport";
import SpaceInvoices from "./_sections/spaceInvoices";


export default function ArchivedCampaign() {
  return (
    <section className="space-y-10">
      <div>
      <Typography variant="h1">Titre de la campagne</Typography>
      <Typography className="m-0" variant="h4">
        Campagne digitale et télé
      </Typography>
      </div>
      <div className="space-y-20">
      <SpaceReport />
      <SpaceRecap />
      <SpaceInvoices />
      </div>
    </section>
  );
}
